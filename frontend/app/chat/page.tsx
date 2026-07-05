"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { PdfViewer } from "@/components/PdfViewer";
import { ChatPanel } from "@/components/ChatPanel";
import { RequireAuth } from "@/components/RequireAuth";
import { useDocumentsStore } from "@/hooks/useDocumentsStore";
import { findOrCreateConversation, getConversation } from "@/lib/chatApi";
import { fileUrlForStoragePath } from "@/lib/config";
import type { ChatMessage, Citation } from "@/lib/types";

function ChatRoomContent() {
  const params = useParams<{ docId: string }>();
  const router = useRouter();
  const { getDocument } = useDocumentsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightPage, setHighlightPage] = useState<number | null>(null);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [conversationError, setConversationError] = useState<string | null>(null);

  const doc = getDocument(params.docId);

  useEffect(() => {
    if (!doc || doc.stage !== "ready") return;
    let cancelled = false;

    setLoadingConversation(true);
    findOrCreateConversation(doc.id)
      .then(async (id) => {
        const conversation = await getConversation(id);
        if (cancelled) return;
        setConversationId(id);
        setInitialMessages(conversation.messages);
      })
      .catch((err: Error) => {
        if (!cancelled) setConversationError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingConversation(false);
      });

    return () => {
      cancelled = true;
    };
  }, [doc?.id, doc?.stage]);

  const handleCitationClick = (citation: Citation) => {
    setCurrentPage(citation.pageNumber);
    setHighlightPage(citation.pageNumber);
  };

  if (!doc) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="font-serif text-lg text-ink mb-2">Không tìm thấy tài liệu</p>
          <p className="text-sm text-ink-soft mb-5">Tài liệu này không tồn tại hoặc đã bị xóa.</p>
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

  if (doc.stage !== "ready") {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="font-serif text-lg text-ink mb-2">Tài liệu đang được xử lý</p>
          <p className="text-sm text-ink-soft mb-5">Quay lại thư viện để theo dõi tiến trình.</p>
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
            fileUrl={fileUrlForStoragePath(doc.storagePath)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            highlightPage={highlightPage}
          />
        </div>
        <div className="min-h-0">
          {loadingConversation ? (
            <div className="flex h-full items-center justify-center">
              <p className="font-mono text-sm text-ink-soft">Đang tải hội thoại…</p>
            </div>
          ) : conversationError ? (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <p className="font-mono text-sm text-rust">{conversationError}</p>
            </div>
          ) : conversationId ? (
            <ChatPanel
              conversationId={conversationId}
              docName={doc.name}
              initialMessages={initialMessages}
              onCitationClick={handleCitationClick}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ChatRoomPage() {
  return (
    <RequireAuth>
      <ChatRoomContent />
    </RequireAuth>
  );
}
