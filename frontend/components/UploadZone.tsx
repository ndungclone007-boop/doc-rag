"use client";

import React, { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import clsx from "clsx";

export function UploadZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const pdfs = Array.from(fileList).filter((f) => f.type === "application/pdf");
      if (pdfs.length > 0) onFiles(pdfs);
    },
    [onFiles]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      className={clsx(
        "cursor-pointer rounded-xl border-2 border-dashed px-8 py-14 text-center transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal",
        isDragging ? "border-teal bg-amber-light/30" : "border-moss bg-paper-dim hover:border-teal/60"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal mb-4">
        <UploadCloud size={22} strokeWidth={2} />
      </div>
      <p className="font-serif text-lg text-ink mb-1">Kéo thả file PDF vào đây</p>
      <p className="text-sm text-ink-soft">
        hoặc <span className="text-teal underline underline-offset-2">chọn file</span> từ máy — hỗ trợ nhiều file cùng lúc
      </p>
    </div>
  );
}
