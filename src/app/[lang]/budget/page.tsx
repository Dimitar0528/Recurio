import BudgetMetricsConsole from "@/components/budget/BudgetMetricsConsole";
import BudgetHeader from "@/components/budget/BudgetHeader";
import { BudgetContextProvider } from "@/context/BudgetContext";
import { getUserBillingEvents, getUserSubscriptions } from "@/dal/subscriptions/queries";
import { Locale } from "next-intl";
import { getSpendingDataForDateRange } from "@/lib/analytics/spending_for_date_ranges";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const locale = (await params).lang as Locale;
  const billingEvents = await getUserBillingEvents();
  const { monthlySpendData } = await getSpendingDataForDateRange(billingEvents, locale);
  const latestMontlySpend = monthlySpendData?.at(-1)?.spend || 0;

  const userSubscriptions = await getUserSubscriptions();
  const statusTotals = userSubscriptions.reduce(
    (acc, sub) => {
      if (sub.status === "Free Trial") {
        acc.freeTrial += sub.price;
      } else if (sub.status === "Cancelled") {
        acc.cancelled += sub.price;
      }
      return acc;
    },
    { freeTrial: 0, cancelled: 0 },
  );
  return (
    <BudgetContextProvider>
      <main
        id="main-content"
        className="min-h-screen bg-background text-foreground pb-12">
        <div className="max-w-7xl mx-auto px-6 pt-22">
          <BudgetHeader />
          <section>
            <BudgetMetricsConsole 
              latestMontlySpend={latestMontlySpend}
              statusTotals={statusTotals} />
          </section>
        </div>
      </main>
    </BudgetContextProvider>
  );
}
