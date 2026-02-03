import * as z from "zod";
import { billingCycleEnum, categoryEnum, statusEnum } from "@/lib/validations/enum";

export const subscriptionFormSchema = z.object({
  id: z.uuidv4().optional(),
  name: z
    .string()
    .min(3, "Subscription name must be at least 3 characters.")
    .max(50, "Subscription name can't be more than 50 characters."),
  category: categoryEnum,
  price: z
    .string()
    .min(1, "Price is required.")
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value > 0, {
      message: "Price must be a positive number.",
    }),
  billingCycle: billingCycleEnum,
  nextBilling: z
    .string()
    .min(1, "Next billing date is required.")
    .transform((value) => new Date(value))
    .refine((date) => date >= new Date(new Date().toDateString()), {
      message: "Date cannot be in the past",
    }),
  autoRenew: z.boolean(),
  status: statusEnum,
});

export const subscriptionsResponseSchema = z.array(subscriptionFormSchema);
export type Subscription = z.infer<typeof subscriptionFormSchema>;
