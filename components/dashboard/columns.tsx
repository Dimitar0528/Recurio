"use client";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";

const subsciptionSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3),
  price: z.number().positive(),
  billingCycle: z.enum(["Monthly", "Annual"]),
  nextBillDate: z.string(),
  category: z.enum(["Entertainment", "Utilities", "Fitness", "Software", "Other"]),
  subscriptionStatus: z.enum(["Active", "Paused", "Cancelled"])
});
export type Subscription = z.infer<typeof subsciptionSchema>;

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "name",
    header: "Service",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Cost",
  },
  {
   accessorKey: "billingCycle",
   header: "Billing Cycle",
  },
  {
    accessorKey: "nextBillDate",
    header: "Next Billing",
  },
  {
    accessorKey: "subscriptionStatus",
    header: "Status",
  }
];
