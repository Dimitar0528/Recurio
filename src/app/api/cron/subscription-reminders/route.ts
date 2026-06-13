import { RenewalReminderEmail } from "@/components/clerk/email-template";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { subscriptionsTable } from "@/db/schema";
import { priceFormatter } from "@/lib/utils";
import { addDays, startOfDay } from "date-fns";
import { and, between, eq, isNull } from "drizzle-orm";
import { Resend } from "resend";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");
  if (!hasLocale(routing.locales, locale)) {
    return Response.json({ error: "Invalid locale" }, { status: 400 });
  }
    
  const resend = new Resend(process.env.RESEND_API_KEY);

  const now = new Date();
  const start = startOfDay(addDays(now, 7));
  const end = startOfDay(addDays(now, 8));
  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.status, "Active"),
        between(subscriptionsTable.nextBilling, start, end),
        isNull(subscriptionsTable.reminderSentAt),
      ),
    );
  if (subscriptions.length === 0) {
    return Response.json({ sent: 0 });
  }

  const userIds = [...new Set(subscriptions.map((s) => s.userId))];
  // Initialize clerkClient
  const client = await clerkClient();
  const users = await client.users.getUserList({
    userId: userIds,
  });
  const userMap = new Map(users.data.map((u) => [u.id, u]));

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        const user = userMap.get(sub.userId);
        if (!user) return { status: "skipped", reason: "no_user" };

        const primaryEmail = user.emailAddresses.find(
          (e) => e.id === user.primaryEmailAddressId,
        )?.emailAddress;
        const settings = user.publicMetadata?.notificationSettings;
        if(settings?.renewalRemindersEnabled === false){
            return { status: "skipped", reason: "disabled_renewal_email_sending"}
        }

        const recipient = settings?.customEmail ?? primaryEmail;
        if (!recipient) {
          return { status: "skipped", reason: "no_email" };
        }

        const { error } = await resend.emails.send({
          from: "Recurio <onboarding@resend.dev>",
          to: recipient,
          subject: `Reminder: ${sub.name} renews soon`,
          react: RenewalReminderEmail({
            subscriptionName: sub.name,
            nextBilling: sub.nextBilling,
            price: priceFormatter(Number(sub.price)),
            billingCycle: sub.billingCycle,
          }),
        });

        if (error) {
          console.error("Email failed to send:", error);
          return { status: "failed", id: sub.id };
        }

        await db
          .update(subscriptionsTable)
          .set({ reminderSentAt: new Date() })
          .where(eq(subscriptionsTable.id, sub.id));

        return { status: "sent", id: sub.id };
      } catch (err) {
        console.error("Unexpected error:", err);
        return { status: "error", id: sub.id };
      }
    }),
  );
}
