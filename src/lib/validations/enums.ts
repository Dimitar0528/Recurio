import * as z from "zod";

export const CATEGORY_VALUES = [
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
] as const;
export const BILLING_CYCLE_VALUES = ["Monthly", "Quaterly", "Yearly"] as const;
export const STATUS_VALUES = ["Active", "Paused", "Cancelled"] as const;
export const BILLING_ENTRY_MODE_VALUES = [
  "Include_current_cycle",
  "Start_from_next_cycle",
] as const;

export const billingCycleEnum = z.enum(BILLING_CYCLE_VALUES);
export const categoryEnum = z.enum(CATEGORY_VALUES, {
  error: () => ({ message: "CATEGORY_INVALID" }),
});
export const statusEnum = z.enum(STATUS_VALUES);
export const billingEntryModeEnum = z.enum(BILLING_ENTRY_MODE_VALUES);

export type Category = z.infer<typeof categoryEnum>;
export type BillingCycle = z.infer<typeof billingCycleEnum>;
export type Status = z.infer<typeof statusEnum>;
export type BillingEntryMode = z.infer<typeof billingEntryModeEnum>;