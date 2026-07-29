"use client";

import { useBudget } from "@/context/BudgetContext";
import { cn, localizeFieldErrors } from "@/lib/utils";
import {
  Category,
  CATEGORY_VALUES,
  goalTypeEnum,
} from "@/lib/validations/enums";
import { budgetSchema } from "@/lib/validations/schemas";
import { useUser } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import {
  Plus,
  Zap,
  Info,
  XCircle,
  Bell,
  Target,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type GoalType = "Category Budget" | "Spending Limit";

type BudgetGoal = {
  id: string;
  name: string;
  type: GoalType;
  category?: string;
  budgetAmount: number;
  currentSpend: number;
  targetSavings?: number;
  currentSaved?: number;
};

type AppNotification = {
  id: string;
  goalId: string;
  type: "active" | "warning" | "exceeded";
  message: string;
  createdAt: string;
};

type ActiveGoalsTableProps = {
  currentMonthlySpendByCategory:
    | {
        name: Category;
        amount: number;
      }[]
    | undefined;
  latestMontlySpend: number;
};

const formatRelativeTime = (createdAtStr: string, current: Date) => {
  const created = new Date(createdAtStr);
  const diffMs = current.getTime() - created.getTime();
  const diffMins = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export default function ActiveGoalsTable({
  currentMonthlySpendByCategory,
  latestMontlySpend,
}: ActiveGoalsTableProps) {
  const tValidation = useTranslations("Validation");
  const locale = useLocale();

  const { user } = useUser();
  const overallBudget = user?.unsafeMetadata.overall_budget;
  const { periodMultiplier } = useBudget();

  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isCategoryBudget, setIsCategoryBudget] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedGoals = localStorage.getItem("recurio_budget_goals");
      if (storedGoals) setGoals(JSON.parse(storedGoals));
      const storedNotifs = localStorage.getItem("recurio_budget_notifications");
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
    }
    setCurrentTime(new Date());
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentTime(new Date());
      },
      1000 * 60 * 30,
    ); // 30 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("recurio_budget_goals", JSON.stringify(goals));
    }
  }, [goals, hasMounted]);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem(
        "recurio_budget_notifications",
        JSON.stringify(notifications),
      );
    }
  }, [notifications, hasMounted]);

  const getProgressColor = (percent: number) => {
    if (overallBudget == null) return "bg-muted text-muted-foreground";
    if (percent >= 100)
      return "bg-red-500 text-red-500 border-red-200 dark:border-red-900/50";
    if (percent >= 80)
      return "bg-amber-500 text-amber-500 border-amber-200 dark:border-amber-900/50";
    return "bg-emerald-500 text-emerald-500 border-emerald-200 dark:border-emerald-900/50";
  };
  const LOCALIZED_ERROR_MESSAGES = {
    NAME_TOO_SHORT: tValidation("stringInput.min", { min: 3 }),
    NAME_TOO_LONG: tValidation("stringInput.max", { max: 50 }),
    INPUT_NUMBER_REQUIRED: tValidation("numberInput.min", {
      subject: locale === "bg" ? "Бюджетът" : "Budget",
    }),
    INPUT_NUMBER_NOT_POSITIVE: tValidation("numberInput.positive", {
      subject: locale === "bg" ? "Бюджетът" : "Budget",
    }),
    INPUT_NUMBER_DECIMALS: tValidation("numberInput.decimal_count", {
      subject: locale === "bg" ? "Бюджетът" : "Budget",
    }),
    CATEGORY_INVALID: tValidation("subscription.category.invalid"),
  };

  const form = useForm({
    defaultValues: {
      name: "",
      type: goalTypeEnum.options[0],
      category: "",
      target_amount: "",
    },
    validators: { onSubmit: budgetSchema },
    onSubmit: async ({ value }) => {
      const limit = parseFloat(value.target_amount);
      if (isNaN(limit)) return;
      let currentSpend = 0;
      switch (value.type) {
        case "Category Budget":
          if (currentMonthlySpendByCategory !== undefined && value.category) {
            currentSpend =
              currentMonthlySpendByCategory.find(
                (data) => data.name === value.category,
              )?.amount ?? 0;
          }
          break;
        case "Spending Limit":
          currentSpend = latestMontlySpend;
          break;
        default:
          currentSpend = 0;
      }

      const newGoal: BudgetGoal = {
        id: "g_" + Date.now(),
        name: value.name,
        type: value.type,
        category:
          value.type === "Category Budget" && value.category
            ? (value.category as Category)
            : undefined,
        budgetAmount: limit,
        currentSpend,
      };

      setGoals((prev) => [...prev, newGoal]);
      setNotifications((prev) => [
        {
          id: "notif_active_" + Date.now(),
          goalId: newGoal.id,
          type: "active",
          message: ` Budget tracking active and stable for "${newGoal.name}".`,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setIsAddingGoal(false);
      form.reset();
    },
  });

  const handleDeleteGoal = (id: string) => {
    const goalToDelete = goals.find((g) => g.id === id);
    setGoals(goals.filter((g) => g.id !== id));
    if (goalToDelete) {
      setNotifications((prev) => [
        {
          id: "notif_delete_" + Date.now(),
          goalId: id,
          type: "active",
          message: ` Budget tracking removed for "${goalToDelete.name}".`,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  useEffect(() => {
    if (!hasMounted || goals.length === 0) return;
    setNotifications((prev) => {
      let updated = [...prev];
      let hasChanged = false;

      goals.forEach((goal) => {
        const adjustedLimit = goal.budgetAmount * periodMultiplier;
        const adjustedSpend = goal.currentSpend * periodMultiplier;
        const percent =
          adjustedLimit > 0 ? (adjustedSpend / adjustedLimit) * 100 : 0;
        if (percent >= 100) {
          const alreadyNotified = prev.some(
            (n) => n.goalId === goal.id && n.type === "exceeded",
          );
          if (!alreadyNotified) {
            updated.unshift({
              id: `notif_exceeded_${goal.id}_${Date.now()}`,
              goalId: goal.id,
              type: "exceeded",
              message: ` Spending limit for "${goal.name}" exceeded.`,
              createdAt: new Date().toISOString(),
            });
            hasChanged = true;
          }
        } else if (percent >= 80) {
          const alreadyNotified = prev.some(
            (n) => n.goalId === goal.id && n.type === "warning",
          );
          if (!alreadyNotified) {
            updated.unshift({
              id: `notif_warn_${goal.id}_${Date.now()}`,
              goalId: goal.id,
              type: "warning",
              message: `80% utilization threshold hit on "${goal.name}".`,
              createdAt: new Date().toISOString(),
            });
            hasChanged = true;
          }
        }
      });
      return hasChanged ? updated : prev;
    });
  }, [goals, periodMultiplier, hasMounted]);

  const dynamicSuggestions = useMemo(() => {
    const list: Array<{
      id: string;
      type: "danger" | "warning" | "success";
      badgeText: string;
      description: string;
      icon: React.ReactNode;
    }> = [];
    goals.forEach((goal) => {
      const adjustedLimit = goal.budgetAmount * periodMultiplier;
      const adjustedSpend = goal.currentSpend * periodMultiplier;
      const percent =
        adjustedLimit > 0 ? (adjustedSpend / adjustedLimit) * 100 : 0;
      if (percent >= 100) {
        const exceeded = adjustedSpend - adjustedLimit;
        list.push({
          id: `suggest-over-${goal.id}`,
          type: "danger",
          badgeText:
            goal.type === "Category Budget"
              ? `${goal.category} Over-Budget`
              : "Limit Exceeded",
          description: `"${goal.name}" has run over by €${exceeded.toFixed(2)}. Review your active items in this category.`,
          icon: <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />,
        });
      } else if (percent >= 80) {
        const margin = adjustedLimit - adjustedSpend;
        list.push({
          id: `suggest-near-${goal.id}`,
          type: "warning",
          badgeText: "Close to limit",
          description: `"${goal.name}" is reaching its cap. You have only €${margin.toFixed(2)} remaining margin.`,
          icon: (
            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
          ),
        });
      } else if (percent < 50 && adjustedSpend > 0) {
        list.push({
          id: `suggest-healthy-${goal.id}`,
          type: "success",
          badgeText: "Healthy Margin",
          description: `Great budget optimization on "${goal.name}"! Spending sits comfortably under half of your threshold.`,
          icon: <Info className="size-4 text-emerald-500 shrink-0 mt-0.5" />,
        });
      }
    });
    return list;
  }, [goals, periodMultiplier]);

  const displayTime = (createdAtStr: string) => {
    if (!currentTime) return "Just now";
    return formatRelativeTime(createdAtStr, currentTime);
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-border/80">
      <div className="lg:col-span-7 py-6 lg:pr-8 lg:border-r border-border/60">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight italic">
              Active Threshold Goals ({goals.length})
            </h3>
            <p className="text-xs text-muted-foreground">
              Assigned budget limits mapped across individual subscription
              partitions.
            </p>
          </div>
          <button
            onClick={() => setIsAddingGoal(!isAddingGoal)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-foreground hover:bg-muted text-xs font-black uppercase transition-all duration-150 cursor-pointer rounded-md">
            {isAddingGoal ? (
              <Minus className="size-3.5" />
            ) : (
              <Plus className="size-3.5" />
            )}
            {isAddingGoal ? "Close Form" : "Create Goal"}
          </button>
        </div>
        {isAddingGoal && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="border-b border-border/80 pb-4 mb-4 space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="w-full">
                      <FieldLabel className="text-xs" htmlFor={field.name}>
                        Goal Name
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          type="text"
                          id={field.name}
                          name={field.name}
                          placeholder="e.g. Media Limit, Cloud Hosting"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full bg-background border border-border rounded-none px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {isInvalid && (
                          <FieldError
                            errors={localizeFieldErrors(
                              field.state.meta.errors,
                              LOCALIZED_ERROR_MESSAGES,
                            )}
                          />
                        )}
                      </FieldContent>
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="type">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="w-full">
                      <FieldLabel className="text-xs" htmlFor={field.name}>
                        Goal Type
                      </FieldLabel>
                      <FieldContent>
                        <Select
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(value) => {
                            if (value) field.handleChange(value);
                            if (value !== "Category Budget") {
                              form.setFieldValue("category", "");
                              setIsCategoryBudget(false);
                            } else {
                              setIsCategoryBudget(true);
                            }
                          }}>
                          <SelectTrigger
                            id={field.name}
                            className="w-full bg-background border border-border rounded-none px-3 py-2 text-xs focus:outline-none"
                            aria-describedby="statusError">
                            <SelectValue>{field.state.value}</SelectValue>
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="" disabled hidden>
                              Select a category
                            </SelectItem>
                            {goalTypeEnum.options.map((goalType) => (
                              <SelectItem key={goalType} value={goalType}>
                                {goalType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError
                            errors={localizeFieldErrors(
                              field.state.meta.errors,
                              LOCALIZED_ERROR_MESSAGES,
                            )}
                          />
                        )}
                      </FieldContent>
                    </Field>
                  );
                }}
              </form.Field>

              {isCategoryBudget && (
                <form.Field name="category">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="w-full">
                        <FieldLabel className="text-xs" htmlFor={field.name}>
                          Category
                        </FieldLabel>
                        <FieldContent>
                          <Select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onValueChange={(value) => {
                              if (value) field.handleChange(value);
                            }}>
                            <SelectTrigger
                              id={field.name}
                              className="w-full bg-background border border-border rounded-none px-3 py-2 text-xs focus:outline-none"
                              aria-describedby="statusError">
                              <SelectValue
                                placeholder={tValidation(
                                  "subscription.category.placeholder",
                                )}></SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                              {CATEGORY_VALUES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError
                              errors={localizeFieldErrors(
                                field.state.meta.errors,
                                LOCALIZED_ERROR_MESSAGES,
                              )}
                            />
                          )}
                        </FieldContent>
                      </Field>
                    );
                  }}
                </form.Field>
              )}

              <form.Field name="target_amount">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="w-full">
                      <FieldLabel className="text-xs" htmlFor={field.name}>
                        Target Limit Amount (€)
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          type="number"
                          id={field.name}
                          name={field.name}
                          placeholder="e.g. 50"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full bg-background border border-border rounded-none px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {isInvalid && (
                          <FieldError
                            errors={localizeFieldErrors(
                              field.state.meta.errors,
                              LOCALIZED_ERROR_MESSAGES,
                            )}
                          />
                        )}
                      </FieldContent>
                    </Field>
                  );
                }}
              </form.Field>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-foreground text-background text-xs font-black uppercase px-4 py-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                {form.state.isSubmitting ? "..." : "Create"}
              </Button>
            </div>
          </form>
        )}

        {goals.length === 0 ? (
          <div className="py-4 px-2 border border-dashed border-border/80 text-center flex flex-col items-center justify-end space-y-3 bg-muted/10">
            <div className="size-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
              <Target className="size-5" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                No Active Goals Configured
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Set custom category limits, spending thresholds, or savings
                targets to monitor your recurring costs closely.
              </p>
            </div>
            <button
              onClick={() => setIsAddingGoal(true)}
              className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-black uppercase hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer rounded-md">
              <Plus className="size-3.5" />
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border/40 border-t border-b border-border/60">
            {goals.map((g) => {
              const adjustedLimit = g.budgetAmount * periodMultiplier;
              const adjustedSpend = g.currentSpend * periodMultiplier;
              const percent = (adjustedSpend / adjustedLimit) * 100;
              return (
                <div
                  key={g.id}
                  className="py-4 flex flex-col justify-between space-y-3 relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black uppercase text-primary block">
                        {g.type}
                      </span>
                      <h4 className="text-sm font-bold text-foreground">
                        {g.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "text-xs font-bold font-mono",
                          percent > 100 ? "text-red-500" : "text-foreground",
                        )}>
                        €{adjustedSpend} / €{adjustedLimit}
                      </span>
                      <button
                        onClick={() => handleDeleteGoal(g.id)}
                        className="text-[10px] text-destructive hover:underline cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-secondary overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-700",
                          getProgressColor(percent),
                        )}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] uppercase tracking-wider font-bold text-muted-foreground">
                      <span>{Math.round(percent)}% used</span>
                      <span>
                        {adjustedSpend > adjustedLimit
                          ? `Exceeded by €${Math.abs(adjustedSpend - adjustedLimit).toFixed(2)}`
                          : `€${Math.abs(adjustedLimit - adjustedSpend).toFixed(2)} remaining margin`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="lg:col-span-5 py-8 lg:pl-8 flex flex-col divide-y divide-border/60">
        <div className="pb-8">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="size-4 text-amber-500" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              Suggestions
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Insights based on active partitions and price optimization profiles.
          </p>
          {dynamicSuggestions.length === 0 ? (
            <div className="py-4 px-2 border border-dashed border-border/80 text-center flex flex-col items-center justify-center space-y-2 bg-muted/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                No Insights Available
              </h4>
            </div>
          ) : (
            <div className="space-y-4">
              {dynamicSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-start gap-3">
                  {suggestion.icon}
                  <div className="space-y-0.5">
                    <span
                      className={cn(
                        "text-[9px] font-black uppercase block",
                        suggestion.type === "danger"
                          ? "text-red-600 dark:text-red-400"
                          : suggestion.type === "warning"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400",
                      )}>
                      {suggestion.badgeText}
                    </span>
                    <p className="text-xs text-foreground font-medium">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-8">
          <div className="flex items-center gap-1.5 mb-2">
            <Bell className="size-4 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              Notification Activity
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Real-time threshold alert records on subscription spending limits.
          </p>
          {notifications.length === 0 ? (
            <div className="py-4 px-2 border border-dashed border-border/80 text-center flex flex-col items-center justify-center space-y-2 bg-muted/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                No Activity Logged
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Real-time alerts regarding budget limits, 80% threshold alerts,
                and renewals will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex justify-between items-center text-xs pb-2 border-b border-border/30">
                  <span className="font-medium text-foreground/80">
                    {notif.message}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono">
                    {displayTime(notif.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
