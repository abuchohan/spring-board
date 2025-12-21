import { useState } from "react";

import { VoiceRecorder } from "@/components/VoiceRecorder/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { PageWrapper } from "@/layouts/PageWrapper";
import { IconChevronDown, IconDownload, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

type AiAction = {
  title: string;
  dueDate?: string;
};

type AiResultShape = {
  title?: string;
  tags?: string[];
  actions?: AiAction[];
  meta?: {
    summary?: string;
    sentiment?: "positive" | "neutral" | "negative";
  };
};

type VoiceNote = {
  id: string;
  userId?: string;
  title?: string;
  storagePath: string;
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  transcript?: string | null;
  aiResult?: AiResultShape | Record<string, unknown> | null;
  createdAt: string;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const VoiceTaggingPage = () => {
  const [playbackUrls, setPlaybackUrls] = useState<Record<string, string>>({});
  const [playbackLoading, setPlaybackLoading] = useState<
    Record<string, boolean>
  >({});
  const [openTranscripts, setOpenTranscripts] = useState<
    Record<string, boolean>
  >({});

  const { data, isLoading } = useSWR<VoiceNote[]>(
    "http://localhost:5000/api/voice-notes/",
    (url: string) =>
      fetch(url, { credentials: "include" }).then((res) => res.json())
  );

  const voiceNotes = data ?? [];

  const handleUploadClick = async (blob: Blob) => {
    const res = await fetch(
      "http://localhost:5000/api/voice-notes/upload-url",
      {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: blob.type,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to get upload URL");
    }

    const { uploadUrl, key } = await res.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": blob.type,
      },
      body: blob,
    });

    if (!uploadRes.ok) {
      throw new Error("S3 upload failed");
    }

    const metaRes = await fetch("http://localhost:5000/api/voice-notes", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storagePath: key,
      }),
    });

    if (!metaRes.ok) {
      throw new Error("Failed to save voice note metadata");
    }
    mutate("http://localhost:5000/api/voice-notes/");
  };

  const handleUploadSuccess = async () => {
    toast.success("Voice Note Uploaded");
  };

  const handleUploadError = (err: unknown) => {
    toast.error("Upload failed" + err);
  };

  const handleOnPlay = async (id: string) => {
    setPlaybackLoading((prev) => ({ ...prev, [id]: true }));
    const res = await fetch(
      `http://localhost:5000/api/voice-notes/${id}/playback-url`,
      {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      setPlaybackLoading((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      throw new Error("Failed to get playback URL");
    }

    const { playbackUrl } = await res.json();

    setPlaybackUrls((prev) => ({
      ...prev,
      [id]: playbackUrl,
    }));

    setPlaybackLoading((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleDeleteAudio = async (id: string) => {
    const res = await fetch(
      `http://localhost:5000/api/voice-notes/${id}/delete`,
      {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete");
    }

    setPlaybackUrls((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    mutate("http://localhost:5000/api/voice-notes/");
  };

  const toggleTranscript = (id: string) => {
    setOpenTranscripts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const extractActions = (notes: VoiceNote[]) => {
    const items: {
      noteId: string;
      noteLabel: string;
      title: string;
      dueDate?: string;
      noteIndex: number;
    }[] = [];

    notes.forEach((note, idx) => {
      const source =
        note.aiResult && typeof note.aiResult === "object"
          ? (note.aiResult as AiResultShape)
          : null;
      const noteLabel = note.title || source?.title || `Voice note #${idx + 1}`;

      const actions = source?.actions;
      if (!Array.isArray(actions)) return;

      actions.forEach((action, actionIdx) => {
        if (action && typeof action.title === "string") {
          items.push({
            noteId: note.id,
            noteLabel,
            title: action.title,
            dueDate: action.dueDate,
            noteIndex: idx,
          });
        } else {
          console.warn(
            `Skipping invalid action at ${note.id}-${actionIdx}`,
            action
          );
        }
      });
    });

    return items.sort((a, b) => a.noteIndex - b.noteIndex);
  };

  const allActions = extractActions(voiceNotes);
  const anyProcessing = voiceNotes.some(
    (note) => note.status === "PENDING" || note.status === "PROCESSING"
  );

  return (
    <PageWrapper title="Voice Tagging">
      <div className="flex flex-col gap-6 justify-between">
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">AI Action Points</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tasks auto-collected from analysed voice notes.
                </p>
              </div>
              {anyProcessing && (
                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <Spinner className="size-3.5" />
                  Updating...
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </>
            ) : allActions.length > 0 ? (
              <ul className="space-y-2">
                {allActions.map((action) => (
                  <li
                    key={`${action.noteId}-${action.title}-${action.dueDate ?? "nodue"}`}
                    className="flex items-start justify-between gap-3 rounded-lg border bg-background/70 px-3 py-2"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{action.title}</span>
                      <span className="text-xs text-muted-foreground">
                        From {action.noteLabel}
                      </span>
                    </div>
                    {action.dueDate ? (
                      <span className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                        Due {action.dueDate}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No AI tasks yet. Once notes finish processing, action points
                will appear here.
              </p>
            )}
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-5" />
            Loading your voice notes...
          </div>
        )}

        {voiceNotes.length === 0 && !isLoading && (
          <div className="rounded-lg border border-dashed bg-muted/40 px-6 py-10 text-center text-sm text-muted-foreground">
            No voice notes yet. Record something below to get started.
          </div>
        )}

        {voiceNotes.length > 0 && (
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {voiceNotes.map((note, index) => {
              const isProcessing =
                note.status === "PENDING" || note.status === "PROCESSING";
              const isTranscriptOpen = Boolean(openTranscripts[note.id]);
              const noteNumber = index + 1;
              const title = note.title || `Voice Note #${noteNumber}`;

              return (
                <Card key={note.id} className="relative ">
                  {isProcessing && (
                    <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-muted/70 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
                      <Spinner className="size-3.5" />
                      <span>AI is processing this voice note</span>
                    </div>
                  )}

                  <CardHeader className="pb-2 pr-28">
                    {title ? (
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {noteNumber}
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          {title}
                        </CardTitle>
                      </div>
                    ) : (
                      <Skeleton className="h-5 w-40" />
                    )}
                    <div className="text-xs text-muted-foreground">
                      Recorded {formatDate(note.createdAt)}
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <audio
                        controls
                        className="w-full max-w-md rounded-lg border bg-muted/50"
                        style={{
                          pointerEvents: playbackUrls[note.id]
                            ? "unset"
                            : "none",
                        }}
                        src={playbackUrls[note.id]}
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          aria-label="Load audio"
                          onClick={() => handleOnPlay(note.id)}
                          disabled={
                            Boolean(playbackUrls[note.id]) ||
                            playbackLoading[note.id]
                          }
                        >
                          {playbackLoading[note.id] ? (
                            <Spinner className="size-4" />
                          ) : (
                            <IconDownload />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          aria-label="Delete voice note"
                          onClick={() => handleDeleteAudio(note.id)}
                        >
                          <IconTrash />
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/40 px-4 py-3">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between text-left"
                        onClick={() => toggleTranscript(note.id)}
                      >
                        <span className="text-sm font-medium text-foreground">
                          Transcript
                        </span>
                        <IconChevronDown
                          className={`transition-transform ${isTranscriptOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isTranscriptOpen && (
                        <div className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
                          {note.transcript ? (
                            <p>{note.transcript}</p>
                          ) : isProcessing ? (
                            <>
                              <Skeleton className="h-3.5 w-3/4" />
                              <Skeleton className="h-3.5 w-5/6" />
                              <Skeleton className="h-3.5 w-2/3" />
                            </>
                          ) : (
                            <p className="text-muted-foreground">
                              No transcript available.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-auto">
          <VoiceRecorder
            onUploadClick={handleUploadClick}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default VoiceTaggingPage;
