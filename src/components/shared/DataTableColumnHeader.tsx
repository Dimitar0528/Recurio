import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  enableHiding?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  enableHiding = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const tReusable = useTranslations("Reusable");
  if (!column.getCanSort()) {
    return <div>{title}</div>;
  }

  return (
    <div className={"flex items-center gap-2"}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="data-[state=open]:bg-accent -ml-3 h-8 cursor-pointer hover:bg-primary/15 text-foreground/90">
              <span>{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDown />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp />
              ) : (
                <ChevronsUpDown />
              )}
            </Button>
          }></DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className="group cursor-pointer"
            onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="group-hover:text-white" />
            {tReusable("data_table.sorting.asc")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="group cursor-pointer"
            onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="group-hover:text-white" />
            {tReusable("data_table.sorting.desc")}
          </DropdownMenuItem>
          {enableHiding && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="group cursor-pointer"
                onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="group-hover:text-white" />
                {tReusable("data_table.sorting.hide")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
