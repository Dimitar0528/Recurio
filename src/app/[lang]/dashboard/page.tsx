import { columns } from "@/components/dashboard/data_table/columns";
import { DataTable } from "@/components/dashboard/data_table/DataTable";
import { Button } from "@/components/ui/button";
import { getTableColumns } from "drizzle-orm";
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
import { db } from "@/lib/db";
import { subscriptionsTable } from "@/db/schema";
import SubscriptionDialog from "@/components/dashboard/SubscriptionDialog";
import {  priceFormatter } from "@/lib/utils";

async function getData() {
  "use cache";
  cacheTag("subscriptions");
  // This cache will revalidate after a day even if no explicit
  // revalidate instruction was received
  cacheLife("days");
  const { created_at, updated_at, deleted_at, ...rest } =
    getTableColumns(subscriptionsTable);
  const rawData = await db.select({ ...rest }).from(subscriptionsTable);
  const data = rawData.map((row) => ({
    ...row,
    price: Number(row.price),
  }));

  return data;
}
export default async function Page({ params }: PageProps<"/[lang]">) {
  const data = await getData();
  const filteredData = data.filter(
    (subscription) => subscription.status === "Active",
  );
  const monthlySpend = filteredData.reduce(
    (acc, { price, billingCycle }) =>
      acc + (billingCycle === "Annual" ? price / 12 : price),
    0,
  );
  const roundedMonthlySpend = Number(monthlySpend.toFixed(2));

  const yearlySpend = roundedMonthlySpend * 12;
  const activeSubscriptions = filteredData.length;
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
                className="cursor-pointer font-bold text-sm uppercase tracking-wider bg-primary dark:bg-primary dark:hover:bg-primary/85 text-primary-foreground hover:bg-primary/85 hover:text-white p-4 w-85 md:w-70">
                + Add Subscription
              </Button>
            }
            title="New Subscription"
            description="Add a new subscription. All fields are required."
            submitLabel="Create">
            <SubscriptionForm />
          </SubscriptionDialog>
        </div>

        <Link
          href="/payments"
          className="mb-8 bg-primary/[0.03] border border-primary/20 rounded-2xl p-4 flex items-center justify-between group hover:bg-primary/[0.06] transition-colors cursor-pointer">
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
                <span className="text-foreground font-bold">Amazon Prime</span>{" "}
                and <span className="text-foreground font-bold">Adobe CC</span>{" "}
                will charge 193.99 € in the next 72 hours.
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Review Schedule <ArrowUpRight size={14} />
          </div>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatWidget
            label="Monthly Burn"
            value={priceFormatter(roundedMonthlySpend)}
            trend="4% vs last mo"
            icon={Wallet}
          />
          <StatWidget
            label="Yearly Impact"
            value={priceFormatter(yearlySpend)}
            icon={Calendar}
          />
          <StatWidget
            label="Active Subs"
            value={activeSubscriptions}
            icon={PieChart}
          />
          <StatWidget label="Income Ratio" value="4.2%" icon={Percent} />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="px-2">
              <DataTable columns={columns} data={data} />
            </div>
          </div>

          <InsightsSidebar data={data} />
        </div>
      </div>
    </div>
  );
}
