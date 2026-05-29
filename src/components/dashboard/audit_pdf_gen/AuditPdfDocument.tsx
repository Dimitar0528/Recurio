"use client";

import { Document, Page } from "@react-pdf/renderer";
import { Subscription, BillingEvent } from "@/lib/validations/schemas";
import { styles } from "./audit-styles";
import { generateAuditData } from "./audit-analytics";
import {
  CoverHeader,
  ExecutiveSummary,
  FinancialHealth,
  CategoryAnalysis,
  BehavioralInsights,
  TopCostCenters,
  AnomaliesRisks,
  LifecycleDiagnostics,
  AppendixRegistry,
  AppendixHistory,
  Footer,
} from "./AuditSections";

type AuditPdfProps = {
  subscriptions: Subscription[];
  billingEvents: BillingEvent[];
};

export function AuditPdfDocument({
  subscriptions,
  billingEvents,
}: AuditPdfProps) {
  const data = generateAuditData(subscriptions, billingEvents);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <CoverHeader />
        <ExecutiveSummary text={data.executiveSummaryText} />
        <FinancialHealth data={data} />
        <CategoryAnalysis data={data} />
        <BehavioralInsights data={data} />
        <TopCostCenters data={data} />
        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <AnomaliesRisks data={data} />
        <LifecycleDiagnostics
          text={data.lifecycleDiagnosticsText}
          oldest={data.oldestSubText}
        />
        <AppendixRegistry subscriptions={subscriptions} />
        <AppendixHistory billingEvents={billingEvents} />
        <Footer />
      </Page>
    </Document>
  );
}
