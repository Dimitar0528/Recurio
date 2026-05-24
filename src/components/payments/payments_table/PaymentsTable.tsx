"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { BillingEvent } from "@/lib/validations/schemas";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useColumns } from "./columns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { dateFormatter } from "@/lib/utils";

export default function PaymentsTable({
  billingEvents,
}: {
  billingEvents: BillingEvent[];
}) {
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("dashboard_page.subscription_table_component");
  const locale = useLocale();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");  

  const columns = useColumns();

  const table = useReactTable({
    data: billingEvents,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => {
      const search = filterValue.toLowerCase().trim();
      if (!search) return true;
      const { subscriptionName, subscriptionCategory, source, chargedAt } =
        row.original;

      const nameMatch =
        subscriptionName?.toLowerCase().includes(search) ?? false;
      const categoryMatch = tReusable(`categories.${subscriptionCategory}`)
      ?.toLowerCase().includes(search) ?? false;
      const sourceMatch = source?.toLowerCase().includes(search) ?? false;
      const formattedDate = chargedAt ? dateFormatter(chargedAt, locale) : "";
      const dateMatch = formattedDate.toLowerCase().includes(search);

      return nameMatch || categoryMatch || sourceMatch || dateMatch;
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-card to-card/95 border border-border/80 rounded-2xl shadow-md p-3 md:p-4 backdrop-blur-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 px-2 pt-2">
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
            Payment History
          </h2>
          <div className="rounded-lg border border-primary/10 bg-primary/10 py-1 px-2 text-xs text-foreground/70 leading-relaxed">
            Showing only the 30 most recent payments. For more information,
            download the financial{" "}
            <span className="font-semibold text-foreground/90">audit</span> from
            the{" "}
            <Link
              href="/dashboard#audit"
              className="underline underline-offset-2 hover:text-foreground transition-colors">
              dashboard page
            </Link>
            .
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
            />
            <Input
              placeholder={"Filter payments..."}
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-muted/20 border border-border/50 hover:border-border/80 focus-visible:ring-1 focus-visible:ring-primary/20 rounded-full text-xs transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/40 bg-card/40">
        <Table className="border-collapse">
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border/40 hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const metaClass = header.column.columnDef.meta?.className;
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-xs font-semibold tracking-wider text-muted-foreground/80 py-1 px-4 first:rounded-l-xl last:rounded-r-xl ${metaClass}`}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group border-b border-border/10 last:border-0 hover:bg-muted/30 transition-all duration-150">
                  {row.getVisibleCells().map((cell) => {
                    const metaClass = cell.column.columnDef.meta?.className;
                    return (
                      <TableCell
                        key={cell.id}
                        className={`py-3.5 px-4 text-sm font-medium text-foreground/85 group-hover:text-foreground ${metaClass}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground">
                  <span className="text-sm font-semibold text-foreground/75">
                    {tReusable("data_table.no_results")}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="border-t py-4">
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:items-center px-2">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              {tReusable("data_table.rows_per_page")}
            </span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}>
              <SelectTrigger
                id="select-rows-per-page"
                className="h-8 w-[68px] bg-muted/20 border-border/50 hover:bg-muted/40 transition-colors cursor-pointer text-xs rounded-lg">
                <SelectValue />
              </SelectTrigger>

              <SelectContent side="top" className="rounded-xl">
                {[5, 10, 15, 20, 30].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                    className="text-xs rounded-lg">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center order-first sm:order-0">
            <div className="text-sm font-medium text-muted-foreground tabular-nums tracking-wide">
              {tReusable("data_table.pagination_info", {
                current:
                  table.getRowModel().rows?.length > 0
                    ? table.getState().pagination.pageIndex + 1
                    : 0,
                total: table.getPageCount(),
              })}
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer size-8 bg-primary/10 hover:bg-primary/20 transition-colors"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">
                {tReusable("data_table.sr.first_page")}
              </span>
              <ChevronsLeft className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer size-8 bg-primary/10 hover:bg-primary/20 transition-colors"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">
                {tReusable("data_table.sr.previous_page")}
              </span>
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer size-8 bg-primary/10 hover:bg-primary/20 transition-colors"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <span className="sr-only">
                {tReusable("data_table.sr.next_page")}
              </span>
              <ChevronRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer size-8 bg-primary/10 hover:bg-primary/20 transition-colors"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              <span className="sr-only">
                {tReusable("data_table.sr.last_page")}
              </span>
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
