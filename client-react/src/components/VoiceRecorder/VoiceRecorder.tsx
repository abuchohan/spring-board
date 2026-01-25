import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  IconMicrophone,
  IconSquareFilled,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";

export const VoiceRecorder = ({
  onRecorded,
  onUploadClick,
  onUploadSuccess,
  onUploadError,
}: {
  onRecorded?: (blob: Blob) => void;
  onUploadClick: (blob: Blob) => Promise<void>;
  onUploadSuccess: () => void;
  onUploadError: (err: unknown) => void;
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [audio, setAudio] = useState<{ url: string; blob: Blob } | null>(null);
  const [counter, setCounter] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [waveform, setWaveform] = useState<number[]>(new Array(20).fill(0));

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setCounter((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = async () => {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // Create media recorder
    const recorder = new MediaRecorder(stream);

    // Audio Context for visualizer
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;
    analyser.fftSize = 64; // Results in 32 frequency bins

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const updateWaveform = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      // Take the first 20 bins
      const bars = Array.from(dataArray).slice(0, 20);
      setWaveform(bars);
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    };
    updateWaveform();

    // Store media recorder in ref
    mediaRecorderRef.current = recorder;

    // Create onstart event handler
    recorder.onstart = () => {
      chunksRef.current = [];
      setAudio(null);
      setCounter(0);
    };

    // Create ondataavailable event handler
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    // Start recording
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return Promise.resolve(null);

    return new Promise<Blob | null>((resolve) => {
      const handleStop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudio({ url, blob });
        if (onRecorded) onRecorded(blob);

        // Cleanup visualizer
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        setWaveform(new Array(20).fill(0));
        setIsRecording(false);
        resolve(blob);
      };

      recorder.addEventListener("stop", handleStop, { once: true });

      if (recorder.state === "recording") {
        recorder.stop();
      } else {
        recorder.removeEventListener("stop", handleStop);
        resolve(null);
      }
    });
  };

  const onRecordHandler = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const onDiscardClick = () => {
    setAudio(null);
    setCounter(0);
  };

  const handleStopAndUpload = async () => {
    const blob = await stopRecording();
    await handleUpload(blob);
  };

  const handleUpload = async (blobOverride?: Blob | null) => {
    const blobToUpload = blobOverride ?? audio?.blob;

    if (!blobToUpload) return;

    setIsUploading(true);
    try {
      await onUploadClick(blobToUpload); // parent does actual upload
      onUploadSuccess(); // parent tells us success
      setAudio(null); // clear blob
      setCounter(0);
    } catch (err) {
      onUploadError(err); // show error but keep blob
    } finally {
      setIsUploading(false);
    }
  };

  const overlay = isRecording ? (
    <div className="fixed inset-0 z-40 pointer-events-auto">
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 pb-24">
        <div className="rounded-full border border-default/40 bg-default/10 px-4 py-1.5 text-sm font-medium flex items-center">
          <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-destructive" />
          {formatTime(counter)}
        </div>
        <div className="h-16 flex justify-center items-center gap-1.5 px-3 rounded-md min-w-50">
          {waveform.map((value, index) => (
            <div
              key={index}
              className="w-1 bg-primary transition-all duration-75 rounded-full"
              style={{
                height: `${Math.max((value / 255) * 100, 10)}%`,
                opacity: Math.max(value / 255, 0.2),
              }}
            />
          ))}
        </div>
        {/* NON MVP: Add realtime transcript here so we can skip the API step */}

        <div>Transcription of audio here</div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {typeof document !== "undefined" && overlay
        ? createPortal(overlay, document.body)
        : null}

      <div className="flex flex-col justify-center gap-4 align-center">
        <div className="flex justify-center">
          {!isRecording ? (
            <Button
              type="button"
              variant="outline"
              aria-label="Record a voice note"
              onClick={onRecordHandler}
              disabled={isUploading}
              className="h-14 w-14 rounded-full p-0"
            >
              {isUploading ? <Spinner /> : <IconMicrophone />}
            </Button>
          ) : (
            <Button
              type="button"
              variant={"destructive"}
              aria-label="Stop and upload"
              onClick={handleStopAndUpload}
              className="h-14 w-14 rounded-full p-0"
            >
              <IconSquareFilled />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
