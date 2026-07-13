import "server-only";
import {
  ChangePriceReason,
  subscriptionBaseSchema,
  SubscriptionFormValues,
} from "@/lib/validations/schemas";
import { db } from "@/db/db";
import {
  subscriptionPriceHistoryTable,
  subscriptionBillingEventsTable,
  subscriptionsTable,
} from "@/db/schema";
import { cacheLife, cacheTag, refresh, revalidatePath, updateTag } from "next/cache";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { DatabaseError } from "pg";
import { DrizzleQueryError } from "drizzle-orm/errors";

import { verifyUser } from "../users/verifyUser";
import {
  isDue,
  canGenerateCharge,
  getNextBillingDateFromCycle,
  getManualRenewalGraceDate,
  isManualGraceExpired,
} from "@/lib/utils";
import { startOfDay, subMonths, subYears } from "date-fns";
import { enforceRateLimit, rateLimiters } from "@/lib/security/rate_limits";
import { billingCycleEnum, billingEntryModeEnum } from "@/lib/validations/enums";

async function getOwnedSubscriptionOrThrow(id: string, userId: string) {
  const [subscription] = await db
    .select({
      id: subscriptionsTable.id,
      userId: subscriptionsTable.userId,
      price: subscriptionsTable.price,
      billingCycle: subscriptionsTable.billingCycle,
      status: subscriptionsTable.status,
      nextBilling: subscriptionsTable.nextBilling,
      autoRenew: subscriptionsTable.autoRenew,
      manualRenewalGraceUntil: subscriptionsTable.manualRenewalGraceUntil,
    })
    .from(subscriptionsTable)
    .where(
      and(eq(subscriptionsTable.id, id), eq(subscriptionsTable.userId, userId)),
    )
    .limit(1);

  if (!subscription) {
    throw new Error("Subscription not found");
  }
  return subscription;
}

async function invalidateUserSubscriptionCacheData(userId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/planner")
  updateTag(`subscriptions-${userId}`);
  updateTag(`billing-events-${userId}`);
}

export async function insertUserSubscription(
  subscription: SubscriptionFormValues,
) {
  const userId = await verifyUser();
  await enforceRateLimit(rateLimiters.createSubscription, userId);

  const result = subscriptionBaseSchema.safeParse(subscription);
  if (!result.success) throw new Error("Invalid subscription data shape!");

  const parsedSubscription = result.data;
  let chargedAtDate;
  switch (parsedSubscription.billingCycle) {
    case billingCycleEnum.options[2]:
      chargedAtDate = subYears(parsedSubscription.nextBilling, 1);
      break;
    case billingCycleEnum.options[1]:
      chargedAtDate = subMonths(parsedSubscription.nextBilling, 3);
      break;
    default:
      chargedAtDate = subMonths(parsedSubscription.nextBilling, 1);
  }
  try {
      const [createdSubscription] = await db
        .insert(subscriptionsTable)
        .values({
          name: parsedSubscription.name,
          price: parsedSubscription.price.toFixed(2),
          billingCycle: parsedSubscription.billingCycle,
          nextBilling: parsedSubscription.nextBilling,
          category: parsedSubscription.category,
          status: parsedSubscription.status,
          statusChangedAt: chargedAtDate,
          lastRenewedAt: chargedAtDate,
          userId: userId,
        })
        .returning({
          id: subscriptionsTable.id,
          billingCycle: subscriptionsTable.billingCycle,
          nextBilling: subscriptionsTable.nextBilling,
        });

      const shouldCreateInitialBillingEvent =
        subscription.billingEntryMode === billingEntryModeEnum.options[0];
          
      if (shouldCreateInitialBillingEvent) {
        await db.insert(subscriptionBillingEventsTable).values({
          subscriptionId: createdSubscription.id,
          userId,
          amount: parsedSubscription.price.toFixed(2),
          chargedAt: chargedAtDate,
          source: "initial",
        });
      }

    await invalidateUserSubscriptionCacheData(userId);
  } catch (err) {
    if (
      err instanceof DrizzleQueryError &&
      err.cause instanceof DatabaseError
    ) {
      if (err.cause.code === "23505") {
        throw new Error("SUB_ALREADY_EXISTS");
      }
    }
  }
}

export async function updateUserSubscription(
  id: string,
  subscription: SubscriptionFormValues,
  changePriceReason: ChangePriceReason,
) {
  const userId = await verifyUser();
  // await enforceRateLimit(rateLimiters.updateSubscription, userId);

  const result = subscriptionBaseSchema.safeParse(subscription);
  if (!result.success) throw new Error("Invalid subscription data shape!");

  const parsedSubscription = result.data;
  const now = new Date();
  const existingSubscription = await getOwnedSubscriptionOrThrow(id, userId);
  const oldPrice = Number(existingSubscription.price);
  const newPrice = parsedSubscription.price
  const priceChanged =
    oldPrice !== newPrice &&
    changePriceReason != null &&
    changePriceReason !== "Correcting";

  const [updatedSubscription] = await db
    .update(subscriptionsTable)
    .set({
      name: parsedSubscription.name,
      category: parsedSubscription.category,
      price: parsedSubscription.price.toFixed(2),
      billingCycle: parsedSubscription.billingCycle,
      nextBilling: parsedSubscription.nextBilling,
      autoRenew: parsedSubscription.autoRenew,
      status: parsedSubscription.status,
      statusChangedAt:
        existingSubscription.status !== parsedSubscription.status
          ? now
          : undefined,
    })
    .where(
      and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.id, id)),
    )
    .returning({ id: subscriptionsTable.id, price: subscriptionsTable.price });

    if (priceChanged) {
      await db.insert(subscriptionPriceHistoryTable).values({
        subscriptionId: updatedSubscription.id,
        oldPrice: oldPrice.toFixed(2),
        newPrice: newPrice.toFixed(2),
        changeReason: changePriceReason,
      });
      updateTag(`price-history-${updatedSubscription.id}`);
      refresh();
    }
  await invalidateUserSubscriptionCacheData(userId);
}

export async function deleteUserSubscription(id: string) {
  const userId = await verifyUser();
  await enforceRateLimit(rateLimiters.deleteSubscription, userId);
  const result = await db
    .update(subscriptionsTable)
    .set({
      deletedAt: new Date(),
    })
    .where(
      and(
        eq(subscriptionsTable.userId, userId),
        eq(subscriptionsTable.id, id),
        isNull(subscriptionsTable.deletedAt),
      ),
    )
    .returning({ id: subscriptionsTable.id });

  if (result.length === 0) {
    throw new Error("Subscription not found or already deleted");
  }
  await invalidateUserSubscriptionCacheData(userId);
}

export async function undoDeleteUserSubscription(id: string) {
  const userId = await verifyUser();

  const result = await db
    .update(subscriptionsTable)
    .set({
      deletedAt: null,
    })
    .where(
      and(
        eq(subscriptionsTable.userId, userId),
        eq(subscriptionsTable.id, id),
        isNotNull(subscriptionsTable.deletedAt),
      ),
    )
    .returning({ id: subscriptionsTable.id });

  if (result.length === 0) {
    throw new Error("Not found or not deleted");
  }
  await invalidateUserSubscriptionCacheData(userId);
}

export async function getProcessDueRenewalsForUser() {
  const userId = await verifyUser();
  const now = startOfDay(new Date());
  return await processDueRenewalsForUser(userId, now);
}

export async function processDueRenewalsForUser(userId: string, now: Date) {
  "use cache";
  cacheTag(`process-due-renewal-subs-${userId}`);
  cacheLife("halfDay");

  const subscriptions = await db
    .select({
      id: subscriptionsTable.id,
      userId: subscriptionsTable.userId,
      price: subscriptionsTable.price,
      billingCycle: subscriptionsTable.billingCycle,
      status: subscriptionsTable.status,
      nextBilling: subscriptionsTable.nextBilling,
      autoRenew: subscriptionsTable.autoRenew,
      manualRenewalGraceUntil: subscriptionsTable.manualRenewalGraceUntil,
      deletedAt: subscriptionsTable.deletedAt,
      createdAt: subscriptionsTable.createdAt,
    })
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, userId),
        isNull(subscriptionsTable.deletedAt),
      ),
    );

    for (const subscription of subscriptions) {
      if (subscription.deletedAt) continue;
      if (!isDue(subscription.nextBilling, now)) continue;

      if (!canGenerateCharge(subscription.status)) {
        continue;
      }

      if (subscription.autoRenew) {
        const nextBilling = getNextBillingDateFromCycle(
          subscription.nextBilling,
          subscription.billingCycle,
        );

        const updated = await db
          .update(subscriptionsTable)
          .set({
            nextBilling,
            lastRenewedAt: now,
            manualRenewalGraceUntil: null,
            reminderSentAt: null,
          })
          .where(
            and(
              eq(subscriptionsTable.id, subscription.id),
              eq(subscriptionsTable.userId, userId),
              eq(subscriptionsTable.nextBilling, subscription.nextBilling),
            ),
          )
          .returning({ id: subscriptionsTable.id });

        if (updated.length === 0) {
          continue;
        }

        await db.insert(subscriptionBillingEventsTable).values({
          subscriptionId: subscription.id,
          userId,
          amount: subscription.price,
          chargedAt: now,
          source: "auto",
        });
      }

      if (!subscription.manualRenewalGraceUntil) {
        const graceUntil = getManualRenewalGraceDate(subscription.nextBilling);

        await db
          .update(subscriptionsTable)
          .set({
            manualRenewalGraceUntil: graceUntil,
          })
          .where(
            and(
              eq(subscriptionsTable.id, subscription.id),
              eq(subscriptionsTable.userId, userId),
            ),
          );
        continue;
      }

      if (isManualGraceExpired(subscription.manualRenewalGraceUntil, now)) {
        await db
          .update(subscriptionsTable)
          .set({
            status: "Cancelled",
            statusChangedAt: now,
            manualRenewalGraceUntil: null,
            reminderSentAt: null,
          })
          .where(
            and(
              eq(subscriptionsTable.id, subscription.id),
              eq(subscriptionsTable.userId, userId),
            ),
          );
      }
    }
}

export async function confirmManualRenewalForUser(id: string) {
  const userId = await verifyUser();
  const now = startOfDay(new Date());
  const subscription = await getOwnedSubscriptionOrThrow(id, userId);

  if (!canGenerateCharge(subscription.status)) {
    return;
  }

  const nextBilling = getNextBillingDateFromCycle(
    subscription.nextBilling,
    subscription.billingCycle,
  );

    await db.insert(subscriptionBillingEventsTable).values({
      subscriptionId: subscription.id,
      userId,
      amount: subscription.price,
      chargedAt: now,
      source: "manual",
    });
    const updated = await db
      .update(subscriptionsTable)
      .set({
        nextBilling,
        lastRenewedAt: now,
        manualRenewalGraceUntil: null,
      })
      .where(
        and(
          eq(subscriptionsTable.id, subscription.id),
          eq(subscriptionsTable.userId, userId),
          eq(subscriptionsTable.nextBilling, subscription.nextBilling),
        ),
      )
      .returning({ id: subscriptionsTable.id });

    if (updated.length === 0) {
      throw new Error("Concurrent update detected");
    }

  await invalidateUserSubscriptionCacheData(userId);
}

export async function declineManualRenewalForUser(id: string) {
  const userId = await verifyUser();
  const now = new Date();
  await getOwnedSubscriptionOrThrow(id, userId);

  const result = await db
    .update(subscriptionsTable)
    .set({
      status: "Cancelled",
      statusChangedAt: now,
      manualRenewalGraceUntil: null,
    })
    .where(
      and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.id, id)),
    )
    .returning({ id: subscriptionsTable.id });

  if (result.length === 0) {
    throw new Error("Update failed");
  }
  await invalidateUserSubscriptionCacheData(userId);
}
