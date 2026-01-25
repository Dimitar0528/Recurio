import * as z from "zod";
export const billingCycleEnum = z.enum(["Monthly", "Annual"]);
export const categoryEnum = z.enum([
  "Entertainment",
  "Utilities",
  "Fitness",
  "Software",
  "Education",
  "Other",
],{error: "Choose a valid option"});
export const statusEnum = z.enum(["Active", "Paused", "Cancelled"]); 

export const subscriptionFormSchema = z.object({
  id: z.uuidv4().optional(),
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
    .min(1, "Next billing date is required.")
    .transform((value) => new Date(value))
    .refine((date) => date >= new Date(new Date().toDateString()), {
      message: "Date cannot be in the past",
    }),
    category: categoryEnum,
    status: statusEnum
});

export const subscriptionsResponseSchema = z.array(subscriptionFormSchema);
export type Subscription = z.infer<typeof subscriptionFormSchema>;
