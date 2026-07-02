import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-moss bg-paper/95 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-teal text-paper">
            <BookOpen size={17} strokeWidth={2.2} />
          </span>
          <span className="font-serif text-lg font-semibold text-ink tracking-tight">
            Thư Viện Tài Liệu
          </span>
        </Link>
        <span className="font-mono text-xs text-ink-soft hidden sm:block">
          RAG PDF Assistant — frontend preview
        </span>
      </div>
    </header>
  );
}
