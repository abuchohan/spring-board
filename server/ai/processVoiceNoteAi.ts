import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "../prisma/client.ts";
import { analyseTranscript } from "./analyse.ts";
import { transcribeAudio } from "./transcribe.ts";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
});

async function downloadFromS3(key: string): Promise<BlobPart> {
  const obj = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    })
  );

  const bytes = await obj.Body!.transformToByteArray();

  return Buffer.from(bytes);
}

export async function processVoiceNoteAI(voiceNoteId: string) {
  try {
    await prisma.voiceNote.update({
      where: { id: voiceNoteId },
      data: { status: "PROCESSING" },
    });

    const voiceNote = await prisma.voiceNote.findUnique({
      where: { id: voiceNoteId },
    });

    if (!voiceNote) throw new Error("Voice note not found");

    // 1. Download audio
    const audioBuffer = await downloadFromS3(voiceNote.storagePath);

    // 2. Transcribe
    const transcript = await transcribeAudio(audioBuffer);

    // 3. Analyse transcript
    const analysis = await analyseTranscript(transcript);

    // 4. Persist result
    await prisma.voiceNote.update({
      where: { id: voiceNoteId },
      data: {
        transcript,
        title: analysis.title,
        tags: analysis.tags,
        actions: analysis.actions,
        aiResult: analysis,
        status: "DONE",
      },
    });
  } catch (error: any) {
    console.error(error);

    await prisma.voiceNote.update({
      where: { id: voiceNoteId },
      data: {
        status: "FAILED",
      },
    });
  }
}
