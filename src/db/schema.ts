import {
  boolean,
  char,
  index,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  CATEGORY_VALUES,
  BILLING_CYCLE_VALUES,
  STATUS_VALUES,
} from "@/lib/validations/enums";
import { sql } from "drizzle-orm";

export const dbCategoryEnum = pgEnum("category", CATEGORY_VALUES);
export const dbBillingCycleEnum = pgEnum("billing_cycle", BILLING_CYCLE_VALUES);
export const dbStatusEnum = pgEnum("status", STATUS_VALUES);

const timestamps = {
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp({ withTimezone: true }),
};

export const subscriptionsTable = pgTable(
  "subscriptions",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 50 }).notNull(),
    category: dbCategoryEnum().notNull(),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    billingCycle: dbBillingCycleEnum().notNull(),
    nextBilling: timestamp({ withTimezone: true }).notNull(),
    autoRenew: boolean().notNull().default(true),
    status: dbStatusEnum().notNull(),
    statusChangedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    lastRenewedAt: timestamp({ withTimezone: true }).notNull(),
    manualRenewalGraceUntil: timestamp({ withTimezone: true }),
    userId: char({ length: 32 }).notNull(),
    ...timestamps,
  },
  (table) => [
    index("name_idx").on(table.name),
    uniqueIndex("subNameUniquePerUser").on(
      table.userId,
      sql`lower(${table.name})`,
    ),
  ],
);

export const dbBillingEventSourceEnum = pgEnum("billing_event_source", [
  "initial",
  "auto",
  "manual",
] as const);

export const subscriptionBillingEventsTable = pgTable(
  "subscription_billing_events",
  {
    id: uuid().primaryKey().defaultRandom(),
    subscriptionId: uuid()
      .notNull()
      .references(() => subscriptionsTable.id, { onDelete: "cascade" }),
    userId: char({ length: 32 }).notNull(),
    amount: numeric({ precision: 10, scale: 2 }).notNull(),
    chargedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    source: dbBillingEventSourceEnum().notNull(),
    ...timestamps,
  },
  (table) => [
    index("subscription_billing_events_sub_idx").on(table.subscriptionId),
    index("subscription_billing_events_user_idx").on(table.userId),
    index("subscription_billing_events_charged_idx").on(table.chargedAt),
  ],
);
