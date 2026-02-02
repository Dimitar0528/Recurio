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

import { createSubscription, updateSubscription } from "@/app/actions";
import { Switch } from "../ui/switch";

type SubscriptionFormProps = {
  initialValues?: Subscription;
};
export default function SubscriptionForm({
  initialValues
}: SubscriptionFormProps) {
  const initialModifiedValues = initialValues
    ? {
        ...initialValues,
        nextBilling: initialValues.nextBilling.toISOString().split("T")[0],
        price: initialValues.price.toFixed(2)
      }
    : undefined;
  const form = useForm({
    defaultValues: initialModifiedValues ?? {
      name: "",
      category: "",
      price: "",
      billingCycle: billingCycleEnum.options[0],
      nextBilling: new Date().toISOString().split("T")[0],
      autoRenew: true,
      status: statusEnum.options[0],
    },
    validators: {
      onSubmit: subscriptionFormSchema,
    },
    onSubmit: async ({ value }) => {
      const subscription = subscriptionFormSchema.parse(value);
      if(initialValues && initialModifiedValues === value) return toast.info("No changes were made!")
       if (initialValues && initialValues.id) {
         toast.success("Subscription updated successfully!");
         await updateSubscription(initialValues.id, subscription);
       } else {
         toast.success("Subscription created successfully!");
         await createSubscription(subscription);
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
          </form.Field>
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <form.Field name="nextBilling">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Next Billing </FieldLabel>
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
          </form.Field>
          <form.Field
            name="autoRenew"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field orientation="horizontal" data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="form-tanstack-switch-twoFactor">
                      Auto Renew
                    </FieldLabel>
                    <FieldDescription>
                      Disable auto renewing.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Switch
                    id="form-tanstack-switch-twoFactor"
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    aria-invalid={isInvalid}
                  />
                </Field>
              );
            }}
          />
        </div>
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
      </FieldGroup>
    </form>
  );
}
