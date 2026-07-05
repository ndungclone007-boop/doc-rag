import type { Metadata } from "next";
import { Lora, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { DocumentsProvider } from "@/hooks/useDocumentsStore";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Thư Viện Tài Liệu — RAG PDF Assistant",
  description: "Upload PDF, đặt câu hỏi, nhận câu trả lời kèm trích dẫn nguồn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${lora.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        <AuthProvider>
          <DocumentsProvider>{children}</DocumentsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
