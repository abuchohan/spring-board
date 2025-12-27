import OpenAI from "openai";

const openai = new OpenAI();
export async function transcribeAudio(buffer: BlobPart): Promise<string> {
  const file = new File([buffer], "audio.webm", {
    type: "audio/webm",
  });

  const transcript = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  return transcript.text;
}
