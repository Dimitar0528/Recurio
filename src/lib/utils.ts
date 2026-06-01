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
  yearFormat?: "numeric" | "2-digit" | undefined
) {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: yearFormat && yearFormat
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
  date_range_period: "month" | "year",
) {
  if (date_range_period === "month") {
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
// others
export function priceFormatter(price: number) {
  const formattedPrice = new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
  }).format(price);
  return formattedPrice;
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

export const categoryColors = [
  { hex: "#8B5CF6", dot: "bg-violet-500", text: "text-violet-500" },
  { hex: "#0EA5E9", dot: "bg-sky-500", text: "text-sky-500" },
  { hex: "#10B981", dot: "bg-emerald-500", text: "text-emerald-500" }, 
  { hex: "#F59E0B", dot: "bg-amber-500", text: "text-amber-500" }, 
  { hex: "#F43F5E", dot: "bg-rose-500", text: "text-rose-500" },
  { hex: "#06B6D4", dot: "bg-cyan-500", text: "text-cyan-500" }, 
  { hex: "#D946EF", dot: "bg-fuchsia-500", text: "text-fuchsia-500" },
  { hex: "#84CC16", dot: "bg-lime-500", text: "text-lime-500" },
  { hex: "#F97316", dot: "bg-orange-500", text: "text-orange-500" },
  { hex: "#14B8A6", dot: "bg-teal-500", text: "text-teal-500" }
];