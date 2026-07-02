import type { ExtractedPage } from "./pdf";
import type { PageChunk } from "./types";

// Stand-ins for the `chunking`, `embedding`, `vectorstore` and `retrieval`
// backend modules described in the architecture plan. These are naive,
// dependency-free, purely client-side implementations so the frontend can
// be demoed end-to-end without a backend. Each function is written so it
// maps 1:1 onto a future backend call:
//
//   chunkPages()        -> POST /documents/:id/chunk        (chunking module)
//   (skipped: embed)    -> POST /documents/:id/embed         (embedding module, calls text-embedding-004 / SentenceTransformers)
//   retrieveTopChunks() -> POST /documents/:id/retrieve      (retrieval + rerank module, real version uses Qdrant vector search)

const CHUNK_SIZE = 600; // chars
const CHUNK_OVERLAP = 80;

export function chunkPages(pages: ExtractedPage[], docId: string): PageChunk[] {
  const chunks: PageChunk[] = [];
  let counter = 0;
  for (const { page, text } of pages) {
    if (!text) continue;
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + CHUNK_SIZE, text.length);
      const slice = text.slice(start, end).trim();
      if (slice) {
        chunks.push({ id: `${docId}-${page}-${counter++}`, page, text: slice });
      }
      if (end === text.length) break;
      start = end - CHUNK_OVERLAP;
    }
  }
  return chunks;
}

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "of", "in", "on", "to",
  "and", "or", "for", "with", "la", "va", "la", "cua", "mot", "cac",
  "nhung", "la", "va", "trong", "cho", "de", "voi", "khong", "co", "gi",
]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics for looser matching
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export function retrieveTopChunks(
  query: string,
  chunks: PageChunk[],
  topK = 3
): PageChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0 || chunks.length === 0) return [];

  const scored = chunks.map((chunk) => {
    const chunkTokens = tokenize(chunk.text);
    const chunkSet = new Set(chunkTokens);
    let score = 0;
    for (const qt of queryTokens) {
      if (chunkSet.has(qt)) score += 1;
    }
    // light length-normalization so long chunks don't win purely on volume
    score = score / Math.sqrt(chunkTokens.length || 1);
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk);
}
