import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/db";
import {
  subscriptionBillingEventsTable,
  subscriptionsTable,
} from "@/db/schema";
import { asc, desc, getTableColumns, eq, and, isNull } from "drizzle-orm";
import { verifyUser } from "../users/verifyUser";

export async function getUserSubscriptions() {
  const userId = await verifyUser();
  return await getSubscriptionsData(userId);
}

export async function getUserBillingEvents() {
  const userId = await verifyUser();
  return await getBillingEventsData(userId);
}

async function getSubscriptionsData(userID: string) {
  "use cache";
  cacheTag(`subscriptions-${userID}`);
  // This cache will revalidate after 12h even if no explicit
  // revalidate instruction was received
  cacheLife("halfDay");
  const { updatedAt, deletedAt, userId, ...rest } =
    getTableColumns(subscriptionsTable);
  const rawData = await db
    .select({ ...rest })
    .from(subscriptionsTable)
    .where(and(eq(userId, userID), isNull(subscriptionsTable.deletedAt)))
    .orderBy(asc(subscriptionsTable.nextBilling));

  const data = rawData.map((row) => ({
    ...row,
    price: Number(row.price),
  }));

  return data;
}

async function getBillingEventsData(userId: string) {
  "use cache";
  cacheTag(`billing-events-${userId}`);
  cacheLife("halfDay");
  const rawData = await db
    .select({
      amount: subscriptionBillingEventsTable.amount,
      chargedAt: subscriptionBillingEventsTable.chargedAt,
      source: subscriptionBillingEventsTable.source,
      subscriptionId: subscriptionBillingEventsTable.subscriptionId,
      id: subscriptionBillingEventsTable.id,
    })
    .from(subscriptionBillingEventsTable)
    .where(
      and(
        eq(subscriptionBillingEventsTable.userId, userId),
        isNull(subscriptionBillingEventsTable.deletedAt),
      ),
    )
    .orderBy(
      desc(subscriptionBillingEventsTable.chargedAt),
    );

  return rawData.map((event) => ({
    ...event,
    amount: Number(event.amount),
  }));
}
