"use server";

import { SubscriptionFormValues } from "@/lib/validations/schemas";
import {
  deleteUserSubscription,
  insertUserSubscription,
  undoDeleteUserSubscription,
  updateUserSubscription,
} from "@/dal/subscriptions/mutations";

export async function createSubscription(subscription: SubscriptionFormValues) {
  await insertUserSubscription(subscription);
}

export async function updateSubscription(
  id: string,
  subscription: SubscriptionFormValues,
) {
  await updateUserSubscription(id, subscription);
}

export async function deleteSubscription(id: string) {
  await deleteUserSubscription(id);
}

export async function undoDeleteSubscription(id: string) {
  await undoDeleteUserSubscription(id);
}
