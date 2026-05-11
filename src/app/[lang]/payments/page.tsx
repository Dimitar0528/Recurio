import {
  getUserBillingEvents,
  getUserSubscriptions,
} from "@/dal/subscriptions/queries";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { startOfDay, differenceInDays } from "date-fns";
import { getSubscriptionsWithinTimeInterval } from "@/lib/utils";
import { TimelineSection } from "@/components/payments/TimeLineSection";
import { getSpendingDataForDateRange } from "@/lib/analytics/spending_for_date_ranges";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const locale = (await params).lang as Locale;
  setRequestLocale(locale);

  const userSubscriptions = await getUserSubscriptions();
  const upcomingSubscriptions = getSubscriptionsWithinTimeInterval(
    userSubscriptions,
    "upcoming-7-days",
  );
  const recentlyBilledSubscriptions = getSubscriptionsWithinTimeInterval(
    userSubscriptions,
    "previous-7-days",
  );
  const today = startOfDay(new Date());

  const billingEvents = await getUserBillingEvents();
  // const { monthlySpendData, yearlySpendData } =
  //   await getSpendingDataForDateRange(billingEvents);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-background text-foreground pb-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <section className="grid lg:grid-cols-12 gap-16 items-center relative py-8">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-screen h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

          <div className="lg:col-span-4 space-y-7 relative z-10">
            <div className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-black tracking-[-0.06em] leading-[0.95]">
                Transactional <br />
                <span className="text-muted-foreground italic font-medium">
                  Trajectory.
                </span>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              A high-fidelity view of your{" "}
              <span className="text-foreground font-bold">
                14-day fiscal window
              </span>
              . Observe the transition as near-term liabilities move across the
              threshold into verified settlements.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-black tracking-tight">
                  {upcomingSubscriptions.length}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                  Upcoming
                </p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-black tracking-tight">
                  {recentlyBilledSubscriptions.length}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                  Settled
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-8 relative z-10">
            <div className="absolute left-6 top-0 bottom-0 w-px">
              <div className="absolute inset-0 bg-linear-to-b from-amber-500/70 via-primary/60 to-emerald-500/70" />
              <div className="absolute inset-0 blur-sm bg-linear-to-b from-amber-500/40 via-primary/30 to-emerald-500/40" />
            </div>

            <div className="space-y-10 relative">
              <TimelineSection
                title={`Upcoming Payments`}
                items={upcomingSubscriptions}
                theme_color="amber"
                emptyMessage="Clear Horizon. No imminent charges."
                getLabel={(subscription) => {
                  const daysLeft = differenceInDays(
                    subscription.nextBilling,
                    today,
                  );
                  return `${daysLeft}d`;
                }}
                getTitle={(subscription) => subscription.name}
                getSubtitle={(subscription) => {
                  const daysLeft = differenceInDays(
                    subscription.nextBilling,
                    today,
                  );
                  return `Renews in ${daysLeft} days`;
                }}
                getPrice={(subscription) => subscription.price}
              />
              {/* Today Marker */}
              <div className="pl-16 py-5 relative">
                <div
                  className="absolute left-[18px] top-1/2 -translate-y-1/2
                   w-3 h-3 rounded-full bg-primary
                   ring-8 ring-primary/10
                   shadow-[0_0_22px_var(--color-primary)]"
                />
                <div className="h-px w-full bg-border/50 relative">
                  <span
                    className="absolute -top-3 left-0 bg-background pr-5
                     text-[10px] font-black uppercase
                     tracking-[0.3em] text-primary">
                    Today
                  </span>
                </div>
              </div>

              <TimelineSection
                title={`Recent Payments`}
                items={[...recentlyBilledSubscriptions].reverse()}
                theme_color="emerald"
                crossed
                emptyMessage="No recent settlements."
                getLabel={() => "Done"}
                getTitle={(subscription) => subscription.name}
                getSubtitle={(subscription) => {
                  const daysPassed = differenceInDays(
                    today,
                    subscription.lastRenewedAt,
                  );
                  if (daysPassed === 0) return "Paid today";
                  if (daysPassed === 1) return "Paid yesterday";
                  return `Paid ${daysPassed} days ago`;
                }}
                getPrice={(subscription) => subscription.price}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
