import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface ProcessingOverlayProps {
  progress: number;
  originalUrl: string;
}

const STEPS = [
  { threshold: 0, label: "Loading AI model…" },
  { threshold: 20, label: "Analyzing image…" },
  { threshold: 50, label: "Detecting edges…" },
  { threshold: 75, label: "Removing background…" },
  { threshold: 90, label: "Finalizing result…" },
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
}: ProcessingOverlayProps) {
  const label = getStepLabel(progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Preview of original while processing */}
      <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-card border border-border bg-card">
        <img
          src={originalUrl}
          alt="Your upload being processed by AI"
          className="w-full object-contain max-h-80"
          style={{ filter: "brightness(0.85) saturate(0.6)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-sm gap-4 px-8">
          <div className="w-12 h-12 rounded-full bg-card/90 shadow-card flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-display font-semibold text-foreground text-base">
              {label}
            </p>
            <p className="text-muted-foreground text-sm mt-0.5">
              {progress > 0 ? `${progress}%` : "Starting…"}
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.max(progress, 5)}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        The AI model runs entirely in your browser. This may take 10–30 seconds
        depending on image size.
      </p>
    </motion.div>
  );
}
