import "server-only";
import { Subscription } from "@/lib/validations/form";
import { db } from "@/db/db";
import { subscriptionsTable } from "@/db/schema";
import { revalidatePath, updateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { verifyUser } from "../users/verifyUser";

export async function insertUserSubscription(subscription: Subscription) {
  const userId = await verifyUser();
  
  await db.insert(subscriptionsTable).values({
    name: subscription.name,
    price: subscription.price.toFixed(2),
    billingCycle: subscription.billingCycle,
    startDate: subscription.startDate,
    nextBilling: subscription.nextBilling,
    category: subscription.category,
    status: subscription.status,
    userId: userId,
  });

  revalidatePath("/dashboard");
  updateTag(`subscriptions-${userId}`);
}

export async function updateUserSubscription(
  id: string,
  subscription: Subscription,
) {
  const userId = await verifyUser();

  await db
    .update(subscriptionsTable)
    .set({
      name: subscription.name,
      category: subscription.category,
      price: subscription.price.toFixed(2),
      billingCycle: subscription.billingCycle,
      startDate: subscription.startDate,
      nextBilling: subscription.nextBilling,
      autoRenew: subscription.autoRenew,
      status: subscription.status,
    })
    .where(
      and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.id, id)),
    );

  revalidatePath("/dashboard");
  updateTag(`subscriptions-${userId}`);
}

export async function deleteUserSubscription(id: string) {
  const userId = await verifyUser();

  await db
    .update(subscriptionsTable)
    .set({
      deleted_at: new Date(),
    })
    .where(
      and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.id, id)),
    );

  revalidatePath("/dashboard");
  updateTag(`subscriptions-${userId}`);
}

export async function undoDeleteUserSubscription(id: string) {
  const userId = await verifyUser();
  
  await db
    .update(subscriptionsTable)
    .set({
      deleted_at: null,
    })
    .where(
      and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.id, id)),
    );

  revalidatePath("/dashboard");
  updateTag(`subscriptions-${userId}`);
}
