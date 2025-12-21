import { Router } from "express";
import {
  getUploadUrl,
  uploadVoiceNote,
  getUserVoiceNotes,
  getPlaybackUrl,
  deleteVoiceNote,
} from "../controllers/voice-notes.controller.ts";

export const voiceNotesRouter = Router();

// inside voiceNotesRouter:
voiceNotesRouter.get("/", getUserVoiceNotes);
voiceNotesRouter.post("/", uploadVoiceNote);
voiceNotesRouter.post("/upload-url", getUploadUrl);
voiceNotesRouter.post("/:id/playback-url", getPlaybackUrl);
voiceNotesRouter.post("/:id/delete", deleteVoiceNote);
