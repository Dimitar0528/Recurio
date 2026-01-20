import Hero from "@/components/landing_page/Hero";
import Features from "@/components/landing_page/Features";
import DataVisualization from "@/components/landing_page/DataVisualization";
import { Separator } from "@/components/ui/separator";
import {
  ChartPie,
  CreditCardIcon,
  MessageCircleWarningIcon,
  TrendingUp,
} from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import Testimonials from "@/components/landing_page/Testimonials";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "next-intl";
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
      <Hero />

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
      <Testimonials  /> 

      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t("cta.title")}</h2>
          <p className="text-muted-foreground mb-10 text-lg">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold cursor-pointer hover:shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all">
              {t("cta.primary")}
            </button>
            <button className="w-full sm:w-auto bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-bold border border-border cursor-pointer hover:bg-secondary/60 transition-colors">
              {t("cta.secondary")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
