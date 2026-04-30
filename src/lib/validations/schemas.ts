import * as z from "zod";
import {
  billingCycleEnum,
  i18nCategoryEnum,
  statusEnum,
} from "@/lib/validations/enums";
import { setDateHoursToZero } from "../utils";
import type { useTranslations } from "next-intl";

export type TFunction = ReturnType<typeof useTranslations<"Validation">>;

export const i18nSubscriptionFormSchema = (t: TFunction) => {
  const categoryEnum = i18nCategoryEnum(t);
  return z.object({
    name: z
      .string()
      .trim()
      .min(3, t("subscription.name.min", { min: 3 }))
      .max(50, t("subscription.name.max", { max: 50 })),
    category: categoryEnum,
    price: z
      .string()
      .trim()
      .min(1, t("subscription.price.required"))
      .transform((value) => Number(value))
      .refine((value) => Number.isFinite(value) && value > 0, {
        message: t("subscription.price.positive"),
      })
      .refine((value) => Number(value.toFixed(2)) === value, {
        message: t("subscription.price.decimal_count"),
      }),
    billingCycle: billingCycleEnum,
    nextBilling: z
      .string()
      .min(1, t("subscription.nextBilling.required"))
      .transform((value) => new Date(value))
      .refine((date) => !isNaN(date.getTime()), {
        message: t("subscription.nextBilling.invalid"),
      })
      .refine((date) => date >= setDateHoursToZero(new Date()), {
        message: t("subscription.nextBilling.cannot_be_in_the_past"),
      }),
    autoRenew: z.boolean(),
    status: statusEnum,
  });
};
export const i18nSubscriptionSchema = (t: TFunction) =>
  i18nSubscriptionFormSchema(t).extend({
    id: z.uuid(),
    createdAt: z.date(),
    statusChangedAt: z.date().nullable().optional(),
    lastRenewedAt: z.date().nullable().optional(),
    manualRenewalGraceUntil: z.date().nullable().optional(),
  });

export const billingEventSchema = z.object({
  id: z.uuid(),
  subscriptionId: z.uuid(),
  amount: z.number().positive(),
  chargedAt: z.date(),
  source: z.enum(["initial", "auto", "manual"]),
});

export const i18nNetSalarySchema = (t: TFunction) => {
  return z.object({
    netSalary: z
      .string()
      .trim()
      .min(1, t("netSalary.min"))
      .transform((value) => Number(value))
      .refine((value) => Number.isFinite(value) && value > 0, {
        message: t("netSalary.positive"),
      })
      .refine((value) => Number(value.toFixed(2)) === value, {
        message: t("netSalary.decimal_count"),
      }),
  });
};

export type SubscriptionFormValues = z.infer<
  ReturnType<typeof i18nSubscriptionFormSchema>
>;

export type Subscription = z.infer<ReturnType<typeof i18nSubscriptionSchema>>;
export type BillingEvent = z.infer<typeof billingEventSchema>;
