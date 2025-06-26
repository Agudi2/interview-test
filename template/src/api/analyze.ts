import dotenv from "dotenv";
dotenv.config();

import { embed } from "../lib/openai";
import { parseEntry } from "../lib/taskExtractor";
import type { UserProfile } from "../lib/types";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function analyzeDiaryEntry(text: string, profile?: UserProfile) {
  const raw_text = text;

  const embedding = await embed(raw_text);
  const parsed = parseEntry(raw_text);

  const theme = parsed.theme?.[0]?.toLowerCase() || "unknown";
  const vibe = parsed.vibe?.[0]?.toLowerCase() || "unknown";

  let response_text = "";

  try {
    if (!openai) throw new Error("OpenAI client not initialized");

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
  } catch (err: any) {
    console.warn("⚠️ GPT failed, using fallback:", err?.message || err);

    // Fallback if GPT fails (quota, network, etc.)
    if (theme.includes("balance")) {
      response_text =
        "Remember, rest is productive too. You’re allowed to pause. 🧘‍♀️";
    } else if (vibe.includes("anxious") || vibe.includes("conflicted")) {
      response_text = "Take a breath. You're doing better than you think. 🌿";
    } else if (vibe.includes("driven") || theme.includes("goal")) {
      response_text =
        "Keep pushing, but don’t forget to check in with yourself. 💼💙";
    } else if (vibe.includes("reflective") || theme.includes("general")) {
      response_text = "It's okay to pause and reflect. Your thoughts matter. 🪞";
    } else {
      response_text = "Thanks for sharing. Every feeling is valid. 💬";
    }
  }

  const entryId = `entry_${Date.now()}`;
  return { entryId, response_text, parsed, embedding };
}
