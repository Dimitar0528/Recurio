import { auth } from "@clerk/nextjs/server";
import { Subscription } from "@/lib/validations/form";
import { db } from "@/db/db";
import { subscriptionsTable } from "@/db/schema";
import { revalidatePath, updateTag } from "next/cache";
import { and, eq } from "drizzle-orm";

export async function insertUserSubscription(subscription: Subscription) {
  const { isAuthenticated, redirectToSignIn, userId } = await auth();
  if (!isAuthenticated) return redirectToSignIn();

  await db.insert(subscriptionsTable).values({
    name: subscription.name,
    price: subscription.price.toFixed(2),
    billingCycle: subscription.billingCycle,
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
  const { isAuthenticated, redirectToSignIn, userId } = await auth();
  if (!isAuthenticated) return redirectToSignIn();

  await db
    .update(subscriptionsTable)
    .set({
      name: subscription.name,
      category: subscription.category,
      price: subscription.price.toFixed(2),
      billingCycle: subscription.billingCycle,
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
  const { isAuthenticated, redirectToSignIn, userId } = await auth();
  if (!isAuthenticated) return redirectToSignIn();
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
  const { isAuthenticated, redirectToSignIn, userId } = await auth();
  if (!isAuthenticated) return redirectToSignIn();
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