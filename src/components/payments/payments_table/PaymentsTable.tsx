"use client"

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
import {  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, SlidersHorizontal } from "lucide-react";
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
import { useTranslations } from "next-intl";

export default function PaymentsTable({ billingEvents }: {billingEvents: BillingEvent[]}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
    state: {
      sorting,
      columnFilters,
    },
  });
  const t = useTranslations("dashboard_page.subscription_table_component");
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-2">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-sm font-black uppercase tracking-[0.2em]">
          Payment History
        </h2>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder={"Filter by name..."}
              value={
                (table
                  .getColumn("subscriptionName")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("subscriptionName")
                  ?.setFilterValue(event.target.value)
              }
              className="w-full pl-8 bg-transparent border-b border-border outline-none"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 transition-colors ${
              showFilters
                ? "text-primary bg-primary/10 rounded-md"
                : "text-muted-foreground hover:text-primary"
            }`}>
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                "No results found"
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="border-t py-4">
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:items-center">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <p className="text-sm font-medium whitespace-nowrap text-muted-foreground">
              {t("rows_per_page")}
            </p>

            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}>
              <SelectTrigger
                id="select-rows-per-page"
                className="w-[65px] scale-[0.90] cursor-pointer">
                <SelectValue />
              </SelectTrigger>

              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center order-first sm:order-0">
            <div className="text-sm font-medium text-muted-foreground tabular-nums tracking-wide">
              {t("pagination_info", {
                current: table.getState().pagination.pageIndex + 1,
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
              <span className="sr-only">{t("sr.first_page")}</span>
              <ChevronsLeft className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer size-8 bg-primary/10 hover:bg-primary/20 transition-colors"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">{t("sr.previous_page")}</span>
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer size-8 bg-primary/10 hover:bg-primary/20 transition-colors"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <span className="sr-only">{t("sr.next_page")}</span>
              <ChevronRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer size-8 bg-primary/10 hover:bg-primary/20 transition-colors"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              <span className="sr-only">{t("sr.last_page")}</span>
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}