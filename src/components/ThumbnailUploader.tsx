import { useState, useRef, useEffect } from "react";
import { compressImage } from "@/lib/compress";
import { getSearchParam } from "@/lib/blogs/getParams";
import autoSave from "@/lib/blogs/autosave";
import saveToDatabase from "@/lib/blogs/saveToDatabase";

interface ThumbnailUploaderProps {
  initialUrl?: string | null;
}

export default function ThumbnailUploader({ initialUrl }: ThumbnailUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_MB = 2;

  useEffect(() => {
    setPreview(initialUrl || null);
  }, [initialUrl]);

  const uploadFileToApi = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/crud/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Upload failed");
    }
    const data = await response.json();
    const id = getSearchParam('id')
    autoSave(id, { thumb : data.url })
    return data.url as string;
  };

  const deleteFileFromApi = async (url: string): Promise<void> => {
    const res = await fetch("/api/crud/files/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok){
      window.showToast('Something went wrong')
    } else { 
      saveToDatabase(getSearchParam('id'), { thumb: '' })
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_SIZE_MB}MB`);
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      setProgress(20);
      const compressedFile = await compressImage(file);
      setProgress(60);
      const uploadedUrl = await uploadFileToApi(compressedFile);
      setProgress(100);
      setPreview(uploadedUrl);
      setTimeout(() => setUploading(false), 500);
    } catch (err) {
      setUploading(false);
      setError((err as Error).message || "Failed to process/upload image");
    }
  };

  const handleReplaceClick = async () => {
    if (preview) {
      try {
        await deleteFileFromApi(preview);
      } catch (err) {
        console.error("Error deleting old file:", err);
      }
    }
    setPreview(null);
    setProgress(0);
    setUploading(false);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto font-sans">
      {!preview && (
        <label
          htmlFor="thumbnail-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-500 rounded-xl p-8 cursor-pointer text-center transition-all hover:bg-blue-700/40 hover:border-blue-600"
        >
          <input
            id="thumbnail-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-upload-icon lucide-upload"><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>
          <span className="text-lg font-semibold text-blue-500">Upload Thumbnail</span>
          <span className="text-sm text-gray-500 mt-2">
            JPG, PNG, GIF, WEBP (max {MAX_SIZE_MB}MB)
          </span>
        </label>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2 animate-pulse">{error}</p>
      )}

      {uploading && (
        <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full bg-blue-300 animate-pulse" />
          </div>
        </div>
      )}

      {preview && (
        <div className="mt-4 relative group">
          <img
            src={preview}
            alt="Uploaded Thumbnail"
            className="w-full aspect-video rounded-lg object-cover shadow-md"
          />
          <button
            onClick={handleReplaceClick}
            className="absolute flex top-0 right-0 cursor-pointer items-center justify-center text-white bg-black bg-opacity-50 transition-opacity duration-200 rounded-full"
            title="Replace Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}