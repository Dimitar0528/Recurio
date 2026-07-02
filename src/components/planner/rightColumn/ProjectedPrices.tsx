import { priceFormatter } from "@/lib/utils";
import { Locale, useTranslations } from "next-intl";

type ProjectedPricesProps = {
  draftMonthly: number;
  draftYearly: number;
  monthlySpend: number;
  t: ReturnType<typeof useTranslations<"planner_page.right_column_component">>;
  locale: Locale;
};
export default function ProjectedPrices ({
    draftMonthly,
    draftYearly,
    monthlySpend,
    t,
    locale
}: ProjectedPricesProps){
    const newMonthly = monthlySpend + draftMonthly;
    const monthlyPercentIncrease =
      monthlySpend > 0 ? (draftMonthly / monthlySpend) * 100 : 0;
    const timelineNodes = [
      {
        id: "daily",
        label: t(
          "projected_price_stats.micro_velocity_cost.timeline_points.daily",
        ),
        letter: locale === "bg" ? "Д" : "D",
        value: draftMonthly / 30.417,
        badgeStyles:
          "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400",
        labelStyles: "text-slate-400 dark:text-slate-500",
        valueStyles: "text-slate-800 dark:text-slate-200",
      },
      {
        id: "weekly",
        label: t(
          "projected_price_stats.micro_velocity_cost.timeline_points.weekly",
        ),
        letter: locale === "bg" ? "С" : "W",
        value: draftMonthly / 4.33,
        badgeStyles:
          "border-slate-350 dark:border-slate-750 text-slate-500 dark:text-slate-400",
        labelStyles: "text-slate-400 dark:text-slate-500",
        valueStyles: "text-slate-800 dark:text-slate-200",
      },
      {
        id: "monthly",
        label: t(
          "projected_price_stats.micro_velocity_cost.timeline_points.monthly",
        ),
        letter: locale === "bg" ? "М" : "M",
        value: draftMonthly,
        badgeStyles:
          "border-indigo-450 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 shadow-xs",
        labelStyles: "text-indigo-500 dark:text-indigo-400/80",
        valueStyles: "text-slate-850 dark:text-slate-100",
      },
      {
        id: "quarterly",
        label: t(
          "projected_price_stats.micro_velocity_cost.timeline_points.quarterly",
        ),
        letter: locale === "bg" ? "Т" : "Q",
        value: draftMonthly * 3,
        badgeStyles:
          "border-slate-350 dark:border-slate-750 text-slate-500 dark:text-slate-400",
        labelStyles: "text-slate-400 dark:text-slate-500",
        valueStyles: "text-slate-800 dark:text-slate-200",
      },
      {
        id: "yearly",
        label: t(
          "projected_price_stats.micro_velocity_cost.timeline_points.yearly",
        ),
        letter: locale === "bg" ? "Г" : "Y",
        value: draftYearly,
        badgeStyles:
          "border-emerald-550 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 shadow-xs",
        labelStyles: "text-emerald-500 dark:text-emerald-400/80",
        valueStyles: "text-slate-850 dark:text-slate-100",
      },
    ];

    return (
      <>
        <div className="flex flex-col md:flex-row md:items-end items-center gap-6 pb-6 border-b border-slate-250/60 dark:border-slate-800/80 ">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500 block">
              {t("projected_price_stats.title")}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                {priceFormatter(newMonthly)}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {t("projected_price_stats.compared_to", {
                  monthlySpend: priceFormatter(monthlySpend),
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            <div className="space-y-0.5">
              <span className="block text-[9px] text-slate-400 dark:text-slate-550 uppercase tracking-widest font-semibold">
                {t("projected_price_stats.sandbox_shift")}
              </span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                +
                {monthlyPercentIncrease > 0
                  ? `${monthlyPercentIncrease.toFixed(1)}%`
                  : `${priceFormatter(draftMonthly)}`}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-0.5">
              <span className="block text-[9px] text-slate-400 dark:text-slate-550 uppercase tracking-widest font-semibold">
                {t("projected_price_stats.five_year_leak")}
              </span>
              <span className="text-xl font-extrabold text-rose-500 dark:text-rose-450 font-mono">
                {priceFormatter(draftYearly * 5)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-550 uppercase">
            {t("projected_price_stats.micro_velocity_cost.name")}
          </h4>
          <div className="relative mx-auto">
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 sm:left-4 sm:right-4 sm:top-5 sm:bottom-auto sm:w-auto sm:h-0.5 pointer-events-none" />
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-4 relative z-10">
              {timelineNodes.map((node) => (
                <div
                  key={node.id}
                  className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 pl-1 sm:pl-0">
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border-2 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${node.badgeStyles}`}>
                    {node.letter}
                  </div>
                  <div className="space-y-0.5">
                    <span
                      className={`text-[10px] block uppercase font-mono tracking-wider ${node.labelStyles}`}>
                      {node.label}
                    </span>
                    <span
                      className={`text-lg font-bold font-mono ${node.valueStyles}`}>
                      €{node.value.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
}