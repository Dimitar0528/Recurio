"use client";
import * as z from "zod";

import { ColumnDef } from "@tanstack/react-table";
import { type Subscription } from "@/lib/validations/schemas";
import { AlertTriangle, Ban, Delete, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "../../shared/DataTableColumnHeader";
import { dateFormatter, priceFormatter, isDue } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import SubscriptionDialog from "../SubscriptionDialog";
import SubscriptionForm from "../SubscriptionForm";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { deleteSubscription, undoDeleteSubscription } from "@/app/actions";
import { SubIcon } from "@/components/shared/SubIcon";
import { isWithinInterval, startOfDay, subDays } from "date-fns";
import { RateLimitError } from "@/lib/security/rate_limits";
import { useState } from "react";

export const useColumns = (): ColumnDef<Subscription>[] => {
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("dashboard_page.subscription_table_component");
  const locale = useLocale();

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

        const statusClasses = {
          Active:
            "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-300",
          Paused:
            "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
          Cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        };

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
              {billingCycle === "Yearly" && (
                <span className="text-[10px] text-muted-foreground">
                  {t("table.badges.monthly_estimate", {
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
        const statusClasses = {
          Active:
            "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-300",
          Paused:
            "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
          Cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        };
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
      cell: ({ row }) => {
        const subscription = row.original;
        const id = subscription.id!;
        const requiredPhrase = t("delete_dialog.phrase_template", {
          name: subscription.name,
        });

        const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

        const deleteSubscriptionSchema = z.object({
          requiredPhrase: z
            .string()
            .refine(
              (val) => val === requiredPhrase,
              t("delete_dialog.validation_error", { phrase: requiredPhrase }),
            ),
        });

        const form = useForm({
          defaultValues: {
            requiredPhrase: "",
          },
          validators: {
            onSubmit: deleteSubscriptionSchema,
          },
          onSubmit: async () => {
            try {
              await deleteSubscription(id);
              setIsDeleteDialogOpen(false);
              toast.success(t("delete_dialog.delete_messages.deleted"), {
                duration: 8000,
                action: {
                  label: t("delete_dialog.delete_messages.undo"),
                  onClick: async () => await undoDeleteSubscription(id),
                },
              });
            } catch (err) {
              const message =
                err instanceof RateLimitError
                  ? t("delete_dialog.delete_messages.rate_limited")
                  : t("delete_dialog.delete_messages.error");

              toast.error(message);
            }
          },
        });

        const dropdownItems = [
          {
            id: "edit",
            label: t("actions_dropdown.dropdown_items.edit"),
            icon: Edit,
            textClass: "text-primary",
            iconClass: "text-primary",
            onClick: () => setIsEditDialogOpen(true),
          },
          {
            id: "cancel",
            label: t("actions_dropdown.dropdown_items.cancel"),
            icon: Ban,
            textClass: "text-foreground",
            iconClass: "text-muted-foreground",
            onClick: () => {
              toast.info(
                locale === "bg"
                  ? "Тази функция ще бъде достъпна скоро"
                  : "This feature will be available soon",
              );
            },
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    id="actions-menu-btn"
                    aria-label="Actions button"
                    className="bg-background outline-solid outline-primary/20 cursor-pointer hover:scale-[1.05] active:scale-[0.98] transition-all p-2 rounded-md">
                    <MoreHorizontal
                      className="text-muted-foreground"
                      size={20}
                    />
                  </Button>
                }
              />
              <DropdownMenuContent className="min-w-[190px] bg-popover border border-border p-1 rounded-md shadow-md">
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
                          className={`flex w-full items-center gap-1 px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-accent transition-colors group ${textClass} ${
                            id === "cancel" ? "relative" : ""
                          }`}>
                          {id === "cancel" && (
                            <span className="absolute -top-1.5 right-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[8px] tracking-wide uppercase font-bold px-1 py-0.5 rounded pointer-events-none select-none leading-none z-10 tab">
                              {locale === "bg"
                                ? "Скоро"
                                : "Coming Soon"}
                            </span>
                          )}
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

            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border shadow-2xl">
                <div className="bg-destructive/5 px-6 py-4 border-b border-destructive/10 flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-full text-destructive">
                    <AlertTriangle size={20} />
                  </div>
                  <DialogTitle className="text-destructive">
                    {t("delete_dialog.title")}
                  </DialogTitle>
                </div>
                <div className="p-4 space-y-6">
                  <form
                    id="delete-subscription-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      form.handleSubmit();
                    }}>
                    <div className="text-sm leading-relaxed text-foreground/80 space-y-4">
                      <p>
                        {t.rich("delete_dialog.warning", {
                          important: (c) => (
                            <strong className="text-foreground">{c}</strong>
                          ),
                        })}
                      </p>
                      <div className="p-2 rounded-lg bg-muted/50 border border-border text-xs leading-normal">
                        <span className="font-bold text-foreground block mb-1 uppercase tracking-wider">
                          {t("delete_dialog.impact_title")}
                        </span>
                        {t.rich("delete_dialog.impact_text", {
                          italic: (c) => (
                            <span className="text-muted-foreground italic">
                              {c}
                            </span>
                          ),
                        })}
                      </div>

                      <p className="text-xs bg-accent/50 p-2 rounded-lg border border-border">
                        <span className="font-bold">
                          {t("delete_dialog.recommendation_title")}
                        </span>{" "}
                        {t.rich("delete_dialog.recommendation_text", {
                          critical: (c) => <strong>{c}</strong>,
                          paused: (c) => <strong>{c}</strong>,
                          cancelled: (c) => <strong>{c}</strong>,
                        })}
                      </p>
                    </div>

                    <div className="space-y-3 select-none">
                      <Label className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground mt-4">
                        {t("delete_dialog.verification_label")}
                      </Label>
                      <div className="p-3 bg-secondary/50 border border-border rounded-md text-sm mb-2">
                        <span className="text-muted-foreground">
                          {t("delete_dialog.type_phrase")}{" "}
                        </span>
                        <span className="font-mono font-bold text-destructive">
                          {requiredPhrase}
                        </span>
                      </div>
                      <FieldGroup>
                        <form.Field name="requiredPhrase">
                          {(field) => {
                            const isInvalid =
                              field.state.meta.isTouched &&
                              !field.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  aria-invalid={isInvalid}
                                  aria-describedby="requiredPhraseError"
                                  placeholder={t("delete_dialog.placeholder")}
                                  autoComplete="off"
                                />
                                {isInvalid && (
                                  <FieldError
                                    id="requiredPhraseError"
                                    errors={field.state.meta.errors}
                                    aria-live="polite"
                                  />
                                )}
                              </Field>
                            );
                          }}
                        </form.Field>
                      </FieldGroup>
                    </div>
                  </form>
                </div>

                <DialogFooter className="bg-muted/30 p-4 mb-1 mx-2 border-t border-border gap-2">
                  <DialogClose
                    render={
                      <Button
                        variant="outline"
                        className="cursor-pointer border-border hover:bg-accent font-semibold">
                        {t("delete_dialog.cancel")}
                      </Button>
                    }
                  />
                  <Button
                    type="submit"
                    form="delete-subscription-form"
                    disabled={!form.state.canSubmit}
                    variant="destructive"
                    className="cursor-pointer font-bold shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase">
                    {t("delete_dialog.confirm")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );
      },
    },
  ];
};
