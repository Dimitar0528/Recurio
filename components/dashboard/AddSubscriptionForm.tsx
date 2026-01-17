"use client"

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Field,
  FieldContent,
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

const billingCycleEnum = z.enum(["Monthly", "Annual"])
const categoryEnum = z.enum(["Entertainment", "Utilities", "Fitness", "Software", "Education", "Other"]);
const subScriptionStatusEnum = z.enum(["Active", "Paused", "Cancelled"]);

export const subscriptionFormSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3, "Subscription name must be at least 3 characters."),
  price: z
    .string()
    .min(1, "Price is required.")
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value > 0, {
      message: "Price must be a positive number.",
    }),
  billingCycle: billingCycleEnum,
  nextBilling: z
    .string()
    .min(1, "Next bill date is required.")
    .transform((value) => new Date(value))
    .refine((date) => date >= new Date(new Date().toDateString()), {
      message: "Date cannot be in the past",
    }).or(z.string()),
    category: categoryEnum,
    status: subScriptionStatusEnum
});

export default function AddSubscriptionForm() {
    const form = useForm({
      defaultValues: {
        name: "",
        price: "",
        billingCycle: billingCycleEnum.options[0],
        nextBilling: new Date().toISOString().split("T")[0],
        category: categoryEnum.options[0],
        status: subScriptionStatusEnum.options[0],
      },
      validators: {
        onSubmit: subscriptionFormSchema,
      },
      onSubmit: async ({ value }) => {
        toast.success("Form submitted successfully");
      },
    });
return (
  <form
    id="add-subscription-form"
    onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
    <FieldGroup>
      <form.Field
        name="name"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Name *</FieldLabel>
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
      />
      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="price"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Price (€) *</FieldLabel>
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
        />
        <form.Field
          name="billingCycle"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel
                    className="mb-1.75"
                    htmlFor="form-tanstack-select-language">
                    Billing Cycle *
                  </FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="nextBilling"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Next Bill Date *</FieldLabel>
                <Input
                  type="date"
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
        />
        <form.Field
          name="category"
          children={(field) => {
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                </FieldContent>
              </Field>
            );
          }}
        />
      </div>
      <form.Field
        name="status"
        children={(field) => {
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    {subScriptionStatusEnum.options.map((category) => (
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
      />
    </FieldGroup>
  </form>
);
}