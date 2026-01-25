import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWrapper } from "@/layouts/PageWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";

const API_URL = import.meta.env.VITE_API_URL;

type VoiceNote = {
  id: string;
  title?: string | null;
  transcript?: string | null;
  status?: string | null;
  createdAt: string;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDayLabel = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) {
    return `Yesterday • ${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getDayKey = (dateString: string) => new Date(dateString).toDateString();

export default function AppPage() {
  const [openTranscripts, setOpenTranscripts] = useState<
    Record<string, boolean>
  >({});
  const { data, isLoading } = useSWR(
    `${API_URL}/voice-notes/`,
    (url: string) =>
      fetch(url, { credentials: "include" }).then((res) => res.json()),
    {
      refreshInterval: (latest) =>
        Array.isArray(latest) &&
        latest.some(
          (note) => note.status === "PENDING" || note.status === "PROCESSING",
        )
          ? 3000
          : 0,
    },
  );

  const voiceNotes: VoiceNote[] = Array.isArray(data) ? data : [];
  const sortedNotes = [...voiceNotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const groupedNotes = sortedNotes.reduce<
    Array<{ label: string; key: string; notes: VoiceNote[] }>
  >((groups, note) => {
    const key = getDayKey(note.createdAt);
    const group = groups.find((item) => item.key === key);
    if (group) {
      group.notes.push(note);
      return groups;
    }
    groups.push({
      key,
      label: formatDayLabel(note.createdAt),
      notes: [note],
    });
    return groups;
  }, []);

  return (
    <PageWrapper title="Norma">
      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && groupedNotes.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No voice notes yet. Record something to get started.
        </p>
      )}

      {!isLoading && groupedNotes.length > 0 && (
        <div className="flex flex-col gap-8">
          {groupedNotes.map((group) => (
            <section key={group.key} className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {group.label}
              </h2>
              <div className="flex flex-col gap-4">
                {group.notes.map((note) => {
                  const status = note.status?.toUpperCase();
                  const isProcessing =
                    status === "PENDING" || status === "PROCESSING";
                  const isOpen = Boolean(openTranscripts[note.id]);

                  return (
                    <Card key={note.id} className="py-3 gap-0">
                      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-3">
                        {isProcessing && !note.title ? (
                          <Skeleton className="h-5 w-48" />
                        ) : (
                          <CardTitle className="text-base">
                            {note.title ?? "Voice Note Error"}
                          </CardTitle>
                        )}
                        {isProcessing && (
                          <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                            Processing
                          </span>
                        )}
                      </CardHeader>
                      <CardContent>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between text-left text-xs font-medium text-muted-foreground"
                          onClick={() =>
                            setOpenTranscripts((prev) => ({
                              ...prev,
                              [note.id]: !prev[note.id],
                            }))
                          }
                        >
                          <span>Transcript</span>
                          <span>{isOpen ? "Hide" : "Show"}</span>
                        </button>
                        {isOpen && (
                          <div className="mt-2 text-sm text-foreground">
                            {note.transcript ? (
                              <p>{note.transcript}</p>
                            ) : isProcessing ? (
                              <div>
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="mt-2 h-4 w-2/3" />
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No transcript available.
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
