// export async function getUserVoiceNotes(req: Request, res: Response) {}

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type Request, type Response } from "express";
import prisma from "../prisma/client.ts";
import { error } from "console";
import { createVoiceNote } from "../service/voice.service.ts";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
});

export async function getUserVoiceNotes(req: Request, res: Response) {
  try {
    const user = req.user!;
    const voiceNotes = await prisma.voiceNote.findMany({
      where: { userId: user.id },
    });

    return res.status(200).json(voiceNotes);
  } catch (error) {}
}

export async function uploadVoiceNote(req: Request, res: Response) {
  try {
    const { storagePath } = req.body;

    if (!storagePath) {
      return res.status(400).json({ error: "Missing Storage Path" });
    }

    // we can assert this is true because we are running middleware that checks if there is a user
    const userId = req.user!.id;

    const voiceNote = await createVoiceNote(userId, storagePath);

    return res.status(201).json({ id: voiceNote.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create voice note" });
  }
}

export async function getUploadUrl(req: Request, res: Response) {
  try {
    const { contentType } = req.body;

    if (!contentType) {
      return res.status(400).json({ error: "Missing Content Type" });
    }

    // You can derive this from req.user if you want
    const voiceNoteId = crypto.randomUUID();

    const key = `voice-notes/${voiceNoteId}.webm`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300, // seconds
    });

    res.status(200).json({
      uploadUrl,
      key,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
}

export async function getPlaybackUrl(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Please provide an Id for a voice note" });
    }

    const user = req.user!;

    const voiceNote = await prisma.voiceNote.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        storagePath: true,
      },
    });

    if (!voiceNote) {
      return res.status(404).json({ error: "Voice note not found" });
    }

    // 2. Generate signed GET URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: voiceNote.storagePath,
    });

    const playbackUrl = await getSignedUrl(s3, command, {
      expiresIn: 600, // 10 minutes
    });

    // 3. Return URL only
    return res.json({ playbackUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to generate playback URL" });
  }
}

export async function deleteVoiceNote(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Please provide an Id for a voice to delete" });
    }

    const user = req.user!;

    const voiceNote = await prisma.voiceNote.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!voiceNote) {
      return res.status(404).json({ error: "failed to find voice note" });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: voiceNote.storagePath,
      })
    );

    await prisma.voiceNote.delete({
      where: {
        id: voiceNote.id,
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delte voice note" });
  }
}
