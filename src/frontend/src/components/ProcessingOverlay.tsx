import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface ProcessingOverlayProps {
  progress: number;
  originalUrl: string;
  estimatedRemainingSeconds: number | null;
  onCancel: () => void;
  isCancelling: boolean;
}

const STEPS = [
  { threshold: 0, label: "Loading AI model\u2026" },
  { threshold: 20, label: "Analyzing image\u2026" },
  { threshold: 50, label: "Detecting edges\u2026" },
  { threshold: 75, label: "Removing background\u2026" },
  { threshold: 90, label: "Finalizing result\u2026" },
];

function getStepLabel(progress: number) {
  for (let i = STEPS.length - 1; i >= 0; i--) {
    if (progress >= STEPS[i].threshold) return STEPS[i].label;
  }
  return STEPS[0].label;
}

export default function ProcessingOverlay({
  progress,
  originalUrl,
  estimatedRemainingSeconds,
  onCancel,
  isCancelling,
}: ProcessingOverlayProps) {
  const label = getStepLabel(progress);

  const timeLabel = isCancelling
    ? "Cancelling\u2026"
    : progress > 80
      ? "Almost done\u2026"
      : estimatedRemainingSeconds !== null && estimatedRemainingSeconds > 0
        ? `~${estimatedRemainingSeconds}s remaining`
        : "Estimating\u2026";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Preview while processing */}
      <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-card border border-border/60 bg-card">
        <img
          src={originalUrl}
          alt="Your upload being processed by AI"
          className="w-full object-contain max-h-80"
          style={{ filter: "brightness(0.6) saturate(0.4)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm gap-4 px-8">
          {/* Spinner */}
          <div className="w-14 h-14 rounded-full bg-card/90 border border-primary/20 shadow-card flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>

          <div className="text-center">
            <p className="font-display font-bold text-foreground text-base tracking-tight">
              {label}
            </p>
            <p className="text-muted-foreground text-sm mt-0.5">
              {progress > 0 ? `${progress}%` : "Starting\u2026"}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-border/30 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.5 0.22 295) 0%, oklch(0.65 0.2 290) 100%)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${Math.max(progress, 5)}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Estimated time */}
          <p className="text-xs font-semibold text-muted-foreground font-body">
            {timeLabel}
          </p>

          {/* Cancel button */}
          <button
            type="button"
            data-ocid="processing.cancel-button"
            onClick={onCancel}
            disabled={isCancelling}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/60 hover:border-border rounded-lg px-4 py-1.5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-card/50"
          >
            {isCancelling ? "Cancelling\u2026" : "Cancel"}
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
        The AI model runs entirely in your browser. This may take 10\u201330
        seconds depending on image size.
      </p>
    </motion.div>
  );
}
