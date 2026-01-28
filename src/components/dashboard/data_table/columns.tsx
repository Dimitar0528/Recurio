"use client";
import { ColumnDef } from "@tanstack/react-table";
import type {Subscription} from "@/lib/validations/form";
import { Delete, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormatter, priceFormatter, SEVEN_DAYS_MS, FOURTEEN_DAYS_MS, setDateHoursToZero } from "@/lib/utils";
import { useLocale } from "next-intl";
import SubscriptionDialog from "../SubscriptionDialog";
import SubscriptionForm from "../SubscriptionForm";
import { Badge } from "@/components/ui/badge";
export const columns: ColumnDef<Subscription>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="cursor-pointer"
        checked={
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="cursor-pointer"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "mobile",
    header: () => null,
    cell: ({ row }) => {
      const { name, category, price, billingCycle, nextBilling, status } =
        row.original;
      const locale = useLocale();
      const formattedPrice = priceFormatter(price);
      const billingDate = dateFormatter(nextBilling, locale);
      return (
        <div className="flex flex-col gap-2">
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{category}</div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Billing</span>
            <div className="flex flex-col">
              <span className="font-medium leading-none">
                {formattedPrice} /{" "}
                <span className="text-xs text-primary">{billingCycle}</span>
              </span>
              {billingCycle === "Annual" && (
                <span className="ml-1 text-xs text-muted-foreground font-medium">
                  (~{priceFormatter(price / 12)}
                  <span className="text-primary/80 ml-0.5">/ Monthly</span>)
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Next Billing</span>
            <span>{billingDate}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span>{status}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { name, category } = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium leading-none">{name}</span>
          <span className="text-xs text-primary mt-1">{category}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const { billingCycle } = row.original;
      const formattedPrice = priceFormatter(price);

      return (
        <div className="flex flex-col">
          <span className="font-medium leading-none">
            {formattedPrice} /{" "}
            <span className="text-xs text-primary">{billingCycle}</span>
          </span>
          {billingCycle === "Annual" && (
            <span className="ml-1 text-xs text-muted-foreground font-medium">
              (~{priceFormatter(price / 12)}
              <span className="text-primary/80 ml-0.5">/ Monthly</span>)
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "nextBilling",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Next Billing" />
    ),
    cell: ({ row }) => {
      const { nextBilling } = row.original;
      const locale = useLocale();
      const dailyTime = setDateHoursToZero(new Date()).getTime();
      const subscriptionTime = setDateHoursToZero(nextBilling).getTime()
      const billingDate = dateFormatter(nextBilling, locale);
      return (
        <div className="flex flex-col">
          {billingDate}
          {subscriptionTime >= dailyTime &&
            subscriptionTime - dailyTime <= FOURTEEN_DAYS_MS &&
            subscriptionTime - dailyTime >= SEVEN_DAYS_MS && (
              <Badge
                variant="secondary"
                className="bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200">
                Expires in 7–14 days
              </Badge>
            )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const subscription = row.original;

      return (
        <div className="flex gap-2 flex-col sm:flex-row">
          <SubscriptionDialog
            trigger={
              <Button variant="outline" className="cursor-pointer">
                <Edit className="text-primary" />
              </Button>
            }
            title="Edit Subscription"
            description="Edit the current subscription. All fields are required."
            submitLabel="Edit">
            <SubscriptionForm initialValues={subscription} />
          </SubscriptionDialog>
            <Button variant="outline" className="cursor-pointer">
              <Delete className="text-destructive" />
            </Button>
        </div>
      );
    },
  },
];
