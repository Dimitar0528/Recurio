import { RenewalReminderEmail } from "@/components/clerk/email-template";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { subscriptionsTable } from "@/db/schema";
import { priceFormatter } from "@/lib/utils";
import { addDays, startOfDay } from "date-fns";
import { and, between, eq, isNull } from "drizzle-orm";
import { Resend } from "resend";

export async function GET() {
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

  const result = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        const user = userMap.get(sub.userId);
        if (!user) return { status: "skipped", reason: "no_user", statusCode: 401 };

        const primaryEmail = user.emailAddresses.find(
          (e) => e.id === user.primaryEmailAddressId,
        )?.emailAddress;
        const settings = user.publicMetadata?.notificationSettings;
        if(settings?.renewalRemindersEnabled === false){
            return { status: "skipped", reason: "disabled_renewal_email_sending", statusCode: 400}
        }

        const recipient = settings?.customEmail ?? primaryEmail;
        if (!recipient) {
          return { status: "skipped", reason: "no_email", statusCode: 400 };
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
          return { status: "failed", reason: error.message, statusCode: error.statusCode };
        }

        await db
          .update(subscriptionsTable)
          .set({ reminderSentAt: new Date() })
          .where(eq(subscriptionsTable.id, sub.id));

        return { status: "sent", statusCode: 200 };
      } catch (err) {
        console.error("Unexpected error:", err);
        return { status: "error", statusCode: 500 };
      }
    }),
  );
  return Response.json({ result });
}
