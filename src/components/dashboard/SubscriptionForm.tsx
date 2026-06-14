"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Subscription,
  subscriptionFormSchema,
} from "@/lib/validations/schemas";
import {
  billingCycleEnum,
  billingEntryModeEnum,
  CATEGORY_VALUES,
  statusEnum,
  type Category,
} from "@/lib/validations/enums";

import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { ChevronDownIcon } from "lucide-react";

import { format } from "date-fns";
import { bg, enUS } from "react-day-picker/locale";

import { advanceDateWithClamp, localizeFieldErrors } from "@/lib/utils";
import { createSubscription, updateSubscription } from "@/app/actions";
import { useLocale, useTranslations } from "next-intl";

import { useDialogClose } from "@/context/subscription-dialog-context";
import { RateLimitError } from "@/lib/security/rate_limits";

type SubscriptionFormProps = {
  initialValues?: Subscription;
  shouldHideTrackingField?: boolean
};

export default function SubscriptionForm({
  initialValues,
  shouldHideTrackingField,
}: SubscriptionFormProps) {
  const closeDialog = useDialogClose();

  const locale = useLocale();
  const tReusable = useTranslations("Reusable");
  const tValidation = useTranslations("Validation");
  const t = useTranslations("dashboard_page.subscription_form_component");

  const LOCALIZED_ERROR_MESSAGES = {
    NAME_TOO_SHORT: tValidation("subscription.name.min", { min: 3 }),
    NAME_TOO_LONG: tValidation("subscription.name.max", { max: 50 }),

    PRICE_REQUIRED: tValidation("subscription.price.required"),
    PRICE_NOT_POSITIVE: tValidation("subscription.price.positive"),
    PRICE_DECIMALS: tValidation("subscription.price.decimal_count"),

    NEXT_BILLING_REQUIRED: tValidation("subscription.nextBilling.required"),
    NEXT_BILLING_INVALID: tValidation("subscription.nextBilling.invalid"),
    NEXT_BILLING_PAST: tValidation(
      "subscription.nextBilling.cannot_be_in_the_past",
    ),
    CATEGORY_INVALID: tValidation("subscription.category.invalid"),
  };

  const dateLocale = locale === "bg" ? bg : enUS;

  const initialModifiedValues = initialValues && {
    ...initialValues,
    nextBilling: format(initialValues.nextBilling, "yyyy-MM-dd"),
    price: initialValues.price.toFixed(2),
  };

  const form = useForm({
    defaultValues: initialModifiedValues ?? {
      name: "",
      category: "",
      price: "",
      billingCycle: billingCycleEnum.options[0],
      nextBilling: advanceDateWithClamp(new Date(), { advanceMonthNumber: 1 })
        .toISOString()
        .split("T")[0],
      autoRenew: true,
      status: statusEnum.options[0],
      billingEntryMode: billingEntryModeEnum.options[0],
    },
    validators: {
      onSubmit: subscriptionFormSchema,
    },
    onSubmit: async ({ value }) => {
      const result = subscriptionFormSchema.safeParse(value);
      if (!result.success) {
        return toast.error(result.error.message);
      }
      if (initialValues && initialModifiedValues === value) {
        return toast.info(t("messages.update.no_changes"));
      }
      if (initialValues?.id) {
        const loadingUpdateToast = toast.loading(t("messages.update.loading"));
        try {
          await updateSubscription(initialValues.id, result.data);
          toast.success(t("messages.update.success"), {
            id: loadingUpdateToast,
          });
          closeDialog();
        } catch (err) {
          const message =
            err instanceof RateLimitError
              ? t("messages.rate_limited")
              : t("messages.update.error");

          toast.error(message, { id: loadingUpdateToast });
        }
        return;
      }
      const loadingCreateToast = toast.loading(t("messages.create.loading"));
      try {
        await createSubscription(result.data);
        toast.success(t("messages.create.success"), {
          id: loadingCreateToast,
        });
        closeDialog();
      } catch (err) {
        if (err instanceof RateLimitError) {
          toast.error(t("messages.rate_limited"), {
            id: loadingCreateToast,
          });
        } else if (
          err instanceof Error &&
          err.message === "SUB_ALREADY_EXISTS"
        ) {
          toast.error(t("messages.create.error_already_exists"), {
            id: loadingCreateToast,
          });
        } else {
          toast.error(t("messages.create.error"), {
            id: loadingCreateToast,
          });
        }
      }
    },
  });

  return (
    <form
      id="subscription-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="name">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }>
                <FieldLabel htmlFor={field.name}>{t("fields.name")}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("fields.name_placeholder")}
                  autoComplete="on"
                  aria-describedby="nameError"
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                />
                <FieldError
                  id="nameError"
                  errors={localizeFieldErrors(
                    field.state.meta.errors,
                    LOCALIZED_ERROR_MESSAGES,
                  )}
                  aria-live="polite"
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="category">
            {(field) => {
              const typedCategory = field.state.value as Category;
              return (
                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel className="mb-1.5" htmlFor="select-category">
                      {t("fields.category")}
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (value) field.handleChange(value);
                      }}>
                      <SelectTrigger
                        id="select-category"
                        className="w-full"
                        aria-describedby="categoryError">
                        <SelectValue>
                          {field.state.value &&
                            tReusable(`categories.${typedCategory}`)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_VALUES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {tReusable(`categories.${category}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      id="categoryError"
                      errors={localizeFieldErrors(
                        field.state.meta.errors,
                        LOCALIZED_ERROR_MESSAGES,
                      )}
                      aria-live="polite"
                    />
                  </FieldContent>
                </Field>
              );
            }}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="price">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }>
                <FieldLabel htmlFor={field.name}>
                  {t("fields.price")}
                </FieldLabel>
                <Input
                  type="number"
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("fields.price_placeholder")}
                  className="w-full"
                  aria-describedby="priceError"
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  autoComplete="on"
                />
                <FieldError
                  id="priceError"
                  errors={localizeFieldErrors(
                    field.state.meta.errors,
                    LOCALIZED_ERROR_MESSAGES,
                  )}
                  aria-live="polite"
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="billingCycle">
            {(field) => (
              <Field>
                <FieldContent>
                  <FieldLabel className="mb-1.75" htmlFor="select-cycle">
                    {t("fields.billing_cycle")}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) => {
                      if (!value || value === field.state.value) return;
                      field.handleChange(value);
                      const options =
                        value === "Annual"
                          ? { advanceYearNumber: 1 }
                          : { advanceMonthNumber: 1 };
                      const nextDate = format(
                        advanceDateWithClamp(new Date(), options),
                        "yyyy-MM-dd",
                      );
                      field.form.setFieldValue("nextBilling", nextDate);
                    }}>
                    <SelectTrigger
                      id="select-cycle"
                      className="w-full"
                      aria-describedby="billingCycleError">
                      <SelectValue>
                        {tReusable(`billingCycle.${field.state.value}`)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {billingCycleEnum.options.map((cycle) => (
                        <SelectItem key={cycle} value={cycle}>
                          {tReusable(`billingCycle.${cycle}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    id="billingCycleError"
                    errors={localizeFieldErrors(
                      field.state.meta.errors,
                      LOCALIZED_ERROR_MESSAGES,
                    )}
                    aria-live="polite"
                  />
                </FieldContent>
              </Field>
            )}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <form.Field name="nextBilling">
            {(field) => {
              const dateValue = field.state.value
                ? new Date(field.state.value)
                : undefined;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {t("fields.next_billing")}
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className="w-32 justify-between font-normal">
                          {dateValue
                            ? format(dateValue, "PP", { locale: dateLocale })
                            : t("fields.date_placeholder")}
                          <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                      }
                      aria-describedby="nextBillingError"
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={dateLocale}
                        mode="single"
                        captionLayout="dropdown"
                        endMonth={
                          new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() + 18,
                          )
                        }
                        fixedWeeks
                        selected={dateValue}
                        onSelect={(selectedDate) => {
                          if (!selectedDate) return;
                          field.handleChange(
                            format(selectedDate, "yyyy-MM-dd"),
                          );
                        }}
                        defaultMonth={dateValue || undefined}
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError
                    id="nextBillingError"
                    errors={localizeFieldErrors(
                      field.state.meta.errors,
                      LOCALIZED_ERROR_MESSAGES,
                    )}
                    aria-live="polite"
                  />
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="autoRenew">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent className="flex flex-row items-center gap-4">
                  <div className="flex flex-col">
                    <FieldLabel htmlFor="switch-auto-renew">
                      {t("fields.auto_renew.name")}
                    </FieldLabel>
                    <FieldDescription>
                      {t("fields.auto_renew.description", {
                        value: String(field.state.value),
                      })}
                    </FieldDescription>
                  </div>
                  <Switch
                    id="switch-auto-renew"
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    aria-describedby="autoRenewError"
                  />
                  <FieldError
                    id="autoRenewError"
                    errors={localizeFieldErrors(
                      field.state.meta.errors,
                      LOCALIZED_ERROR_MESSAGES,
                    )}
                    aria-live="polite"
                  />
                </FieldContent>
              </Field>
            )}
          </form.Field>
        </div>
        <div
          className={` ${!shouldHideTrackingField ? "grid grid-cols-1 sm:grid-cols-3 gap-6 items-start" : ""}`}>
          <form.Field name="status">
            {(field) => (
              <Field>
                <FieldLabel className="mb-2" htmlFor="select-status">
                  {t("fields.status")}
                </FieldLabel>
                <FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) => {
                      if (value) field.handleChange(value);
                    }}>
                    <SelectTrigger
                      id="select-status"
                      className="w-full h-11 rounded-lg"
                      aria-describedby="statusError">
                      <SelectValue>
                        {tReusable(`status.${field.state.value}`)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      {statusEnum.options.map((status) => (
                        <SelectItem key={status} value={status}>
                          {tReusable(`status.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    id="statusError"
                    errors={localizeFieldErrors(
                      field.state.meta.errors,
                      LOCALIZED_ERROR_MESSAGES,
                    )}
                    aria-live="polite"
                  />
                </FieldContent>
              </Field>
            )}
          </form.Field>
          {!shouldHideTrackingField && (
            <form.Field name="billingEntryMode">
              {(field) => {
                const trackingOptions = [
                  {
                    value: billingEntryModeEnum.options[0],
                    label: t("fields.billingEntryMode.options.today"),
                  },
                  {
                    value: billingEntryModeEnum.options[1],
                    label: t("fields.billingEntryMode.options.next_cycle"),
                  },
                ] as const;
                return (
                  <Field className="col-span-2">
                    <FieldContent>
                      <FieldLabel className="mb-2">
                        {t("fields.billingEntryMode.name")}
                      </FieldLabel>
                      <div
                        role="radiogroup"
                        aria-label="Start tracking from"
                        className="grid grid-cols-2 gap-2 p-1 rounded-lg border bg-background">
                        {trackingOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={field.state.value === option.value}
                            onClick={() => field.handleChange(option.value)}
                            className={`w-full sm:w-auto px-0.5 py-1 rounded-md text-sm transition text-left sm:text-center cursor-pointer ${
                              field.state.value === option.value
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "hover:bg-muted"
                            }`}>
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <FieldError
                        id="billingEntryModeError"
                        errors={localizeFieldErrors(
                          field.state.meta.errors,
                          LOCALIZED_ERROR_MESSAGES,
                        )}
                        aria-live="polite"
                      />
                    </FieldContent>
                  </Field>
                );
              }}
            </form.Field>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
