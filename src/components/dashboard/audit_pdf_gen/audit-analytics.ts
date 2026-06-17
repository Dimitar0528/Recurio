import { Subscription, BillingEvent } from "@/lib/validations/schemas";
import { dateFormatter, priceFormatter } from "@/lib/utils";
import { Locale } from "next-intl";
import type { AuditPdfT } from "./audit-pdf-i18n";
export function generateAuditData(
  subscriptions: Subscription[],
  billingEvents: BillingEvent[],
  locale: Locale,
  t: AuditPdfT,
) {
  const activeSubs = subscriptions.filter((s) => s.status === "Active");
  const pausedSubs = subscriptions.filter((s) => s.status === "Paused");
  const hasNoSubs = subscriptions.length === 0;
  const monthlyBurn = activeSubs.reduce((total, { price, billingCycle }) => {
    let normalized = price;
    switch (billingCycle) {
      case "Yearly":
        normalized = price / 12;
        break;
      case "Quaterly":
        normalized = price / 3;
        break;
    }
    return total + normalized;
  }, 0);
  const annualBurn = monthlyBurn * 12;
  const lifetimeSpend = billingEvents.reduce((sum, e) => sum + e.amount, 0);
  const avgSubscriptionCost =
    activeSubs.length > 0 ? monthlyBurn / activeSubs.length : 0;

  // Category breakdowns
  const categoryStats = activeSubs.reduce<
    Record<string, { total: number; count: number }>
  >((acc, s) => {
    let normPrice = s.price;
    switch (s.billingCycle) {
      case "Yearly":
        normPrice = s.price / 12;
        break;
      case "Quaterly":
        normPrice = s.price / 3;
        break;
    }
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
      wasteList.push(t("analytics.waste.postPause", { name: sub.name }));
  });
  activeSubs.forEach((sub) => {
    if (sub.category === "Other" && sub.price > 15) {
      wasteList.push(
        t("analytics.waste.poorCategorization", {
          name: sub.name,

          price: priceFormatter(sub.price),
        }),
      );
    }
  });
  const riskList: string[] = [];
  activeSubs.forEach((s) => {
    if (!s.autoRenew)
      riskList.push(
        t("analytics.risk.manualRenewal", {
          name: s.name,

          date: dateFormatter(s.nextBilling, locale, "numeric"),
        }),
      );
    if (s.billingCycle === "Yearly" && s.price > 100)
      riskList.push(
        t("analytics.risk.lumpSum", {
          name: s.name,
          price: priceFormatter(s.price),
          date: dateFormatter(s.nextBilling, locale, "numeric"),
        }),
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
      ? t("analytics.portfolioDiversity.highlyDiversified", {
          count: uniqueCategoriesUsed,
        })
      : portfolioDiversity === "moderately balanced"
        ? t("analytics.portfolioDiversity.moderatelyBalanced", {
            count: uniqueCategoriesUsed,
          })
        : t("analytics.portfolioDiversity.highlyConcentrated", {
            count: uniqueCategoriesUsed,
          });

  const totalWarnings = wasteList.length + riskList.length;
  let executiveSummaryText = "";
  if (hasNoSubs) {
    executiveSummaryText = t("analytics.executiveSummary.noSubs");
  } else if (totalWarnings > 3 && monthlyBurn > 150) {
    executiveSummaryText = t("analytics.executiveSummary.heavyLeakage", {
      activeCount: activeSubs.length,
      monthlyBurn: priceFormatter(monthlyBurn),
      warningCount: totalWarnings,
    });
  } else if (monthlyBurn > 100) {
    executiveSummaryText = t("analytics.executiveSummary.highSpend", {
      avgCost: priceFormatter(avgSubscriptionCost),
      warningCount: totalWarnings,
    });
  } else {
    executiveSummaryText = t("analytics.executiveSummary.optimized", {
      activeCount: activeSubs.length,
      monthlyBurn: priceFormatter(monthlyBurn),
      warningCount: totalWarnings,
    });
  }

  const annualBillingCount = activeSubs.filter(
    (s) => s.billingCycle === "Yearly",
  ).length;
  const annualRatio =
    activeSubs.length > 0 ? annualBillingCount / activeSubs.length : 0;
  let financialHealthText = "";
  if (hasNoSubs) {
    financialHealthText = t("analytics.financialHealth.noSubs");
  } else if (annualRatio > 0.6) {
    financialHealthText = t("analytics.financialHealth.annualHeavy", {
      annualRatio: (annualRatio * 100).toFixed(0),
    });
  } else if (annualRatio < 0.25) {
    financialHealthText = t("analytics.financialHealth.monthlyHeavy");
  } else {
    financialHealthText = t("analytics.financialHealth.balanced");
  }

  const activeAutoRenewCount = activeSubs.filter((s) => s.autoRenew).length;
  const autoRenewRatio =
    activeSubs.length > 0
      ? (activeAutoRenewCount / activeSubs.length) * 100
      : 0;
  let behavioralAutomationText = "";
  if (hasNoSubs) {
    behavioralAutomationText = t("analytics.behavioral.noSubs");
  } else if (autoRenewRatio > 85) {
    behavioralAutomationText = t("analytics.behavioral.highAutomation", {
      autoRenewRatio: autoRenewRatio.toFixed(0),
    });
  } else if (autoRenewRatio < 35) {
    behavioralAutomationText = t("analytics.behavioral.lowAutomation", {
      autoRenewRatio: autoRenewRatio.toFixed(0),
    });
  } else {
    behavioralAutomationText = t("analytics.behavioral.balanced", {
      autoRenewRatio: autoRenewRatio.toFixed(0),
    });
  }

  const autoEventsCount = billingEvents.filter(
    (e) => e.source === "auto",
  ).length;
  const totalEvents = billingEvents.length;
  const autoEventRatio =
    totalEvents > 0 ? (autoEventsCount / totalEvents) * 100 : 0;
  let lifecycleDiagnosticsText = "";
  if (hasNoSubs) {
    lifecycleDiagnosticsText = t("analytics.lifecycle.noSubs");
  } else if (variablePricingCount > 0) {
    lifecycleDiagnosticsText = t("analytics.lifecycle.variablePricing", {
      count: variablePricingCount,
    });
  } else {
    lifecycleDiagnosticsText = t("analytics.lifecycle.stablePricing");
  }

  const oldestSub = [...subscriptions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )[0];
  const oldestSubText = oldestSub
    ? t("analytics.oldestSub.withSub", {
        name: oldestSub.name,
        date: dateFormatter(oldestSub.createdAt, locale, "numeric"),
      })
    : t("analytics.oldestSub.none");
  const costliestActive = [...activeSubs]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);
  const upcomingObligations = [...activeSubs]
    .sort(
      (a, b) =>
        new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime(),
    )
    .slice(0, 3);
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
