import * as z from "zod";
import { billingCycleEnum, categoryEnum, statusEnum } from "@/lib/validations/enum";
import { setDateHoursToZero } from "../utils";

export const subscriptionFormSchema = z
  .object({
    id: z.uuidv4().optional(),
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters.")
      .max(50, "Name can't be more than 50 characters."),
    category: categoryEnum,
    price: z
      .string()
      .trim()
      .min(1, "Price is required.")
      .transform((value) => Number(value))
      .refine((value) => Number.isFinite(value) && value > 0, {
        message: "Price must be a positive number.",
      })
      .refine((value) => Number(value.toFixed(2)) === value, {
        message: "Price can have at most 2 decimal places.",
      }),
    billingCycle: billingCycleEnum,
    startDate: z
      .string()
      .min(1, "Starting date is required.")
      .transform((value) => new Date(value))
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid start date.",
      }),
    nextBilling: z
      .string()
      .min(1, "Next billing date is required.")
      .transform((value) => new Date(value))
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid billing date.",
      })
      .refine((date) => date >= setDateHoursToZero(new Date()), {
        message: "Date cannot be in the past",
      }),
    autoRenew: z.boolean(),
    status: statusEnum,
  })
  .refine((data) => data.nextBilling >= data.startDate, {
    message: "Next billing must be after start date.",
    path: ["nextBilling"],
  });

export const netSalarySchema = z.object({
  netSalary: z
    .string()
    .trim()
    .min(1, "Net salary is required.")
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value > 0, {
      message: "Net salary must be a positive number.",
    })
    .refine((value) => Number(value.toFixed(2)) === value, {
      message: "Net salary can have at most 2 decimal places.",
    }),
});

export const subscriptionsResponseSchema = z.array(subscriptionFormSchema);
export type Subscription = z.infer<typeof subscriptionFormSchema>;
