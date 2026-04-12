import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useCallback } from "react";

interface ImagePreviewProps {
  originalUrl: string;
  processedUrl: string;
  originalFile: File | null;
  onReset: () => void;
}

export default function ImagePreview({
  originalUrl,
  processedUrl,
  originalFile,
  onReset,
}: ImagePreviewProps) {
  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = processedUrl;
    const baseName = originalFile?.name.replace(/\.[^.]+$/, "") ?? "image";
    a.download = `${baseName}-no-bg.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [processedUrl, originalFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      {/* Success badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/25 text-accent text-sm font-medium font-body">
          <CheckCircle2 className="w-4 h-4" />
          Background removed successfully!
        </div>
      </div>

      {/* Before / After panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground font-body">
              Before
            </span>
            <span className="text-xs text-muted-foreground/60">
              · Original image
            </span>
          </div>
          <div className="rounded-xl overflow-hidden border border-border bg-card shadow-card">
            <img
              src={originalUrl}
              alt="Original before background removal"
              className="w-full object-contain max-h-[400px]"
            />
          </div>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-accent font-body">
              After
            </span>
            <span className="text-xs text-muted-foreground/60">
              · Background removed
            </span>
          </div>
          <div
            className="rounded-xl overflow-hidden border border-accent/20 shadow-card"
            style={{
              backgroundImage:
                "repeating-conic-gradient(oklch(0.92 0 0) 0% 25%, oklch(0.98 0 0) 0% 50%)",
              backgroundSize: "24px 24px",
            }}
          >
            <img
              src={processedUrl}
              alt="Result with background removed, transparent"
              className="w-full object-contain max-h-[400px]"
            />
          </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Button
          data-ocid="download-btn"
          size="lg"
          onClick={handleDownload}
          className="gap-2 px-8 font-display font-semibold text-base h-12 shadow-card"
        >
          <Download className="w-5 h-5" />
          Download PNG
        </Button>
        <Button
          data-ocid="reset-btn"
          size="lg"
          variant="outline"
          onClick={onReset}
          className="gap-2 px-8 font-display font-medium text-base h-12"
        >
          <RefreshCw className="w-4 h-4" />
          Upload Another
        </Button>
      </motion.div>
    </motion.div>
  );
}
