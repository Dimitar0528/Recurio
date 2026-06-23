"use server";

import {
  ChangePriceReason,
  SubscriptionFormValues,
} from "@/lib/validations/schemas";
import {
  confirmManualRenewalForUser,
  deleteUserSubscription,
  declineManualRenewalForUser,
  insertUserSubscription,
  undoDeleteUserSubscription,
  updateUserSubscription,
} from "@/dal/subscriptions/mutations";
import { updateUserNotificationsMetadata } from "@/dal/users/mutateMetadata";
import { getSubscriptionPriceHistoryData } from "@/dal/subscriptions/queries";
import { verifyUser } from "@/dal/users/verifyUser";

export async function createSubscription(subscription: SubscriptionFormValues) {
  await insertUserSubscription(subscription);
}

export async function updateSubscription(
  id: string,
  subscription: SubscriptionFormValues,
  changePriceReason: ChangePriceReason,
) {
  await updateUserSubscription(id, subscription, changePriceReason);
}

export async function deleteSubscription(id: string) {
  await deleteUserSubscription(id);
}

export async function undoDeleteSubscription(id: string) {
  await undoDeleteUserSubscription(id);
}

export async function confirmManualRenewal(id: string) {
  await confirmManualRenewalForUser(id);
}

export async function declineManualRenewal(
  id: string,
  status: "Paused" | "Cancelled",
) {
  await declineManualRenewalForUser(id, status);
}

export async function updateNotificationSettings(data: {
  renewalRemindersEnabled: boolean;
  deliveryMode: "clerk" | "custom";
  customEmail?: string;
}) {
  await updateUserNotificationsMetadata(data);
}

export async function getUserSubscriptionPriceHistoryAction(
  subscriptionId: string,
) {
  const userId = await verifyUser();
  return await getSubscriptionPriceHistoryData(userId, subscriptionId);
}