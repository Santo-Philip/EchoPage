import autoSave from "@/lib/blogs/autosave";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  id: string;
}

const PostScheduler: React.FC<Props> = ({ id }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const isScheduled = selectedDate && selectedTime;
  const buttonText = isScheduled ? "Schedule" : "Publish";

  const handleSubmit = () => {
  let scheduleIso: string;

  if (selectedDate && selectedTime) {
    const combined = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    // For timestamptz, just use ISO string (UTC)
    scheduleIso = combined.toISOString();

    autoSave(id, { schedule: scheduleIso, status: "pending" });

    window.showToast(`Post Scheduled at ${combined.toLocaleString()}`);
    window.location.href = "/a/dashboard";
  } else {
    const now = new Date();
    scheduleIso = now.toISOString();

    autoSave(id, { status: "pending", schedule: scheduleIso });

    window.showToast("Post will be public after review");
    window.location.href = "/a/dashboard";
  }
};


  return (
    <div className="flex flex-col gap-4 w-full p-4 rounded shadow">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd-mm-yyyy"
        placeholderText="Select Date"
        className="mt-1 py-2 px-6 outline-none border border-text-muted rounded-full w-full"
      />
      <DatePicker
        selected={selectedTime}
        onChange={(time) => setSelectedTime(time)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Time"
        dateFormat="HH:mm"
        placeholderText="Select Time"
        className="mt-1 py-2 px-6 outline-none border border-text-muted rounded-full w-full"
      />

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className={`py-2 w-sm mt-10 outline-none rounded-full text-white ${
            isScheduled
              ? "bg-blue-600/70 hover:bg-blue-700"
              : "bg-green-600/70 hover:bg-green-700"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PostScheduler;
