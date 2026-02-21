"use client";

import { useState, useEffect } from "react";
import {
  ArrowDown,
  Check,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PlusCircle,
  Settings2,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DataTableSkeleton from "./DataTableSkeleton";
import { useTranslations } from "next-intl";
import { useColumns } from "./columns";
import { Subscription } from "@/lib/validations/form";
import { Status, statusEnum } from "@/lib/validations/enum";
import { cn } from "@/lib/utils";
type DataTableProps = {
  data: Subscription[];
};

export function DataTable({
  data,
}: DataTableProps) {
  const tReusable = useTranslations("Reusable")
  const t = useTranslations("dashboard_page.data_table_component");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const columns = useColumns();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      table.setColumnVisibility({
        select: true,
        mobile: mobile,
        name: !mobile,
        price: !mobile,
        subscription: !mobile,
        billing: !mobile,
        nextBilling: !mobile,
        status: !mobile,
        actions: true,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [table]);

  const column = table.getColumn("status");
  if (!column) return null;

  const facets = column?.getFacetedUniqueValues() as Map<Status, number>;
  const selectedStatuses = new Set(column?.getFilterValue() as Status[]);

  const allSubscriptionStatuses = Object.values(statusEnum.enum) 
  if (!hasMounted) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-sm overflow-hidden px-2">
      <div className="p-2 px-4 border-b border-border bg-primary dark:bg-primary/50 text-primary-foreground rounded-2xl">
        <h2 className="font-bold uppercase tracking-[0.125em] text-center gap-2">
          {t("title")}
        </h2>
      </div>

      <div className="flex items-center justify-start py-4 flex-col md:flex-row gap-2">
        <Input
          placeholder={t("filter_placeholder")}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed bg-transparent hover:bg-secondary/50 cursor-pointer">
                <PlusCircle className="mr-2 h-4 w-4 opacity-60" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t("table.columns.status")}
                </span>
                {selectedStatuses?.size > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-mono font-bold text-[10px] lg:hidden">
                      {selectedStatuses.size}
                    </Badge>
                    <div className="hidden space-x-1 lg:flex">
                      {selectedStatuses.size > 1 ? (
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-mono font-bold text-[10px]">
                          {selectedStatuses.size}
                        </Badge>
                      ) : (
                        Array.from(selectedStatuses).map((status) => (
                          <Badge
                            variant="secondary"
                            key={status}
                            className="rounded-sm px-1 font-mono font-bold text-[10px] uppercase">
                            {tReusable(`status.${status}`)}
                          </Badge>
                        ))
                      )}
                    </div>
                  </>
                )}
              </Button>
            }></PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder={t("table.columns.status")}
                className="h-9 font-sans"
              />
              <CommandList>
                <CommandEmpty>{t("no_results")}</CommandEmpty>
                <CommandGroup>
                  {allSubscriptionStatuses.map((status) => {
                    const isSelected = selectedStatuses.has(status);

                    return (
                      <CommandItem
                        key={status}
                        onSelect={() => {
                          if (isSelected) {
                            selectedStatuses.delete(status);
                          } else {
                            selectedStatuses.add(status);
                          }
                          const filterValues = Array.from(selectedStatuses);
                          column?.setFilterValue(
                            filterValues.length ? filterValues : undefined,
                          );
                        }}
                        className="cursor-pointer">
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}>
                          <Check className={cn("h-4 w-4")} />
                        </div>
                        <span className="capitalize text-sm font-medium">
                          {tReusable(`status.${status}`)}
                        </span>
                        {facets?.get(status) && (
                          <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-[10px] text-muted-foreground">
                            {facets.get(status)}
                          </span>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {selectedStatuses.size > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => column?.setFilterValue(undefined)}
                        className="text-xs font-bold uppercase tracking-widest hover:text-foreground cursor-pointer">
                        {t("status_button_clear_text")}
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex md:ml-auto gap-2 flex-col md:flex-row mt-2 md:mt-0 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="cursor-pointer">
                  <Settings2 />
                  {t("view_button")}
                  <ArrowDown />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-center">
                  {t("toggle_columns")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => {
                    if (!column.getCanHide()) return false;
                    if (isMobile)
                      return column.id === "mobile" || column.id === "actions";
                    return column.id !== "mobile";
                  })
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }>
                        {t(`table.columns.${column.id}` as any)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  {t("no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end py-4 flex-col md:flex-row gap-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {t("rows_selected", {
            count: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8 flex-col md:flex-row gap-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t("rows_per_page")}</p>
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

          <div className="flex w-[120px] items-center justify-center text-sm font-medium">
            {t("pagination_info", {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            })}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex bg-primary/20"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">{t("sr.first_page")}</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 bg-primary/20"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">{t("sr.previous_page")}</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 bg-primary/20"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <span className="sr-only">{t("sr.next_page")}</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex bg-primary/20"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              <span className="sr-only">{t("sr.last_page")}</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
