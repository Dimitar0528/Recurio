"use server"

import { Subscription } from "@/lib/validations/form";
import { db } from "@/lib/db";
import { subscriptionsTable } from "@/db/schema";
import { revalidatePath, updateTag } from "next/cache";
import { eq } from "drizzle-orm";

export async function createSubscription(input: Subscription) {
  await db.insert(subscriptionsTable).values({
    name: input.name,
    price: input.price.toFixed(2), 
    billingCycle: input.billingCycle,
    nextBilling: input.nextBilling,
    category: input.category,
    status: input.status,
  });
  revalidatePath("/dashboard")
  updateTag('subscriptions')
}

export async function updateSubscription(id: string, input: Subscription) {
  await db
    .update(subscriptionsTable)
    .set({
      name: input.name,
      price: input.price.toFixed(2),
      billingCycle: input.billingCycle,
      nextBilling: input.nextBilling,
      category: input.category,
      status: input.status,
    })
    .where(eq(subscriptionsTable.id, id));

  revalidatePath("/dashboard");
  updateTag("subscriptions");
}
