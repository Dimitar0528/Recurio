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

interface SpendingCategory {
  name: Category;
  amount: number;
}

export interface SpendingDataForDateRange {
  label: string;
  spend: number;
  categories: SpendingCategory[];
}

function generateSpendingDataForDateRange(
  billingEvents: BillingEvent[],
  date_range_period: "month" | "year",
  locale?: Locale
): SpendingDataForDateRange[] {
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
    const category = billingEvent.subscriptionCategory;
    bucket.categories.set(
      category,
      (bucket.categories.get(category) || 0) + billingEvent.amount,
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