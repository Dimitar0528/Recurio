import { SubscriptionTable } from "@/components/dashboard/subscriptions_table/SubscriptionsTable";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Wallet,
  ArrowUpRight,
  BellRing,
  ShieldCheck,
  Download,
} from "lucide-react";

import SubscriptionForm from "@/components/dashboard/SubscriptionForm";
import InsightsSidebar from "@/components/dashboard/InsightsSidebar";
import Link from "next/link";
import SubscriptionDialog from "@/components/dashboard/SubscriptionDialog";
import {
  getCurrentDateRange,
  getSubscriptionsWithinTimeInterval,
  priceFormatter,
} from "@/lib/utils";
import {
  getUserBillingEvents,
  getUserSubscriptions,
} from "@/dal/subscriptions/queries";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "next-intl";
import { BillingEvent, Subscription } from "@/lib/validations/schemas";
import { SpendingCard } from "@/components/dashboard/SpendingCard";
import { getProcessDueRenewalsForUser } from "@/dal/subscriptions/mutations";
import { startOfDay } from "date-fns";
import { getSpendingDataForDateRange } from "@/lib/analytics/spending_for_date_ranges";
import DownloadAuditButton from "@/components/dashboard/audit_pdf_gen/DownloadAuditButton";

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

function calculateAverageSpendings(subscriptions: Subscription[]) {
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "Active",
  );

  const averageMonthly = activeSubscriptions.reduce(
    (total, { price, billingCycle }) => {
      let normalized = price;
      switch (billingCycle) {
        case "Yearly":
          normalized = price / 12;
          break;
        case "Quarterly":
          normalized = price / 3;
          break;
      }
      return total + normalized;
    },
    0,
  );
  const projectedYearly = averageMonthly * 12;

  return {
    averageMonthly,
    projectedYearly,
  };
}

function calculateActualChargesInRange(
  billingEvents: BillingEvent[],
  rangeStart: Date,
  rangeEnd: Date,
) {
  return billingEvents.reduce((total, billingEvent) => {
    const chargedAt = startOfDay(new Date(billingEvent.chargedAt));
    const isInRange = chargedAt >= rangeStart && chargedAt < rangeEnd;
    return total + (isInRange ? billingEvent.amount : 0);
  }, 0);
}

function calculateActualSpendings(
  billingEvents: BillingEvent[],
  today = new Date(),
) {
  const { start: startMonth, end: endMonth } = getCurrentDateRange(today, "month");
  const { start: startYear, end: endYear } = getCurrentDateRange(today, "year");
  const actualMonthlySpend = calculateActualChargesInRange(billingEvents, startMonth, endMonth);
  const actualYearlySpend = calculateActualChargesInRange(billingEvents, startYear, endYear);
  return {
    actualMonthlySpend,
    actualYearlySpend
  }
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const locale = (await params).lang as Locale;
  setRequestLocale(locale);
  const tReusable = await getTranslations({ locale, namespace: "Reusable" });
  const t = await getTranslations({ locale, namespace: "dashboard_page" });

  await getProcessDueRenewalsForUser();
  const userSubscriptions = await getUserSubscriptions();
  const billingEvents = await getUserBillingEvents();

  const { averageMonthly, projectedYearly } =
    calculateAverageSpendings(userSubscriptions);
  const { actualMonthlySpend, actualYearlySpend } =
    calculateActualSpendings(billingEvents);

  const activeSubscriptions = userSubscriptions.filter(
    (s) => s.status === "Active",
  ).length;
  const upcomingSubscriptions = getSubscriptionsWithinTimeInterval(
    userSubscriptions,
    "upcoming-7-days",
  );
  const upcomingSubscriptionNames = upcomingSubscriptions.map((s) => s.name);
  const totalUpcomingAmount = upcomingSubscriptions.reduce(
    (sum, s) => sum + s.price,
    0,
  );

  const namesText =
    upcomingSubscriptionNames.length === 1
      ? t("upcoming_alert.names_format.one", {
          name: upcomingSubscriptionNames[0],
        })
      : upcomingSubscriptionNames.length === 2
        ? t("upcoming_alert.names_format.two", {
            name1: upcomingSubscriptionNames[0],
            name2: upcomingSubscriptionNames[1],
          })
        : t("upcoming_alert.names_format.multiple", {
            name: upcomingSubscriptionNames[0],
            count: upcomingSubscriptionNames.length - 1,
          });

  const { monthlySpendData, yearlySpendData } =
    await getSpendingDataForDateRange(billingEvents);
  
  return (
    <main
      id="main-content"
      className="min-h-screen bg-background text-foreground pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-22">
        <section className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-2">
          <div>
            <h1 className="text-3xl text-center md:text-left font-bold uppercase tracking-[0.125em] mb-1">
              {t("header.title")}
            </h1>
            <p className="text-muted-foreground text-md text-center md:text-left">
              {t.rich("header.active_subs", {
                count: activeSubscriptions,
                highlight: (chunks) => (
                  <span className="bg-primary dark:bg-primary/50 font-bold text-primary-foreground px-1 rounded-md">
                    {chunks}
                  </span>
                ),
              })}
            </p>
          </div>
          <SubscriptionDialog
            trigger={
              <Button
                variant="outline"
                className="cursor-pointer font-bold text-sm uppercase tracking-wider bg-primary dark:bg-primary/50 dark:hover:bg-primary/70 text-primary-foreground hover:bg-primary/85 hover:text-white p-4 w-83 md:w-70 aria-expanded:bg-primary aria-expanded:text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all">
                {tReusable("dialog.title", {
                  action: locale === "bg" ? "+ Добави" : "+ Add",
                })}
              </Button>
            }
            title={tReusable("dialog.title", {
              action: locale === "bg" ? "Добави" : "Create",
            })}
            description={tReusable("dialog.description")}
            submitLabel={tReusable("dialog.submit", {
              action: locale === "bg" ? "Добави" : "Create",
            })}
            cancelLabel={tReusable("dialog.cancel")}>
            <SubscriptionForm />
          </SubscriptionDialog>
        </section>

        {upcomingSubscriptions.length > 0 && (
          <Link
            href="/payments"
            className="mb-8 bg-primary/5 border border-primary/20 rounded-2xl p-2 pl-4 flex flex-col md:flex-row items-center justify-between group hover:bg-primary/15 transition-colors cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
                <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <BellRing size={20} />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold">{t("upcoming_alert.title")}</p>
                <p className="text-xs text-muted-foreground">
                  {t.rich("upcoming_alert.description", {
                    names: namesText,
                    amount: priceFormatter(totalUpcomingAmount),
                    bold: (chunks) => (
                      <span className="text-foreground font-bold">
                        {chunks}
                      </span>
                    ),
                  })}
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-2 md:mt-0">
              {t("upcoming_alert.cta")} <ArrowUpRight size={14} />
            </div>
          </Link>
        )}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <SpendingCard
            variant="light"
            title={t("cards.monthly.title")}
            description={t("cards.monthly.description")}
            icon={<Wallet size={20} />}
            primaryLabel={t("cards.monthly.primary_label")}
            primaryValue={priceFormatter(actualMonthlySpend)}
            secondaryLabel={t("cards.monthly.secondary_label")}
            secondaryValue={priceFormatter(averageMonthly)}
            spendData={monthlySpendData}
          />

          <SpendingCard
            variant="dark"
            title={t("cards.yearly.title")}
            description={t("cards.yearly.description")}
            icon={<Calendar size={20} />}
            primaryLabel={t("cards.yearly.primary_label", {
              year: new Date().getFullYear(),
            })}
            primaryValue={priceFormatter(actualYearlySpend)}
            secondaryLabel={t("cards.yearly.secondary_label")}
            secondaryValue={priceFormatter(projectedYearly)}
            spendData={yearlySpendData}
          />
        </section>

        <section className="grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <SubscriptionTable data={userSubscriptions} />
          </div>
          <div className="lg:col-span-4">
            <InsightsSidebar
              data={userSubscriptions}
              monthlySpend={averageMonthly}
            />
          </div>
        </section>

        <section
          className="lg:w-3xl mx-auto bg-foreground/95 text-background rounded-2xl p-3 mt-6 relative overflow-hidden group shadow-2xl text-center"
          id="audit"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
          }}>
          <div
            aria-hidden
            className="absolute -right-4 -top-4 text-background/6 pointer-events-none select-none">
            <ShieldCheck size={120} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 p-1">
            <div className="text-center md:text-left">
              <h3 className="font-mono text-[12px] uppercase tracking-[0.3em] text-muted-background mb-2 flex items-center justify-center md:justify-start gap-2">
                <Download size={10} />
                {t("audit.title")}
              </h3>
              <p className="text-sm text-background/80 leading-relaxed max-w-md">
                {t("audit.description")}
              </p>
            </div>
            <DownloadAuditButton
              subscriptions={userSubscriptions}
              billingEvents={billingEvents}
              label={t("audit.button")}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
