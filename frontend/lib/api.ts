"use client";

// -----------------------------------------------------------------------
// This file is the ONLY place that talks to "the backend". Right now the
// backend doesn't exist yet, so every function below fakes it client-side
// (PDF parsing via pdfjs, naive keyword retrieval, a canned answer
// generator instead of Gemini/Gemma). Each function documents which real
// NestJS module + endpoint it will call once backend.md is implemented.
// Swapping mock -> real should only require editing this file.
// -----------------------------------------------------------------------

import { extractPagesText, getPageCount } from "./pdf";
import { chunkPages, retrieveTopChunks } from "./retrieval";
import type { ChatMessage, Citation, DocMeta, PageChunk, PipelineStage } from "./types";

const chunkStore = new Map<string, PageChunk[]>();

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface UploadHandlers {
  onStage: (stage: PipelineStage, progress: number) => void;
}

/**
 * Real version: POST /upload (multipart) -> kicks off async job in
 * `jobs/` queue; client then polls or subscribes via WebSocket to
 * `preprocessing` -> `chunking` -> `embedding` status events.
 */
export async function uploadDocument(
  file: File,
  handlers: UploadHandlers,
  id: string = uid()
): Promise<DocMeta> {
  handlers.onStage("uploading", 10);
  await wait(300);
  handlers.onStage("uploading", 100);

  handlers.onStage("parsing", 10);
  let pageCount = 0;
  let pages: Awaited<ReturnType<typeof extractPagesText>> = [];
  try {
    pageCount = await getPageCount(file);
    handlers.onStage("parsing", 55);
    pages = await extractPagesText(file);
    handlers.onStage("parsing", 100);
  } catch (err) {
    handlers.onStage("error", 0);
    throw new Error(
      "Không đọc được nội dung PDF. File có thể bị hỏng hoặc là bản scan ảnh (cần OCR)."
    );
  }

  handlers.onStage("chunking", 20);
  const chunks = chunkPages(pages, id);
  chunkStore.set(id, chunks);
  await wait(250);
  handlers.onStage("chunking", 100);

  // Real version: POST /documents/:id/embed, one call per chunk batch to
  // text-embedding-004 (or a local SentenceTransformers model), storing
  // vectors in Qdrant. Simulated here with a delay proportional to size.
  handlers.onStage("embedding", 10);
  await wait(Math.min(1200, 150 + chunks.length * 15));
  handlers.onStage("embedding", 100);

  handlers.onStage("ready", 100);

  return {
    id,
    name: file.name,
    sizeBytes: file.size,
    pageCount,
    uploadedAt: new Date().toISOString(),
    stage: "ready",
    progress: 100,
  };
}

/** Real version: DELETE /documents/:id */
export async function deleteDocument(id: string): Promise<void> {
  chunkStore.delete(id);
  await wait(150);
}

/**
 * Real version: retrieval module embeds `question`, does a similarity
 * search in Qdrant (+ optional rerank), then llm-orchestration streams a
 * generated answer from Gemini 2.5 Flash / Gemma over WebSocket.
 * Here we do naive keyword retrieval and template the "answer" from the
 * matched chunks, streamed word-by-word to preserve the same UI contract.
 */
export async function askQuestion(
  docId: string,
  question: string,
  onToken: (partial: string) => void
): Promise<{ content: string; citations: Citation[] }> {
  const chunks = chunkStore.get(docId) ?? [];
  const top = retrieveTopChunks(question, chunks, 3);

  const citations: Citation[] = top.map((c) => ({
    id: uid(),
    docId,
    page: c.page,
    snippet: c.text.slice(0, 220),
  }));

  const answer =
    top.length > 0
      ? `Dựa trên nội dung tài liệu, phần liên quan nhất nằm ở trang ${top
          .map((c) => c.page)
          .join(", ")}. Tóm tắt: ${top[0].text.slice(0, 260)}${
          top[0].text.length > 260 ? "..." : ""
        }`
      : `Mình chưa tìm thấy đoạn nào trong tài liệu khớp với câu hỏi này. Bạn thử diễn đạt lại hoặc hỏi cụ thể hơn nhé.`;

  const words = answer.split(" ");
  let acc = "";
  for (const w of words) {
    acc += (acc ? " " : "") + w;
    onToken(acc);
    await wait(18);
  }

  return { content: answer, citations };
}

export function buildChatMessage(
  role: ChatMessage["role"],
  content: string,
  citations?: Citation[]
): ChatMessage {
  return {
    id: uid(),
    role,
    content,
    citations,
    createdAt: new Date().toISOString(),
  };
}
