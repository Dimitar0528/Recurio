"use client";

import { useState } from "react";
import { ArrowRight, Check, Minus, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

type Subscription = {
  id: string;
  name: string;
  price: number;
  date: string;
  color: string;
  active: boolean;
};

type SubscriptionItemProps = Subscription & {
  onToggle: (id: string) => void;
  t: ReturnType<typeof useTranslations>;
};

function SubscriptionItem({
  name,
  price,
  date,
  color,
  active,
  id,
  onToggle,
  t,
}: SubscriptionItemProps) {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`w-full flex items-center justify-between p-4 border-b border-border last:border-0 transition-all duration-300 group select-none cursor-pointer
        ${
          active
            ? "bg-transparent hover:bg-accent/50"
            : "bg-muted/20 opacity-60"
        }`}>
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-5 h-5 rounded-md border transition-colors
          ${
            active
              ? "bg-primary border-primary"
              : "bg-transparent border-muted-foreground"
          }`}>
          {active ? (
            <Check className="text-primary-foreground w-3.5 h-3.5" />
          ) : (
            <Minus className="text-muted-foreground w-3.5 h-3.5" />
          )}
        </div>
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <div className="text-left">
          <p
            className={`text-sm font-semibold transition-all ${
              active ? "text-foreground" : "text-muted-foreground line-through"
            }`}>
            {name}
          </p>
          <p className="text-xs text-muted-foreground">
            {active
              ? `${t("subscription_item.renews")} ${date}`
              : t("subscription_item.paused")}
          </p>
        </div>
      </div>
      <div
        className={`text-sm font-mono font-medium transition-colors ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}>
        {active ? "" : "- "}
        {price.toFixed(2)} €
      </div>
    </button>
  );
}

export default function HeroSection() {
  const t = useTranslations("landing_page.hero_component")
  const [subs, setSubs] = useState<Subscription[]>([
    {
      id: "1",
      name: "Adobe Creative Cloud",
      price: 44.03,
      date: formatter.format(new Date()),
      color: "bg-red-500",
      active: true,
    },
    {
      id: "2",
      name: "ChatGPT Plus",
      price: 23.0,
      date: formatter.format(new Date().setDate(new Date().getDate() + 28)),
      color: "bg-gray-500",
      active: true,
    },
    {
      id: "3",
      name: "Netflix Premium",
      price: 9.99,
      date: formatter.format(new Date().setDate(new Date().getDate() + 14)),
      color: "bg-red-600",
      active: true,
    },
    {
      id: "4",
      name: "Spotify Premium",
      price: 5.62,
      date: formatter.format(new Date().setDate(new Date().getDate() + 18)),
      color: "bg-green-500",
      active: true,
    },
  ]);

  const toggleSub = (id: string) => {
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const monthlyBurn = subs.reduce((acc, curr) => (curr.active ? acc + curr.price : acc), 0);

  const yearlyImpact = monthlyBurn * 12;

  return (
    <section className="pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="lg:text-left text-center">
          <h1 className="lg:mt-10 text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
            {t("title.part_1")} <br />
            <span className="text-muted-foreground">
              {t("title.part_2")}
            </span>{" "}
            {t("title.part_3")}{" "}
            <span className="text-primary italic">{t("title.part_4")}</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed lg:mx-0 mx-auto">
            {t("description")}
          </p>

          <Link href="/dashboard" className="flex flex-wrap gap-4">
            <button className="w-fit bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:gap-3 transition-all sm:w-xl mx-auto cursor-pointer hover:shadow-lg hover:bg-primary/90 hover:scale-[1.02]">
              {t("cta")} <ArrowRight />
            </button>
          </Link>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-3xl transition-opacity duration-500" />

          <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.01]">
            <div className="border-b border-border p-4 flex items-center justify-between bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
              <div className="flex items-center gap-2">
                <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-muted-foreground">
                  live_preview.exe
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-secondary rounded-lg border border-transparent transition-colors">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                    {t("metrics.monthly_burn")}
                  </p>
                  <p className="text-2xl font-bold tabular-nums">
                    {monthlyBurn.toFixed(2)} €
                  </p>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] uppercase font-bold text-primary">
                      {t("metrics.yearly_impact")}
                    </p>
                    <TrendingDown
                      size={14}
                      className="text-primary opacity-50"
                    />
                  </div>
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {yearlyImpact.toFixed(2)} €
                  </p>
                </div>
              </div>

              <div className="space-y-0 border border-border rounded-lg overflow-hidden bg-background">
                {subs.map((sub) => (
                  <SubscriptionItem
                    key={sub.id}
                    {...sub}
                    onToggle={toggleSub}
                    t={t}
                  />
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground mt-2 italic underline-offset-4 underline">
                {t("tip")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
