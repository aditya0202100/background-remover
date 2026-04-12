import ImagePreview from "@/components/ImagePreview";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import UploadZone from "@/components/UploadZone";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useBackgroundRemoval } from "@/hooks/useBackgroundRemoval";
import { AlertCircle, Scissors } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function App() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const { processImage, processedUrl, isProcessing, progress, reset } =
    useBackgroundRemoval();

  const handleFileAccepted = useCallback(
    async (file: File) => {
      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setOriginalUrl(url);
      setHasError(false);
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
    reset();
  }, [originalUrl, reset]);

  const hasImage = !!originalUrl;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-xs sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Scissors className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg text-foreground tracking-tight">
              BgEraser
            </span>
          </div>
          <span className="text-sm text-muted-foreground font-body hidden sm:block">
            100% client-side · no uploads · instant results
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        {/* Upload zone — always visible until result */}
        {!hasImage && (
          <section className="flex flex-col gap-3">
            <div className="text-center mb-2">
              <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
                Remove Image Backgrounds
              </h1>
              <p className="text-muted-foreground mt-2 font-body text-base">
                Upload an image and the AI removes the background instantly —
                right in your browser.
              </p>
            </div>
            <UploadZone onFileAccepted={handleFileAccepted} />
          </section>
        )}

        {/* Processing state */}
        {isProcessing && originalUrl && (
          <ProcessingOverlay progress={progress} originalUrl={originalUrl} />
        )}

        {/* Error state — processing failed, offer reset/retry */}
        {!isProcessing && hasImage && hasError && (
          <section
            className="flex flex-col items-center gap-4 py-12 text-center"
            data-ocid="error-state"
          >
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-foreground text-lg">
                Something went wrong
              </h2>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                The background removal failed. Try a different image or give it
                another shot.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                data-ocid="error-reset-btn"
              >
                Upload new image
              </Button>
              {originalFile && (
                <Button
                  onClick={() => void handleFileAccepted(originalFile)}
                  data-ocid="error-retry-btn"
                >
                  Retry
                </Button>
              )}
            </div>
          </section>
        )}

        {/* Result: before/after */}
        {!isProcessing && hasImage && processedUrl && (
          <ImagePreview
            originalUrl={originalUrl}
            processedUrl={processedUrl}
            originalFile={originalFile}
            onReset={handleReset}
          />
        )}

        {/* Re-upload zone after processing */}
        {!isProcessing && hasImage && processedUrl && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Want to process another image?{" "}
              <button
                type="button"
                onClick={handleReset}
                className="text-primary font-medium underline underline-offset-2 hover:opacity-80 transition-smooth"
              >
                Upload new image
              </button>
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground font-body">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            All processing happens locally — your images never leave your
            device.
          </p>
        </div>
      </footer>

      <Toaster richColors position="bottom-center" />
    </div>
  );
}
