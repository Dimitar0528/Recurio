"use client";
import { ColumnDef } from "@tanstack/react-table";
import { type Subscription } from "@/lib/validations/schemas";
import { Ban, Delete, Edit, MoreHorizontal, CalendarDays, HandCoinsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "../../shared/DataTableColumnHeader";
import { dateFormatter, priceFormatter, isDue } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import SubscriptionDialog from "../SubscriptionDialog";
import SubscriptionForm from "../SubscriptionForm";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubIcon } from "@/components/shared/SubIcon";
import { isWithinInterval, startOfDay, subDays } from "date-fns";
import { useState } from "react";
import DeleteDialog from "./actions/DeleteDialog";
import PriceHistoryDialog from "./actions/PriceHistoryDialog";
import {
  getUserSubscriptionPriceHistory,
  getUserSubscriptiontCancellationGuide,
} from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import CancellationDialog from "./actions/CancellationDialog";
import SavingsSimDialog from "./actions/SavingsSimDialog";

export const useColumns = (): ColumnDef<Subscription>[] => {
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("dashboard_page.subscription_table_component");
  const locale = useLocale();

  const statusClasses = {
    Active:
      "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-300",
    "Free Trial":
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    Cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  return [
    {
      id: "mobile",
      header: () => null,
      cell: ({ row }) => {
        const {
          name,
          category,
          price,
          billingCycle,
          nextBilling,
          status,
          autoRenew,
        } = row.original;

        const formattedPrice = priceFormatter(price);
        const billingDate = dateFormatter(nextBilling, locale);

        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 items-center">
            <div className="flex flex-col text-center items-center">
              <span className="font-medium leading-tight truncate w-full ">
                {name}
              </span>
              <span className="text-xs text-primary">
                {tReusable(`categories.${category}`)}
              </span>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-xs text-muted-foreground">
                {t("table.columns.billing")}
              </span>
              <span className="font-medium leading-tight">
                {formattedPrice}
              </span>
              <span className="text-xs text-primary">
                {tReusable(`billingCycle.${billingCycle}`)}
              </span>
              {billingCycle != "Monthly" && (
                <span className="text-[10px] text-muted-foreground">
                  {billingCycle === "Quarterly"
                    ? t("table.badges.monthly_estimate", {
                        price: priceFormatter(price / 3),
                      })
                    : t("table.badges.monthly_estimate", {
                        price: priceFormatter(price / 12),
                      })}
                </span>
              )}
            </div>
            <div className="flex flex-col text-center">
              <span className="text-xs text-muted-foreground">
                {t("table.columns.nextBilling")}
              </span>
              <span className="text-sm">{billingDate}</span>
              <span className="text-xs text-primary">
                {autoRenew ? t("table.badges.auto") : t("table.badges.manual")}
              </span>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-xs text-muted-foreground">
                {t("table.columns.status")}
              </span>
              <Badge
                variant="outline"
                className={`${statusClasses[status]} text-xs mx-auto`}>
                {tReusable(`status.${status}`)}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("table.columns.name")}
          enableHiding
        />
      ),
      cell: ({ row }) => {
        const { name, category } = row.original;

        return (
          <div className="flex items-center gap-2">
            <SubIcon name={name} />
            <div className="flex flex-col">
              <span className="font-medium leading-none">{name}</span>
              <span className="text-xs text-primary dark:text-primary mt-1">
                {tReusable(`categories.${category}`)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("table.columns.price")}
          enableHiding
        />
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const { billingCycle } = row.original;
        const formattedPrice = priceFormatter(price);

        return (
          <div className="flex flex-col">
            <span className="font-medium leading-none">
              {formattedPrice} /{" "}
              <span className="text-xs text-primary">
                {tReusable(`billingCycle.${billingCycle}`)}
              </span>
            </span>
            {billingCycle === "Yearly" && (
              <span className="ml-1 text-[10px] text-muted-foreground font-medium">
                {t("table.badges.monthly_estimate", {
                  price: priceFormatter(price / 12),
                })}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "nextBilling",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("table.columns.nextBilling")}
          enableHiding
        />
      ),
      cell: ({ row }) => {
        const { nextBilling, status, autoRenew } = row.original;
        let billingDate;
        if (nextBilling.getUTCFullYear() > new Date().getUTCFullYear()) {
          billingDate = dateFormatter(nextBilling, locale, "numeric");
        } else {
          billingDate = dateFormatter(nextBilling, locale);
        }

        const dailyTime = startOfDay(new Date()).getTime();
        const subscriptionTime = startOfDay(nextBilling).getTime();
        const isActiveAndExpiringSoonSub =
          status === "Active" &&
          subscriptionTime >= dailyTime &&
          isWithinInterval(dailyTime, {
            start: subDays(subscriptionTime, 14),
            end: subDays(subscriptionTime, 7),
          });
        const isPendingRenewal =
          !autoRenew && status === "Active" && isDue(nextBilling, new Date());
        return (
          <div className="flex flex-col">
            <div>
              {billingDate}{" "}
              <Tooltip>
                <TooltipTrigger className="text-primary cursor-help">
                  (
                  {autoRenew
                    ? t("table.badges.auto")
                    : t("table.badges.manual")}
                  )
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {autoRenew
                      ? t("table.badges.renews_auto")
                      : t("table.badges.requires_manual")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            {isActiveAndExpiringSoonSub && (
              <Badge
                variant="secondary"
                className="bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200 text-[10px]">
                {t("table.badges.expiring_soon")}
              </Badge>
            )}
            {isPendingRenewal && (
              <Badge variant="destructive" className="text-[10px]">
                {t("table.badges.renew_required")}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("table.columns.status")}
          enableHiding
        />
      ),
      filterFn: (row, columnId, value) => {
        if (!value || value.length === 0) return true;
        return value.includes(row.getValue(columnId));
      },
      cell: ({ row }) => {
        const { status } = row.original;
        return (
          <Badge variant="outline" className={`${statusClasses[status]}`}>
            {tReusable(`status.${status}`)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: `${t("table.columns.actions")}`,
      cell: ({ row, table }) => {
        const subscription = row.original;
        const { id, name } = subscription;
        const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
        const [isPriceHistoryDialogOpen, setIsPriceHistoryDialogOpen] = useState(false);
        const [isSavingsDialogOpen, setIsSavingsDialogOpen] = useState(false);
            const allSubs = table
              .getFilteredRowModel()
              .rows.map((r) => r.original);

        const {
          data: priceHistory,
          isLoading,
          isError,
        } = useQuery({
          queryKey: ["price-history", id],
          queryFn: () => getUserSubscriptionPriceHistory(id),
          enabled: isPriceHistoryDialogOpen,
          staleTime: Infinity,
          gcTime: Infinity,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        });

        const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
        const {
          data: guide,
          isLoading: isGuideLoading,
          isError: isGuideError,
        } = useQuery({
          queryKey: ["cancellation-guide", name],
          queryFn: () => getUserSubscriptiontCancellationGuide(name),
          enabled: isCancelDialogOpen,
          staleTime: Infinity,
          gcTime: Infinity,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        });

        const dropdownItems = [
          {
            id: "savings",
            label: t("actions_dropdown.dropdown_items.saving_sim"),
            icon: HandCoinsIcon,
            textClass: "text-amber-600",
            iconClass: "text-amber-600",
            onClick: () => setIsSavingsDialogOpen(true),
          },
          {
            id: "price-history",
            label: t("actions_dropdown.dropdown_items.price_history"),
            icon: CalendarDays,
            textClass: "text-green-600",
            iconClass: "text-green-600",
            onClick: () => setIsPriceHistoryDialogOpen(true),
          },
          {
            id: "cancel",
            label: t("actions_dropdown.dropdown_items.cancel"),
            icon: Ban,
            textClass: "text-foreground",
            iconClass: "text-muted-foreground",
            onClick: () => setIsCancelDialogOpen(true),
          },
          {
            id: "edit",
            label: t("actions_dropdown.dropdown_items.edit"),
            icon: Edit,
            textClass: "text-primary",
            iconClass: "text-primary",
            onClick: () => setIsEditDialogOpen(true),
          },
          {
            id: "delete",
            label: t("actions_dropdown.dropdown_items.delete"),
            icon: Delete,
            textClass: "text-destructive",
            iconClass: "text-destructive",
            onClick: () => setIsDeleteDialogOpen(true),
          },
        ];

        return (
          <>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      size="sm"
                      id="actions-menu-btn"
                      aria-label="Actions button"
                      className="bg-background outline-solid outline-primary/20 cursor-pointer hover:scale-[1.05] active:scale-[0.98] transition-all p-2 rounded-md w-12">
                      <MoreHorizontal
                        className="text-muted-foreground"
                        size={20}
                      />
                    </Button>
                  }
                />
                <DropdownMenuContent
                  className={` ${locale === "bg" ? "min-w-[235px]" : "min-w-[180px]"} bg-popover border border-border p-1 rounded-md shadow-md`}>
                  {dropdownItems.map(
                    ({
                      id,
                      label,
                      icon: Icon,
                      textClass,
                      iconClass,
                      onClick,
                    }) => (
                      <DropdownMenuItem
                        key={id}
                        nativeButton={true}
                        render={
                          <button
                            className={`flex w-full items-center gap-1 px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-accent transition-colors group ${textClass}`}>
                            <Icon
                              size={16}
                              className={`${iconClass} group-hover:text-gray-200 transition-colors`}
                            />
                            <span>{label}</span>
                          </button>
                        }
                        onClick={onClick}
                      />
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <SavingsSimDialog
              isSavingsDialogOpen={isSavingsDialogOpen}
              setIsSavingsDialogOpen={setIsSavingsDialogOpen}
              setIsCancelDialogOpen={setIsCancelDialogOpen}
              allSubs={allSubs}
              subscription={subscription}
              t={t}
            />

            <PriceHistoryDialog
              isPriceHistoryDialogOpen={isPriceHistoryDialogOpen}
              setIsPriceHistoryDialogOpen={setIsPriceHistoryDialogOpen}
              priceHistory={priceHistory}
              isLoading={isLoading}
              isError={isError}
              t={t}
            />

            <CancellationDialog
              isCancelDialogOpen={isCancelDialogOpen}
              setIsCancelDialogOpen={setIsCancelDialogOpen}
              guide={guide}
              isLoading={isGuideLoading}
              isError={isGuideError}
              serviceName={name}
              t={t}
            />

            <SubscriptionDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              title={tReusable("dialog.title", {
                action: t("actions_dropdown.dropdown_items.edit"),
              })}
              description={tReusable("dialog.description")}
              submitLabel={tReusable("dialog.submit", {
                action: t("actions_dropdown.dropdown_items.edit"),
              })}
              cancelLabel={tReusable("dialog.cancel")}>
              <SubscriptionForm
                initialValues={subscription}
                shouldHideTrackingField
              />
            </SubscriptionDialog>

            <DeleteDialog
              isDeleteDialogOpen={isDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              id={id}
              name={name}
              t={t}
            />
          </>
        );
      },
    },
  ];
};
