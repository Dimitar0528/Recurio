"use client";

import { useEffect, useState } from "react";
import { cn, priceFormatter } from "@/lib/utils";
import { Subscription } from "@/lib/validations/form";
import { PieChart } from "lucide-react";
import { Button } from "../ui/button";
import { categoryEnum, type BillingCycle, type Category } from "@/lib/validations/enum";
import { Input } from "../ui/input";
import { useUser } from "@clerk/nextjs";

import { netSalarySchema } from "@/lib/validations/form";
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
  const t = useTranslations("dashboard_page.insights_sidebar_component");
  const { user, isLoaded } = useUser();
  const [salary, setSalary] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    const clerkSalary = user?.unsafeMetadata?.net_salary;
    if (typeof clerkSalary === "number") {
      setSalary(clerkSalary);
    }
  }, [isLoaded, user]);

  const ratio = salary && salary > 0 ? (monthlySpend / salary) * 100 : 0;

  const form = useForm({
    defaultValues: {
      netSalary: salary?.toFixed(2) ?? "",
    },
    validators: {
      onSubmit: netSalarySchema,
    },
    onSubmit: async ({ value }) => {
      if (!user) return;
      const result = netSalarySchema.safeParse(value);
      if (!result.success) return toast.error(result.error.message);
      const parsedNetSalary = result.data.netSalary;
      try {
        await user.update({
          unsafeMetadata: {
            net_salary: parsedNetSalary,
          },
        });
        setSalary(parsedNetSalary);
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to update salary:", err);
      }
    },
  })

  const handleRemove = async () => {
    if (!user) return;
    try {
      await user.update({
        unsafeMetadata: {
          net_salary: null,
        },
      });
      setSalary(null);
    } catch (err) {
      console.error("Failed to remove salary:", err);
    }
  };

  const [viewMode, setViewMode] = useState<BillingCycle>("Monthly");

  const aggregatedByCategory = data
    .filter((subscription) => subscription.status === "Active")
    .reduce<Record<Category, number>>(
      (acc, { price, billingCycle, category }) => {
        let normalizedAmount = price;

        if (viewMode === "Monthly") {
          normalizedAmount = billingCycle === "Annual" ? price / 12 : price;
        } else {
          normalizedAmount = billingCycle === "Monthly" ? price * 12 : price;
        }

        acc[category] = (acc[category] ?? 0) + normalizedAmount;
        return acc;
      },
      {} as Record<Category, number>,
    );
  const totalSpend = Object.values(aggregatedByCategory).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  const categoryItems = Object.entries(aggregatedByCategory).map(
    ([category, amount]) => {
      const percentage =
        totalSpend === 0 ? 0 : ((amount / totalSpend) * 100).toFixed(1);
        const typedCategory = category as Category
      return {
        key: typedCategory,
        label: tReusable(`categories.${typedCategory}`),
        value: percentage,
        money: priceFormatter(amount),
      };
    },
  );

  const allCategories = Object.values(categoryEnum.enum);
  const baseColors = [
    "bg-purple-500",
    "bg-primary",
    "bg-blue-500",
    "bg-zinc-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-cyan-500",
    "bg-red-500",
  ];
   const categoryColors: Record<Category, string> = allCategories.reduce(
    (acc, category, index) => {
      acc[category] = baseColors[index % baseColors.length];
      return acc;
    },
    {} as Record<Category, string>,
  );

  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="bg-card border border-border rounded-2xl p-3">
        {!isLoaded ? (
          <div className="space-y-2 animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-4 w-32 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-7 w-full rounded" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-1">
              <h3 className="text-sm font-bold flex items-center gap-1">
                {t("income_ratio.title")}
              </h3>
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

            {!salary && !isEditing && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("income_ratio.intro")}{" "}
                  <span className="block italic font-bold">
                    {t("income_ratio.disclaimer")}
                  </span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="w-full text-xs font-bold border-dashed border-primary/30 hover:border-primary/60 text-primary cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {t("income_ratio.add_salary")}
                </Button>
              </div>
            )}

            {isEditing && (
              <form
                id="net-salary-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="space-y-3">
                <form.Field name="netSalary">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground"
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
                          className="h-6"
                          aria-describedby="netSalaryError"
                        />
                        {isInvalid && (
                          <FieldError
                            id="netSalaryError"
                            errors={field.state.meta.errors}
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
                    className="flex-1 text-xs font-bold h-6.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                    disabled={!form.state.canSubmit || form.state.isSubmitting}>
                    {form.state.isSubmitting
                      ? t("income_ratio.form.saving")
                      : t("income_ratio.form.save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6.5 text-xs cursor-pointer"
                    onClick={() => setIsEditing(false)}
                    disabled={form.state.isSubmitting}>
                    {t("income_ratio.form.cancel")}
                  </Button>
                </div>
              </form>
            )}

            {!isEditing && salary && (
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400 tracking-widest">
                      {t("income_ratio.stats.burn")}
                    </p>
                    <p className="text-md font-mono font-bold">
                      {ratio.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400 tracking-widest">
                      {t("income_ratio.stats.salary")}
                    </p>
                    <p className="text-md font-mono uppercase font-bold">
                      {priceFormatter(salary)}
                    </p>
                  </div>
                </div>
                <div
                  className="h-1.5 w-full bg-secondary rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={Math.min(ratio, 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}>
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: `${Math.min(ratio, 100)}%` }}
                  />
                </div>
                <p
                  className={cn(
                    "text-[11px] inline text-muted-foreground leading-tight p-0.25 px-2 rounded-lg",
                    ratio > 10
                      ? "bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200"
                      : "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200",
                  )}>
                  {ratio > 10
                    ? t("income_ratio.stats.feedback_high")
                    : t("income_ratio.stats.feedback_healthy")}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <PieChart size={16} className="text-primary" />
            {t("breakdown.title")}
          </h3>
          <div className="flex bg-secondary rounded-md text-xs font-bold outline-solid outline-primary/20">
            <Button
              onClick={() => setViewMode("Monthly")}
              className={` rounded-lg transition-all cursor-pointer hover:bg-primary hover:text-background dark:hover:text-foreground active:scale-[0.98] ${
                viewMode === "Monthly"
                  ? "bg-primary/30 shadow text-foreground"
                  : "text-gray-700 dark:text-gray-300 bg-secondary"
              }`}>
              {t("breakdown.monthly")}
            </Button>
            <Button
              onClick={() => setViewMode("Annual")}
              className={` rounded-lg transition-all cursor-pointer hover:bg-primary hover:text-background dark:hover:text-foreground active:scale-[0.98] ${
                viewMode === "Annual"
                  ? "bg-primary/30 shadow text-foreground"
                  : "text-gray-700 dark:text-gray-300 bg-secondary"
              }`}>
              {t("breakdown.annual")}
            </Button>
          </div>
        </div>
        <div className="space-y-5">
          {categoryItems.length > 0 ? (
            categoryItems.map((item) => (
              <div key={item.key}>
                <div className="flex justify-between text-xs mb-2 items-baseline">
                  <span className="text-gray-600 dark:text-gray-300 font-bold">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">
                      {item.money}
                    </span>
                    <span className="text-muted-foreground text-[12px]">
                      ({item.value}%)
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      categoryColors[item.key] ?? "bg-muted"
                    } transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm">
              {t("breakdown.no_results")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
