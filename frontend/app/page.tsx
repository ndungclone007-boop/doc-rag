"use client";

import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { DocumentCard } from "@/components/DocumentCard";
import { EmptyState } from "@/components/EmptyState";
import { RequireAuth } from "@/components/RequireAuth";
import { useDocumentsStore } from "@/hooks/useDocumentsStore";

function LibraryContent() {
  const { documents, loading, addFiles, removeDocument, reindex } = useDocumentsStore();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-2xl text-ink font-semibold mb-1.5">Tài liệu của bạn</h1>
          <p className="text-sm text-ink-soft">
            Upload PDF, hệ thống lập chỉ mục, sau đó bạn có thể trò chuyện trực tiếp trên nội dung tài liệu.
          </p>
        </div>

        <div className="mb-10">
          <UploadZone onFiles={addFiles} />
        </div>

        {loading ? (
          <p className="text-sm font-mono text-ink-soft">Đang tải danh sách tài liệu…</p>
        ) : documents.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onDelete={removeDocument} onReindex={reindex} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <RequireAuth>
      <LibraryContent />
    </RequireAuth>
  );
}
