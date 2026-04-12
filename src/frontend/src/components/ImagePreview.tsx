import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";

interface ImagePreviewProps {
  originalUrl: string;
  processedUrl: string;
  originalFile: File | null;
  onReset: () => void;
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
  originalUrl,
  processedUrl,
  originalFile,
  onReset,
}: ImagePreviewProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>("png");
  const [isConverting, setIsConverting] = useState(false);

  const handleDownload = useCallback(async () => {
    setIsConverting(true);
    try {
      const baseName = originalFile?.name.replace(/\.[^.]+$/, "") ?? "image";
      let dataUrl: string;

      if (selectedFormat === "png") {
        dataUrl = processedUrl;
      } else {
        dataUrl = await convertBlobToFormat(processedUrl, selectedFormat);
      }

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${baseName}-no-bg.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsConverting(false);
    }
  }, [processedUrl, originalFile, selectedFormat]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      {/* Success badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold font-body">
          <CheckCircle2 className="w-4 h-4" />
          Background removed successfully!
        </div>
      </div>

      {/* Before / After panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body">
              Before
            </span>
            <span className="text-xs text-muted-foreground/50">· Original</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-card">
            <img
              src={originalUrl}
              alt="Original before background removal"
              className="w-full object-contain max-h-[420px]"
            />
          </div>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary font-body">
              After
            </span>
            <span className="text-xs text-muted-foreground/50">
              · Background removed
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-primary/25 shadow-card checkerboard-dark">
            <img
              src={processedUrl}
              alt="Result with background removed, transparent"
              className="w-full object-contain max-h-[420px]"
            />
          </div>
        </motion.div>
      </div>

      {/* Download section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Format selector — always-visible 3-button row */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body">
            Choose format
          </p>
          <div
            className="flex items-stretch rounded-xl border border-border/60 bg-card overflow-hidden"
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
                    : "bg-card text-foreground hover:bg-muted",
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

        {/* Action buttons row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            data-ocid="download-btn"
            size="lg"
            onClick={() => void handleDownload()}
            disabled={isConverting}
            className="gap-2.5 px-8 font-display font-semibold text-base h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-glow-primary transition-smooth"
          >
            <Download className="w-5 h-5" />
            {isConverting
              ? "Converting…"
              : `Download ${FORMAT_OPTIONS.find((f) => f.value === selectedFormat)?.label ?? "PNG"}`}
          </Button>

          <Button
            data-ocid="reset-btn"
            size="lg"
            variant="outline"
            onClick={onReset}
            className="gap-2.5 px-8 font-display font-medium text-base h-12 border-border/60 hover:bg-card hover:border-primary/40 transition-smooth rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Upload Another
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground/60">
          JPG exports use a white background. PNG &amp; WebP preserve
          transparency.
        </p>
      </motion.div>
    </motion.div>
  );
}
