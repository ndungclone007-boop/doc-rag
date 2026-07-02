import clsx from "clsx";
import { CitationTab } from "./CitationTab";
import type { ChatMessage, Citation } from "@/lib/types";

export function MessageBubble({
  message,
  onCitationClick,
}: {
  message: ChatMessage;
  onCitationClick: (citation: Citation) => void;
}) {
  const isUser = message.role === "user";
  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
          isUser
            ? "bg-teal text-paper rounded-br-sm"
            : "bg-paper border border-moss text-ink rounded-bl-sm shadow-card"
        )}
      >
        <p className="whitespace-pre-wrap">
          {message.content}
          {message.streaming && <span className="inline-block w-1.5 h-3.5 bg-current opacity-50 ml-0.5 align-middle animate-pulse" />}
        </p>
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 pt-2 border-t border-moss/60">
            {message.citations.map((c) => (
              <CitationTab key={c.id} citation={c} onClick={onCitationClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
