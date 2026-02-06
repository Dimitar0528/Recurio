import { columns } from "@/components/dashboard/data_table/columns";
import { DataTable } from "@/components/dashboard/data_table/DataTable";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  PieChart,
  Percent,
  Wallet,
  ArrowUpRight,
  BellRing,
} from "lucide-react";
import { cacheTag, cacheLife } from "next/cache";

import SubscriptionForm from "@/components/dashboard/SubscriptionForm";
import StatWidget from "@/components/dashboard/StatWidget";
import InsightsSidebar from "@/components/dashboard/InsightsSidebar";
import Link from "next/link";
import SubscriptionDialog from "@/components/dashboard/SubscriptionDialog";
import { priceFormatter, setDateHoursToZero, SEVEN_DAYS_MS } from "@/lib/utils";
import { getUserSubscriptions } from "@/dal/subscriptions/queries";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Locale } from "next-intl";

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const locale = (await params).lang as Locale;
  const t = await getTranslations({
    locale,
    namespace: "Metadata.dashboard_page",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export async function getDailyDate() {
  "use cache";
  cacheTag("getDailyDate");
  cacheLife("days");
  return new Date();
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const userSubscriptions = await getUserSubscriptions();

  const activeSubscriptions = userSubscriptions.filter(
    (subscription) => subscription.status === "Active",
  ).length;
  const monthlySpend = userSubscriptions.reduce(
    (acc, { price, billingCycle }) =>
      acc + (billingCycle === "Annual" ? price / 12 : price),
    0,
  );
  const roundedMonthlySpend = Number(monthlySpend.toFixed(2));
  const yearlySpend = roundedMonthlySpend * 12;

  const dailyTime = setDateHoursToZero(await getDailyDate()).getTime();
  const upcomingSubscriptions = userSubscriptions.filter((upcomingSubscription) => {
    const subscriptionTime = setDateHoursToZero(
      upcomingSubscription.nextBilling,
    ).getTime();
    return (
      subscriptionTime >= dailyTime &&
      subscriptionTime - dailyTime <= SEVEN_DAYS_MS
    );
  });
  const upcomingSubscriptionNames = upcomingSubscriptions.map(
    (upcomingSubscription) => upcomingSubscription.name,
  );
  const totalUpcomingAmount = upcomingSubscriptions.reduce(
    (sum, upcomingSubscription) => sum + upcomingSubscription.price,
    0,
  );
  const namesText =
    upcomingSubscriptionNames.length === 1
      ? upcomingSubscriptionNames[0]
      : upcomingSubscriptionNames.length === 2
        ? `${upcomingSubscriptionNames[0]} and ${upcomingSubscriptionNames[1]}`
        : `${upcomingSubscriptionNames[0]} and ${upcomingSubscriptionNames.length - 1} more`;
  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl text-center md:text-left font-bold tracking-tight mb-2">
              Workspace
            </h1>
            <p className="text-muted-foreground text-sm text-center md:text-left">
              You have{" "}
              <span className="text-foreground font-medium">
                {activeSubscriptions} active
              </span>{" "}
              subscriptions totaling{" "}
              <span className="text-foreground font-medium">
                {priceFormatter(roundedMonthlySpend)}
              </span>{" "}
              this month.
            </p>
          </div>
          <SubscriptionDialog
            trigger={
              <Button
                variant="outline"
                className="cursor-pointer font-bold text-sm uppercase tracking-wider bg-primary dark:bg-primary/50 dark:hover:bg-primary/70 text-primary-foreground hover:bg-primary/85 hover:text-white p-4 w-85 md:w-70">
                + Add Subscription
              </Button>
            }
            title="New Subscription"
            description="Add a new subscription. All fields are required."
            submitLabel="Create Subscription">
            <SubscriptionForm />
          </SubscriptionDialog>
        </div>
        {upcomingSubscriptions.length > 0 && (
          <Link
            href="/payments"
            className="mb-8 bg-primary/[0.03] border border-primary/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between group hover:bg-primary/[0.1] transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
                <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <BellRing size={20} />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold">Upcoming charges detected</p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-foreground font-bold">{namesText}</span>{" "}
                  will charge{" "}
                  <span className="text-foreground font-bold">
                    {priceFormatter(totalUpcomingAmount)}
                  </span>{" "}
                  in the next 7 days.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-4 md:mt-0">
              Review Schedule <ArrowUpRight size={14} />
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatWidget
            label="Current Monthly Spending"
            value={priceFormatter(roundedMonthlySpend)}
            trend="4% vs last mo"
            icon={Wallet}
          />
          <StatWidget
            label="Projected Yearly Spending"
            value={priceFormatter(yearlySpend)}
            icon={Calendar}
          />
          <StatWidget
            label="Active Subscriptions"
            value={activeSubscriptions}
            icon={PieChart}
          />
          <StatWidget label="Income Ratio" value="4.2%" icon={Percent} />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="px-2">
              <DataTable columns={columns} data={userSubscriptions} />
            </div>
          </div>

          <InsightsSidebar data={userSubscriptions} />
        </div>
      </div>
    </div>
  );
}
