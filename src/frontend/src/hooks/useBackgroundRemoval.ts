import { useCallback, useRef, useState } from "react";

interface BackgroundRemovalState {
  processedUrl: string | null;
  isProcessing: boolean;
  progress: number;
  error: string | null;
}

export function useBackgroundRemoval() {
  const [state, setState] = useState<BackgroundRemovalState>({
    processedUrl: null,
    isProcessing: false,
    progress: 0,
    error: null,
  });

  const processedBlobRef = useRef<string | null>(null);

  const processImage = useCallback(async (file: File): Promise<void> => {
    setState({
      processedUrl: null,
      isProcessing: true,
      progress: 0,
      error: null,
    });

    try {
      // Dynamic import to avoid blocking initial load
      const { removeBackground } = await import("@imgly/background-removal");

      // Clean up previous result
      if (processedBlobRef.current) {
        URL.revokeObjectURL(processedBlobRef.current);
        processedBlobRef.current = null;
      }

      const resultBlob = await removeBackground(file, {
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            setState((s) => ({ ...s, progress: pct }));
          }
        },
        output: {
          format: "image/png" as const,
          quality: 1,
        },
      });

      const url = URL.createObjectURL(resultBlob);
      processedBlobRef.current = url;

      setState({
        processedUrl: url,
        isProcessing: false,
        progress: 100,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      setState({
        processedUrl: null,
        isProcessing: false,
        progress: 0,
        error: message,
      });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    if (processedBlobRef.current) {
      URL.revokeObjectURL(processedBlobRef.current);
      processedBlobRef.current = null;
    }
    setState({
      processedUrl: null,
      isProcessing: false,
      progress: 0,
      error: null,
    });
  }, []);

  return {
    processImage,
    reset,
    processedUrl: state.processedUrl,
    isProcessing: state.isProcessing,
    progress: state.progress,
    error: state.error,
  };
}
