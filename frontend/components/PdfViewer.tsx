"use client";

import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer({
  file,
  currentPage,
  onPageChange,
  highlightPage,
}: {
  file: File;
  currentPage: number;
  onPageChange: (page: number) => void;
  highlightPage?: number | null;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState(480);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(Math.max(280, entry.contentRect.width - 24));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-moss px-4 py-2.5">
        <span className="font-mono text-xs text-ink-soft">Xem trước tài liệu</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="rounded p-1 text-ink-soft hover:bg-paper-dim disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="font-mono text-xs text-ink w-16 text-center">
            {currentPage} / {numPages || "…"}
          </span>
          <button
            type="button"
            disabled={currentPage >= numPages}
            onClick={() => onPageChange(Math.min(numPages, currentPage + 1))}
            className="rounded p-1 text-ink-soft hover:bg-paper-dim disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-paper-dim px-3 py-4">
        <div className={highlightPage === currentPage ? "ring-2 ring-amber rounded-sm" : ""}>
          <Document
            file={file}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={<p className="text-xs font-mono text-ink-soft px-2">Đang tải PDF…</p>}
            error={<p className="text-xs font-mono text-rust px-2">Không thể hiển thị file này.</p>}
          >
            <Page
              pageNumber={currentPage}
              width={containerWidth}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
        {highlightPage === currentPage && (
          <p className="mt-2 text-[11px] font-mono text-amber-dark px-1">
            ↑ trích dẫn cho câu trả lời gần nhất nằm trên trang này
          </p>
        )}
      </div>
    </div>
  );
}
