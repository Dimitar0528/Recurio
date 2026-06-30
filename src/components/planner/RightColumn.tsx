"use client";
import { Coins, HelpCircle } from "lucide-react";
import {
  useSubscription,
  getPeriodLabel,
} from "@/context/SubscriptionPlannerContext";
import { BillingCycle, Category } from "@/lib/validations/enums";
import { useLocale, useTranslations } from "next-intl";
import { priceFormatter } from "@/lib/utils";

type ActiveSubscription = {
  id: string;
  name: string;
  category: Category;
  price: number;
  billingCycle: BillingCycle;
}
type SortedStackItem = { id: string,monthlyCost: number, isDraft: boolean} & Omit<ActiveSubscription, "id">;

type RightColumnProps = {
  currentlyActiveSubscriptions: ActiveSubscription[];
};

const parseMonthly = (price: number, period: BillingCycle) => {
  if (period === "Yearly") return price / 12;
  if (period === "Quarterly") return price / 3;
  return price;
};

export default function RightColumn({ currentlyActiveSubscriptions }: RightColumnProps) {
  const tLabels = useTranslations("planner_page.period_labels");
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("planner_page.right_column_component")
  const locale = useLocale();

  const {
    hypotheticalName,
    hypotheticalCategory,
    hypotheticalPrice,
    hypotheticalPeriod,
  } = useSubscription();

  const activeList: SortedStackItem[] = currentlyActiveSubscriptions.map(
    (sub) => ({
      ...sub,
      monthlyCost: parseMonthly(sub.price, sub.billingCycle),
      isDraft: false,
    }),
  );
  const hasDraft =
    hypotheticalName.trim() !== "" && Number(hypotheticalPrice) > 0;
  const draftMonthly = hasDraft
    ? parseMonthly(Number(hypotheticalPrice), hypotheticalPeriod)
    : 0;
  if (hasDraft && hypotheticalCategory != null) {
    activeList.push({
      id: "hypothetical-draft",
      name: hypotheticalName,
      category: hypotheticalCategory,
      price: parseFloat(hypotheticalPrice),
      billingCycle: hypotheticalPeriod,
      monthlyCost: draftMonthly,
      isDraft: true,
    });
  }
  const sortedStack = activeList.sort(
    (a, b) => b.monthlyCost - a.monthlyCost,
  );

  const monthlySpend = activeList
    .filter((sub) => sub.isDraft === false)
    .reduce((total, sub) => (total += sub.monthlyCost), 0);
  const draftYearly = draftMonthly * 12;
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
    <div className="lg:col-span-7 space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4 flex items-center justify-between">
          <span> {t("active_subscriptions.title")} </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono">
            {t("active_subscriptions.monthly_spend", {
              monthlySpend: priceFormatter(monthlySpend),
            })}
          </span>
        </h3>

        {sortedStack.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {t("active_subscriptions.empty.title")}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-550 mt-1 px-4 max-w-md mx-auto">
              {t("active_subscriptions.empty.description")}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {sortedStack.map((sub, index) => {
              if (sub.isDraft) {
                return (
                  <div
                    key="hypothetical-draft"
                    className="relative flex items-center justify-between bg-linear-to-r from-indigo-50/50 to-emerald-50/20 dark:from-indigo-950/20 dark:to-emerald-950/5 border-2 border-dashed border-indigo-500/80 rounded-2xl px-4 py-3.5 shadow-sm">
                    <div className="absolute top-1 right-3 -translate-y-1/2 bg-indigo-500 text-white dark:text-slate-900 text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded-full uppercase">
                      {t("active_subscriptions.sandbox_sub.label")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-850 dark:text-slate-200">
                          {sub.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono font-bold bg-slate-200 dark:bg-slate-800/80 px-1.5 py-0.2 rounded">
                          {t("active_subscriptions.sandbox_sub.rank_total", {
                            index: index + 1,
                            total: sortedStack.length,
                          })}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 font-mono uppercase tracking-wider">
                        {tReusable(`categories.${sub.category}`)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono text-indigo-700 dark:text-indigo-300 font-bold block">
                        €{sub.price.toFixed(2)}/
                        {getPeriodLabel(sub.billingCycle, tLabels)}
                      </span>
                      {sub.billingCycle !== "Monthly" && (
                        <span className="text-[10px] text-slate-450 dark:text-slate-400 font-mono">
                          {priceFormatter(sub.monthlyCost)}/
                          {locale === "bg" ? "мес." : "mo"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 hover:border-slate-300 dark:hover:border-slate-800 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-850 dark:text-slate-200">
                        {sub.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono font-bold bg-slate-200 dark:bg-slate-800/80 px-1.5 py-0.2 rounded">
                        {t("active_subscriptions.sandbox_sub.rank", {
                          index: index + 1,
                        })}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 font-mono uppercase tracking-wider">
                      {tReusable(`categories.${sub.category}`)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-semibold block">
                        €{sub.price.toFixed(2)}/
                        {getPeriodLabel(sub.billingCycle, tLabels)}
                      </span>
                      {sub.billingCycle !== "Monthly" && (
                        <span className="text-[10px] text-slate-450 dark:text-slate-400 font-mono">
                          (€{sub.monthlyCost.toFixed(2)}/
                          {locale === "bg" ? "мес." : "mo"})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {hasDraft ? (
        <div className="relative py-6 px-4 space-y-8 overflow-hidden transition-all duration-300">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-linear-to-br from-indigo-500/10 to-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

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
            <div className="relative">
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
        </div>
      ) : (
        <div className="bg-slate-100 dark:bg-slate-900/45 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500 dark:text-slate-400 shadow-inner">
          <Coins className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("projected_price_stats.empty.title")}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            {t("projected_price_stats.empty.description")}
          </p>
        </div>
      )}
    </div>
  );
}
