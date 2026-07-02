"use client";
import { Coins } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionPlannerContext";
import { BillingCycle, Category } from "@/lib/validations/enums";
import { useLocale, useTranslations } from "next-intl";
import { priceFormatter } from "@/lib/utils";
import ActiveSubsHierarchy from "./rightColumn/ActiveSubsHierarchy";
import ProjectedPrices from "./rightColumn/ProjectedPrices";
import OpportunityCosts from "./rightColumn/OpportunityCosts";

type ActiveSubscription = {
  id: string;
  name: string;
  category: Category;
  price: number;
  billingCycle: BillingCycle;
}
export type SortedStackItem = { id: string, monthlyCost: number, isDraft: boolean} & Omit<ActiveSubscription, "id">;

type RightColumnProps = {
  currentlyActiveSubscriptions: ActiveSubscription[];
};

const parseMonthly = (price: number, period: BillingCycle) => {
  if (period === "Yearly") return price / 12;
  if (period === "Quarterly") return price / 3;
  return price;
};

export default function RightColumn({
  currentlyActiveSubscriptions,
}: RightColumnProps) {
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("planner_page.right_column_component");
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
  const sortedStack = activeList.sort((a, b) => b.monthlyCost - a.monthlyCost);
  const monthlySpend = activeList
    .filter((sub) => sub.isDraft === false)
    .reduce((total, sub) => (total += sub.monthlyCost), 0);
    const draftYearly = draftMonthly * 12;

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
        <ActiveSubsHierarchy
          sortedStack={sortedStack}
          t={t}
          tReusable={tReusable}
          locale={locale}
        />
      </div>
      {hasDraft ? (
        <div className="relative py-6 px-4 space-y-8 overflow-hidden transition-all duration-300">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-linear-to-br from-indigo-500/10 to-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
          <ProjectedPrices
            draftMonthly={draftMonthly}
            draftYearly={draftYearly}
            monthlySpend={monthlySpend}
            t={t}
            locale={locale}
          />
          <OpportunityCosts
            draftMonthly={draftMonthly}
            draftYearly={draftYearly}
            monthlySpend={monthlySpend}
            hypotheticalPrice={Number(hypotheticalPrice)}
            hypotheticalPeriod={hypotheticalPeriod}
            t={t}
          />
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
