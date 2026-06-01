import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader";
import { dateFormatter, priceFormatter } from "@/lib/utils";
import { BillingEvent } from "@/lib/validations/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";

export const useColumns = (): ColumnDef<BillingEvent>[] => {
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("payments_page.payments_table_component");
  const locale = useLocale();

  return [
    {
      accessorKey: "chargedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("table.columns.charged_on")}
        />
      ),
      cell: ({ row }) => {
        const { chargedAt } = row.original;
        const chargedAtDate = dateFormatter(chargedAt, locale, "2-digit");
        return <span className="text-xs font-mono">{chargedAtDate}</span>;
      },
      meta: {
        className: "hidden md:table-cell",
      },
    },
    {
      accessorKey: "subscriptionName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("table.columns.subscription")}
        />
      ),
      cell: ({ row }) => {
        const { subscriptionName, subscriptionCategory, chargedAt, source } =
          row.original;
        const chargedAtDate = dateFormatter(chargedAt, locale);

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold leading-none">
              {subscriptionName}
            </span>
            <span className="text-[10px] font-medium text-primary uppercase tracking-widest leading-none">
              {tReusable(`categories.${subscriptionCategory}`)}
            </span>

            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground md:hidden">
              <span className="font-mono">{chargedAtDate}</span>
              <span>({t(`table.source.${source}`)})</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "source",
      header: t("table.columns.type"),
      cell: ({ row }) => {
        const { source } = row.original;
        return <span className="text-xs">{t(`table.source.${source}`)}</span>;
      },
      meta: {
        className: "hidden md:table-cell",
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("table.columns.amount")}
        />
      ),
      cell: ({ row }) => {
        const { amount } = row.original;
        return (
          <span className="text-sm font-mono font-bold">
            {priceFormatter(amount)}
          </span>
        );
      },
    },
  ];
};
