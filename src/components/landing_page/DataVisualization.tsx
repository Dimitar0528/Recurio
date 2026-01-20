"use client";

import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
export default function DataVisualization() {
  const t = useTranslations("landing_page.data_visualization_component");
    const years = [
    {
      label: t("years.year_01"),
      value: "180.00 €",
      barWidth: "10%",
      highlight: false,
    },
    {
      label: t("years.year_05"),
      value: "900.00 €",
      barWidth: "40%",
      highlight: false,
    },
    {
      label: t("years.year_10"),
      value: "1,800.00 €",
      barWidth: "100%",
      highlight: true,
    },
  ];
  return (
    <section className="py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-primary font-mono text-xs mb-6 mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {t("tagline")}
              </div>

              <h2 className="text-4xl font-bold tracking-tight mb-6 leading-tight text-center lg:text-left">
                {t("heading")}
              </h2>

              <p className="text-muted-foreground text-lg mb-8 leading-relaxed text-center lg:text-left max-w-lg mx-auto lg:mx-0">
                {t("description.part_1")}{" "}
                <strong className="uppercase text-black dark:text-gray-200">
                  {t("description.emphasis")}
                </strong>{" "}
                {t("description.part_2")}
              </p>

              <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
                <div className="mx-auto lg:mx-0">
                  <p className="text-3xl font-mono font-bold">
                    {t("stats.horizon_value")}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t("stats.horizon_label")}
                  </p>
                </div>
                <div className="mx-auto lg:mx-0">
                  <p className="text-3xl font-mono font-bold text-primary">
                    {t("stats.multiplier_value")}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t("stats.multiplier_label")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-8 md:p-16 border-l border-border">
              <div className="space-y-12">
                {years.map((year) => (
                  <div key={year.label} className="relative">
                    <div className="flex justify-between items-end mb-2">
                      <span
                        className={`text-xs font-bold uppercase tracking-tighter ${
                          year.highlight ? "text-primary" : ""
                        }`}>
                        {year.label}
                      </span>
                      <span
                        className={`font-mono ${
                          year.highlight
                            ? "text-xl font-bold text-primary"
                            : "text-sm"
                        }`}>
                        {year.value}
                      </span>
                    </div>
                    <div
                      className={`h-${year.highlight ? "5" : "3"} w-full ${
                        year.highlight
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-secondary"
                      } rounded-full overflow-hidden`}>
                      <div
                        className={`h-full ${
                          year.highlight
                            ? "bg-primary w-full"
                            : "bg-foreground/20"
                        }`}
                        style={{ width: year.barWidth }}
                      />
                    </div>

                    {year.highlight && (
                      <div className="absolute -top-12 -right-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded text-[10px] font-bold rotate-6 shadow-xl">
                        {t("opportunity_cost")}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                  <Eye className="text-primary mt-1" size={20} />
                  <p className="text-xs text-muted-foreground leading-normal">
                    {t("disclaimer")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
