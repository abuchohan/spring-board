import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PageWrapper } from "@/layouts/PageWrapper";
import useSWR from "swr";

const API_URL = import.meta.env.VITE_API_URL;

const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const VoiceTaggingPage = () => {
  const { data, isLoading } = useSWR(`${API_URL}/voice-notes/`, (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json()),
  );

  //   const handleDeleteAudio = async (id: string) => {
  //     const res = await fetch(`${API_URL}/voice-notes/${id}/delete`, {
  //       credentials: "include",
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to delete");
  //     }

  //     setPlaybackUrls((prev) => {
  //       const { [id]: _, ...rest } = prev;
  //       return rest;
  //     });

  //     mutate(`${API_URL}/voice-notes/`);
  //   };

  console.log(data);
  return (
    <PageWrapper title="Voice Tagging">
      <div className="flex flex-col gap-6 justify-between">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-5" />
            Loading your voice notes...
          </div>
        )}

        {data &&
          data.map((tasks) => (
            <Card key={tasks.id}>
              <h1>
                {tasks.title} - created from
                {tasks.aiResult.actions.map((actions) => {
                  return actions.title;
                })}
              </h1>
            </Card>
          ))}

        <div className="flex justify-center mt-auto"></div>
      </div>
    </PageWrapper>
  );
};

export default VoiceTaggingPage;
