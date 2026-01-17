"use client";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { subscriptionFormSchema } from "../AddSubscriptionForm";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";

export type Subscription = z.infer<typeof subscriptionFormSchema>;

export const columns: ColumnDef<Subscription>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("bg-BG", {
        style: "currency",
        currency: "EUR",
      }).format(cost);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "billingCycle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Billing Cycle" />
    ),
  },
  {
    accessorKey: "nextBilling",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Next Billing" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<div></div>} nativeButton={false}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(payment.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
