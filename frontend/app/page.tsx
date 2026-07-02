"use client";

import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { DocumentCard } from "@/components/DocumentCard";
import { EmptyState } from "@/components/EmptyState";
import { useDocumentsStore } from "@/hooks/useDocumentsStore";

export default function LibraryPage() {
  const { documents, addFiles, removeDocument } = useDocumentsStore();

  const handleReindex = (id: string) => {
    // Real version: POST /documents/:id/reindex. Here, deleting and asking
    // the user to re-upload is the honest equivalent since we don't retain
    // the original File object once parsed.
    removeDocument(id);
  };

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

        {documents.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onDelete={removeDocument}
                onReindex={handleReindex}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
