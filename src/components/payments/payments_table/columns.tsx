import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { dateFormatter, priceFormatter } from "@/lib/utils";
import { BillingEvent } from "@/lib/validations/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";

export const useColumns = (): ColumnDef<BillingEvent>[] => {
  const tReusable = useTranslations("Reusable");
  const locale = useLocale();
  return [
    {
      accessorKey: "chargetAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Charged On"} />
      ),
      cell: ({ row }) => {
        const { chargedAt } = row.original;
        const chargedAtDate = dateFormatter(chargedAt, locale);
        return (
          <span className="text-xs font-mono text-muted-foreground">
            {chargedAtDate}
          </span>
        );
      },
    },
    {
      accessorKey: "subscriptionName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Subscription"} />
      ),
      cell: ({ row }) => {
        const { subscriptionName, subscriptionCategory } = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold">{subscriptionName}</span>
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
              {tReusable(`categories.${subscriptionCategory}`)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Type",
      cell: ({ row }) => {
        const { source } = row.original;
        return (
          <span className="text-xs text-muted-foreground capitalize">
            {source}
          </span>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Amount"} />
      ),
      cell: ({ row }) => {
        const { amount } = row.original;
        return (
          <span className="text-sm font-mono font-bold w-20 text-right">
            {priceFormatter(amount)}
          </span>
        );
      },
    },
  ];
};
