"use client";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { AtSign, BellRing, Mail, ShieldCheck } from "lucide-react";
import { cn, localizeFieldErrors } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { updateNotificationSettings } from "@/app/actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Field, FieldError } from "../ui/field";
import { useForm } from "@tanstack/react-form";
import { customNotificationEmailSchema } from "@/lib/validations/schemas";

export const DEFAULT_NOTIFICATION_SETTINGS = {
  renewalRemindersEnabled: true,
  deliveryMode: "clerk" as const,
  customEmail: null,
};
export default function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailMode, setEmailMode] = useState<"clerk" | "custom">("clerk");

  const tValidation = useTranslations("Validation");
  const tName = useTranslations("custom_clerk_components.menu_items");
  const t = useTranslations("custom_clerk_components.notification_settings_component");

  const LOCALIZED_ERROR_MESSAGES = {
    CUSTOM_NOTIFICATION_EMAIL_REQUIRED: tValidation(
      "customNotificationEmail.min",
    ),
  };
  
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const settings =
    (user?.publicMetadata?.notificationSettings) ??
    DEFAULT_NOTIFICATION_SETTINGS;

  useEffect(() => {
    setNotificationsEnabled(settings.renewalRemindersEnabled);
    setEmailMode(settings.deliveryMode);

    form.setFieldValue("customNotificationEmail", settings.customEmail ?? "");
  }, [settings]);

  const form = useForm({
    defaultValues: { customNotificationEmail: settings?.customEmail ?? "" },
    onSubmit: async ({ value }) => {
      if (emailMode === "custom") {
        const result = customNotificationEmailSchema.safeParse(value);
        if (!result.success) {
          return toast.error(tValidation("customNotificationEmail.min"));
        }
      }
      toast.promise(
        updateNotificationSettings({
          renewalRemindersEnabled: notificationsEnabled,
          deliveryMode: emailMode,
          customEmail:
            emailMode === "custom" ? value.customNotificationEmail : undefined,
        }),
        {
          loading: t("update_metadata_messages.loading"),
          success: () => {
            user?.reload();
            return t("update_metadata_messages.success");
          },
          error: t("update_metadata_messages.error"),
        },
      );
    },
  });
  
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--color-primary),transparent_45%)]/12" />
      <div className="space-y-6">
        <div className="space-y-1 border-b pb-3">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-lg font-semibold">{tName("name")}</h2>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-6 border-b pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-primary" />
                <h3 className="font-medium">{t("get_notifications.title")}</h3>
              </div>
              <p className="max-w-md text-xs text-muted-foreground">
                {t("get_notifications.description")}
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              className="cursor-pointer"
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <h3 className="font-medium">{t("delivery_mail.title")}</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("delivery_mail.description")}
              </p>
            </div>

            <form
              id="custom-notification-email-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-2.5">
              <RadioGroup value={emailMode} onValueChange={setEmailMode}>
                <label
                  className={cn(
                    "group flex cursor-pointer items-center justify-between rounded-2xl border border-transparent px-3 py-2 transition-all",
                    "hover:bg-muted/50",
                    emailMode === "clerk" && "bg-primary/[0.07]",
                  )}>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                        emailMode === "clerk"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}>
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t("delivery_mail.account_mail_option")}
                      </p>
                      <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                  </div>
                  <RadioGroupItem value="clerk" />
                </label>
                <label
                  className={cn(
                    "group flex cursor-pointer flex-col gap-4 rounded-2xl border border-transparent px-4 py-4 transition-all",
                    "hover:bg-muted/50",
                    emailMode === "custom" && "bg-primary/[0.07]",
                  )}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                          emailMode === "custom"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}>
                        <AtSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {t("delivery_mail.custom_mail_option.title")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("delivery_mail.custom_mail_option.description")}
                        </p>
                      </div>
                    </div>
                    <RadioGroupItem value="custom" />
                  </div>
                  {emailMode === "custom" && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="overflow-hidden">
                      <form.Field name="customNotificationEmail">
                        {(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <Input
                                type="email"
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="notifications@example.com"
                                autoComplete="on"
                                className="h-10 rounded-xl bg-primary/25 shadow-none"
                                aria-describedby="customNotificationEmailError"
                              />
                              {isInvalid && (
                                <FieldError
                                  id="customNotificationEmailError"
                                  errors={localizeFieldErrors(
                                    field.state.meta.errors,
                                    LOCALIZED_ERROR_MESSAGES,
                                  )}
                                  aria-live="polite"
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.Field>
                    </motion.div>
                  )}
                </label>
              </RadioGroup>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {t("delivery_mail.change_text")}
                </p>
                <Button
                  type="submit"
                  form="custom-notification-email-form"
                  className="cursor-pointer bg-primary dark:bg-primary/50 dark:hover:bg-primary/70 text-primary-foreground hover:bg-primary/85 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {t("delivery_mail.save_changes")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
