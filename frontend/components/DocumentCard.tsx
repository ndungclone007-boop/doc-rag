"use client";

import Link from "next/link";
import { FileText, RotateCw, Trash2 } from "lucide-react";
import { ProgressStages } from "./ProgressStages";
import type { DocMeta } from "@/lib/types";

function formatSize(bytes: number) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function DocumentCard({
  doc,
  onDelete,
  onReindex,
}: {
  doc: DocMeta;
  onDelete: (id: string) => void;
  onReindex: (id: string) => void;
}) {
  const ready = doc.stage === "ready";
  const errored = doc.stage === "error";

  const body = (
    <div className="flex flex-col gap-3 rounded-xl border border-moss bg-paper p-5 shadow-card transition-shadow hover:shadow-md h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
            <FileText size={17} />
          </span>
          <div className="min-w-0">
            <p className="font-serif text-[15px] text-ink leading-snug truncate" title={doc.name}>
              {doc.name}
            </p>
            <p className="text-xs text-ink-soft font-mono mt-0.5">
              {doc.pageCount > 0 ? `${doc.pageCount} trang · ` : ""}
              {formatSize(doc.sizeBytes)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onReindex(doc.id);
            }}
            title="Re-index"
            className="rounded-md p-1.5 text-ink-soft hover:bg-paper-dim hover:text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
          >
            <RotateCw size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onDelete(doc.id);
            }}
            title="Xóa"
            className="rounded-md p-1.5 text-ink-soft hover:bg-rust-light hover:text-rust focus-visible:outline focus-visible:outline-2 focus-visible:outline-rust"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <ProgressStages stage={doc.stage} progress={doc.progress} errorMessage={doc.errorMessage} />

      <div className="mt-auto pt-1 text-xs font-mono">
        {ready && <span className="text-teal-dark">Sẵn sàng trò chuyện →</span>}
        {errored && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onReindex(doc.id);
            }}
            className="text-rust underline underline-offset-2"
          >
            Thử lại
          </button>
        )}
      </div>
    </div>
  );

  if (!ready) {
    return <div className="opacity-90">{body}</div>;
  }

  return (
    <Link href={`/chat/${doc.id}`} className="block h-full">
      {body}
    </Link>
  );
}
