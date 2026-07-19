"use client"
import { Locale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { FileQuestion, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { Metadata, Route } from "next";

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const t = await getTranslations({
    locale,
    namespace: "Metadata.not_found_page",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function NotFoundPage() {
  const t = useTranslations("not_found_page");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground antialiased">
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
            {t("error_code")}
          </span>
          <h1 className="text-8xl font-mono font-bold tracking-tighter mt-2">
            404
          </h1>
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-4">
          {t("heading")}
        </h2>

        <p className="text-muted-foreground leading-relaxed mb-10">
          {t("subheading")}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={`/` as Route}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all group">
            <Home size={18} />
            {t("back_home")}
            <ArrowRight
              size={18}
              className="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
