import Hero from "@/components/landing_page/Hero";
import Features from "@/components/landing_page/Features";
import DataVisualization from "@/components/landing_page/DataVisualization";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ChartPie,
  CreditCardIcon,
  MessageCircleWarningIcon,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Suspense, type ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import Testimonials from "@/components/landing_page/Testimonials";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale, Locale } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({
    locale,
    namespace: "Metadata.landing_page",
  });

  return {
    title: t("title", { brandName: "Recurio" }),
    description: t("description"),
  };
}

type MetricCardProps = {
  label: string;
  value: string | number;
  subtext: string;
  icon?: ComponentType<LucideProps>;
};

function MetricCard({ label, value, subtext, icon: Icon }: MetricCardProps) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        {Icon ? (
          <div className="p-2 rounded-lg bg-secondary text-foreground">
            <Icon size={24} color="oklch(0.59 0.20 277)" />
          </div>
        ) : null}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-3xl font-mono font-bold mb-1">{value}</div>
      <p className="text-sm text-muted-foreground">{subtext}</p>
    </div>
  );
}

export default async function LandingPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  setRequestLocale(lang as Locale);
  const t = await getTranslations("landing_page");
  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-primary-foreground">
      <Suspense>
        <Hero />
      </Suspense>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label={t("metrics.efficiency.label")}
            value={t("metrics.efficiency.value")}
            subtext={t("metrics.efficiency.subtext")}
            icon={ChartPie}
          />
          <MetricCard
            label={t("metrics.pending.label")}
            value={t("metrics.pending.value")}
            subtext={t("metrics.pending.subtext")}
            icon={MessageCircleWarningIcon}
          />
          <MetricCard
            label={t("metrics.leak.label")}
            value={t("metrics.leak.value")}
            subtext={t("metrics.leak.subtext")}
            icon={CreditCardIcon}
          />
          <MetricCard
            label={t("metrics.annual_burn.label")}
            value={t("metrics.annual_burn.value")}
            subtext={t("metrics.annual_burn.subtext")}
            icon={TrendingUp}
          />
        </div>
      </section>

      <section id="problem" className="py-20 px-6 border-y border-border">
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
          <div className="bg-card border border-border rounded-[3rem] p-8 md:p-20 relative shadow-2xl shadow-black/5">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 max-w-3xl leading-[1.1] text-foreground">
                {t("cta.title")}
              </h2>

              <p className="text-muted-foreground mb-12 text-lg md:text-xl max-w-xl leading-relaxed">
                {t("cta.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                <button className="group relative w-full sm:w-auto bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold text-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 overflow-hidden">
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {t("cta.primary")}
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>

                <button className="w-full sm:w-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground px-10 py-5 rounded-2xl font-bold text-lg border border-border cursor-pointer transition-all flex items-center justify-center gap-2">
                  <Zap size={18} className="text-muted-foreground" />
                  {t("cta.secondary")}
                </button>
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-primary/10 rounded-tl-3xl -z-10" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-primary/10 rounded-br-3xl -z-10" />
        </div>
      </section>
    </div>
  );
}
