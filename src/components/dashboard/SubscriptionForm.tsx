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
  subscriptionFormSchema,
  Subscription,
} from "@/lib/validations/form";
import { billingCycleEnum, categoryEnum, statusEnum } from "@/lib/validations/enum";

import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { ChevronDownIcon } from "lucide-react";

import { format } from "date-fns";
import { bg,enUS } from "react-day-picker/locale";


import { advanceDateWithClamp } from "@/lib/utils";
import { createSubscription, updateSubscription } from "@/app/actions";
import { useLocale } from "next-intl";

type SubscriptionFormProps = {
  initialValues?: Subscription;
};
export default function SubscriptionForm({
  initialValues
}: SubscriptionFormProps) {
  const locale = useLocale();
  const initialModifiedValues = initialValues
    ? {
        ...initialValues,
        startDate: format(initialValues.startDate, "yyyy-MM-dd"),
        nextBilling: format(initialValues.nextBilling, "yyyy-MM-dd"),
        price: initialValues.price.toFixed(2),
      }
    : undefined;
  const form = useForm({
    defaultValues: initialModifiedValues ?? {
      name: "",
      category: "",
      price: "",
      billingCycle: billingCycleEnum.options[0],
      startDate: new Date().toISOString().split("T")[0],
      nextBilling: advanceDateWithClamp(new Date(), {advanceMonthNumber: 1})
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
      
      if (initialValues && initialModifiedValues === value) return toast.info("No changes were made!");

      if (initialValues && initialValues.id) {
        toast.success("Subscription updated successfully!");
        await updateSubscription(initialValues.id, result.data);
      } else {
        toast.success("Subscription created successfully!");
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
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Netflix, Gym, etc."
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="category">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="responsive" data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel
                      className="mb-1.5"
                      htmlFor="form-tanstack-select-language">
                      Category
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (value) field.handleChange(value);
                      }}>
                      <SelectTrigger
                        id="form-tanstack-select-language"
                        aria-invalid={isInvalid}
                        className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryEnum.options.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                </Field>
              );
            }}
          </form.Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="price">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Price (€) </FieldLabel>
                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="9.99 €"
                    autoComplete="off"
                    className="w-full"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="billingCycle">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel
                      className="mb-1.75"
                      htmlFor="form-tanstack-select-language">
                      Billing Cycle
                    </FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (!value) return;
                        field.handleChange(value);
                        const advanceDateOptions =
                          value === "Annual"
                            ? { advanceYearNumber: 1 }
                            : { advanceMonthNumber: 1 };

                        const nextBillingDate = format(
                          advanceDateWithClamp(new Date(), advanceDateOptions),
                          "yyyy-MM-dd",
                        );
                        field.form.setFieldValue(
                          "nextBilling",
                          nextBillingDate,
                        );
                      }}>
                      <SelectTrigger
                        id="form-tanstack-select-language"
                        aria-invalid={isInvalid}
                        className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {billingCycleEnum.options.map((cycle) => (
                          <SelectItem key={cycle} value={cycle}>
                            {cycle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              );
            }}
          </form.Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="startDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const dateValue = field.state.value
                ? new Date(field.state.value)
                : undefined;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          id={field.name}
                          className="w-32 justify-between font-normal">
                          {dateValue ? (
                            format(dateValue, "PP", {
                              locale: locale === "bg" ? bg : enUS,
                            })
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={locale === "bg" ? bg : enUS}
                        mode="single"
                        captionLayout="dropdown"
                        fixedWeeks
                        selected={dateValue}
                        onSelect={(selectedDate) => {
                          if (!selectedDate) return;
                          const startDate = format(selectedDate, "yyyy-MM-dd");
                          field.handleChange(startDate);

                          const advanceDateOptions =
                            field.form.getFieldValue("billingCycle") ===
                            "Annual"
                              ? { advanceYearNumber: 1 }
                              : { advanceMonthNumber: 1 };

                          const nextBillingDate = format(
                            advanceDateWithClamp(
                              selectedDate,
                              advanceDateOptions,
                            ),
                            "yyyy-MM-dd",
                          );
                          field.form.setFieldValue(
                            "nextBilling",
                            nextBillingDate,
                          );
                        }}
                        defaultMonth={dateValue || undefined}
                      />
                    </PopoverContent>
                  </Popover>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="nextBilling">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const dateValue = field.state.value
                ? new Date(field.state.value)
                : undefined;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Next Billing</FieldLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          id={field.name}
                          className="w-32 justify-between font-normal">
                          {dateValue ? (
                            format(dateValue, "PP", {
                              locale: locale === "bg" ? bg : enUS,
                            })
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={locale === "bg" ? bg : enUS}
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <form.Field
            name="autoRenew"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <FieldContent className="flex flex-row items-center gap-4">
                    <div className="flex flex-col">
                      <FieldLabel htmlFor="form-tanstack-switch-twoFactor">
                        Auto Renew
                      </FieldLabel>
                      <FieldDescription>
                        Disable auto renewing.
                      </FieldDescription>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Switch
                      id="form-tanstack-switch-twoFactor"
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                      aria-invalid={isInvalid}
                    />
                  </FieldContent>
                </Field>
              );
            }}
          />
          <form.Field name="status">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="responsive" data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel
                      className="mb-1.5"
                      htmlFor="form-tanstack-select-language">
                      Status
                    </FieldLabel>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (value) field.handleChange(value);
                      }}>
                      <SelectTrigger
                        id="form-tanstack-select-language"
                        aria-invalid={isInvalid}
                        className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusEnum.options.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              );
            }}
          </form.Field>
        </div>
      </FieldGroup>
    </form>
  );
}
