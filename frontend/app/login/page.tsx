"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal text-paper">
            <BookOpen size={19} strokeWidth={2.2} />
          </span>
          <h1 className="font-serif text-xl text-ink font-semibold">Đăng nhập</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-mono text-ink-soft mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-moss bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-soft mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-moss bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
          </div>

          {error && <p className="text-xs text-rust font-mono">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-teal py-2 text-sm font-medium text-paper hover:bg-teal-dark disabled:opacity-50"
          >
            {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-teal underline underline-offset-2">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
