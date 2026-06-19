import {
  differenceInMonths,
  differenceInYears,
  eachMonthOfInterval,
  subMonths,
  eachYearOfInterval,
  subYears,
  format,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { BillingEvent } from "../validations/schemas";
import { Category } from "../validations/enums";
import { bg, enUS } from "date-fns/locale";
import { Locale } from "next-intl";

export type SpendingDataForDateRange = {
  label: string;
  spend: number;
  categories: { name: Category; amount: number }[];
  subscriptions: { name: string; amount: number, count: number }[];
};

function generateSpendingDataForDateRange(
  billingEvents: BillingEvent[],
  date_range_period: "month" | "year",
  locale?: Locale
) {
  if (billingEvents.length === 0) return [];
  const now = new Date();
  const firstBillingDate = billingEvents.at(-1)?.chargedAt ?? now;
  const isMonthly = date_range_period === "month";
  const activePeriods = isMonthly
    ? differenceInMonths(now, startOfMonth(firstBillingDate))
    : differenceInYears(now, startOfYear(firstBillingDate));
  const maxViewWindow = isMonthly ? 6 : 3;
  const visiblePeriods =
    activePeriods < maxViewWindow ? activePeriods : maxViewWindow - 1;
  const intervals = isMonthly
    ? eachMonthOfInterval({
        start: subMonths(now, visiblePeriods),
        end: now,
      })
    : eachYearOfInterval({
        start: subYears(now, visiblePeriods),
        end: now,
      });

  // Create buckets
  const buckets = new Map<
    string,
    {
      label: string;
      spend: number;
      categories: Map<Category, number>;
      subscriptions: Map<string, { amount: number; count: number }>;
    }
  >();

  intervals.forEach((intervalDate) => {
    const key = isMonthly
      ? format(intervalDate, "yyyy-MM")
      : format(intervalDate, "yyyy");
    buckets.set(key, {
      label: format(intervalDate, isMonthly ? "MMM" : "yyyy", {
        locale: locale ? (locale === "bg" ? bg : enUS) : undefined,
      }),
      spend: 0,
      categories: new Map(),
      subscriptions: new Map(),
    });
  });
  // Single pass through billing events
  billingEvents.forEach((billingEvent) => {
    const chargedAt = billingEvent.chargedAt;

    const key = isMonthly
      ? format(chargedAt, "yyyy-MM")
      : format(chargedAt, "yyyy");
    const bucket = buckets.get(key);
    if (!bucket) return;
    bucket.spend += billingEvent.amount;
    const {subscriptionName, subscriptionCategory} = billingEvent;
    const existingSubData = bucket.subscriptions.get(subscriptionName) || {
      amount: 0,
      count: 0,
    };
    bucket.subscriptions.set(subscriptionName, {
      amount: existingSubData.amount + billingEvent.amount,
      count: existingSubData.count + 1,
    });
    bucket.categories.set(
      subscriptionCategory,
      (bucket.categories.get(subscriptionCategory) || 0) + billingEvent.amount,
    );
  });
  return Array.from(buckets.values()).map((bucket) => ({
    label: bucket.label,
    spend: bucket.spend,

    categories: Array.from(bucket.categories.entries()).map(
      ([name, amount]) => ({
        name,
        amount,
      }),
    ),

    subscriptions: Array.from(bucket.subscriptions.entries()).map(
      ([name, data]) => ({
        name,
        amount: data.amount,
        count: data.count,
      }),
    ),
  }));
}

export async function getSpendingDataForDateRange(
  billingEvents: BillingEvent[],
  locale?: Locale
) {
  const monthlySpendData = generateSpendingDataForDateRange(
    billingEvents,
    "month",
    locale
  );
  const yearlySpendData = generateSpendingDataForDateRange(
    billingEvents,
    "year",
    locale
  );
  return {
    monthlySpendData,
    yearlySpendData,
  };
}

export function compareCurrentVsPreviousSpend(spendData: SpendingDataForDateRange[]) {
  const latestSpend = spendData.at(-1)?.spend ?? 0;
  const previousSpend = spendData.at(-2)?.spend ?? 0;
  const growthRate =
    previousSpend === 0
      ? 0
      : ((latestSpend - previousSpend) / previousSpend) * 100;

  return growthRate;
}