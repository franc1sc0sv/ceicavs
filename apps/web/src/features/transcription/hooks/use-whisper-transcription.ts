import { useRef, useState, useCallback, useEffect } from "react";

interface DownloadProgress {
  status: string;
  loaded: number;
  total: number;
}

interface WhisperTranscriptionState {
  transcript: string | null;
  segments: string | null;
  isTranscribing: boolean;
  downloadProgress: DownloadProgress | null;
  error: string | null;
}

interface UseWhisperTranscriptionReturn extends WhisperTranscriptionState {
  transcribe: (audio: Float32Array, language?: string) => void;
  reset: () => void;
}

export function useWhisperTranscription(): UseWhisperTranscriptionReturn {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<WhisperTranscriptionState>({
    transcript: null,
    segments: null,
    isTranscribing: false,
    downloadProgress: null,
    error: null,
  });

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/whisper.worker.ts", import.meta.url),
      { type: "module" },
    );

    workerRef.current.onmessage = (e: MessageEvent) => {
      const data = e.data as {
        type: string;
        status?: string;
        loaded?: number;
        total?: number;
        text?: string;
        segments?: string;
        message?: string;
      };

      if (data.type === "progress") {
        setState((prev) => ({
          ...prev,
          downloadProgress: {
            status: data.status ?? "",
            loaded: data.loaded ?? 0,
            total: data.total ?? 0,
          },
        }));
      } else if (data.type === "result") {
        setState((prev) => ({
          ...prev,
          transcript: data.text ?? null,
          segments: data.segments ?? null,
          isTranscribing: false,
          downloadProgress: null,
        }));
      } else if (data.type === "error") {
        console.error("[use-whisper] worker error:", new Error(data.message ?? "Unknown error"));
        setState((prev) => ({
          ...prev,
          isTranscribing: false,
          downloadProgress: null,
          error: data.message ?? "Unknown error",
        }));
      }
    };

    workerRef.current.onerror = (e) => {
      console.error("[use-whisper] uncaught worker error:", new Error(e.message ?? "Worker crashed"));
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const transcribe = useCallback((audio: Float32Array, language?: string) => {
    setState((prev) => ({
      ...prev,
      isTranscribing: true,
      transcript: null,
      error: null,
    }));
    workerRef.current?.postMessage({ type: "transcribe", audio, language }, [
      audio.buffer,
    ]);
  }, []);

  const reset = useCallback(() => {
    setState({
      transcript: null,
      segments: null,
      isTranscribing: false,
      downloadProgress: null,
      error: null,
    });
  }, []);

  return { ...state, transcribe, reset };
}
