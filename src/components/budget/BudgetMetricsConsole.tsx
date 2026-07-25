"use client";
import { cn, localizeFieldErrors, priceFormatter } from "@/lib/utils";
import { Info, XCircle, AlertTriangle, CheckCircle, Edit2 } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useBudget } from "@/context/BudgetContext";
import { useUser } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import { inputNumberSchema } from "@/lib/validations/schemas";
import { toast } from "sonner";
import { Field, FieldError } from "../ui/field";
import { useLocale, useTranslations } from "next-intl";

type BudgetMetricsConsoleProps = {
  latestMontlySpend: number;
  statusTotals: {
    freeTrial: number;
    cancelled: number;
  };
};

export default function BudgetMetricsConsole({
  latestMontlySpend,
  statusTotals,
}: BudgetMetricsConsoleProps) {
  const tValidation = useTranslations("Validation");
  const locale = useLocale();

  const LOCALIZED_ERROR_MESSAGES = {
    INPUT_NUMBER_REQUIRED: tValidation("numberInput.min", {
      subject: locale === "bg" ? "Бюджетът" : "Budget",
    }),
    INPUT_NUMBER_NOT_POSITIVE: tValidation("numberInput.positive", {
      subject: locale === "bg" ? "Бюджетът" : "Budget",
    }),
    INPUT_NUMBER_DECIMALS: tValidation("numberInput.decimal_count", {
      subject: locale === "bg" ? "Бюджетът" : "Budget",
    }),
  };
  const { user, isLoaded } = useUser();
  const overallBudget = user?.unsafeMetadata.overall_budget;
  const { period, periodMultiplier } = useBudget();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [includeTrials, setIncludeTrials] = useState(false);
  const [includeCancelled, setIncludeCancelled] = useState(false);

  const form = useForm({
    defaultValues: {
      inputNumber: overallBudget?.toFixed(2) ?? "",
    },
    validators: { onSubmit: inputNumberSchema },
    onSubmit: async ({ value }) => {
      if (!user) return;
      const result = inputNumberSchema.safeParse(value);
      if (!result.success) return toast.error(result.error.message);
      const parsedBudget = result.data.inputNumber;
      try {
        await user.updateMetadata({
          unsafeMetadata: { overall_budget: parsedBudget },
        });
        setIsEditingBudget(false);
      } catch (err) {
        console.error("Failed to update overall budget:", err);
      }
    },
  });

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border/80 animate-pulse">
        <div className="py-8 pr-0 md:pr-8 md:border-r border-border/60 border-b md:border-b-0 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-muted rounded-none" />
              <div className="h-8 w-36 bg-muted rounded-none" />
            </div>
            <div className="h-6 w-20 bg-muted rounded-none" />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4">
            <div className="space-y-3 flex-1 w-full">
              <div className="h-3 w-full bg-muted rounded-none" />
              <div className="h-3 w-5/6 bg-muted rounded-none" />
              <div className="h-3 w-4/6 bg-muted rounded-none" />
            </div>
            <div className="size-28 rounded-full bg-muted shrink-0" />
          </div>
          <div className="h-4 w-full bg-muted rounded-none pt-4" />
        </div>
        <div className="py-8 md:px-8 md:border-r border-border/60 border-b md:border-b-0 space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded-none" />
            <div className="h-3 w-full bg-muted rounded-none" />
          </div>
          <div className="space-y-4 py-4 border-t border-b border-border/40">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-12 bg-muted" />
                <div className="h-5 w-20 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-12 bg-muted ml-auto" />
                <div className="h-5 w-20 bg-muted ml-auto" />
              </div>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-none" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-28 bg-muted rounded-none" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-4 w-20 bg-muted rounded-none" />
              <div className="h-4 w-20 bg-muted rounded-none" />
            </div>
          </div>
        </div>
        <div className="py-8 pl-0 md:pl-8 space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded-none" />
            <div className="h-10 w-40 bg-muted rounded-none" />
            <div className="h-3 w-full bg-muted rounded-none" />
          </div>
          <div className="pt-4 border-t border-border/30 space-y-3">
            <div className="h-3 w-24 bg-muted rounded-none" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded-none" />
              <div className="h-4 w-full bg-muted rounded-none" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  let total = 0;
  if (includeTrials) total += statusTotals.freeTrial;
  if (includeCancelled) total += statusTotals.cancelled;
  const activeSpending = latestMontlySpend * periodMultiplier;
  const currentBudget =
    typeof overallBudget === "number" ? overallBudget * periodMultiplier : 0;
  const forecastedSpending = (latestMontlySpend + total) * periodMultiplier;
  const remainingBudget =
    typeof overallBudget === "number"
      ? Math.max(0, currentBudget - activeSpending)
      : 0;
  const percentUsed =
    currentBudget > 0 ? (activeSpending / currentBudget) * 100 : 0;

  const getProgressColor = (percent: number) => {
    if (overallBudget == null) return "bg-muted text-muted-foreground";
    if (percent >= 100)
      return "bg-red-500 text-red-500 border-red-200 dark:border-red-900/50";
    if (percent >= 80)
      return "bg-amber-500 text-amber-500 border-amber-200 dark:border-amber-900/50";
    return "bg-emerald-500 text-emerald-500 border-emerald-200 dark:border-emerald-900/50";
  };
  const getGoalStatusLabel = (percent: number) => {
    if (overallBudget == null) {
      return {
        label: "Unconfigured",
        icon: <Info className="size-4 text-muted-foreground inline mr-1" />,
        color: "text-muted-foreground",
      };
    }
    if (percent >= 100)
      return {
        label: "Exceeded",
        icon: <XCircle className="size-4 text-red-500 inline mr-1" />,
        color: "text-red-600 dark:text-red-400",
      };
    if (percent >= 80)
      return {
        label: "Near Limit",
        icon: <AlertTriangle className="size-4 text-amber-500 inline mr-1" />,
        color: "text-amber-600 dark:text-amber-400",
      };
    return {
      label: "On Track",
      icon: <CheckCircle className="size-4 text-emerald-500 inline mr-1" />,
      color: "text-emerald-600 dark:text-emerald-400",
    };
  };

  const potentialSubCount = Math.floor(
    remainingBudget / (12 * periodMultiplier),
  );
  const handleResetBudget = async () => {
    if (!user) return;
    try {
      await user.updateMetadata({ unsafeMetadata: { overall_budget: null } });
    } catch (err) {
      console.error("Failed to reset overall_budget on Clerk:", err);
    }
  };

  // IMPROVEMENT: Consolidated layout. The editing state utilizes an inline horizontal row.
  const renderBudgetForm = (isSetupMode: boolean) => (
    <form
      key={overallBudget ?? "unset"}
      id="budget-console-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={cn("w-full", isSetupMode ? "space-y-4 my-6" : "")}>
      <form.Field name="inputNumber">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="w-full">
              {isSetupMode && (
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Establish an overall spending limit to track utilization,
                  check subscription pricing thresholds, and calculate remaining
                  space.
                </p>
              )}
              <div className="flex gap-2 items-start w-full">
                {!isSetupMode && (
                  <span className="text-lg font-bold self-center">€</span>
                )}
                <div className="flex-1 flex flex-col gap-1">
                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={isSetupMode ? "e.g. 100" : "Limit"}
                    autoComplete="on"
                    className="h-8"
                    aria-describedby="overallBudgetError"
                  />
                  {isInvalid && (
                    <FieldError
                      id="overallBudgetError"
                      errors={localizeFieldErrors(
                        field.state.meta.errors,
                        LOCALIZED_ERROR_MESSAGES,
                      )}
                      aria-live="polite"
                    />
                  )}
                </div>

                {/* Horizontal Action buttons inline in both view and edit modes */}
                {isSetupMode ? (
                  <Button
                    type="submit"
                    disabled={!form.state.canSubmit || form.state.isSubmitting}
                    className="bg-primary text-primary-foreground text-xs font-black uppercase px-4 h-8 hover:opacity-90 cursor-pointer">
                    {form.state.isSubmitting ? "..." : "Set Limit"}
                  </Button>
                ) : (
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      type="submit"
                      form="budget-console-form"
                      size="sm"
                      className="h-8 px-2.5 text-xs font-bold cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all dark:bg-primary/50"
                      disabled={
                        !form.state.canSubmit || form.state.isSubmitting
                      }>
                      {form.state.isSubmitting ? "..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2.5 text-xs cursor-pointer border border-border"
                      onClick={() => setIsEditingBudget(false)}
                      disabled={form.state.isSubmitting}
                      type="button">
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Field>
          );
        }}
      </form.Field>
    </form>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border/80">
      {/* Panel 1: Primary Overall Budget */}
      <div className="py-8 pr-0 md:pr-8 md:border-r border-border/60 border-b md:border-b-0 flex flex-col justify-between h-full">
        {overallBudget == null ? (
          <div className="flex flex-col justify-between h-full w-full">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    Overall {period} Limit
                  </p>
                  <h2 className="text-xl font-bold tracking-tight mt-2 text-muted-foreground">
                    Budget Limit Unset
                  </h2>
                </div>
                <span className="text-xs font-bold uppercase flex items-center">
                  <Info className="size-4 text-muted-foreground inline mr-1" />
                  <span className="text-[10px] tracking-wider font-bold text-muted-foreground">
                    Pending Setup
                  </span>
                </span>
              </div>
              {renderBudgetForm(true)}
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold border-t border-border/30 pt-4 mt-2">
              <span>Unconfigured Status</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Setup Required
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full w-full">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-full">
                  <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    Overall {period} Limit
                  </p>
                  {isEditingBudget ? (
                    <div className="mt-2 w-full">{renderBudgetForm(false)}</div>
                  ) : (
                    <div className="flex items-center gap-2 mt-2">
                      <h2 className="text-3xl font-black font-mono tracking-tighter">
                        {priceFormatter(currentBudget)}
                      </h2>
                      <button
                        onClick={() => setIsEditingBudget(true)}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                        <Edit2 className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
                {!isEditingBudget && (
                  <span className="text-xs font-bold uppercase flex items-center shrink-0">
                    {getGoalStatusLabel(percentUsed).icon}
                    <span className="ml-1 text-[10px] tracking-wider font-bold">
                      {getGoalStatusLabel(percentUsed).label}
                    </span>
                  </span>
                )}
              </div>

              {/* IMPROVEMENT: Keeps the progress metrics and gauge rendered during edit mode */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4">
                <div className="space-y-2 text-xs flex-1 w-full sm:w-auto">
                  <div className="flex justify-between border-b border-border/30 pb-1.5">
                    <span className="text-muted-foreground">Spent Basis:</span>
                    <span className="font-mono font-semibold">
                      {priceFormatter(activeSpending)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 pb-1.5">
                    <span className="text-muted-foreground">
                      Safety Cap (80%):
                    </span>
                    <span className="font-mono font-semibold">
                      {priceFormatter(currentBudget * 0.8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilization:</span>
                    <span
                      className={cn(
                        "font-bold",
                        percentUsed >= 100
                          ? "text-red-500"
                          : percentUsed >= 80
                            ? "text-amber-500"
                            : "text-emerald-500",
                      )}>
                      {Math.round(percentUsed)}%
                    </span>
                  </div>
                </div>
                <div className="relative size-28 shrink-0 flex items-center justify-center">
                  <svg className="size-full -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      className="stroke-muted fill-transparent"
                      strokeWidth="7"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      className={cn(
                        "fill-transparent stroke-current transition-all duration-1000 ease-out",
                      )}
                      strokeWidth="9"
                      strokeDasharray={289.03}
                      strokeDashoffset={
                        289.03 - (Math.min(percentUsed, 100) / 100) * 289.03
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xl font-black font-mono tabular-nums leading-none">
                      {Math.round(percentUsed)}%
                    </span>
                    <p className="text-[8px] uppercase tracking-wider font-black text-muted-foreground mt-0.5">
                      Utilized
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold border-t border-border/30 pt-4 mt-2">
              <span>Overall Utilization Tracking</span>
              <button
                onClick={handleResetBudget}
                className="text-[10px] uppercase font-bold text-destructive hover:underline cursor-pointer">
                Reset Limit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panel 2: Projected Forecast Panel */}
      <div className="py-8 md:px-8 md:border-r border-border/60 border-b md:border-b-0 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-sm font-black uppercase text-foreground mt-2 tracking-tight">
                Forecast Model
              </h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            Calculates baseline expenses paired with scheduled project
            parameters selected below.
          </p>
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-2 gap-4 border-b border-t border-border/40 py-3.5">
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                  Active Basis
                </span>
                <p className="text-base font-bold font-mono">
                  {priceFormatter(activeSpending)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                  Expected Cap
                </span>
                {overallBudget == null ? (
                  <span className="text-[9px] uppercase font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 mt-0.5 inline-block">
                    Limit Required
                  </span>
                ) : (
                  <p
                    className={cn(
                      "text-base font-black font-mono",
                      forecastedSpending > currentBudget
                        ? "text-red-500"
                        : "text-primary",
                    )}>
                    {priceFormatter(forecastedSpending)}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-secondary rounded-none overflow-hidden relative">
                {overallBudget != null && (
                  <>
                    <div
                      className={cn(
                        "h-full absolute left-0 top-0 transition-all duration-700",
                        getProgressColor(percentUsed),
                      )}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                    <div
                      className="h-full absolute left-0 top-0 bg-primary/25 transition-all duration-700"
                      style={{
                        width: `${Math.min((forecastedSpending / currentBudget) * 100, 100)}%`,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground block mb-2.5">
            Adjust Parameters
          </span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeTrials}
                onChange={(e) => setIncludeTrials(e.target.checked)}
                className="rounded-none border-border text-primary focus:ring-primary size-3.5"
              />
              Free Trials (+{priceFormatter(statusTotals.freeTrial)})
            </label>
            <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeCancelled}
                onChange={(e) => setIncludeCancelled(e.target.checked)}
                className="rounded-none border-border text-primary focus:ring-primary size-3.5"
              />
              Cancelled (+{priceFormatter(statusTotals.cancelled)})
            </label>
          </div>
        </div>
      </div>

      {/* Panel 3: Remaining Space & Metrics */}
      <div className="py-8 pl-0 md:pl-8 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-sm font-black uppercase text-foreground mt-2 tracking-tight">
                Free Margin
              </h3>
            </div>
          </div>
          <div className="mb-6 mt-4">
            {overallBudget == null ? (
              <>
                <h2 className="text-4xl font-black font-mono text-muted-foreground tracking-tighter">
                  €--.--
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed mt-4">
                  Configure an overall spending limit in the first panel to
                  inspect your available financial margin.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-black font-mono text-emerald-500 tracking-tighter tabular-nums">
                  {priceFormatter(remainingBudget)}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed mt-4">
                  {potentialSubCount > 0 ? (
                    <>
                      You can still allocate roughly{" "}
                      <span className="font-bold text-foreground border-b border-emerald-400">
                        {potentialSubCount}
                      </span>{" "}
                      subscriptions averaging{" "}
                      <span className="font-semibold text-foreground">
                        €12/
                        {period === "Monthly"
                          ? "mo"
                          : period === "Quarterly"
                            ? "qtr"
                            : "yr"}
                      </span>
                    </>
                  ) : (
                    "Your limit threshold is saturated. De-allocations or cancellations are required to regain margin."
                  )}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="border-t border-border/30 pt-4">
          <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground block mb-3">
            Performance Indicators
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs pb-1.5 border-b border-border/35">
              <span className="text-muted-foreground font-semibold">
                Success Efficiency
              </span>
              <span className="font-mono font-bold text-primary">
                0 / 6 periods
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-semibold">
                Continuous Streak
              </span>
              <span className="font-mono font-bold text-emerald-500">
                0 periods 🔥
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
