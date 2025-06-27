let OpenAI: typeof import("openai").default | null = null;

async function loadOpenAI() {
  if (!OpenAI) {
    try {
      const module = await import("openai");
      OpenAI = module.default;
    } catch {
      console.warn('⚠️ Failed to import OpenAI SDK; using fallback embedding');
    }
  }
  return OpenAI;
}

const apiKey = process.env.OPENAI_API_KEY || "";

export function hasRealOpenAIKey() {
  return Boolean(apiKey && OpenAI);
}

export async function embed(text: string): Promise<number[]> {
  const OpenAI = await loadOpenAI();

  if (apiKey && OpenAI) {
    const client = new OpenAI({ apiKey }); // ✅ this now works
    const res = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return res.data[0].embedding as number[];
  }

  // MOCK embedding
  return Array.from(
    { length: 8 },
    (_, i) => ((text.charCodeAt(i % text.length) || 0) % 100) / 100
  );
}
