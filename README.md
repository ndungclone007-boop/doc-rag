# DSA RAG PDF — Frontend

Project hỏi-đáp PDF theo kiến trúc RAG .

## Chạy thử

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Upload PDF, chờ pipeline chạy xong (upload → parse → chunk → embed → ready), rồi vào trang chat để hỏi đáp.

## Trạng thái hiện tại: chạy được mà không cần backend

Backend NestJS chưa tồn tại, nên để có thể chạy thử và demo UI/UX ngay, các bước xử lý AI được
**giả lập ở client**, thay vì gọi API thật:

| Module trong plan       | File frontend giả lập             | Khi có backend thật               |
|--------------------------|-----------------------------------|------------------------------------|
| `upload`                 | `hooks/useDocumentsStore.tsx`     | `POST /upload` (multipart)         |
| `preprocessing`          | `lib/pdf.ts` (pdfjs, đọc text)    | `POST /documents/:id/parse`        |
| `chunking`                | `lib/retrieval.ts` → `chunkPages` | `POST /documents/:id/chunk`        |
| `embedding`               | giả lập delay trong `lib/api.ts`  | `POST /documents/:id/embed` (text-embedding-004 / SentenceTransformers) |
| `vectorstore` + `retrieval` | `lib/retrieval.ts` → `retrieveTopChunks` (khớp từ khóa, không phải vector) | Qdrant similarity search + rerank |
| `llm-orchestration`       | `askQuestion` trong `lib/api.ts` (trích đoạn có sẵn, stream giả) | Gọi Gemini 2.5 Flash / Gemma, stream qua WebSocket |
| `auth`                    | chưa có (không có màn hình đăng nhập) | Session-based auth |

**Toàn bộ điểm nối với backend đều nằm trong `lib/api.ts`.** Khi backend sẵn sàng, chỉ cần viết lại
các hàm `uploadDocument`, `deleteDocument`, `askQuestion` trong file này để gọi API thật — phần UI
(component, trang) không cần đổi vì đã được thiết kế theo đúng hợp đồng dữ liệu (`lib/types.ts`).

Vì file gốc chỉ được giữ trong bộ nhớ trình duyệt (`lib/fileStore.ts`), danh sách tài liệu **sẽ mất
khi reload trang** — đây là giới hạn có chủ đích của bản demo, sẽ hết khi có `GET /documents` thật.

## Cấu trúc thư mục

```
app/
  page.tsx                 # Trang thư viện: upload + danh sách tài liệu
  chat/[docId]/page.tsx    # Reading room: PDF viewer + chat, 2 cột
  layout.tsx, globals.css
components/
  UploadZone.tsx           # Drag-drop, multi-file
  ProgressStages.tsx       # Progress bar theo từng giai đoạn pipeline
  DocumentCard.tsx / DocumentGrid (inline)  # Quản lý tài liệu: xem/xóa/re-index
  PdfViewer.tsx            # react-pdf, đồng bộ trang với trích dẫn
  ChatPanel.tsx            # Giao diện chat, stream câu trả lời
  MessageBubble.tsx / CitationTab.tsx  # Trích dẫn nguồn (số trang + đoạn văn)
hooks/
  useDocumentsStore.tsx    # Context quản lý state danh sách tài liệu (in-memory)
lib/
  api.ts                   # *** Điểm nối duy nhất với backend ***
  pdf.ts                   # Đọc text PDF bằng pdfjs-dist (client-side)
  retrieval.ts             # Chunking + retrieval giả lập
  fileStore.ts             # Giữ File object trong bộ nhớ
  types.ts                 # Type dùng chung
```

## Thiết kế

Chủ đề "phòng đọc / thư viện": nền giấy ấm (`#FAF7F0`), mực đậm (`#20241F`), điểm nhấn hổ phách
cho trích dẫn (`citation-tab` trong `globals.css` — hình dạng như tab đánh dấu trang sách, bấm vào
sẽ nhảy PDF viewer tới đúng trang). Serif (Lora) cho tiêu đề, sans (Inter) cho nội dung, mono
(IBM Plex Mono) cho số trang/nhãn kỹ thuật/trạng thái pipeline.

## Việc còn lại khi làm backend thật

1. Thay các hàm trong `lib/api.ts` bằng fetch call thật tới NestJS API.
2. Thêm auth: trang login, gắn cookie/session vào request.
3. `GET /documents` khi load trang thư viện thay vì state in-memory rỗng.
4. WebSocket thật cho streaming câu trả lời (hiện đang giả lập bằng `setTimeout` theo từng từ).
5. (Nâng cao) Highlight chính xác vị trí trích dẫn trên trang PDF, hiện chỉ khoanh viền cả trang.

## Techstack hiện tại 
Next.js 14 (App Router) + TypeScript + TailwindCSS. 

## Dự án sẽ còn được phát triển thêm cả phần backend rồi đi đến bản hoàn chỉnh 