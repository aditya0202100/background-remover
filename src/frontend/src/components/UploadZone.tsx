import { Button } from "@/components/ui/button";
import { AlertCircle, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
}

export default function UploadZone({ onFileAccepted }: UploadZoneProps) {
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndAccept(file);
      e.target.value = "";
    },
    [validateAndAccept],
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        type="button"
        data-ocid="upload-btn"
        size="lg"
        onClick={() => inputRef.current?.click()}
        className="gap-2.5 px-10 font-display font-semibold text-base h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary hover:shadow-[0_0_28px_0_oklch(0.5_0.22_295_/_0.5)] transition-smooth rounded-xl"
      >
        <Upload className="w-5 h-5" />
        Upload Image
      </Button>
      <p className="text-xs text-muted-foreground font-body">
        PNG, JPG, WebP, GIF · up to {MAX_SIZE_MB}MB
      </p>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl bg-destructive/10 border border-destructive/25 px-4 py-3 text-sm text-destructive max-w-sm text-center"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="sr-only"
        tabIndex={-1}
        data-ocid="upload-input"
      />
    </div>
  );
}
