import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
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
    <div className="max-w-md mx-auto font-sans">
      {!preview && (
        <label
          htmlFor="thumbnail-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-500 rounded-xl p-8 cursor-pointer text-center transition-all hover:bg-blue-50 hover:border-blue-600"
        >
          <input
            id="thumbnail-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <Upload className="w-10 h-10 text-blue-500 mb-2" />
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
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
            title="Replace Image"
          >
            <X className="w-8 h-8 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}