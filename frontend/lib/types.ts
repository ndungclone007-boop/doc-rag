export type PipelineStage =
  | "uploading"
  | "parsing"
  | "chunking"
  | "embedding"
  | "ready"
  | "error";

export interface PageChunk {
  id: string;
  page: number;
  text: string;
}

export interface DocMeta {
  id: string;
  name: string;
  sizeBytes: number;
  pageCount: number;
  uploadedAt: string;
  stage: PipelineStage;
  progress: number; // 0-100 within current pipeline
  errorMessage?: string;
}

export interface Citation {
  id: string;
  docId: string;
  page: number;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  createdAt: string;
  streaming?: boolean;
}

export const PIPELINE_STAGES: { key: PipelineStage; label: string }[] = [
  { key: "uploading", label: "Tải lên" },
  { key: "parsing", label: "Trích xuất PDF" },
  { key: "chunking", label: "Chia nhỏ văn bản" },
  { key: "embedding", label: "Tạo embedding" },
  { key: "ready", label: "Sẵn sàng" },
];
