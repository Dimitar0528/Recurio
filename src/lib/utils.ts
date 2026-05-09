import { clsx, type ClassValue } from "clsx";
import { Locale } from "next-intl";
import { twMerge } from "tailwind-merge";
import { BillingCycle, Status } from "@/lib/validations/enums";
import {
  startOfDay,
  addMonths,
  addYears,
  setHours,
  isWithinInterval,
  subDays,
  addDays,
} from "date-fns";
import { Subscription } from "./validations/schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// date formatting
export function dateFormatter(
  date: Date | number,
  locale: Locale,
  yearFormat?: "numeric",
) {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: yearFormat ? yearFormat : undefined,
  }).format(date);
  return formattedDate;
}

type AdvanceDateByOptions = {
  advanceMonthNumber?: number;
  advanceYearNumber?: number;
};
export function advanceDateWithClamp(
  date: Date,
  advanceDateOptions: AdvanceDateByOptions,
) {
  const { advanceMonthNumber = 0, advanceYearNumber = 0 } = advanceDateOptions;
  let newDate = addYears(date, advanceYearNumber);
  newDate = addMonths(newDate, advanceMonthNumber);
  return setHours(newDate, 12);
}

export function getCurrentDateRange(
  date = new Date(),
  period: "month" | "year",
) {
  if (period === "month") {
    const start = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
    );
    const end = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1),
    );
    return { start, end };
  }

  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const end = new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 1));
  return { start, end };
}

export function priceFormatter(price: number) {
  const formattedPrice = new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
  }).format(price);
  return formattedPrice;
}

// renewal rules
const MANUAL_RENEWAL_GRACE_DAYS = 7;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function isDue(nextBilling: Date, now = new Date()) {
  return startOfDay(new Date(nextBilling)) <= startOfDay(new Date(now));
}

export function canGenerateCharge(status: Status) {
  return status === "Active";
}

export function getNextBillingDateFromCycle(
  currentBillingDate: Date,
  billingCycle: BillingCycle,
) {
  if (billingCycle === "Annual") {
    return advanceDateWithClamp(currentBillingDate, { advanceYearNumber: 1 });
  }
  return advanceDateWithClamp(currentBillingDate, { advanceMonthNumber: 1 });
}

export function getManualRenewalGraceDate(nextBilling: Date) {
  return new Date(
    nextBilling.getTime() + MANUAL_RENEWAL_GRACE_DAYS * DAY_IN_MS,
  );
}

export function isManualGraceExpired(graceUntil: Date, now = new Date()) {
  return startOfDay(new Date(graceUntil)) < startOfDay(new Date(now));
}

export function getSubscriptionsWithinTimeInterval(
  subscriptions: Subscription[],
  mode: "upcoming-7-days" | "previous-7-days",
) {
  const today = startOfDay(new Date());
  const interval =
    mode === "upcoming-7-days"
      ? {
          start: today,
          end: addDays(today, 7),
        }
      : {
          start: subDays(today, 7),
          end: today,
        };
  const subscriptionsWithinTimeInterval = subscriptions.filter((sub) => {
    if (mode === "upcoming-7-days" && sub.status !== "Active") {
      return false;
    }
    const dateToCheck =
      mode === "upcoming-7-days"
        ? new Date(sub.nextBilling)
        : sub.lastRenewedAt;

    return isWithinInterval(startOfDay(dateToCheck), interval);
  });
  return subscriptionsWithinTimeInterval;
}