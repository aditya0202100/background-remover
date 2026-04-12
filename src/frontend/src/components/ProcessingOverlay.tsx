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
      {/* Preview while processing */}
      <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-card border border-border/60 bg-card">
        <img
          src={originalUrl}
          alt="Your upload being processed by AI"
          className="w-full object-contain max-h-80"
          style={{ filter: "brightness(0.6) saturate(0.4)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm gap-5 px-8">
          {/* Spinner */}
          <div className="w-14 h-14 rounded-full bg-card/90 border border-primary/20 shadow-card flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>

          <div className="text-center">
            <p className="font-display font-bold text-foreground text-base tracking-tight">
              {label}
            </p>
            <p className="text-muted-foreground text-sm mt-0.5">
              {progress > 0 ? `${progress}%` : "Starting…"}
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
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
        The AI model runs entirely in your browser. This may take 10–30 seconds
        depending on image size.
      </p>
    </motion.div>
  );
}
