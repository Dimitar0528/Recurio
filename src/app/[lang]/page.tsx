import Hero from "@/components/landing_page/Hero";
import Features from "@/components/landing_page/Features";
import DataVisualization from "@/components/landing_page/DataVisualization";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Zap,
} from "lucide-react";

import { Suspense } from "react";;
import Testimonials from "@/components/landing_page/Testimonials";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "next-intl";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const t = await getTranslations({
    locale,
    namespace: "Metadata.landing_page",
  });

  return {
    title: t("title", { brandName: "Recurio" }),
    description: t("description"),
  };
}

export default async function LandingPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  setRequestLocale(lang as Locale);
  const t = await getTranslations("landing_page");
  return (
    <main
      id="main-content"
      className="min-h-screen font-sans selection:bg-primary selection:text-primary-foreground">
      <Suspense>
        <Hero />
      </Suspense>

      <section id="problem" className="py-24 px-6 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-primary mb-8 underline decoration-2 underline-offset-8">
            {t("problem.title")}
          </h2>
          <p className="text-3xl md:text-4xl font-medium leading-[1.3] text-foreground italic">
            {t("problem.quote")}
          </p>
        </div>
      </section>

      <Features />
      <Separator />
      <DataVisualization />
      <Separator />
      <Testimonials />

      <section className="py-32 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-5xl mx-auto relative">
          <div
            className="absolute inset-0 -z-10 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
          <div
            aria-hidden
            className="absolute -top-8 -left-4 text-[12rem] md:text-[18rem] font-black leading-none select-none pointer-events-none text-foreground opacity-[0.03] tracking-tighter -z-10">
            GO
          </div>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-mono text-muted-foreground tracking-[0.25em] uppercase">
              ✦ ✦ ✦
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-end">
            <div className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-[3px] bg-primary rounded-full" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-foreground mb-6 pl-4">
                {t("cta.title")}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md pl-4">
                {t("cta.subtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end shrink-0">
              <Link href="/dashboard">
                <button
                  className="group relative w-full lg:w-auto bg-primary text-primary-foreground px-10 py-5 font-bold text-base tracking-wide cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                  }}>
                  <div className="relative z-10 flex items-center gap-3">
                    {t("cta.primary")}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>
              </Link>
              <button
                className="group w-full lg:w-auto relative px-10 py-5 font-bold text-base tracking-wide cursor-pointer border border-border text-foreground hover:border-primary/50 transition-colors flex items-center gap-3 bg-transparent"
                style={{
                  clipPath:
                    "polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)",
                }}>
                <Zap
                  size={16}
                  className="text-primary group-hover:scale-110 transition-transform"
                />
                {t("cta.secondary")}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-14">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-mono text-muted-foreground/40">
              ✦ ✦ ✦
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
