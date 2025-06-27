import dotenv from "dotenv";
dotenv.config();

import { embed } from "../lib/openai"; // Already handles loading OpenAI
import { parseEntry } from "../lib/taskExtractor";
//import type { UserProfile } from "../lib/types"; Not using it anymore

const apiKey = process.env.OPENAI_API_KEY;

export async function analyzeDiaryEntry(text: string) {
  const raw_text = text;
  const embedding = await embed(raw_text);
  const parsed = parseEntry(raw_text);

  const theme = parsed.theme?.[0]?.toLowerCase() || "unknown";
  const vibe = parsed.vibe?.[0]?.toLowerCase() || "unknown";

  let response_text = "";

  try {
    const { default: OpenAI } = await import("openai");
    if (!apiKey) throw new Error("Missing OpenAI key");

    const openai = new OpenAI({ apiKey });

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a thoughtful, emotionally supportive assistant. Your job is to respond to a user's diary entry with empathy and encouragement based on their emotional state and theme.",
        },
        {
          role: "user",
          content: `Diary entry: "${text}"\nTheme: ${theme}\nVibe: ${vibe}\n\nRespond in 1–2 sentences with empathy and kindness.`,
        },
      ],
      temperature: 0.8,
    });

    response_text =
      gptResponse.choices[0].message.content?.trim() ||
      "Thanks for sharing. Every feeling is valid. 💬";
  } catch (err: unknown) {
    const error = err as Error;
    console.warn("⚠️ GPT failed, using fallback:", error.message || error);

    // Fallback
    if (theme.includes("balance")) {
      response_text = "Remember, rest is productive too. 🧘‍♀️";
    } else if (vibe.includes("anxious") || vibe.includes("conflicted")) {
      response_text = "Take a breath. You're doing better than you think. 🌿";
    } else if (vibe.includes("driven") || theme.includes("goal")) {
      response_text = "Keep pushing, but don’t forget to check in. 💼💙";
    } else if (vibe.includes("reflective") || theme.includes("general")) {
      response_text = "It's okay to pause and reflect. 🪞";
    } else {
      response_text = "Thanks for sharing. Every feeling is valid. 💬";
    }
  }

  const entryId = `entry_${Date.now()}`;
  return { entryId, response_text, parsed, embedding };
}
