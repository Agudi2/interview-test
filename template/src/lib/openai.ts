/*
 * openai.ts
 * ----------
 * Thin helper around the official OpenAI client.
 * If an API key is missing (i.e. candidate doesn't have one), the helper falls back to
 * deterministic stub functions so unit tests still pass offline.
 */

// You MAY install the official package locally if you have a key:
//   pnpm add -D openai
// The template keeps it optional so it still works without.

let OpenAI: any;

async function loadOpenAI() {
  if (!OpenAI) {
    try {
      OpenAI = (await import("openai")).default;
    } catch {
      // fallback
    }
  }
  return OpenAI;
}


const apiKey = process.env.OPENAI_API_KEY || "";

export function hasRealOpenAIKey() {
  return Boolean(apiKey && OpenAI);
}

/**
 * Return embedding for a given text.
 * • If a real key & client are available → call embeddings API.
 * • Otherwise → return a deterministic pseudo-vector so tests stay deterministic.
 */
export async function embed(text: string): Promise<number[]> {
  const OpenAI = await loadOpenAI();
  const apiKey = process.env.OPENAI_API_KEY || "";

  if (apiKey && OpenAI) {
    const client = new OpenAI({ apiKey });
    const res = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    // @ts-ignore
    return res.data[0].embedding as number[];
  }

  // fallback: mock vector
  return Array.from(
    { length: 8 },
    (_, i) => ((text.charCodeAt(i % text.length) || 0) % 100) / 100
  );
}

