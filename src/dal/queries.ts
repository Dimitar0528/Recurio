import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db/db";
import { subscriptionsTable } from "@/db/schema";
import { asc, getTableColumns, eq, and, isNull } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getUserSubscriptions() {
  const { isAuthenticated, redirectToSignIn, userId } = await auth();
  if (!isAuthenticated) return redirectToSignIn();
  return await getSubscriptionsData(userId);
}

async function getSubscriptionsData(userID: string) {
  "use cache";
  cacheTag(`subscriptions-${userID}`);
  // This cache will revalidate after a day even if no explicit
  // revalidate instruction was received
  cacheLife("days");
  const { created_at, updated_at, deleted_at, userId, ...rest } =
    getTableColumns(subscriptionsTable);
  const rawData = await db
    .select({ ...rest })
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, userID),
        isNull(subscriptionsTable.deleted_at),
      ),
    )
    .orderBy(asc(subscriptionsTable.nextBilling));

  const data = rawData.map((row) => ({
    ...row,
    price: Number(row.price),
  }));

  return data;
}
