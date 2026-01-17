"use client";

import {useState} from "react";
import { ArrowDown, Settings2 } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddSubscriptionForm from "@/components/dashboard/AddSubscriptionForm";

type DataTableProps<TData, TValue> ={
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
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

  return (
    <>
      <div className="flex items-center justify-start py-4">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex ml-auto gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<div></div>} nativeButton={false}>
              <Button variant="outline" className="cursor-pointer">
                <Settings2 />
                Toggle columns
                <ArrowDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }>
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog>
            <DialogTrigger render={<div></div>} nativeButton={false}>
              <Button variant="outline" className="cursor-pointer">
                + Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className={"font-bold text-lg"}>
                  New Subscription
                </DialogTitle>
                <DialogDescription>
                  Add a new subscription. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <AddSubscriptionForm />
              <DialogFooter>
                <DialogClose render={<div></div>} nativeButton={false}>
                  <Button variant="outline" className="p-4 cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  form="add-subscription-form"
                  className="p-4 cursor-pointer">
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </>
  );
}
