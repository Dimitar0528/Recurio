import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function dateFormatter(){
  const formatter = new Intl.DateTimeFormat("bg-BG", {
    month: "short",
    day: "numeric",
  });
  return formatter
}