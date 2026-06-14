"use client";
import { useEffect, useState } from "react";
import { categoryColors, cn, localizeFieldErrors, priceFormatter } from "@/lib/utils";
import { Subscription } from "@/lib/validations/schemas";
import { Button } from "../ui/button";
import {
  CATEGORY_VALUES,
  type BillingCycle,
  type Category,
} from "@/lib/validations/enums";
import { Input } from "../ui/input";
import { useUser } from "@clerk/nextjs";
import { netSalarySchema } from "@/lib/validations/schemas";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl";
type InsightsSidebarProps = {
  data: Subscription[];
  monthlySpend: number;
};

export default function InsightsSidebar({
  data,
  monthlySpend,
}: InsightsSidebarProps) {
  const tReusable = useTranslations("Reusable");
  const tValidation = useTranslations("Validation");
  const t = useTranslations("dashboard_page.insights_sidebar_component");

  const LOCALIZED_ERROR_MESSAGES = {
    NET_SALARY_REQUIRED: tValidation("netSalary.min"),
    NET_SALARY_NOT_POSITIVE: tValidation("netSalary.positive"),
    NET_SALARY_DECIMALS: tValidation("netSalary.decimal_count"),
  };

  const { user, isLoaded } = useUser();
  const [salary, setSalary] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<BillingCycle>("Monthly");

  useEffect(() => {
    if (!isLoaded) return;
    const clerkSalary = user?.unsafeMetadata?.net_salary;
    if (typeof clerkSalary === "number") {
      setSalary(clerkSalary);
    }
  }, [isLoaded, user]);

  const ratio = salary && salary > 0 ? (monthlySpend / salary) * 100 : 0;

  const form = useForm({
    defaultValues: { netSalary: salary?.toFixed(2) ?? "" },
    validators: { onSubmit: netSalarySchema },
    onSubmit: async ({ value }) => {
      if (!user) return;
      const result = netSalarySchema.safeParse(value);
      if (!result.success) return toast.error(result.error.message);
      const parsedNetSalary = result.data.netSalary;
      try {
        await user.update({ unsafeMetadata: { net_salary: parsedNetSalary } });
        setSalary(parsedNetSalary);
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to update salary:", err);
      }
    },
  });

  const handleRemove = async () => {
    if (!user) return;
    try {
      await user.update({ unsafeMetadata: { net_salary: null } });
      setSalary(null);
    } catch (err) {
      console.error("Failed to remove salary:", err);
    }
  };

  const aggregatedByCategory = data
    .filter((s) => s.status === "Active")
    .reduce<Record<Category, number>>(
      (acc, { price, billingCycle, category }) => {
        let normalized = price;
        if (viewMode === "Monthly") {
          normalized = billingCycle === "Annual" ? price / 12 : price;
        } else {
          normalized = billingCycle === "Monthly" ? price * 12 : price;
        }
        acc[category] = (acc[category] ?? 0) + normalized;
        return acc;
      },
      {} as Record<Category, number>,
    );

  const totalSpend = Object.values(aggregatedByCategory).reduce(
    (sum, v) => sum + v,
    0,
  );

  const categoryItems = Object.entries(aggregatedByCategory)
    .map(([category, amount]) => {
      const percentage = totalSpend === 0 ? 0 : (amount / totalSpend) * 100;
      const typedCategory = category as Category;
      return {
        key: typedCategory,
        label: tReusable(`categories.${typedCategory}`),
        value: parseFloat(percentage.toFixed(2)),
        money: priceFormatter(amount),
      };
    })
    .sort((a, b) => b.value - a.value);

  const categoryColorMap: Record<Category, (typeof categoryColors)[0]> =
    CATEGORY_VALUES.reduce(
      (acc, category, i) => {
        acc[category] = categoryColors[i % categoryColors.length];
        return acc;
      },
      {} as Record<Category, (typeof categoryColors)[0]>,
    );

  // Stacked bar segments
  const stackedSegments = categoryItems.map((item) => ({
    ...item,
    color: categoryColorMap[item.key],
  }));

  return (
    <div className="max-lg:border-t lg:border-l">
      {!isLoaded ? (
        <div className="p-3 space-y-3 animate-pulse">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-10 w-36 rounded" />
          <Skeleton className="h-2 w-full rounded" />
          <Skeleton className="h-3 w-48 rounded" />
        </div>
      ) : (
        <div className="p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground">
              {t("income_ratio.title")}
            </p>
            {!isEditing && salary && (
              <div className="flex items-center">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary hover:underline transition-colors cursor-pointer mr-4 outline-solid outline-primary/20 rounded-md px-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                  {t("income_ratio.edit")}
                </button>
                <button
                  onClick={handleRemove}
                  className="text-[10px] uppercase font-bold text-destructive hover:underline cursor-pointer rounded-md px-1 outline-solid outline-primary/20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                  {t("income_ratio.remove")}
                </button>
              </div>
            )}
          </div>

          {/* Empty state */}
          {!salary && !isEditing && (
            <div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {t("income_ratio.intro")}
                <span className="block mt-0.25 italic opacity-70">
                  {t("income_ratio.disclaimer")}
                </span>
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="group w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 px-4 py-2.5 text-xs font-semibold text-primary transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99]">
                <span className="text-primary/60 group-hover:text-primary transition-colors">
                  +
                </span>
                {t("income_ratio.add_salary")}
              </button>
            </div>
          )}

          {/* Edit form */}
          {isEditing && (
            <form
              id="net-salary-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-2.5">
              <form.Field name="netSalary">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-4"
                        htmlFor={field.name}>
                        {t("income_ratio.form.label")}
                      </FieldLabel>
                      <Input
                        type="number"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={t("income_ratio.form.placeholder")}
                        autoComplete="on"
                        className="h-8"
                        aria-describedby="netSalaryError"
                      />
                      {isInvalid && (
                        <FieldError
                          id="netSalaryError"
                          errors={localizeFieldErrors(
                            field.state.meta.errors,
                            LOCALIZED_ERROR_MESSAGES,
                          )}
                          aria-live="polite"
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  form="net-salary-form"
                  size="sm"
                  className="flex-1 h-7 text-xs font-bold cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all dark:bg-primary/50"
                  disabled={!form.state.canSubmit || form.state.isSubmitting}>
                  {form.state.isSubmitting
                    ? t("income_ratio.form.saving")
                    : t("income_ratio.form.save")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs cursor-pointer"
                  onClick={() => setIsEditing(false)}
                  disabled={form.state.isSubmitting}>
                  {t("income_ratio.form.cancel")}
                </Button>
              </div>
            </form>
          )}

          {/* Ratio display */}
          {!isEditing && salary && (
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mt-1.5">
                    {t("income_ratio.stats.burn")}
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-black font-mono tabular-nums leading-none tracking-tighter transition-colors duration-500",
                      ratio > 10 ? "text-orange-500" : "text-primary",
                    )}>
                    {ratio.toFixed(2)}
                    <span className="text-2xl font-bold text-muted-foreground/80">
                      &nbsp;%
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                    {t("income_ratio.stats.salary")}
                  </p>
                  <p className="text-sm font-mono font-bold">
                    {priceFormatter(salary)}
                  </p>
                </div>
              </div>
              <div
                className="h-1 w-full bg-secondary rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.min(ratio, 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Ratio Progress Bar">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 ease-out rounded-full",
                    ratio > 10 ? "bg-orange-500" : "bg-primary",
                  )}
                  style={{ width: `${Math.min(ratio, 100)}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5",
                  ratio > 10
                    ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300"
                    : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
                )}>
                {ratio > 10
                  ? t("income_ratio.stats.feedback_high")
                  : t("income_ratio.stats.feedback_healthy")}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="mx-1 border-t border-solid border-border/60 " />

      {/* Category breakdown */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-muted-foreground">
            {t("breakdown.title")}
          </p>
          <div className="flex items-center bg-secondary rounded-full p-0.5 text-[10px] font-bold uppercase tracking-wider">
            <button
              onClick={() => setViewMode("Monthly")}
              className={cn(
                "px-3 py-1 rounded-full transition-all duration-200 cursor-pointer",
                viewMode === "Monthly"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/20",
              )}>
              {t("breakdown.monthly")}
            </button>
            <button
              onClick={() => setViewMode("Annual")}
              className={cn(
                "px-3 py-1 rounded-full transition-all duration-200 cursor-pointer",
                viewMode === "Annual"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/20",
              )}>
              {t("breakdown.annual")}
            </button>
          </div>
        </div>

        {categoryItems.length > 0 ? (
          <div className="space-y-1">
            <div className="flex h-2 w-full rounded-full overflow-hidden gap-px mb-5">
              {stackedSegments.map((seg) => (
                <div
                  key={seg.key}
                  className={cn(
                    "h-full transition-all duration-700",
                    seg.color.dot,
                  )}
                  style={{ width: `${seg.value}%` }}
                  title={`${seg.label}: ${seg.value}%`}
                />
              ))}
            </div>
            {categoryItems.map((item) => {
              const colors = categoryColorMap[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-3 py-0.5 group">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125",
                      colors.dot,
                    )}
                  />
                  <span className="flex-1 text-xs font-medium text-foreground/80 truncate">
                    {item.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground">
                    {item.money}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold tabular-nums w-10 text-right",
                      colors.text,
                    )}>
                    {item.value}%
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground py-4">
            {t("breakdown.no_results")}
          </p>
        )}
      </div>
    </div>
  );
}
