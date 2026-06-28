"use client";
import { HelpCircle } from "lucide-react";
import {
  useSubscription,
  getPeriodLabel,
} from "@/context/SubscriptionPlannerContext";
import { BillingCycle, Category } from "@/lib/validations/enums";

type ActiveSubscription = {
  id: string;
  name: string;
  category: Category;
  price: number;
  billingCycle: BillingCycle;
}
 interface SortedStackItem extends Omit<ActiveSubscription, "id"> {
   id: string;
   monthlyCost: number;
   isDraft: boolean;
 }

type RightColumnProps = {
  currentlyActiveSubscriptions: ActiveSubscription[];
};

const parseMonthly = (price: number, period: BillingCycle) => {
  if (period === "Yearly") return price / 12;
  if (period === "Quarterly") return price / 3;
  return price;
};

export default function RightColumn({ currentlyActiveSubscriptions }: RightColumnProps) {
  const {
    calculations,
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
    if (calculations.hasDraft && hypotheticalCategory != null) {
      activeList.push({
        id: "hypothetical-draft",
        name: hypotheticalName,
        category: hypotheticalCategory,
        price: parseFloat(hypotheticalPrice),
        billingCycle: hypotheticalPeriod,
        monthlyCost: calculations.draftMonthly,
        isDraft: true,
      });
    }
  const sortedStack = activeList.sort((a, b) => b.monthlyCost - a.monthlyCost);
    
  return (
    <div className="lg:col-span-7 space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4 flex items-center justify-between">
          <span>The Active Subscription Hierarchy</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono">
            Base Total: €30.99/mo
          </span>
        </h3>

        {sortedStack.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Your subscription stack is empty.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-550 mt-1 px-4">
              Draft a subscription or use the presets bank to start building
              your stack.
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
                      Sandbox Draft
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-850 dark:text-slate-200">
                          {sub.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono font-bold bg-slate-200 dark:bg-slate-800/80 px-1.5 py-0.2 rounded">
                          Rank #{index + 1} of {sortedStack.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 font-mono uppercase tracking-wider">
                        {sub.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono text-indigo-700 dark:text-indigo-300 font-bold block">
                        €{sub.price.toFixed(2)}/
                        {getPeriodLabel(sub.billingCycle)}
                      </span>
                      {sub.billingCycle !== "Monthly" && (
                        <span className="text-[10px] text-slate-450 dark:text-slate-400 font-mono">
                          (€{sub.monthlyCost.toFixed(2)}/mo)
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
                        Rank #{index + 1}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 font-mono uppercase tracking-wider">
                      {sub.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-semibold block">
                        €{sub.price.toFixed(2)}/{getPeriodLabel(sub.billingCycle)}
                      </span>
                      {sub.billingCycle !== "Monthly" && (
                        <span className="text-[10px] text-slate-450 dark:text-slate-400 font-mono">
                          (€{sub.monthlyCost.toFixed(2)}/mo)
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
    </div>
  );
}
