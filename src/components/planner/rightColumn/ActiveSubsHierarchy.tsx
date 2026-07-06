import { HelpCircle } from "lucide-react";
import { SortedStackItem } from "../RightColumn";
import { Locale, useTranslations } from "next-intl";
import { getPeriodLabel } from "@/context/SubscriptionPlannerContext";
import { priceFormatter } from "@/lib/utils";

type ActiveSubsHierarchyProps = {
  sortedStack: SortedStackItem[];
  t: ReturnType<typeof useTranslations<"planner_page.right_column_component">>;
  tReusable: ReturnType<typeof useTranslations<"Reusable">>;
  locale: Locale;
};
export default function ActiveSubsHierarchy({
  sortedStack,
  t,
  tReusable,
  locale
}: ActiveSubsHierarchyProps) {
  const tLabels = useTranslations("planner_page.period_labels");

    return sortedStack.length === 0 ? (
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
                <div className="absolute top-1.75 right-3 -translate-y-1/2 bg-indigo-500 text-white dark:text-slate-900 text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded-full uppercase">
                  {t("active_subscriptions.sandbox_sub.label")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-850 dark:text-slate-200">
                      {sub.name}
                    </h4>
                    <span className="text-[10px] text-slate-600 dark:text-slate-550 font-mono font-bold bg-slate-200 dark:bg-slate-800/80 px-1.5 py-0.2 rounded">
                      {t("active_subscriptions.sandbox_sub.rank_total", {
                        index: index + 1,
                        total: sortedStack.length,
                      })}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider">
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
                  <span className="text-[10px] text-slate-600 dark:text-slate-550 font-mono font-bold bg-slate-200 dark:bg-slate-800/80 px-1.5 py-0.2 rounded">
                    {t("active_subscriptions.sandbox_sub.rank", {
                      index: index + 1,
                    })}
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider">
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
    );
}