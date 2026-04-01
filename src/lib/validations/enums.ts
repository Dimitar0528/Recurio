import * as z from "zod";
import { TFunction } from "./schemas";

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
export const BILLING_CYCLE_VALUES = ["Monthly", "Annual"] as const;
export const STATUS_VALUES = ["Active", "Paused", "Cancelled"] as const;

export const categoryEnum = z.enum(CATEGORY_VALUES);
export const billingCycleEnum = z.enum(BILLING_CYCLE_VALUES);

export const i18nCategoryEnum = (t: TFunction) =>
  z.enum(CATEGORY_VALUES, { error: t("subscription.category.invalid") });
export const statusEnum = z.enum(STATUS_VALUES);

export type Category = z.infer<typeof categoryEnum>;
export type BillingCycle = z.infer<typeof billingCycleEnum>;
export type Status = z.infer<typeof statusEnum>