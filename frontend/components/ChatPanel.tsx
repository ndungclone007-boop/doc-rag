"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { askQuestion, buildChatMessage } from "@/lib/api";
import type { ChatMessage, Citation } from "@/lib/types";

export function ChatPanel({
  docId,
  docName,
  onCitationClick,
}: {
  docId: string;
  docName: string;
  onCitationClick: (citation: Citation) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isSending) return;

    const userMsg = buildChatMessage("user", question);
    const draftId = Math.random().toString(36).slice(2, 9);
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: draftId, role: "assistant", content: "", createdAt: new Date().toISOString(), streaming: true },
    ]);
    setInput("");
    setIsSending(true);

    try {
      const { content, citations } = await askQuestion(docId, question, (partial) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === draftId ? { ...m, content: partial } : m))
        );
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === draftId ? { ...m, content, citations, streaming: false } : m))
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-moss px-4 py-2.5">
        <p className="font-mono text-xs text-ink-soft">Hỏi đáp về tài liệu</p>
        <p className="font-serif text-sm text-ink truncate">{docName}</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-ink-soft font-mono border border-dashed border-moss rounded-lg px-3 py-4">
            Đặt câu hỏi bất kỳ về nội dung tài liệu — câu trả lời sẽ kèm trích dẫn số trang.
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onCitationClick={onCitationClick} />
        ))}
      </div>

      <div className="border-t border-moss p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Nhập câu hỏi..."
            className="flex-1 resize-none rounded-lg border border-moss bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-teal/40 max-h-32"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal text-paper disabled:opacity-40 hover:bg-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
