import { clsx, type ClassValue } from "clsx"
import { Locale } from "next-intl";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function dateFormatter(date: Date | number, locale: Locale){
  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date);
  return formattedDate
}

export function priceFormatter(price: number){
   const formattedPrice = new Intl.NumberFormat("bg-BG", {
     style: "currency",
     currency: "EUR",
   }).format(price);
   return formattedPrice
}