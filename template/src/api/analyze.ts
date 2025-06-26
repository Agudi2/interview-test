import { embed } from '../lib/openai';
import { parseEntry } from '../lib/taskExtractor';
import type { UserProfile } from '../lib/types';

export async function analyzeDiaryEntry(text: string, profile?: UserProfile) {
  const raw_text = text;

  const embedding = await embed(raw_text);
  const parsed = parseEntry(raw_text);

  const theme = parsed.theme?.[0]?.toLowerCase() || '';
  const vibe = parsed.vibe?.[0]?.toLowerCase() || '';

  let response_text = '';

  if (theme.includes('balance')) {
    response_text = "Remember, rest is productive too. You’re allowed to pause. 🧘‍♀️";
  } else if (vibe.includes('anxious') || vibe.includes('conflicted')) {
    response_text = "Take a breath. You're doing better than you think. 🌿";
  } else if (vibe.includes('driven') || theme.includes('goal')) {
    response_text = "Keep pushing, but don’t forget to check in with yourself. 💼💙";
  } else if (vibe.includes('reflective') || theme.includes('general')) {
    response_text = "It's okay to pause and reflect. Your thoughts matter. 🪞";
  } else {
    response_text = "Thanks for sharing. Every feeling is valid. 💬";
  }

  return { response_text, parsed, embedding };
}
