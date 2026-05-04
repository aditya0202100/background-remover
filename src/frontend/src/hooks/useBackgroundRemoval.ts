import { useCallback, useRef, useState } from "react";

interface BackgroundRemovalState {
  processedUrl: string | null;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  elapsedSeconds: number;
  isCancelling: boolean;
}

export function useBackgroundRemoval() {
  const [state, setState] = useState<BackgroundRemovalState>({
    processedUrl: null,
    isProcessing: false,
    progress: 0,
    error: null,
    elapsedSeconds: 0,
    isCancelling: false,
  });

  const processedBlobRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const processImage = useCallback(
    async (file: File): Promise<void> => {
      // Clean up any previous abort controller
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const abortController = new AbortController();
      abortRef.current = abortController;

      stopTimer();
      setState({
        processedUrl: null,
        isProcessing: true,
        progress: 0,
        error: null,
        elapsedSeconds: 0,
        isCancelling: false,
      });

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setState((s) => ({
          ...s,
          elapsedSeconds: Math.floor((Date.now() - startTime) / 1000),
        }));
      }, 1000);

      try {
        const { removeBackground } = await import("@imgly/background-removal");

        if (processedBlobRef.current) {
          URL.revokeObjectURL(processedBlobRef.current);
          processedBlobRef.current = null;
        }

        // Check if cancelled during dynamic import
        if (abortController.signal.aborted) {
          stopTimer();
          setState({
            processedUrl: null,
            isProcessing: false,
            progress: 0,
            error: null,
            elapsedSeconds: 0,
            isCancelling: false,
          });
          return;
        }

        const resultBlob = await removeBackground(file, {
          progress: (_key: string, current: number, total: number) => {
            // If cancelled mid-progress, stop updating
            if (abortController.signal.aborted) return;
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

        stopTimer();
        // If cancelled while processing ran to completion, discard result
        if (abortController.signal.aborted) {
          setState({
            processedUrl: null,
            isProcessing: false,
            progress: 0,
            error: null,
            elapsedSeconds: 0,
            isCancelling: false,
          });
          return;
        }
        const url = URL.createObjectURL(resultBlob);
        processedBlobRef.current = url;

        setState({
          processedUrl: url,
          isProcessing: false,
          progress: 100,
          error: null,
          elapsedSeconds: 0,
          isCancelling: false,
        });
      } catch (err) {
        stopTimer();
        // If cancelled, just reset silently
        if (abortController.signal.aborted) {
          setState({
            processedUrl: null,
            isProcessing: false,
            progress: 0,
            error: null,
            elapsedSeconds: 0,
            isCancelling: false,
          });
          return;
        }
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setState({
          processedUrl: null,
          isProcessing: false,
          progress: 0,
          error: message,
          elapsedSeconds: 0,
          isCancelling: false,
        });
        throw err;
      }
    },
    [stopTimer],
  );

  const cancelProcessing = useCallback(() => {
    if (!abortRef.current) return;
    setState((s) => ({ ...s, isCancelling: true }));
    abortRef.current.abort();
    stopTimer();
  }, [stopTimer]);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    stopTimer();
    if (processedBlobRef.current) {
      URL.revokeObjectURL(processedBlobRef.current);
      processedBlobRef.current = null;
    }
    setState({
      processedUrl: null,
      isProcessing: false,
      progress: 0,
      error: null,
      elapsedSeconds: 0,
      isCancelling: false,
    });
  }, [stopTimer]);

  return {
    processImage,
    reset,
    cancelProcessing,
    processedUrl: state.processedUrl,
    isProcessing: state.isProcessing,
    progress: state.progress,
    error: state.error,
    elapsedSeconds: state.elapsedSeconds,
    isCancelling: state.isCancelling,
  };
}
