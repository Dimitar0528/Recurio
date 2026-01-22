import * as z from "zod";
export const billingCycleEnum = z.enum(["Monthly", "Annual"]);
export const categoryEnum = z.enum([
  "Entertainment",
  "Utilities",
  "Fitness",
  "Software",
  "Education",
  "Other",
]);
export const subScriptionStatusEnum = z.enum(["Active", "Paused", "Cancelled"]); 

export const subscriptionFormSchema = z.object({
  name: z.string().min(3, "Subscription name must be at least 3 characters."),
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
    .min(1, "Next bill date is required.")
    .transform((value) => new Date(value))
    .refine((date) => date >= new Date(new Date().toDateString()), {
      message: "Date cannot be in the past",
    }),
    category: categoryEnum,
    status: subScriptionStatusEnum
});

export const subscriptionsResponseSchema = z.array(subscriptionFormSchema);
export type Subscription = z.infer<typeof subscriptionFormSchema>;
