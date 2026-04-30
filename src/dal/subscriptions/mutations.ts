import "server-only";
import { SubscriptionFormValues } from "@/lib/validations/schemas";
import { db } from "@/db/db";
import {
  subscriptionBillingEventsTable,
  subscriptionsTable,
} from "@/db/schema";
import { cacheLife, cacheTag, revalidatePath, updateTag } from "next/cache";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { verifyUser } from "../users/verifyUser";
import {
  setDateHoursToZero,
  isDue,
  canGenerateCharge,
  getNextBillingDateFromCycle,
  getManualRenewalGraceDate,
  isManualGraceExpired,
} from "@/lib/utils";
import { BillingCycle, Status } from "@/lib/validations/enums";

type RenewalDecisionStatus = "Paused" | "Cancelled";

type OwnedSubscription = {
  id: string;
  userId: string;
  price: string;
  billingCycle: BillingCycle;
  status: Status;
  nextBilling: Date;
  autoRenew: boolean;
  manualRenewalGraceUntil: Date | null;
};

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
  return subscription as OwnedSubscription;
}

async function invalidateSubscriptionDashboardCache(userId: string) {
  revalidatePath("/dashboard");
  updateTag(`subscriptions-${userId}`);
  updateTag(`billing-events-${userId}`);
}

export async function insertUserSubscription(
  subscription: SubscriptionFormValues,
) {
  const userId = await verifyUser();
  const now = new Date();

  await db.transaction(async (tx) => {
    const [createdSubscription] = await tx
      .insert(subscriptionsTable)
      .values({
        name: subscription.name,
        price: subscription.price.toFixed(2),
        billingCycle: subscription.billingCycle,
        nextBilling: subscription.nextBilling,
        category: subscription.category,
        status: subscription.status,
        statusChangedAt: now,
        lastRenewedAt: now,
        userId: userId,
      })
      .returning({
        id: subscriptionsTable.id,
      });

    await tx.insert(subscriptionBillingEventsTable).values({
      subscriptionId: createdSubscription.id,
      userId,
      amount: subscription.price.toFixed(2),
      chargedAt: now,
      source: "initial",
    });
  });
  await invalidateSubscriptionDashboardCache(userId);
}

export async function updateUserSubscription(
  id: string,
  subscription: SubscriptionFormValues,
) {
  const userId = await verifyUser();
  const now = new Date();
  const existingSubscription = await getOwnedSubscriptionOrThrow(id, userId);

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
      statusChangedAt:
        existingSubscription.status !== subscription.status ? now : undefined,
    })
    .where(
      and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.id, id)),
    );

  await invalidateSubscriptionDashboardCache(userId);
}

export async function deleteUserSubscription(id: string) {
  const userId = await verifyUser();

  await db
    .update(subscriptionsTable)
    .set({
      deletedAt: new Date(),
    })
    .where(
      and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.id, id)),
    );

  await invalidateSubscriptionDashboardCache(userId);
}

export async function undoDeleteUserSubscription(id: string) {
  const userId = await verifyUser();

  await db
    .update(subscriptionsTable)
    .set({
      deletedAt: null,
    })
    .where(
      and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.id, id)),
    );

  await invalidateSubscriptionDashboardCache(userId);
}

export async function getProcessDueRenewalsForUser() {
  const userId = await verifyUser();
  const now = setDateHoursToZero(new Date());
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
    .where(eq(subscriptionsTable.userId, userId));
  const subscriptionIds = subscriptions
    .filter((subscription) => !subscription.deletedAt)
    .map((subscription) => subscription.id);

  if (subscriptionIds.length > 0) {
    const existingEventRows = await db
      .select({ subscriptionId: subscriptionBillingEventsTable.subscriptionId })
      .from(subscriptionBillingEventsTable)
      .where(
        and(
          eq(subscriptionBillingEventsTable.userId, userId),
          inArray(
            subscriptionBillingEventsTable.subscriptionId,
            subscriptionIds,
          ),
          isNull(subscriptionBillingEventsTable.deletedAt),
        ),
      );
    const existingSubscriptionIds = new Set(
      existingEventRows.map((row) => row.subscriptionId),
    );
    const missingEvents = subscriptions.filter(
      (subscription) =>
        !subscription.deletedAt &&
        !existingSubscriptionIds.has(subscription.id),
    );
    if (missingEvents.length > 0) {
      await db.insert(subscriptionBillingEventsTable).values(
        missingEvents.map((subscription) => ({
          subscriptionId: subscription.id,
          userId,
          amount: subscription.price,
          chargedAt: subscription.createdAt,
          source: "initial" as const,
        })),
      );
    }
  }

  await db.transaction(async (tx) => {
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

        const updated = await tx
          .update(subscriptionsTable)
          .set({
            nextBilling,
            lastRenewedAt: now,
            manualRenewalGraceUntil: null,
          })
          .where(
            and(
              eq(subscriptionsTable.id, subscription.id),
              eq(subscriptionsTable.nextBilling, subscription.nextBilling),
            ),
          )
          .returning({ id: subscriptionsTable.id });

        if (updated.length === 0) {
          continue;
        }

        await tx.insert(subscriptionBillingEventsTable).values({
          subscriptionId: subscription.id,
          userId,
          amount: subscription.price,
          chargedAt: now,
          source: "auto",
        });
      }

      if (!subscription.manualRenewalGraceUntil) {
        const graceUntil = getManualRenewalGraceDate(subscription.nextBilling);

        await tx
          .update(subscriptionsTable)
          .set({
            manualRenewalGraceUntil: graceUntil,
          })
          .where(eq(subscriptionsTable.id, subscription.id));
        continue;
      }

      if (isManualGraceExpired(subscription.manualRenewalGraceUntil, now)) {
        await tx
          .update(subscriptionsTable)
          .set({
            status: "Paused",
            statusChangedAt: now,
            manualRenewalGraceUntil: null,
          })
          .where(eq(subscriptionsTable.id, subscription.id));
      }
    }
  });
}

export async function confirmManualRenewalForUser(id: string) {
  const userId = await verifyUser();
  const now = setDateHoursToZero(new Date());
  const subscription = await getOwnedSubscriptionOrThrow(id, userId);

  if (!canGenerateCharge(subscription.status)) {
    return;
  }

  const nextBilling = getNextBillingDateFromCycle(
    subscription.nextBilling,
    subscription.billingCycle,
  );

  await db.transaction(async (tx) => {
    await tx.insert(subscriptionBillingEventsTable).values({
      subscriptionId: subscription.id,
      userId,
      amount: subscription.price,
      chargedAt: now,
      source: "manual",
    });
    await tx
      .update(subscriptionsTable)
      .set({
        nextBilling,
        lastRenewedAt: now,
        manualRenewalGraceUntil: null,
      })
      .where(eq(subscriptionsTable.id, id));
  });

  await invalidateSubscriptionDashboardCache(userId);
}

export async function declineManualRenewalForUser(
  id: string,
  status: RenewalDecisionStatus,
) {
  const userId = await verifyUser();
  const now = new Date();
  await getOwnedSubscriptionOrThrow(id, userId);

  await db
    .update(subscriptionsTable)
    .set({
      status,
      statusChangedAt: now,
      manualRenewalGraceUntil: null,
    })
    .where(
      and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.id, id)),
    );

  await invalidateSubscriptionDashboardCache(userId);
}
