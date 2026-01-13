import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";

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
import { notFound } from "next/navigation";

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
  if (!hasLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);
  const lp = dictionary.landing_page;

  return (
    <div className="min-h-screen font-sans selection:bg-primary selection:text-primary-foreground">
      <Hero dictionary={lp.hero_component} />

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label={lp.metrics.efficiency.label}
            value={lp.metrics.efficiency.value}
            subtext={lp.metrics.efficiency.subtext}
            icon={ChartPie}
          />
          <MetricCard
            label={lp.metrics.pending.label}
            value={lp.metrics.pending.value}
            subtext={lp.metrics.pending.subtext}
            icon={MessageCircleWarningIcon}
          />
          <MetricCard
            label={lp.metrics.leak.label}
            value={lp.metrics.leak.value}
            subtext={lp.metrics.leak.subtext}
            icon={CreditCardIcon}
          />
          <MetricCard
            label={lp.metrics.annual_burn.label}
            value={lp.metrics.annual_burn.value}
            subtext={lp.metrics.annual_burn.subtext}
            icon={TrendingUp}
          />
        </div>
      </section>

      <section id="problem" className="py-18 px-6 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-primary mb-8 underline decoration-2 underline-offset-8">
            {lp.problem.title}
          </h2>
          <p className="text-3xl md:text-4xl font-medium leading-[1.3] text-foreground italic">
            {lp.problem.quote}
          </p>
        </div>
      </section>

      <Features dictionary={lp.features_component} />
      <Separator />
      <DataVisualization dictionary={lp.data_visualization_component} />

      <section className="pb-16 pt-4 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{lp.cta.title}</h2>
          <p className="text-muted-foreground mb-10 text-lg">
            {lp.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold cursor-pointer hover:shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all">
              {lp.cta.primary}
            </button>
            <button className="w-full sm:w-auto bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-bold border border-border cursor-pointer hover:bg-secondary/60 transition-colors">
              {lp.cta.secondary}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
