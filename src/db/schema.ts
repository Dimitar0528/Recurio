import {
  boolean,
  char,
  index,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  CATEGORY_VALUES,
  BILLING_CYCLE_VALUES,
  STATUS_VALUES,
} from "@/lib/validations/enums";

export const dbCategoryEnum = pgEnum("category", CATEGORY_VALUES);
export const dbBillingCycleEnum = pgEnum("billing_cycle", BILLING_CYCLE_VALUES);
export const dbStatusEnum = pgEnum("status", STATUS_VALUES);

const timestamps = {
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp({ withTimezone: true }),
};

export const subscriptionsTable = pgTable("subscriptions", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 50 }).notNull(),
    category: dbCategoryEnum().notNull(),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    billingCycle: dbBillingCycleEnum().notNull(),
    nextBilling: timestamp({ withTimezone: true }).notNull(),
    autoRenew: boolean().notNull().default(true),
    status: dbStatusEnum().notNull(),
    userId: char({ length: 32 }).notNull(),
    ...timestamps,
  },
  (table) => [index("name_idx").on(table.name)],
);