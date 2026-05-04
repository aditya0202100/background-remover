import BackgroundEditor from "@/components/BackgroundEditor";
import ImagePreview from "@/components/ImagePreview";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import ReviewModal from "@/components/ReviewModal";
import ReviewsSection from "@/components/ReviewsSection";
import UploadZone from "@/components/UploadZone";
import { Button } from "@/components/ui/button";
import { useBackgroundRemoval } from "@/hooks/useBackgroundRemoval";
import {
  AlertCircle,
  ArrowDown,
  Download,
  Shield,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload",
    desc: "Click the Upload Image button and select any JPG, PNG, WebP, or GIF up to 15MB.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "Process",
    desc: "Our on-device AI model instantly analyzes your image and removes the background \u2014 entirely in your browser.",
  },
  {
    step: "03",
    icon: Download,
    title: "Download",
    desc: "Download your result as PNG (transparent), JPG (white background), or WebP. No account needed.",
  },
];

const TRUST_BADGES = [
  { icon: Zap, label: "Instant Results" },
  { icon: Shield, label: "100% Private" },
  { icon: Sparkles, label: "Free Forever" },
];

export default function HomePage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [compositedUrl, setCompositedUrl] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const {
    processImage,
    processedUrl,
    isProcessing,
    progress,
    reset,
    cancelProcessing,
    elapsedSeconds,
    isCancelling,
  } = useBackgroundRemoval();

  const handleFileAccepted = useCallback(
    async (file: File) => {
      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setOriginalUrl(url);
      setHasError(false);
      setShowReviewModal(false);
      try {
        await processImage(file);
        toast.success("Background removed successfully!");
      } catch {
        toast.error("Failed to remove background. Please try again.");
        setHasError(true);
      }
    },
    [processImage],
  );

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setHasError(false);
    setCompositedUrl(null);
    setShowReviewModal(false);
    reset();
  }, [originalUrl, reset]);

  const handleCancel = useCallback(() => {
    cancelProcessing();
    // Reset state after a short delay to allow cancel to propagate
    setTimeout(() => handleReset(), 100);
  }, [cancelProcessing, handleReset]);

  const hasImage = !!originalUrl;

  return (
    <>
      {/* Hero */}
      {!hasImage && (
        <section className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered \u00b7 Free \u00b7 No Signup
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight"
          >
            Remove Image <span className="text-primary">Backgrounds</span>
            <br />
            <span className="text-foreground/70">Instantly</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-muted-foreground text-base sm:text-lg font-body max-w-md leading-relaxed"
          >
            Upload any photo and our on-device AI removes the background in
            seconds. Nothing ever leaves your browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.22 }}
          >
            <UploadZone onFileAccepted={handleFileAccepted} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-5 flex-wrap justify-center"
          >
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground font-body"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-4"
          >
            <a
              href="#how-it-works"
              aria-label="Scroll to How it works"
              className="flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-muted-foreground transition-smooth"
            >
              <span className="text-xs">How it works</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>
          </motion.div>
        </section>
      )}

      {/* Processing state */}
      {isProcessing && originalUrl && (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <ProcessingOverlay
            progress={progress}
            originalUrl={originalUrl}
            estimatedRemainingSeconds={Math.max(0, 20 - elapsedSeconds)}
            onCancel={handleCancel}
            isCancelling={isCancelling}
          />
        </div>
      )}

      {/* Error state */}
      {!isProcessing && hasImage && hasError && (
        <section
          className="max-w-5xl mx-auto px-6 py-16 flex flex-col items-center gap-5 text-center"
          data-ocid="error-state"
        >
          <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-destructive" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground text-xl">
              Something went wrong
            </h2>
            <p className="text-muted-foreground text-sm mt-1.5 max-w-xs leading-relaxed">
              The background removal failed. Try a different image or give it
              another shot.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              variant="outline"
              onClick={handleReset}
              data-ocid="error-reset-btn"
              className="border-border/60 hover:bg-card hover:border-primary/40 transition-smooth"
            >
              Upload new image
            </Button>
            {originalFile && (
              <Button
                onClick={() => void handleFileAccepted(originalFile)}
                data-ocid="error-retry-btn"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth shadow-glow-primary"
              >
                Retry
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Result: [Processed image | Change Background] side by side */}
      {!isProcessing && hasImage && processedUrl && (
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
          <ImagePreview
            originalUrl={originalUrl!}
            processedUrl={processedUrl}
            compositedUrl={compositedUrl ?? undefined}
            originalFile={originalFile}
            onReset={handleReset}
            onDownload={() => setShowReviewModal(true)}
            sidebar={
              <BackgroundEditor
                processedUrl={processedUrl}
                onComposited={(url) => setCompositedUrl(url)}
              />
            }
          />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Want to process another image?{" "}
              <button
                type="button"
                onClick={handleReset}
                className="text-primary font-semibold hover:text-primary/80 underline underline-offset-2 transition-smooth"
                data-ocid="upload-another-link"
              >
                Upload new image
              </button>
            </p>
          </div>
        </div>
      )}

      {/* How it works */}
      {!hasImage && (
        <section
          id="how-it-works"
          className="bg-card/40 border-t border-border/60 py-20"
        >
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl font-bold text-foreground">
                How it works
              </h2>
              <p className="text-muted-foreground mt-2 font-body">
                Three simple steps \u2014 no account, no uploads to any server.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex flex-col gap-4 p-6 rounded-2xl border border-border/60 bg-background"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-primary/60 tracking-widest">
                      {step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed font-body">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews section */}
      <ReviewsSection />

      {/* Review modal shown after successful removal */}
      {showReviewModal && (
        <ReviewModal onClose={() => setShowReviewModal(false)} />
      )}
    </>
  );
}
