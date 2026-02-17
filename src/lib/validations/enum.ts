import * as z from "zod";
export const billingCycleEnum = z.enum(["Monthly", "Annual"]);
export const categoryEnum = z.enum(
  [
    "Entertainment",
    "Software",
    "Utilities",
    "Productivity",
    "Cloud & Infrastructure",
    "Finance",
    "Health & Fitness",
    "Education",
    "News & Media",
    "Other",
  ],
  { error: "Choose a valid category" },
);
export const statusEnum = z.enum(["Active", "Paused", "Cancelled"]);
export type BillingCycle = z.infer<typeof billingCycleEnum>;
export type Category = z.infer<typeof categoryEnum>;