import { Library } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-dim text-ink-soft mb-2">
        <Library size={22} />
      </span>
      <p className="font-serif text-ink text-lg">Kệ sách còn trống</p>
      <p className="text-sm text-ink-soft max-w-sm">
        Tải lên PDF đầu tiên để bắt đầu — hệ thống sẽ đọc, chia nhỏ và lập chỉ mục tài liệu để bạn có thể hỏi đáp trực tiếp trên nội dung.
      </p>
    </div>
  );
}
