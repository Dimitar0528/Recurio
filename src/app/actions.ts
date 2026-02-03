"use server";

import { Subscription } from "@/lib/validations/form";
import {
  deleteUserSubscription,
  insertUserSubscription,
  undoDeleteUserSubscription,
  updateUserSubscription,
} from "@/dal/subscriptions/mutations";

export async function createSubscription(subscription: Subscription) {
  await insertUserSubscription(subscription);
}

export async function updateSubscription(
  id: string,
  subscription: Subscription,
) {
  await updateUserSubscription(id, subscription);
}

export async function deleteSubscription(id: string) {
  await deleteUserSubscription(id);
}

export async function undoDeleteSubscription(id: string) {
  await undoDeleteUserSubscription(id);
}