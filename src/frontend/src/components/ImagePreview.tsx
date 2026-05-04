import { Button } from "@/components/ui/button";
import { CheckCircle2, Download } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useCallback, useState } from "react";

interface ImagePreviewProps {
  originalUrl: string;
  processedUrl: string;
  compositedUrl?: string;
  originalFile: File | null;
  onReset: () => void;
  sidebar?: ReactNode;
  onDownload?: () => void;
}

type DownloadFormat = "png" | "jpg" | "webp";

const FORMAT_OPTIONS: { value: DownloadFormat; label: string; desc: string }[] =
  [
    { value: "png", label: "PNG", desc: "Transparent" },
    { value: "jpg", label: "JPG", desc: "White BG" },
    { value: "webp", label: "WebP", desc: "Modern" },
  ];

function convertBlobToFormat(
  processedUrl: string,
  format: DownloadFormat,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No canvas context"));

      if (format === "jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
      const quality = format === "jpg" ? 0.92 : 0.9;
      resolve(canvas.toDataURL(mimeType, quality));
    };
    img.onerror = reject;
    img.src = processedUrl;
  });
}

export default function ImagePreview({
  originalUrl: _originalUrl,
  processedUrl,
  compositedUrl,
  originalFile,
  onReset: _onReset,
  sidebar,
  onDownload,
}: ImagePreviewProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>("png");
  const [isConverting, setIsConverting] = useState(false);

  // Use composited URL (with background applied) when available, else fall back to transparent
  const downloadSource = compositedUrl ?? processedUrl;

  const handleDownload = useCallback(async () => {
    setIsConverting(true);
    try {
      const baseName = originalFile?.name.replace(/\.[^.]+$/, "") ?? "image";
      let dataUrl: string;

      if (selectedFormat === "png") {
        dataUrl = downloadSource;
      } else {
        dataUrl = await convertBlobToFormat(downloadSource, selectedFormat);
      }

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${baseName}-no-bg.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onDownload?.();
    } finally {
      setIsConverting(false);
    }
  }, [downloadSource, originalFile, selectedFormat, onDownload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      {/* ── Download section — TOP, first thing users see ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="flex flex-col items-center gap-4 p-5 rounded-2xl border border-border/60 bg-card shadow-card"
        data-ocid="download-section"
      >
        {/* Success badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold font-body">
          <CheckCircle2 className="w-4 h-4" />
          Background removed successfully!
        </div>

        {/* Format selector — always-visible 3-button row */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body">
            Choose format
          </p>
          <div
            className="flex items-stretch rounded-xl border border-border/60 bg-background overflow-hidden"
            data-ocid="format-selector"
          >
            {FORMAT_OPTIONS.map((fmt, i) => (
              <button
                key={fmt.value}
                type="button"
                data-ocid={`format-option-${fmt.value}`}
                onClick={() => setSelectedFormat(fmt.value)}
                className={[
                  "flex flex-col items-center justify-center px-5 py-3 min-w-[80px] transition-colors duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  i > 0 ? "border-l border-border/60" : "",
                  selectedFormat === fmt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted",
                ].join(" ")}
              >
                <span className="text-sm font-bold font-display leading-none">
                  {fmt.label}
                </span>
                <span
                  className={[
                    "text-xs mt-1 leading-none",
                    selectedFormat === fmt.value
                      ? "text-primary-foreground/75"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {fmt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Download button */}
        <Button
          data-ocid="download-btn"
          size="lg"
          onClick={() => void handleDownload()}
          disabled={isConverting}
          className="gap-2.5 px-10 font-display font-semibold text-base h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-glow-primary transition-smooth"
        >
          <Download className="w-5 h-5" />
          {isConverting
            ? "Converting…"
            : `Download ${FORMAT_OPTIONS.find((f) => f.value === selectedFormat)?.label ?? "PNG"}`}
        </Button>

        <p className="text-xs text-center text-muted-foreground/60">
          JPG exports use a white background. PNG &amp; WebP preserve
          transparency.
        </p>
      </motion.div>

      {/* ── Result card + Change Background side by side ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
        {/* Result (After) card — left column */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.3 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary font-body">
              Result
            </span>
            <span className="text-xs text-muted-foreground/50">
              · Background removed
            </span>
          </div>
          <div
            className={
              compositedUrl
                ? "rounded-2xl overflow-hidden border border-primary/25 shadow-card flex-1"
                : "rounded-2xl overflow-hidden border border-primary/25 shadow-card checkerboard-dark flex-1"
            }
          >
            <img
              src={compositedUrl ?? processedUrl}
              alt="Result with background removed"
              className="w-full object-contain max-h-[460px]"
            />
          </div>
        </motion.div>

        {/* Change Background panel — right column */}
        {sidebar && (
          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.3 }}
            className="flex flex-col h-full"
          >
            {sidebar}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
