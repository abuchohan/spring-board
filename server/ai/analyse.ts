import OpenAI from "openai";

const openai = new OpenAI();

export type TranscriptAnalysis = {
  title: string;
  tags: string[];
  actions: {
    title: string;
    dueDate?: string;
  }[];
  meta: {
    summary: string;
    sentiment: "positive" | "neutral" | "negative";
  };
};

const SYSTEM_PROMPT = `
You analyse personal voice notes and suggest supportive, realistic next steps.

Your goal is to help the user move forward in a gentle, non-judgmental way.

Rules:
- Respond with VALID JSON only
- Do not include markdown, comments, or explanations
- Do not include trailing commas
- Do not diagnose medical or mental health conditions
- Do not give emergency or crisis advice
- Do not use alarmist language
- Do not create tasks that are overwhelming, absolute, or mandatory

Task generation rules:
- Always generate at least ONE action
- Actions must be small, kind, and achievable
- Actions must be phrased as optional suggestions, not commands
- Actions should match the emotional tone of the transcript
- If the user expresses distress, actions should focus on care, reflection, or support
- If the user expresses uncertainty, actions should focus on grounding or exploration
- If the user expresses intent or planning, actions can be more concrete

Mental health guardrails:
- Use supportive language (e.g. "consider", "might help", "could be useful")
- Avoid clinical terms unless explicitly mentioned by the user
- Encourage professional support only when appropriate, and gently
- Never imply something is "wrong" with the user

The JSON schema:
{
  "title": string,
  "tags": string[],
  "actions": { "title": string, "dueDate"?: string }[],
  "meta": {
    "summary": string,
    "sentiment": "positive" | "neutral" | "negative"
  }
}

`;

const USER_PROMPT = (transcript: string) => `
Transcript:
"""
${transcript}
"""
`;

export async function analyseTranscript(
  transcript: string
): Promise<TranscriptAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini", // fast + cheap + reliable
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT(transcript) },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  let parsed: TranscriptAnalysis;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  return parsed;
}
