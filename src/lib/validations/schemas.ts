import * as z from "zod";
import {
  categoryEnum,
  billingCycleEnum,
  statusEnum,
  billingEntryModeEnum,
} from "@/lib/validations/enums";
import type { useTranslations } from "next-intl";
import { startOfDay } from "date-fns";
import { changeReasonEnum } from "@/lib/validations/enums";

export type ValidationTFunction = ReturnType<typeof useTranslations<"Validation">>;

const subscriptionErrorCodes = {
  NAME_TOO_SHORT: "NAME_TOO_SHORT",
  NAME_TOO_LONG: "NAME_TOO_LONG",
  PRICE_REQUIRED: "PRICE_REQUIRED",
  PRICE_NOT_POSITIVE: "PRICE_NOT_POSITIVE",
  PRICE_DECIMALS: "PRICE_DECIMALS",
  NEXT_BILLING_REQUIRED: "NEXT_BILLING_REQUIRED",
  NEXT_BILLING_INVALID: "NEXT_BILLING_INVALID",
  NEXT_BILLING_PAST: "NEXT_BILLING_PAST",
} as const;

const netSalaryErrorCodes = {
  NET_SALARY_REQUIRED: "NET_SALARY_REQUIRED",
  NET_SALARY_NOT_POSITIVE: "NET_SALARY_NOT_POSITIVE",
  NET_SALARY_DECIMALS: "NET_SALARY_DECIMALS",
};
const customNotificationEmailErrorCodes = {
  CUSTOM_NOTIFICATION_EMAIL_REQUIRED: "CUSTOM_NOTIFICATION_EMAIL_REQUIRED",
};

export const subscriptionBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      error: subscriptionErrorCodes.NAME_TOO_SHORT,
    })
    .max(50, {
      error: subscriptionErrorCodes.NAME_TOO_LONG,
    }),
  category: categoryEnum,
  price: z.number().positive().gt(0),
  billingCycle: billingCycleEnum,
  nextBilling: z.date(),
  autoRenew: z.boolean(),
  status: statusEnum,
  billingEntryMode: billingEntryModeEnum.optional(),
});

export const subscriptionFormSchema = subscriptionBaseSchema.extend({
  price: z
    .string()
    .trim()
    .min(1, {
      error: subscriptionErrorCodes.PRICE_REQUIRED,
    })
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value > 0, {
      error: subscriptionErrorCodes.PRICE_NOT_POSITIVE,
    })
    .refine((value) => Number(value.toFixed(2)) === value, {
      error: subscriptionErrorCodes.PRICE_DECIMALS,
    }),

  nextBilling: z
    .string()
    .min(1, {
      error: subscriptionErrorCodes.NEXT_BILLING_REQUIRED,
    })
    .transform((value) => new Date(value))
    .refine((date) => !isNaN(date.getTime()), {
      error: subscriptionErrorCodes.NEXT_BILLING_INVALID,
    })
    .refine((date) => date >= startOfDay(new Date()), {
      error: subscriptionErrorCodes.NEXT_BILLING_PAST,
    }),
});

export const subscriptionSchema = subscriptionBaseSchema.extend({
  id: z.uuid(),
  createdAt: z.date(),
  statusChangedAt: z.date(),
  lastRenewedAt: z.date(),
  manualRenewalGraceUntil: z.date().nullable().optional(),
  reminderSentAt: z.date().nullable().optional(),
});

export const billingEventSchema = z.object({
  id: z.uuid(),
  amount: z.number().positive().gt(0),
  chargedAt: z.date(),
  source: z.enum(["initial", "auto", "manual"]),
  subscriptionName: z.string().min(3).max(50),
  subscriptionCategory: categoryEnum
});

export const priceHistorySchema = z.object({
  id: z.uuid(),
  oldPrice: z.number().positive().gt(0),
  newPrice: z.number().positive().gt(0),
  changeReason: changeReasonEnum,
  createdAt: z.date(),
});

export const netSalarySchema = z.object({
  netSalary: z
    .string()
    .trim()
    .min(1, { error: netSalaryErrorCodes.NET_SALARY_REQUIRED })
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value > 0, {
      error: netSalaryErrorCodes.NET_SALARY_NOT_POSITIVE,
    })
    .refine((value) => Number(value.toFixed(2)) === value, {
      error: netSalaryErrorCodes.NET_SALARY_DECIMALS
    }),
});

export const customNotificationEmailSchema = z.object({
  customNotificationEmail:z.email().min(1, { error: customNotificationEmailErrorCodes.CUSTOM_NOTIFICATION_EMAIL_REQUIRED})
})
export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export type Subscription = z.infer<typeof subscriptionSchema>;
export type BillingEvent = z.infer<typeof billingEventSchema>;
export type PriceHistory = z.infer<typeof priceHistorySchema>;

export type ChangePriceReason = "Increase" | "Discount" | "Correcting" | null;