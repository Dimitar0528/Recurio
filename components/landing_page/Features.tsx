"use client";

import { Calendar, PieChart, CreditCard, ShieldCheck } from "lucide-react";
import { type getDictionary } from "@/app/[lang]/dictionaries";

export default function Features({
  dictionary,
}: {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >["landing_page"]["features_component"];
}) {
  return (
    <section id="features" className="py-18 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">
              {dictionary.tagline}
            </h2>
            <p className="text-4xl font-bold tracking-tight text-foreground mx-auto">
              {dictionary.heading.line_1}
              <br />
              {dictionary.heading.line_2}
            </p>
          </div>
          <p className="text-muted-foreground max-w-xs text-md leading-relaxed">
            {dictionary.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 bg-card border border-border p-8 rounded-2xl flex flex-col justify-between min-h-[400px]">
            <div className="max-w-md mx-auto md:mx-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <PieChart size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                {dictionary.cost_normalization.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {dictionary.cost_normalization.description}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-border flex gap-8 mx-auto md:mx-0">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                  {dictionary.cost_normalization.monthly}
                </p>
                <p className="text-xl font-mono font-bold">11.99 €</p>
              </div>
              <div className="text-muted-foreground self-center">→</div>
              <div>
                <p className="text-[10px] uppercase font-bold text-primary mb-1">
                  {dictionary.cost_normalization.annual}
                </p>
                <p className="text-xl font-mono font-bold text-primary">
                  143.88 €
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-secondary/30 border border-border p-8 rounded-2xl flex flex-col text-center items-center justify-center md:text-left md:items-stretch">
            <div className="w-10 h-10 rounded-lg bg-foreground text-background flex items-center justify-center mb-6">
              <Calendar size={22} />
            </div>
            <h3 className="text-xl font-bold mb-3">
              {dictionary.time_awareness.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
              {dictionary.time_awareness.description}
            </p>
            <div className="mt-auto space-y-2">
              <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3" />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase">
                {dictionary.time_awareness.proximity}
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-card border border-border p-8 rounded-2xl flex flex-col justify-center text-center md:text-left md:items-start">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-6">
              <CreditCard size={22} color="oklch(0.59 0.20 277)" />
            </div>
            <h3 className="text-xl font-bold mb-3">
              {dictionary.manual_entry.title}
            </h3>
            <p className="text-sm max-w-md text-muted-foreground leading-relaxed">
              {dictionary.manual_entry.description}
            </p>
          </div>

          <div className="md:col-span-8 bg-gray-900 dark:bg-gray-300 text-background p-8 rounded-2xl flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10 max-w-lg mx-auto md:mx-0">
              <h3 className="text-xl font-bold mb-3">
                {dictionary.privacy.title}
              </h3>
              <p className="text-sm text-background/80 leading-relaxed">
                {dictionary.privacy.description}
              </p>
            </div>
            <ShieldCheck
              size={120}
              className="absolute -right-4 opacity-10 rotate-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
