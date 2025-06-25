// src/lib/embedding.ts

export function generateEmbedding(rawText: string): number[] {
  // Return a fixed 384-dimension mock embedding
  return Array(384).fill(0.5)
}
