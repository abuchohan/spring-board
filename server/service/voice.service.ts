import { processVoiceNoteAI } from "../ai/processVoiceNoteAi.js";
import prisma from "../prisma/client.js";

export async function createVoiceNote(userId: string, storagePath: string) {
  const voiceNote = await prisma.voiceNote.create({
    data: {
      userId,
      storagePath,
      status: "PENDING",
    },
  });

  // fire-and-forget
  processVoiceNoteAI(voiceNote.id);

  return voiceNote;
}
