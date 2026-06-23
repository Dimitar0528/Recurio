"use client";

import { useState, useEffect } from "react";
import {
  ArrowDown,
  Check,
  ChevronLeft,
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
import SubscriptionTableSkeleton from "./SubscriptionsTableSkeleton";
import { useLocale, useTranslations } from "next-intl";
import { useColumns } from "./columns";
import { Subscription } from "@/lib/validations/schemas";
import { Status, STATUS_VALUES } from "@/lib/validations/enums";
import { cn, dateFormatter, isDue } from "@/lib/utils";
import { ManualRenewalControls } from "./ManualRenewalControls";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

type SubscriptionTableProps = {
  data: Subscription[];
};

export function SubscriptionTable({ data }: SubscriptionTableProps) {
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("dashboard_page.subscription_table_component");
  const locale = useLocale();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");  
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => {
      const search = filterValue.toLowerCase().trim();
      if (!search) return true;
      const { name, category, billingCycle, nextBilling } =
        row.original;

      const nameMatch = name?.toLowerCase().includes(search) ?? false;
      const categoryMatch =
        tReusable(`categories.${category}`)?.toLowerCase().includes(search) ??
        false;
      const billingCycleMatch =
        tReusable(`billingCycle.${billingCycle}`)
          ?.toLowerCase()
          .includes(search) ?? false;
      const formattedDate = nextBilling ? dateFormatter(nextBilling, locale) : "";
      const dateMatch = formattedDate.toLowerCase().includes(search);

      return nameMatch || categoryMatch || billingCycleMatch || dateMatch;
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter
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
        select: !mobile,
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

  if (!hasMounted) {
    return <SubscriptionTableSkeleton />;
  }

  const pendingRenewalSubscriptions = data.filter(
    ({ autoRenew, status, nextBilling }) =>
      !autoRenew && status === "Active" && isDue(nextBilling, new Date()),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-4xl mx-auto overflow-hidden px-2">
        <div className="p-[2.5] border-2 border-primary dark:border-primary/10 bg-primary dark:bg-primary/50 text-primary-foreground rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all dark:hover:translate-x-[2px] dark:hover:translate-y-[2px] dark:hover:shadow-none">
          <h2 className="font-extrabold uppercase italic tracking-[0.125em] text-center text-lg">
            {t("title")}
          </h2>
        </div>
        <div className="flex items-center justify-start py-4 flex-col md:flex-row gap-2">
          <div className="flex grow gap-4">
            <Input
              placeholder={t("filter_placeholder")}
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-md"
            />
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed bg-transparent hover:bg-secondary/50 cursor-pointer">
                    <PlusCircle className="mr-2 h-4 w-4 opacity-60 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {t("table.columns.status")}
                    </span>
                    {selectedStatuses?.size > 0 && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-4"
                        />
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
                    <CommandEmpty>
                      {tReusable("data_table.no_results")}
                    </CommandEmpty>
                    <CommandGroup>
                      {STATUS_VALUES.map((status) => {
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
          </div>

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
                        return (
                          column.id === "mobile" || column.id === "actions"
                        );
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
        <ManualRenewalControls
          pendingRenewalSubscriptions={pendingRenewalSubscriptions}
          t={t}
          tReusable={tReusable}
        />

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
            {table.getRowModel().rows?.length > 0 ? (
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
                  <span className="text-sm font-semibold text-foreground/75">
                    {tReusable("data_table.no_results")}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="border-t py-4">
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:items-center">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <p className="text-sm font-medium whitespace-nowrap text-muted-foreground">
                {tReusable("data_table.rows_per_page")}
              </p>

              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}>
                <SelectTrigger
                  aria-label="Change Rows Per Page"
                  id="select-rows-per-page"
                  className="w-[65px] scale-[0.90] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent side="top">
                  {[5, 10, 15, 20, 30].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
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
    </QueryClientProvider>
  );
}
