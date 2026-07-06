import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { priceFormatter } from "@/lib/utils";
import { Subscription } from "@/lib/validations/schemas";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

type SavingsSimDialogProps = {
  isSavingsDialogOpen: boolean;
  setIsSavingsDialogOpen: Dispatch<SetStateAction<boolean>>;
  setIsCancelDialogOpen: Dispatch<SetStateAction<boolean>>;
  allSubs: Subscription[];
  subscription: Subscription;
  t: ReturnType<
    typeof useTranslations<"dashboard_page.subscription_table_component">
  >;
};

export default function SavingsSimDialog({
  isSavingsDialogOpen,
  setIsSavingsDialogOpen,
  setIsCancelDialogOpen,
  allSubs,
  subscription,
  t,
}: SavingsSimDialogProps) {
  const tReusable = useTranslations("Reusable")
  const getMonthlyCost = (sub: Subscription) => {
    if (sub.billingCycle === "Yearly") return sub.price / 12;
    if (sub.billingCycle === "Quarterly") return sub.price / 3;
    return sub.price;
  };
  const totalMonthlyBudget = allSubs.reduce(
    (acc, s) => acc + getMonthlyCost(s),
    0,
  );
  const sortedSubs = [...allSubs].sort(
    (a, b) => getMonthlyCost(b) - getMonthlyCost(a),
  );
  const activeSubRank =
    sortedSubs.findIndex((s) => s.id === subscription.id) + 1;
  const monthlyCost = getMonthlyCost(subscription);
  const shareOfBudget =
    totalMonthlyBudget > 0 ? (monthlyCost / totalMonthlyBudget) * 100 : 0;

  const savedNextMonth = monthlyCost;
  const savedNextYear = monthlyCost * 12;
  const savedFiveYears = monthlyCost * 60;

  const trackingDate = subscription.createdAt
    ? new Date(subscription.createdAt)
    : null;
  let monthsSpent = 0;
  if (trackingDate && !isNaN(trackingDate.getTime())) {
    const now = new Date();
    const yearDiff = now.getFullYear() - trackingDate.getFullYear();
    const monthDiff = now.getMonth() - trackingDate.getMonth();
    monthsSpent = Math.max(1, yearDiff * 12 + monthDiff);
  } else {
    monthsSpent = 12;
  }
  const spentSoFar = monthsSpent * monthlyCost;

  const coffeesCount = Math.floor(savedFiveYears / 4.5);
  const tripsCount = Math.floor(savedFiveYears / 300);
  const hasEnoughForPS5 = savedFiveYears >= 550;
  const hasEnoughForAirpods = savedFiveYears >= 250;

  return (
    <Dialog open={isSavingsDialogOpen} onOpenChange={setIsSavingsDialogOpen}>
      <DialogContent className="sm:max-w-[480px] p-8 max-h-[90vh] overflow-y-auto border-none shadow-2xl bg-white dark:bg-slate-950">
        <DialogHeader className="pb-1 border-b border-slate-100 dark:border-slate-900">
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-450 dark:text-slate-500 block">
            {t("savings_dialog.title_header")}
          </span>
          <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">
            {subscription.name}
          </DialogTitle>
          <DialogDescription className="text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400">
            {priceFormatter(subscription.price)} / {tReusable(`billingCycle.${subscription.billingCycle}`)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500 font-bold">
              {t("savings_dialog.cancel_savings_title")}
            </h4>
            <div className="grid grid-cols-3 gap-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {t("savings_dialog.next_month")}
                </span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {priceFormatter(savedNextMonth)}
                </span>
              </div>
              <div className="flex flex-col border-l border-slate-100 dark:border-slate-900 pl-3">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {t("savings_dialog.next_year")}
                </span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {priceFormatter(savedNextYear)}
                </span>
              </div>
              <div className="flex flex-col border-l border-slate-100 dark:border-slate-900 pl-3">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {t("savings_dialog.over_5_years")}
                </span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {priceFormatter(savedFiveYears)}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-900">
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500 font-bold">
              {t("savings_dialog.keep_paying_title")}
            </h4>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {t("savings_dialog.one_year")}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {priceFormatter(savedNextYear)}
                </span>
              </div>
              <div className="flex flex-col border-l border-slate-100 dark:border-slate-900 pl-3">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {t("savings_dialog.three_years")}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {priceFormatter(monthlyCost * 36)}
                </span>
              </div>
              <div className="flex flex-col border-l border-slate-100 dark:border-slate-900 pl-3">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {t("savings_dialog.five_years")}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {priceFormatter(savedFiveYears)}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-900">
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500 font-bold">
              {t("savings_dialog.since_subscribing_title")}
            </h4>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("savings_dialog.youve_spent")}
              </span>
              <span className="text-lg font-black font-mono text-slate-850 dark:text-slate-100">
                {priceFormatter(spentSoFar)}
              </span>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-900">
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500 font-bold">
              {t("savings_dialog.this_sub_title")}
            </h4>
            <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400 font-mono">
              <li>
                {t("savings_dialog.rank_message", { rank: activeSubRank })}
              </li>
              <li>
                {t("savings_dialog.share_message", {
                  percent: shareOfBudget.toFixed(0),
                })}
              </li>
            </ul>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-900">
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500 font-bold">
              {t("savings_dialog.alternatives_title", {
                price: priceFormatter(savedFiveYears),
              })}
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              {hasEnoughForPS5 && (
                <li>{t("savings_dialog.alternatives.ps5")}</li>
              )}
              {hasEnoughForAirpods && (
                <li>{t("savings_dialog.alternatives.airpods")}</li>
              )}
              {tripsCount > 0 && (
                <li>
                  {t("savings_dialog.alternatives.trips", {
                    count: tripsCount,
                  })}
                </li>
              )}
              {coffeesCount > 0 && (
                <li>
                  {t("savings_dialog.alternatives.coffees", {
                    count: coffeesCount,
                  })}
                </li>
              )}
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <DialogClose
            render={
              <Button
                variant="outline"
                className="cursor-pointer border-border hover:bg-accent font-semibold outline-dashed text-xs w-full sm:w-auto">
                {t("savings_dialog.close")}
              </Button>
            }
          />
          <Button
            onClick={() => {
              setIsSavingsDialogOpen(false);
              setIsCancelDialogOpen(true);
            }}
            className="text-xs font-mono font-bold cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto">
            {t("savings_dialog.view_guide")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
