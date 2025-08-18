import { useState } from "react";

interface ThumbnailUploaderProps {
  onUploadComplete?: (url: string) => void;
  maxSizeMB?: number;
  width?: number;
  height?: number;
  quality?: number;
}

export default function ThumbnailUploader({
  onUploadComplete,
  maxSizeMB = 5,
  width = 1280,
  height = 720,
  quality = 0.8,
}: ThumbnailUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (file.type === "image/gif") return resolve(file);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas error");

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Compression failed");
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds ${maxSizeMB}MB`);
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const processedFile = await compressImage(file);
      const previewUrl = URL.createObjectURL(processedFile);
      setPreview(previewUrl);

      // Simulate upload
      const fakeUpload = new Promise<string>((resolve) => {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              resolve("https://example.com/uploaded-thumbnail.jpg");
            }
            return prev + 10;
          });
        }, 100);
      });

      const uploadedUrl = await fakeUpload;
      setUploading(false);
      setProgress(100);
      onUploadComplete?.(uploadedUrl);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setError("Failed to process image");
    }
  };

  const handleReplaceClick = () => {
    // Reset to allow selecting a new file
    setPreview(null);
    setProgress(0);
    setUploading(false);
    setError("");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {!preview && (
        <label
          htmlFor="thumbnail-upload"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #0077ff",
            borderRadius: "12px",
            padding: "40px",
            cursor: "pointer",
            transition: "background 0.2s, border-color 0.2s",
            textAlign: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f0f8ff";
            e.currentTarget.style.borderColor = "#005fcc";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "#0077ff";
          }}
        >
          <input
            id="thumbnail-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <span style={{ fontSize: "18px", fontWeight: "bold", color: "#0077ff" }}>
            Upload Thumbnail
          </span>
          <span style={{ fontSize: "14px", color: "#555", marginTop: "8px" }}>
            JPG, PNG, GIF, WEBP (max {maxSizeMB}MB)
          </span>
        </label>
      )}

      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}

      {preview && (
        <div style={{ marginTop: "16px", position: "relative", cursor: "pointer" }} onClick={handleReplaceClick}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
          />
          {uploading && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "6px",
                width: `${progress}%`,
                backgroundColor: "#0077ff",
                borderRadius: "0 8px 0 0",
                transition: "width 0.1s linear",
              }}
            />
          )}
          {!uploading && (
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              Click to replace
            </div>
          )}
        </div>
      )}
    </div>
  );
}
