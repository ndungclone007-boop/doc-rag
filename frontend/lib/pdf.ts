"use client";

// Client-side PDF utilities built on pdfjs-dist.
//
// In the target architecture (see backend.md) this extraction step belongs
// to the `preprocessing` backend module, running server-side right after
// `upload`. We do it in the browser here only so the frontend is runnable
// and demoable on its own, before the backend pipeline exists. Swap
// `extractPagesText` for a call to `POST /documents/:id/parse` once the
// backend module is ready — the rest of the app (chunking, retrieval UI,
// citations) does not need to change.

import type { PDFDocumentProxy } from "pdfjs-dist";

let workerConfigured = false;

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!workerConfigured) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    workerConfigured = true;
  }
  return pdfjs;
}

export async function loadPdf(file: File): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  return loadingTask.promise;
}

export interface ExtractedPage {
  page: number;
  text: string;
}

export async function extractPagesText(file: File): Promise<ExtractedPage[]> {
  const doc = await loadPdf(file);
  const pages: ExtractedPage[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push({ page: i, text });
  }
  return pages;
}

export async function getPageCount(file: File): Promise<number> {
  const doc = await loadPdf(file);
  return doc.numPages;
}
