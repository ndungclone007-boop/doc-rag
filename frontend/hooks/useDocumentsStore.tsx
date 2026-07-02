"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { deleteDocument, uploadDocument } from "@/lib/api";
import { removeFile, setFile } from "@/lib/fileStore";
import type { DocMeta, PipelineStage } from "@/lib/types";

interface DocumentsContextValue {
  documents: DocMeta[];
  addFiles: (files: File[]) => void;
  removeDocument: (id: string) => void;
  getDocument: (id: string) => DocMeta | undefined;
}

const DocumentsContext = createContext<DocumentsContextValue | null>(null);

// Note: this store is intentionally in-memory only (no localStorage). Once
// the real `upload` + `auth` backend modules exist, this should be replaced
// by a data-fetching hook (react-query/SWR) against GET /documents, scoped
// to the logged-in user's session.
export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocMeta[]>([]);

  const patchDoc = useCallback((id: string, patch: Partial<DocMeta>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  const addFiles = useCallback((files: File[]) => {
    for (const file of files) {
      const tempId = `pending-${Math.random().toString(36).slice(2, 9)}`;
      const placeholder: DocMeta = {
        id: tempId,
        name: file.name,
        sizeBytes: file.size,
        pageCount: 0,
        uploadedAt: new Date().toISOString(),
        stage: "uploading",
        progress: 0,
      };
      setDocuments((prev) => [placeholder, ...prev]);
      setFile(tempId, file);

      uploadDocument(
        file,
        {
          onStage: (stage: PipelineStage, progress: number) => {
            patchDoc(tempId, { stage, progress });
          },
        },
        tempId
      )
        .then((meta) => {
          patchDoc(tempId, meta);
        })
        .catch((err: Error) => {
          patchDoc(tempId, { stage: "error", errorMessage: err.message });
        });
    }
  }, [patchDoc]);

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    removeFile(id);
    void deleteDocument(id);
  }, []);

  const getDocument = useCallback(
    (id: string) => documents.find((d) => d.id === id),
    [documents]
  );

  return (
    <DocumentsContext.Provider value={{ documents, addFiles, removeDocument, getDocument }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocumentsStore() {
  const ctx = useContext(DocumentsContext);
  if (!ctx) throw new Error("useDocumentsStore must be used within DocumentsProvider");
  return ctx;
}
