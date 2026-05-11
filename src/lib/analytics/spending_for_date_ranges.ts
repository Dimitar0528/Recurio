import {
  differenceInMonths,
  differenceInYears,
  eachMonthOfInterval,
  subMonths,
  eachYearOfInterval,
  subYears,
  format,
} from "date-fns";
import { BillingEvent } from "../validations/schemas";

export type SpendingDataForDateRange = {
  label: string;
  spend: number;
};

function generateSpendingDataForDateRange(
  billingEvents: BillingEvent[],
  date_range_period: "month" | "year",
) {
  if (billingEvents.length === 0) return [];
  const now = new Date();
  const firstBillingDate = billingEvents.at(-1)?.chargedAt ?? now;

  const isMonthly = date_range_period === "month";
  const activePeriods = isMonthly
    ? differenceInMonths(now, firstBillingDate)
    : differenceInYears(now, firstBillingDate);
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

  return intervals.map((intervalDate) => {
    const total = billingEvents.reduce((acc, billingEvent) => {
      const chargedAt = billingEvent.chargedAt;

      const matches = isMonthly
        ? chargedAt.getMonth() === intervalDate.getMonth() &&
          chargedAt.getFullYear() === intervalDate.getFullYear()
        : chargedAt.getFullYear() === intervalDate.getFullYear();

      if (!matches) return acc;

      return acc + billingEvent.amount;
    }, 0);

    return {
      label: format(intervalDate, isMonthly ? "MMM" : "yyyy"),
      spend: total,
    };
  });
}

export async function getSpendingDataForDateRange(
  billingEvents: BillingEvent[],
) {
  const monthlySpendData = generateSpendingDataForDateRange(
    billingEvents,
    "month",
  );
  const yearlySpendData = generateSpendingDataForDateRange(
    billingEvents,
    "year",
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