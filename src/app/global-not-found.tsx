import "./[lang]/globals.css";
import { Inter, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { FileQuestion, ArrowRight, Home } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "404 - Page Not Found - Recurio",
  description: "The page you are looking for does not exist.",
  
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <main className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted border border-border mb-8">
              <FileQuestion
                className="text-muted-foreground"
                size={32}
                strokeWidth={1.5}
              />
            </div>

            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-primary">
                Error Code
              </span>
              <h1 className="text-8xl font-mono font-bold tracking-tighter mt-2">
                404
              </h1>
            </div>

            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Page not found
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-10">
              The page you’re looking for doesn’t exist or may have been moved.
              Let&apos;s get you back on track.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="/"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all group">
                <Home size={18} />
                Go back home
                <ArrowRight
                  size={18}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
