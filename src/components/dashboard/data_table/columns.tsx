"use client";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import type {Subscription} from "@/lib/validations/form";
import { MoreHorizontal } from "lucide-react";
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
import { dateFormatter } from "@/lib/utils";

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

      const formattedPrice = new Intl.NumberFormat("bg-BG", {
        style: "currency",
        currency: "EUR",
      }).format(Number(price));

      return (
        <div className="flex flex-col gap-2">
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{category}</div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Billing</span>
            <span className="font-medium">
              {formattedPrice} / {billingCycle}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Next</span>
            <span>{String(nextBilling)}</span>
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
      const cost = parseFloat(row.getValue("price"));
      const { billingCycle } = row.original;
      const formattedPrice = new Intl.NumberFormat("bg-BG", {
        style: "currency",
        currency: "EUR",
      }).format(cost);

      return (
        <div className="flex flex-col">
          <span className="font-medium leading-none">{formattedPrice}</span>
          <span className="text-xs text-primary mt-1">{billingCycle}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "nextBilling",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Next Billing" />
    ),
    cell: ({row}) =>{
      const {nextBilling} = row.original;
      const billing = dateFormatter().format(nextBilling)
      return (
        <div>{billing}</div>
      )
    }
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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
            ></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
