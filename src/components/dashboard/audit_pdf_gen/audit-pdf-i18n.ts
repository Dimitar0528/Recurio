import type { useTranslations } from "next-intl";
import { BillingCycle, CATEGORY_VALUES, Status } from "@/lib/validations/enums";

export type AuditPdfT = ReturnType<
  typeof useTranslations<"dashboard_page.audit_pdf_component">
>;
type ReusableT = ReturnType<typeof useTranslations<"Reusable">>;

export type AuditPdfLabels = {
  cover: {
    subtitle: string;
    title: string;
    systemCheck: string;
    generationTimestamp: (timestamp: string) => string;
  };
  sections: {
    executiveSummary: string;
    financialHealth: string;
    categoryAnalysis: string;
    behavioralInsights: string;
    topCostCenters: string;
    anomaliesRisks: string;
    lifecycleDiagnostics: string;
    appendixRegistry: string;
    appendixHistory: string;
  };
  financialHealth: {
    currentBurnRate: string;
    projectedYearlyCost: string;
    lifetimeAggregatedSpend: string;
    perMonth: string;
    perYear: string;
  };
  categoryDescriptions: Record<(typeof CATEGORY_VALUES)[number], string>;
  categories: {
    diversificationIndex: string;
    primaryCostCenterPrefix: string;
    primaryCostCenterMiddle: string;
    primaryCostCenterSuffix: string;
  };
  behavioral: {
    transactionAutonomyLabel: string;
    transactionAutonomy: (values: {
      totalEvents: number;
      autoEventsCount: number;
      autoEventRatio: string;
    }) => string;
  };
  topCostCenters: {
    costliestAccounts: string;
    upcomingRenewalTimeline: string;
    noActiveSubscriptions: string;
    noUpcomingRenewals: string;
    dueLine: (amount: string, billingCycle: string) => string;
  };
  anomalies: {
    passiveWasteTitle: string;
    inactiveAccountDrift: string;
    uncappedUtilityChecks: string;
    cancelledServiceLeakage: string;
    secureWaste: string;
    renewalRiskTitle: string;
    lumpSumRenewals: string;
    gracePeriodExpirations: string;
    secureRenewal: string;
  };
  lifecycle: {
    legacyScans: string;
    planPricingConsistency: string;
  };
  appendix: {
    registry: {
      columns: {
        name: string;
        category: string;
        billingCycle: string;
        amount: string;
        nextBilling: string;
        status: string;
      };
      empty: string;
    };
    history: {
      columns: {
        chargedAt: string;
        subscription: string;
        category: string;
        renewalType: string;
        amount: string;
      };
      empty: string;
    };
  };
  footer: {
    brand: string;
    page: (pageNumber: number, totalPages: number) => string;
  };
  formatCategory: (category: string) => string;
  formatBillingCycle: (cycle: string) => string;
  formatStatus: (status: string) => string;
  formatEventSource: (source: string) => string;
};

export function buildAuditPdfLabels(
  t: AuditPdfT,
  tReusable: ReusableT,
): AuditPdfLabels {
  const categoryDescriptions = Object.fromEntries(
    CATEGORY_VALUES.map((category) => [
      category,
      t(`categoryDescriptions.${category}`),
    ]),
  ) as AuditPdfLabels["categoryDescriptions"];

  return {
    cover: {
      subtitle: t("cover.subtitle"),
      title: t("cover.title"),
      systemCheck: t("cover.systemCheck"),
      generationTimestamp: (timestamp) =>
        t("cover.generationTimestamp", { timestamp }),
    },
    sections: {
      executiveSummary: t("sections.executiveSummary"),
      financialHealth: t("sections.financialHealth"),
      categoryAnalysis: t("sections.categoryAnalysis"),
      behavioralInsights: t("sections.behavioralInsights"),
      topCostCenters: t("sections.topCostCenters"),
      anomaliesRisks: t("sections.anomaliesRisks"),
      lifecycleDiagnostics: t("sections.lifecycleDiagnostics"),
      appendixRegistry: t("sections.appendixRegistry"),
      appendixHistory: t("sections.appendixHistory"),
    },
    financialHealth: {
      currentBurnRate: t("financialHealth.currentBurnRate"),
      projectedYearlyCost: t("financialHealth.projectedYearlyCost"),
      lifetimeAggregatedSpend: t("financialHealth.lifetimeAggregatedSpend"),
      perMonth: t("financialHealth.perMonth"),
      perYear: t("financialHealth.perYear"),
    },
    categoryDescriptions,
    categories: {
      diversificationIndex: t("categories.diversificationIndex"),
      primaryCostCenterPrefix: t("categories.primaryCostCenterPrefix"),
      primaryCostCenterMiddle: t("categories.primaryCostCenterMiddle"),
      primaryCostCenterSuffix: t("categories.primaryCostCenterSuffix"),
    },
    behavioral: {
      transactionAutonomyLabel: t("behavioral.transactionAutonomyLabel"),
      transactionAutonomy: (values) =>
        t("behavioral.transactionAutonomy", values),
    },
    topCostCenters: {
      costliestAccounts: t("topCostCenters.costliestAccounts"),
      upcomingRenewalTimeline: t("topCostCenters.upcomingRenewalTimeline"),
      noActiveSubscriptions: t("topCostCenters.noActiveSubscriptions"),
      noUpcomingRenewals: t("topCostCenters.noUpcomingRenewals"),
      dueLine: (amount, billingCycle) =>
        t("topCostCenters.dueLine", { amount, billingCycle }),
    },
    anomalies: {
      passiveWasteTitle: t("anomalies.passiveWasteTitle"),
      inactiveAccountDrift: t("anomalies.inactiveAccountDrift"),
      uncappedUtilityChecks: t("anomalies.uncappedUtilityChecks"),
      cancelledServiceLeakage: t("anomalies.cancelledServiceLeakage"),
      secureWaste: t("anomalies.secureWaste"),
      renewalRiskTitle: t("anomalies.renewalRiskTitle"),
      lumpSumRenewals: t("anomalies.lumpSumRenewals"),
      gracePeriodExpirations: t("anomalies.gracePeriodExpirations"),
      secureRenewal: t("anomalies.secureRenewal"),
    },
    lifecycle: {
      legacyScans: t("lifecycle.legacyScans"),
      planPricingConsistency: t("lifecycle.planPricingConsistency"),
    },
    appendix: {
      registry: {
        columns: {
          name: t("appendix.registry.columns.name"),
          category: t("appendix.registry.columns.category"),
          billingCycle: t("appendix.registry.columns.billingCycle"),
          amount: t("appendix.registry.columns.amount"),
          nextBilling: t("appendix.registry.columns.nextBilling"),
          status: t("appendix.registry.columns.status"),
        },
        empty: t("appendix.registry.empty"),
      },
      history: {
        columns: {
          chargedAt: t("appendix.history.columns.chargedAt"),
          subscription: t("appendix.history.columns.subscription"),
          category: t("appendix.history.columns.category"),
          renewalType: t("appendix.history.columns.renewalType"),
          amount: t("appendix.history.columns.amount"),
        },
        empty: t("appendix.history.empty"),
      },
    },
    footer: {
      brand: t("footer.brand"),
      page: (pageNumber, totalPages) =>
        t("footer.page", { pageNumber, totalPages }),
    },
    formatCategory: (category) =>
      tReusable(`categories.${category as keyof typeof categoryDescriptions}`),
    formatBillingCycle: (cycle) =>
      tReusable(`billingCycle.${cycle as BillingCycle}`),
    formatStatus: (status) => tReusable(`status.${status as Status}`),
    formatEventSource: (source) => {
      const key = source as "initial" | "auto" | "manual";
      return t(`appendix.history.eventSource.${key}`);
    },
  };
}
