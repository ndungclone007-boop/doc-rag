"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { PdfViewer } from "@/components/PdfViewer";
import { ChatPanel } from "@/components/ChatPanel";
import { useDocumentsStore } from "@/hooks/useDocumentsStore";
import { getFile } from "@/lib/fileStore";
import type { Citation } from "@/lib/types";

export default function ChatRoomPage() {
  const params = useParams<{ docId: string }>();
  const router = useRouter();
  const { getDocument } = useDocumentsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightPage, setHighlightPage] = useState<number | null>(null);

  const doc = getDocument(params.docId);
  const file = getFile(params.docId);

  const handleCitationClick = (citation: Citation) => {
    setCurrentPage(citation.page);
    setHighlightPage(citation.page);
  };

  if (!doc || !file) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="font-serif text-lg text-ink mb-2">Không tìm thấy tài liệu</p>
          <p className="text-sm text-ink-soft mb-5">
            Tài liệu này chưa được tải lên trong phiên hiện tại, hoặc đã bị xóa.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-sm text-teal underline underline-offset-2"
          >
            <ArrowLeft size={14} /> Về thư viện
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex items-center gap-2 border-b border-moss px-6 py-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-xs font-mono text-ink-soft hover:text-teal"
        >
          <ArrowLeft size={13} /> Thư viện
        </button>
      </div>
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 min-h-0">
        <div className="border-b lg:border-b-0 lg:border-r border-moss min-h-0 h-[45vh] lg:h-auto">
          <PdfViewer
            file={file}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            highlightPage={highlightPage}
          />
        </div>
        <div className="min-h-0">
          <ChatPanel docId={doc.id} docName={doc.name} onCitationClick={handleCitationClick} />
        </div>
      </div>
    </div>
  );
}
