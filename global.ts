import { routing } from "@/i18n/routing";
import messages from "./messages/en.json";
import { RowData } from "@tanstack/react-table";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

declare global {
  interface UserPublicMetadata {
      notificationSettings?: {
        renewalRemindersEnabled: boolean;
        deliveryMode: "clerk" | "custom";
        customEmail: string | null;
    };
  }
  interface UserUnsafeMetadata {
    net_salary?: number | null
    overall_budget?: number | null;
  }
}