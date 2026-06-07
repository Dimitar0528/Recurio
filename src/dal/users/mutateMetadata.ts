import { clerkClient } from "@clerk/nextjs/server";
import { verifyUser } from "./verifyUser";
import { DEFAULT_NOTIFICATION_SETTINGS } from "@/components/clerk/NotificationSettings";

export async function updateUserNotificationsMetadata(data: {
  renewalRemindersEnabled: boolean;
  deliveryMode: "clerk" | "custom";
  customEmail?: string;
}) {
  const userId = await verifyUser();
  const clerk = await clerkClient();
  
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      notificationSettings: {
        renewalRemindersEnabled:
          data.renewalRemindersEnabled ??
          DEFAULT_NOTIFICATION_SETTINGS.renewalRemindersEnabled,
        deliveryMode:
          data.deliveryMode ?? DEFAULT_NOTIFICATION_SETTINGS.deliveryMode,
        customEmail: data.customEmail ?? null,
      },
    },
  });
}
