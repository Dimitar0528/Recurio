import { Subscription, BillingEvent } from "@/lib/validations/schemas";
import { priceFormatter } from "@/lib/utils";
import { formatDate } from "./audit-styles";

export function generateAuditData(
  subscriptions: Subscription[],
  billingEvents: BillingEvent[],
) {
  const activeSubs = subscriptions.filter((s) => s.status === "Active");
  const pausedSubs = subscriptions.filter((s) => s.status === "Paused");
  const hasNoSubs = subscriptions.length === 0;

  const monthlyBurn = activeSubs.reduce(
    (sum, s) => sum + (s.billingCycle === "Annual" ? s.price / 12 : s.price),
    0,
  );
  const annualBurn = monthlyBurn * 12;
  const lifetimeSpend = billingEvents.reduce((sum, e) => sum + e.amount, 0);
  const avgSubscriptionCost =
    activeSubs.length > 0 ? monthlyBurn / activeSubs.length : 0;

  // Category breakdowns
  const categoryStats = activeSubs.reduce<
    Record<string, { total: number; count: number }>
  >((acc, s) => {
    const normPrice = s.billingCycle === "Annual" ? s.price / 12 : s.price;
    if (!acc[s.category]) acc[s.category] = { total: 0, count: 0 };
    acc[s.category].total += normPrice;
    acc[s.category].count += 1;
    return acc;
  }, {});
  const categoryList = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      total: stats.total,
      count: stats.count,
      percentage: monthlyBurn > 0 ? (stats.total / monthlyBurn) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // Anomalies & audit threat vectors
  const wasteList: string[] = [];
  pausedSubs.forEach((sub) => {
    const hasRecentCharge = billingEvents.some(
      (e) =>
        e.subscriptionName === sub.name &&
        sub.statusChangedAt &&
        new Date(e.chargedAt) > new Date(sub.statusChangedAt),
    );
    if (hasRecentCharge)
      wasteList.push(
        `Active leakage: Recurio detected a post-pause transaction on "${sub.name}".`,
      );
  });
  activeSubs.forEach((sub) => {
    if (sub.category === "Other" && sub.price > 15) {
      wasteList.push(
        `Poor categorization: "${sub.name}" (${priceFormatter(sub.price)}) has a high cost but lacks specialized taxonomy.`,
      );
    }
  });
  const riskList: string[] = [];
  activeSubs.forEach((s) => {
    if (!s.autoRenew)
      riskList.push(
        `Abrupt interruption risk: "${s.name}" must be renewed manually before ${formatDate(s.nextBilling)}.`,
      );
    if (s.billingCycle === "Annual" && s.price > 100)
      riskList.push(
        `Liquidity threat: Upcoming lump-sum payment of ${priceFormatter(s.price)} due for "${s.name}" on ${formatDate(s.nextBilling)}.`,
      );
  });

  // Price Volatility evaluation
  const eventsBySub = billingEvents.reduce<Record<string, number[]>>(
    (acc, e) => {
      if (!acc[e.subscriptionName]) acc[e.subscriptionName] = [];
      acc[e.subscriptionName].push(e.amount);
      return acc;
    },
    {},
  );
  const billingConsistency = Object.entries(eventsBySub).map(
    ([name, amounts]) => ({
      name,
      isVariable: new Set(amounts).size > 1,
      avg: amounts.reduce((s, a) => s + a, 0) / amounts.length,
    }),
  );
  const variablePricingCount = billingConsistency.filter(
    (c) => c.isVariable,
  ).length;

  // Portfolio Diversity Profile
  const uniqueCategoriesUsed = categoryList.length;
  const portfolioDiversity =
    uniqueCategoriesUsed >= 6
      ? "highly diversified"
      : uniqueCategoriesUsed >= 3
        ? "moderately balanced"
        : "highly concentrated";
  const categoryDiversityText =
    portfolioDiversity === "highly diversified"
      ? `Your portfolio is highly diversified across ${uniqueCategoriesUsed} distinct categories, which minimizes localized dependency but increases vendor overhead.`
      : portfolioDiversity === "moderately balanced"
        ? `Your spending footprint is moderately balanced across ${uniqueCategoriesUsed} focus categories, indicating a stable, highly specialized tech stack.`
        : `Your expenses are highly concentrated in only ${uniqueCategoriesUsed} categories. This indicates targeted software utility but makes your cash flow vulnerable to pricing changes in these specific markets.`;

  const totalWarnings = wasteList.length + riskList.length;
  let executiveSummaryText = "";
  if (hasNoSubs) {
    executiveSummaryText = `Our diagnostic scan shows that you currently have zero active subscriptions logged in your ledger. If you are using digital tools, registering them inside Recurio will unlock critical metrics like projected burn-rates, auto-renew buffers, and potential expense waste alerts.`;
  } else if (totalWarnings > 3 && monthlyBurn > 150) {
    executiveSummaryText = `Recurio’s audit engines have flagged a heavy leakage profile in your portfolio. You currently maintain ${activeSubs.length} active subscriptions costing ${priceFormatter(monthlyBurn)}/mo, but our scan identified ${totalWarnings} critical warnings. These include potentially active charges on paused services, unclassified high-cost rows, and pending lump-sum renewals. Optimizing these entries in Section VI is highly recommended to protect cash flow.`;
  } else if (monthlyBurn > 100) {
    executiveSummaryText = `Your digital software investment footprint is high but structurally sound. With an average item cost of ${priceFormatter(avgSubscriptionCost)}, you maintain healthy baseline control. Recurio detected ${totalWarnings} moderate operational risk factors. The ledger has high automated maintenance, meaning passive subscription creep remains your main financial threat vector.`;
  } else {
    executiveSummaryText = `Your active services profile is highly optimized, demonstrating strong fiscal discipline. You hold a tight stack of ${activeSubs.length} active subscriptions with a monthly burn rate of ${priceFormatter(monthlyBurn)}. Only ${totalWarnings} low-priority warning flags were raised, confirming that your recurring overhead is well-protected from leakage.`;
  }

  const annualBillingCount = activeSubs.filter(
    (s) => s.billingCycle === "Annual",
  ).length;
  const annualRatio =
    activeSubs.length > 0 ? annualBillingCount / activeSubs.length : 0;
  let financialHealthText = "";
  if (hasNoSubs) {
    financialHealthText = `When subscriptions are registered in Recurio, this section evaluates your monthly recurring drain and projects your yearly cost. This baseline calculation tracks the balance of flexible monthly agreements alongside discounted annual plans to help you allocate cash buffers.`;
  } else if (annualRatio > 0.6) {
    financialHealthText = `A prominent concentration of Annual billing cycles (${(annualRatio * 100).toFixed(0)}% of your tools) points to deep long-term savings but exposes your capital to sudden, massive 'lump-sum' depletions. We recommend retaining a cash reserve equivalent to your top annual obligations.`;
  } else if (annualRatio < 0.25) {
    financialHealthText = `Your recurring ledger is dominated by Monthly cycles. This provides you with excellent agility and low cancelation overhead, but exposes you to 'death by a thousand cuts'. These small, creeping monthly hits are easy to lose track of over time.`;
  } else {
    financialHealthText = `You are maintaining a balanced hybrid strategy. By mixing flexible monthly agreements with discounted annual plans, you keep immediate cash flow liquid while capitalizing on long-term platform savings where appropriate.`;
  }

  const activeAutoRenewCount = activeSubs.filter((s) => s.autoRenew).length;
  const autoRenewRatio =
    activeSubs.length > 0
      ? (activeAutoRenewCount / activeSubs.length) * 100
      : 0;
  let behavioralAutomationText = "";
  if (hasNoSubs) {
    behavioralAutomationText = `This diagnostic panel evaluates platform automation behaviors when active subscriptions are recorded. Recurio measures your automation dependency—calculating set-and-forget billing loops against manual payment controls—to prevent passive payment drift.`;
  } else if (autoRenewRatio > 85) {
    behavioralAutomationText = `Your automation dependency is exceptionally high (${autoRenewRatio.toFixed(0)}%). This set-and-forget approach minimizes cognitive load but drastically increases exposure to 'ghost billing'—where deprecated features or unused user accounts quietly drain resources for months.`;
  } else if (autoRenewRatio < 35) {
    behavioralAutomationText = `Your automation dependency is very low (${autoRenewRatio.toFixed(0)}%). Most of your plans require manual intervention. While this ensures perfect control over your payments, it heavily increases your administrative overhead and creates high disruption risk if a manual billing window is missed.`;
  } else {
    behavioralAutomationText = `Your balanced auto-renew profile (${autoRenewRatio.toFixed(0)}% automatic) represents the optimal security sweet-spot. Core utilities remain continuously automated, while peripheral project accounts are kept on manual leashes, blocking surprise charges.`;
  }

  const autoEventsCount = billingEvents.filter(
    (e) => e.source === "auto",
  ).length;
  const totalEvents = billingEvents.length;
  const autoEventRatio =
    totalEvents > 0 ? (autoEventsCount / totalEvents) * 100 : 0;
  let lifecycleDiagnosticsText = "";
  if (hasNoSubs) {
    lifecycleDiagnosticsText = `Our tracking engine evaluates transactional pricing stability across your history once logged. Recurio monitors consistency over successive cycles to automatically flag unannounced vendor hikes or usage-based tier shifts.`;
  } else if (variablePricingCount > 0) {
    lifecycleDiagnosticsText = `We identified ${variablePricingCount} service plans that exhibit price volatility (variable pricing models). These variable structures usually point to consumption-based fees or hidden tiered upgrades. We recommend auditing these plans inside your payment methods to avoid unexpected cash-draw shocks.`;
  } else {
    lifecycleDiagnosticsText = `Our metrics show a perfectly stable fixed-rate structure across your entire logged history. No variable charge deviations were found, making your recurring monthly spending highly predictable and easy to model.`;
  }

  const oldestSub = [...subscriptions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )[0];
  const oldestSubText = oldestSub
    ? `Your oldest monitored legacy account is "${oldestSub.name}", which has been tracked on your ledger since ${formatDate(oldestSub.createdAt)}.`
    : `No legacy subscription history is currently recorded.`;

  const costliestActive = [...activeSubs]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);
  const upcomingObligations = [...activeSubs]
    .sort(
      (a, b) =>
        new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime(),
    )
    .slice(0, 5);

  return {
    hasNoSubs,
    monthlyBurn,
    annualBurn,
    lifetimeSpend,
    activeSubs,
    categoryList,
    categoryDiversityText,
    executiveSummaryText,
    financialHealthText,
    behavioralAutomationText,
    autoEventsCount,
    totalEvents,
    autoEventRatio,
    lifecycleDiagnosticsText,
    oldestSubText,
    wasteList,
    riskList,
    costliestActive,
    upcomingObligations,
  };
}

export type AuditAnalyticsData = ReturnType<typeof generateAuditData>;
