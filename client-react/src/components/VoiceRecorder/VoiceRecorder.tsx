import { useRef, useState, useEffect } from "react";

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

    // Create onstop event handler
    recorder.onstop = () => {
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
    };

    // Start recording
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (recorder.state === "recording") {
      recorder.stop();
    }

    setIsRecording(false);
  };

  const onRecordHandler = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const onDiscardClick = () => {
    setAudio(null);
    setCounter(0);
  };

  const handleUpload = async () => {
    if (!audio?.blob) return;

    setIsUploading(true);
    try {
      await onUploadClick(audio.blob); // parent does actual upload
      onUploadSuccess(); // parent tells us success
      setAudio(null); // clear blob
      setCounter(0);
    } catch (err) {
      onUploadError(err); // show error but keep blob
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 align-center">
      {audio && (
        <audio controls>
          <source src={audio.url} type="audio/webm" />
        </audio>
      )}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onDiscardClick}
          variant="outline"
          aria-label="Delete recording"
        >
          <IconTrash />
        </Button>

        <div className="gap-2">
          <div className="h-9 flex justify-center items-center gap-1 px-2 rounded-md min-w-[200px]">
            {waveform.map((value, index) => (
              <div
                key={index}
                className="w-2 bg-primary transition-all duration-75 rounded-full"
                style={{
                  height: `${Math.max((value / 255) * 100, 10)}%`,
                  opacity: Math.max(value / 255, 0.2),
                }}
              />
            ))}
          </div>
        </div>
        <div>{formatTime(counter)}</div>

        <Button
          onClick={handleUpload}
          variant="outline"
          aria-label="Upload recording"
          disabled={isUploading || !audio}
        >
          {isUploading ? <Spinner /> : <IconUpload />}
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          aria-label="Record a voice note"
          onClick={onRecordHandler}
        >
          {isRecording ? (
            <>
              <IconSquareFilled />
            </>
          ) : (
            <IconMicrophone />
          )}
        </Button>
      </div>
    </div>
  );
};
