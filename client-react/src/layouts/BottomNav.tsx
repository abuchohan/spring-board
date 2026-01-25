import { Link, useLocation } from "react-router";
import {
  IconChecklist,
  IconMessageCircle,
  IconUserCircle,
} from "@tabler/icons-react";

import { VoiceRecorder } from "@/components/VoiceRecorder/VoiceRecorder";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { mutate } from "swr";
const API_URL = import.meta.env.VITE_API_URL;

const BottomNav = () => {
  const location = useLocation();
  const isTasks = location.pathname.startsWith("/app/tasks");
  const leftTarget = isTasks ? "/app" : "/app/tasks";
  const leftLabel = isTasks ? "Logs" : "Tasks";

  const handleUploadClick = async (blob: Blob) => {
    const res = await fetch(`${API_URL}/voice-notes/upload-url`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: blob.type,
      }),
    });

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

    const metaRes = await fetch(`${API_URL}/voice-notes`, {
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
    console.log("swr mutated");
    mutate(`${API_URL}/voice-notes/`);
  };

  const handleUploadSuccess = async () => {
    toast.success("Voice Note Uploaded");
  };

  const handleUploadError = (err: unknown) => {
    toast.error("Upload failed" + err);
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border/60 bg-background/20 px-8 shadow-lg backdrop-blur-sm">
      <nav className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <Button asChild variant="ghost" size="icon" aria-label={leftLabel}>
            <Link to={leftTarget}>
              {isTasks ? (
                <IconMessageCircle className="size-5" />
              ) : (
                <IconChecklist className="size-5" />
              )}
            </Link>
          </Button>
          <span className="text-[11px] text-muted-foreground">{leftLabel}</span>
        </div>

        <VoiceRecorder
          onUploadClick={handleUploadClick}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        <div className="flex flex-col items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Profile menu">
                <IconUserCircle className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" sideOffset={10}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-[11px] text-muted-foreground">Profile</span>
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
