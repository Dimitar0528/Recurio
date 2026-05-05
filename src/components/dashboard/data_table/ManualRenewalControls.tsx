import { toast } from "sonner";
import { confirmManualRenewal, declineManualRenewal } from "@/app/actions";
import { Subscription } from "@/lib/validations/schemas";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { startOfDay } from "date-fns";

type ManualRenewalControlsProps = {
  pendingRenewalSubscriptions: Subscription[];
  t: ReturnType<typeof useTranslations<"dashboard_page.data_table_component">>;
  tReusable: ReturnType<typeof useTranslations<"Reusable">>;
};

export function ManualRenewalControls({
  pendingRenewalSubscriptions,
  t,
  tReusable,
}: ManualRenewalControlsProps) {
  const [expandedDeclineId, setExpandedDeclineId] = useState<string | null>(
    null,
  );
  const today = startOfDay(new Date());

  const items = pendingRenewalSubscriptions.filter(
    ({ autoRenew, status, nextBilling }) => {
      const dueDate = startOfDay(new Date(nextBilling));
      return !autoRenew && status === "Active" && dueDate <= today;
    },
  );

  if (!items.length) return null;

  return (
    <div className="space-y-1.5 mb-2">
      {pendingRenewalSubscriptions.map((subscription) => {
        const { id, manualRenewalGraceUntil, name } = subscription;

        const graceDate = manualRenewalGraceUntil
          ? startOfDay(new Date(manualRenewalGraceUntil))
          : null;

        const daysLeft = graceDate
          ? Math.ceil(
              (graceDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
            )
          : null;

        const graceLabel =
          daysLeft === null
            ? t("manual_renewal.grace_not_started")
            : daysLeft <= 0
              ? t("manual_renewal.grace_expired")
              : t("manual_renewal.grace_days_left", { count: daysLeft });

        const isExpired = daysLeft !== null && daysLeft <= 0;
        const isDeclineOpen = expandedDeclineId === id;

        return (
          <div
            key={id}
            className={cn(
              "rounded-xl overflow-hidden transition-all duration-200",
              "border border-amber-200/70 dark:border-amber-600/40",
              "bg-amber-50/40 dark:bg-amber-700/15",
            )}>
            {/* Main row */}
            <div className="flex items-center gap-1.5 px-1 py-0.5">
              <span className="relative hidden sm:flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
              </span>

              <div className="flex flex-col sm:flex-row items-baseline gap-0 sm:gap-2 flex-1">
                <span className="text-sm font-medium text-foreground truncate">
                  {name}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium tabular-nums shrink-0",
                    isExpired
                      ? "text-red-500 dark:text-red-400"
                      : "text-amber-800 dark:text-amber-400",
                  )}>
                  {graceLabel}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="xs"
                  className={cn(
                    "h-6 rounded-full px-2 text-xs font-medium cursor-pointer transition-colors",
                    "bg-green-600 text-white hover:bg-green-700",
                    "dark:bg-green-800 dark:hover:bg-green-600",
                  )}
                  onClick={() =>
                    toast.promise(confirmManualRenewal(id), {
                      loading: t("manual_renewal.messages.renewing"),
                      success: t("manual_renewal.messages.renewed"),
                      error: t("manual_renewal.messages.error"),
                    })
                  }>
                  {t("manual_renewal.actions.renew_yes")}
                </Button>

                <Button
                  size="xs"
                  variant="secondary"
                  className={cn(
                    "h-6 rounded-full px-2 text-xs font-medium cursor-pointer transition-colors",
                    "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800",
                    "dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/60 dark:hover:text-blue-200",
                    isDeclineOpen &&
                      "bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200",
                  )}
                  onClick={() =>
                    setExpandedDeclineId((prev) => (prev === id ? null : id))
                  }>
                  {t("manual_renewal.actions.renew_no")}
                  {isDeclineOpen ? <ArrowUp /> : <ArrowDown />}
                </Button>
              </div>
            </div>

            {/* Inline decline panel */}
            {isDeclineOpen && (
              <div className="flex items-center justify-between gap-2 px-1 py-1 border-t  border-amber-200/70 dark:border-amber-600/40 bg-amber-50/40 dark:bg-amber-700/15">
                <span className="text-xs ">
                  {t("manual_renewal.follow_up")}
                </span>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "h-6 rounded-full px-3 text-xs font-medium cursor-pointer transition-colors",
                      "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-800",
                      "dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/60",
                    )}
                    onClick={() =>
                      toast.promise(declineManualRenewal(id, "Paused"), {
                        loading: t("manual_renewal.messages.updating_status"),
                        success: t("manual_renewal.messages.paused"),
                        error: t("manual_renewal.messages.error"),
                      })
                    }>
                    {tReusable("status.Paused")}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "h-6 rounded-full px-3 text-xs font-medium cursor-pointer transition-colors",
                      "border-red-300 bg-red-50 text-red-800 hover:bg-red-100 hover:text-red-800",
                      "dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60",
                    )}
                    onClick={() =>
                      toast.promise(declineManualRenewal(id, "Cancelled"), {
                        loading: t("manual_renewal.messages.updating_status"),
                        success: t("manual_renewal.messages.cancelled"),
                        error: t("manual_renewal.messages.error"),
                      })
                    }>
                    {tReusable("status.Cancelled")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
