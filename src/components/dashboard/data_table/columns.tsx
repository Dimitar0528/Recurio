"use client";
import * as z from "zod";

import { ColumnDef } from "@tanstack/react-table";
import { type Subscription} from "@/lib/validations/form";
import { AlertTriangle, Delete, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormatter, priceFormatter, SEVEN_DAYS_MS, FOURTEEN_DAYS_MS, setDateHoursToZero } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import SubscriptionDialog from "../SubscriptionDialog";
import SubscriptionForm from "../SubscriptionForm";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { deleteSubscription, undoDeleteSubscription } from "@/app/actions";

export const useColumns = (): ColumnDef<Subscription>[] => {
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("dashboard_page.data_table_component");
  const locale = useLocale();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="cursor-pointer"
          checked={
            table.getIsAllPageRowsSelected() ||
            table.getIsSomePageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
            "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
          Paused:
            "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
          Cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        };
        return (
          <div className="flex flex-col gap-2">
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-muted-foreground text-primary">
                {tReusable(`categories.${category}`)}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("table.columns.billing")}
              </span>
              <div className="flex flex-col">
                <span className="font-medium leading-none text-xs">
                  {formattedPrice} /{" "}
                  <span className="text-xs text-primary">
                    {tReusable(`billingCycle.${billingCycle}`)}
                  </span>
                </span>
                {billingCycle === "Annual" && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {t("table.badges.monthly_estimate", {
                      price: priceFormatter(price / 12),
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("table.columns.nextBilling")}
              </span>
              <span>{billingDate}</span>{" "}
              <Tooltip>
                <TooltipTrigger className="text-primary">
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

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("table.columns.status")}
              </span>
              <Badge variant="outline" className={`${statusClasses[status]}`}>
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
        />
      ),
      cell: ({ row }) => {
        const { name, category } = row.original;

        return (
          <div className="flex flex-col">
            <span className="font-medium leading-none">{name}</span>
            <span className="text-xs text-primary dark:text-primary mt-1">
              {tReusable(`categories.${category}`)}
            </span>
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
              <span className="text-xs text-primary">{tReusable(`billingCycle.${billingCycle}`)}</span>
            </span>
            {billingCycle === "Annual" && (
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

        const dailyTime = setDateHoursToZero(new Date()).getTime();
        const subscriptionTime = setDateHoursToZero(nextBilling).getTime();
        const isActiveAndExpiringSoonSub =
          status === "Active" &&
          subscriptionTime >= dailyTime &&
          subscriptionTime - dailyTime <= FOURTEEN_DAYS_MS &&
          subscriptionTime - dailyTime >= SEVEN_DAYS_MS;
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
                className="bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200 text-[11px]">
                {t("table.badges.expiring_soon")}
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
        />
      ),
      cell: ({ row }) => {
        const { status } = row.original;
        const statusClasses = {
          Active:
            "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
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
          onSubmit: async ({}) => {
            toast.promise(deleteSubscription(id), {
              loading: t("messages.deleting"),
              success: () => {
                return {
                  message: t("messages.deleted"),
                  action: {
                    label: t("messages.undo"),
                    onClick: async () => await undoDeleteSubscription(id),
                  },
                  duration: 8000,
                };
              },
              error: `${t("messages.error")}`,
            });
          },
        });
        return (
          <div className="flex gap-2 flex-col sm:flex-row">
            <SubscriptionDialog
              trigger={
                <Button
                  id="edit-btn"
                  aria-label="Edit button"
                  className="bg-background outline-solid outline-primary/20 cursor-pointer hover:scale-[1.05] active:scale-[0.98] transition-all">
                  <Edit className="text-primary" />
                </Button>
              }
              title={tReusable("dialog.title", {
                action: locale === "bg" ? "Редактирай" : "Edit ",
              })}
              description={tReusable("dialog.description")}
              submitLabel={tReusable("dialog.submit", {
                action: locale === "bg" ? "Редактирай" : "Edit",
              })}
              cancelLabel={tReusable("dialog.cancel")}>
              <SubscriptionForm initialValues={subscription} />
            </SubscriptionDialog>

            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    id="delete-btn"
                    aria-label="Delele button"
                    className="bg-background outline-solid outline-primary/20 cursor-pointer hover:scale-[1.05] active:scale-[0.98] transition-all">
                    <Delete className="text-destructive" />
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border shadow-2xl">
                <div className="bg-destructive/5 px-6 py-4 border-b border-destructive/10 flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-full text-destructive">
                    <AlertTriangle size={20} />
                  </div>
                  <DialogTitle className="text-destructive">
                    Are you absolutely sure?
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
                        {" "}
                        Once deleted, the subscription and all related data will
                        be
                        <strong className="text-foreground"> removed</strong>.
                      </p>
                      <div className="p-2 rounded-lg bg-muted/50 border border-border text-xs leading-normal">
                        <span className="font-bold text-foreground block mb-1 uppercase tracking-wider">
                          Statistical Impact
                        </span>
                        Deletion will affect aggregated subscription statistics
                        such as totals, averages, historical insights etc.
                        <span className="text-muted-foreground italic">
                          {" "}
                          These numbers will be recalculated and may no longer
                          reflect past reality.
                        </span>
                      </div>

                      <p className="text-xs bg-accent/50 p-2 rounded-lg border border-border">
                        <span className="font-bold">Recommendation:</span>{" "}
                        Deletion should only be performed for
                        <strong> extremely critical reasons</strong>. In most
                        cases, changing the status of the subscription to
                        <strong> &quot;Paused&quot;</strong> or{" "}
                        <strong>&quot;Cancelled&quot;</strong> is the more
                        appropriate and safer alternative.
                      </p>
                    </div>

                    <div className="space-y-3 select-none">
                      <Label
                        htmlFor="requiredPhrase"
                        className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground mt-4">
                        Verification Required
                      </Label>
                      <div className="p-3 bg-secondary/50 border border-border rounded-md text-sm mb-2">
                        <span className="text-muted-foreground">Type: </span>
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
                                  placeholder="Type the phrase above..."
                                  autoComplete="off"
                                />
                                {isInvalid && (
                                  <FieldError
                                    errors={field.state.meta.errors}
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
                        Cancel
                      </Button>
                    }
                  />
                  <Button
                    type="submit"
                    form="delete-subscription-form"
                    disabled={!form.state.canSubmit}
                    variant="destructive"
                    className="cursor-pointer font-bold shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase">
                    Delete Subscription
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];
} 