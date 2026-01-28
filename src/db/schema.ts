import {index, numeric, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { billingCycleEnum, categoryEnum, statusEnum } from "@/lib/validations/form";
export const dbBillingCycleEnum = pgEnum("billing_cycle", billingCycleEnum.enum);
export const dbCategoryEnum = pgEnum("category", categoryEnum.enum);
export const dbStatusEnum = pgEnum("status", statusEnum.enum);

const timestamps = {
  updated_at: timestamp({ withTimezone: true }).$onUpdate(()=> new Date()),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  deleted_at: timestamp({ withTimezone: true }),
};

export const subscriptionsTable = pgTable(
  "subscriptions",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 50 }).notNull(),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    billingCycle: dbBillingCycleEnum().notNull(),
    nextBilling: timestamp({ withTimezone: true }).notNull().defaultNow(),
    category: dbCategoryEnum().notNull(),
    status: dbStatusEnum().notNull(),
    userId: uuid().notNull().defaultRandom(),
    ...timestamps,
  },
  (table) => [index("name_idx").on(table.name)],
);
