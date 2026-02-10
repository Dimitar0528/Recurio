import { clsx, type ClassValue } from "clsx"
import { Locale } from "next-intl";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

export function dateFormatter(date: Date | number, locale: Locale, yearFormat?: 'numeric'){
  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: yearFormat ? yearFormat : undefined,
  }).format(date);
  return formattedDate
}

export function setDateHoursToZero(date: Date) {
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

type AdvanceDateByOptions = {
  advanceMonthNumber?: number;
  advanceYearNumber?: number;
};
export function advanceDateWithClamp(
  date: Date, advanceDateOptions: AdvanceDateByOptions,
) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Get last day of the target month by creating a date for the 0th day
  // of the next month which returns the last day current month
  const lastDayOfTargetMonth = new Date(year, month + 2, 0).getDate();

  const clampedDay = Math.min(day, lastDayOfTargetMonth);
  const {advanceMonthNumber, advanceYearNumber} = advanceDateOptions;
  // Set hours to 12 to not have date discreptancy
  return new Date(
    advanceYearNumber ? year + advanceYearNumber : year,
    advanceMonthNumber ? month + advanceMonthNumber : month,
    clampedDay,
    12,
  );
}

export function getCurrentDateRange(
  date = new Date(),
  period: "month" | "year",
) {
  if (period === "month") {
    const start = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
    const end = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
    return { start, end };
  }

  const start = new Date(date.getUTCFullYear(), 0, 1);
  const end = new Date(date.getUTCFullYear() + 1, 0, 1);
  return { start, end };
}

export function priceFormatter(price: number){
   const formattedPrice = new Intl.NumberFormat("bg-BG", {
     style: "currency",
     currency: "EUR",
   }).format(price);
   return formattedPrice
}
