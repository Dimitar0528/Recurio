import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/db";
import {
  subscriptionBillingEventsTable,
  subscriptionsTable,
  subscriptionPriceHistoryTable,
  cancellationGuideTable,
} from "@/db/schema";
import {
  asc,
  desc,
  getTableColumns,
  eq,
  and,
  isNull,
  gte,
} from "drizzle-orm";
import { verifyUser } from "../users/verifyUser";
import { subYears } from "date-fns";

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
    .orderBy(
      asc(subscriptionsTable.status),
      asc(subscriptionsTable.nextBilling),
    );

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
  const threeYearsAgo = subYears(new Date(), 3);
  const rawData = await db
    .select({
      id: subscriptionBillingEventsTable.id,
      amount: subscriptionBillingEventsTable.amount,
      chargedAt: subscriptionBillingEventsTable.chargedAt,
      source: subscriptionBillingEventsTable.source,
      subscriptionName: subscriptionsTable.name,
      subscriptionCategory: subscriptionsTable.category,
    })
    .from(subscriptionBillingEventsTable)
    .innerJoin(
      subscriptionsTable,
      eq(subscriptionBillingEventsTable.subscriptionId, subscriptionsTable.id),
    )
    .where(
      and(
        eq(subscriptionBillingEventsTable.userId, userId),
        gte(subscriptionBillingEventsTable.chargedAt, threeYearsAgo),
      ),
    )
    .orderBy(desc(subscriptionBillingEventsTable.chargedAt));

  return rawData.map((event) => ({
    ...event,
    amount: Number(event.amount),
  }));
}

export async function getPriceHistoryData(
  userId: string,
  subscriptionId: string,
) {
  "use cache";
  cacheTag(`price-history-${subscriptionId}`);
  cacheLife("max");

  const rawData = await db
    .select({
      id: subscriptionPriceHistoryTable.id,
      oldPrice: subscriptionPriceHistoryTable.oldPrice,
      newPrice: subscriptionPriceHistoryTable.newPrice,
      changeReason: subscriptionPriceHistoryTable.changeReason,
      createdAt: subscriptionPriceHistoryTable.createdAt,
    })
    .from(subscriptionPriceHistoryTable)
    .innerJoin(
      subscriptionsTable,
      eq(subscriptionPriceHistoryTable.subscriptionId, subscriptionsTable.id),
    )
    .where(
      and(
        eq(subscriptionPriceHistoryTable.subscriptionId, subscriptionId),
        eq(subscriptionsTable.userId, userId),
      ),
    )
    .orderBy(desc(subscriptionPriceHistoryTable.createdAt));

  return rawData.map((row) => ({
    ...row,
    oldPrice: Number(row.oldPrice),
    newPrice: Number(row.newPrice),
  }));
}

function normalize(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "");
}
function isTokenMatch(subscriptionName: string, guideServiceName: string) {
  const subscriptionTokens = normalize(subscriptionName).split(/\s+/);
  const guideTokens = normalize(guideServiceName).split(/\s+/);
  return guideTokens.every((token) => subscriptionTokens.includes(token));
}

export async function getCancellationGuideData(serviceName: string) {
  "use cache";
  cacheTag(`cancellation-guide-${serviceName}`);
  cacheLife("max");

  const guides = await db.select().from(cancellationGuideTable);
  const guide = guides.find((g) => isTokenMatch(serviceName, g.service_name));
  return guide ?? null;
}