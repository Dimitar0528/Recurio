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
import { subscriptionFormSchema, Subscription } from "@/lib/validations/form";
import {
  billingCycleEnum,
  Category,
  categoryEnum,
  statusEnum,
} from "@/lib/validations/enum";

import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { ChevronDownIcon } from "lucide-react";

import { format } from "date-fns";
import { bg, enUS } from "react-day-picker/locale";

import { advanceDateWithClamp } from "@/lib/utils";
import { createSubscription, updateSubscription } from "@/app/actions";
import { useLocale, useTranslations } from "next-intl";

type SubscriptionFormProps = {
  initialValues?: Subscription;
};

export default function SubscriptionForm({
  initialValues,
}: SubscriptionFormProps) {
  const locale = useLocale();
  const tReusable = useTranslations("Reusable");
  const t = useTranslations("dashboard_page.subscription_form_component");

  const dateLocale = locale === "bg" ? bg : enUS;

  const initialModifiedValues = initialValues
    && {
        ...initialValues,
        startDate: format(initialValues.startDate, "yyyy-MM-dd"),
        nextBilling: format(initialValues.nextBilling, "yyyy-MM-dd"),
        price: initialValues.price.toFixed(2),
      }

  const form = useForm({
    defaultValues: initialModifiedValues ?? {
      name: "",
      category: "",
      price: "",
      billingCycle: billingCycleEnum.options[0],
      startDate: new Date().toISOString().split("T")[0],
      nextBilling: advanceDateWithClamp(new Date(), { advanceMonthNumber: 1 })
        .toISOString()
        .split("T")[0],
      autoRenew: true,
      status: statusEnum.options[0],
    },
    validators: {
      onSubmit: subscriptionFormSchema,
    },
    onSubmit: async ({ value }) => {
      const result = subscriptionFormSchema.safeParse(value);
      if (!result.success) return toast.error(result.error.message);

      if (initialValues && initialModifiedValues === value) {
        return toast.info(t("messages.no_changes"));
      }

      if (initialValues && initialValues.id) {
        toast.success(t("messages.success_update"));
        await updateSubscription(initialValues.id, result.data);
      } else {
        toast.success(t("messages.success_create"));
        await createSubscription(result.data);
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
                  errors={field.state.meta.errors}
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
                        {categoryEnum.options.map((category) => (
                          <SelectItem key={category} value={category}>
                            {tReusable(`categories.${category}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      id="categoryError"
                      errors={field.state.meta.errors}
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
                  errors={field.state.meta.errors}
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
                      if (!value) return;
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
                    errors={field.state.meta.errors}
                    aria-live="polite"
                  />
                </FieldContent>
              </Field>
            )}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.Field name="startDate">
            {(field) => {
              const dateValue = field.state.value
                ? new Date(field.state.value)
                : undefined;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {t("fields.start_date")}
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
                        aria-describedby="startDateError"
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={dateLocale}
                          mode="single"
                          captionLayout="dropdown"
                          fixedWeeks
                          selected={dateValue}
                          onSelect={(selectedDate) => {
                            if (!selectedDate) return;
                            const formatted = format(
                              selectedDate,
                              "yyyy-MM-dd",
                            );
                            field.handleChange(formatted);
                            const options =
                              field.form.getFieldValue("billingCycle") ===
                              "Annual"
                                ? { advanceYearNumber: 1 }
                                : { advanceMonthNumber: 1 };
                            field.form.setFieldValue(
                              "nextBilling",
                              format(
                                advanceDateWithClamp(selectedDate, options),
                                "yyyy-MM-dd",
                              ),
                            );
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldError
                      id="startDateError"
                      errors={field.state.meta.errors}
                      aria-live="polite"
                    />
                </Field>
              );
            }}
          </form.Field>

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
                      errors={field.state.meta.errors}
                      aria-live="polite"
                    />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <form.Field name="autoRenew">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent className="flex flex-row items-center gap-4">
                  <div className="flex flex-col">
                    <FieldLabel htmlFor="switch-auto-renew">
                      {t("fields.auto_renew")}
                    </FieldLabel>
                    <FieldDescription>
                      {t("fields.auto_renew_description")}
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
                    errors={field.state.meta.errors}
                    aria-live="polite"
                  />
                </FieldContent>
              </Field>
            )}
          </form.Field>

          <form.Field name="status">
            {(field) => (
              <Field orientation="responsive">
                <FieldLabel className="mb-1.5" htmlFor="select-status">
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
                      className="w-full"
                      aria-describedby="statusError">
                      <SelectValue>
                        {tReusable(`status.${field.state.value}`)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusEnum.options.map((status) => (
                        <SelectItem key={status} value={status}>
                          {tReusable(`status.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    id="statusError"
                    errors={field.state.meta.errors}
                    aria-live="polite"
                  />
                </FieldContent>
              </Field>
            )}
          </form.Field>
        </div>
      </FieldGroup>
    </form>
  );
}
