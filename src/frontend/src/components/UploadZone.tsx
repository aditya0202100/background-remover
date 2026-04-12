import { AlertCircle, ImageIcon, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
}

export default function UploadZone({ onFileAccepted }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAccept = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(
          "Unsupported file type. Please upload a JPG, PNG, WebP, or GIF.",
        );
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
        return;
      }
      onFileAccepted(file);
    },
    [onFileAccepted],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndAccept(file);
    },
    [validateAndAccept],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsDragging(false);
    },
    [],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndAccept(file);
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [validateAndAccept],
  );

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        data-ocid="upload-zone"
        aria-label="Upload — drag and drop or click to browse"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={[
          "relative w-full cursor-pointer rounded-xl border-2 px-8 py-14 flex flex-col items-center justify-center gap-4",
          "transition-smooth select-none outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDragging
            ? "border-primary bg-primary/5 shadow-card"
            : "border-dashed border-border bg-card hover:border-primary/50 hover:bg-primary/[0.02]",
        ].join(" ")}
      >
        <div
          className={[
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-smooth",
            isDragging
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {isDragging ? (
            <ImageIcon className="w-7 h-7" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
        </div>

        <div className="text-center">
          <p className="font-display font-semibold text-xl text-foreground">
            {isDragging ? "Drop to upload" : "Drag & drop image here"}
          </p>
          <p className="text-muted-foreground mt-1 text-sm font-body">
            or{" "}
            <span className="text-primary font-medium underline underline-offset-2">
              click to browse
            </span>
          </p>
          <p className="text-muted-foreground/70 mt-2 text-xs font-body">
            Supports JPG, PNG, WebP, GIF · Max {MAX_SIZE_MB}MB
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          className="sr-only"
          tabIndex={-1}
          data-ocid="upload-input"
        />
      </button>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
