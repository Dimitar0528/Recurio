import {index, numeric, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const billingCycleEnum = pgEnum('billing_cycle', ["Monthly", "Annual"])
export const categoryEmum = pgEnum("category", [
  "Entertainment",
  "Utilities",
  "Fitness",
  "Software",
  "Education",
  "Other",
]);
export const statusEnum = pgEnum("status",["Active", "Paused", "Cancelled"])

const timestamps = {
  updated_at: timestamp({ withTimezone: true }),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  deleted_at: timestamp({ withTimezone: true }),
};

export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  billingCycle: billingCycleEnum().notNull(),
  nextBilling: timestamp({ withTimezone: true }).notNull().defaultNow(),
  category: categoryEmum().notNull(),
  status: statusEnum().notNull(),
  userId: uuid().notNull().defaultRandom(),
  ...timestamps
},(table)=>[
  index("name_idx").on(table.name)
]);
