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
import { Locale } from "next-intl";
import type { AuditPdfLabels, AuditPdfT } from "./audit-pdf-i18n";

type AuditPdfProps = {
  subscriptions: Subscription[];
  billingEvents: BillingEvent[];
  locale: Locale;
  labels: AuditPdfLabels;
  t: AuditPdfT;
};

export function AuditPdfDocument({
  subscriptions,
  billingEvents,
  locale,
  labels,
  t,
}: AuditPdfProps) {
  const data = generateAuditData(subscriptions, billingEvents, locale, t);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <CoverHeader locale={locale} labels={labels} />
        <ExecutiveSummary text={data.executiveSummaryText} labels={labels} />
        <FinancialHealth data={data} labels={labels} />
        <CategoryAnalysis data={data} labels={labels} />
        <BehavioralInsights data={data} labels={labels} />
        <TopCostCenters data={data} locale={locale} labels={labels} />
        <Footer labels={labels} />
      </Page>

      <Page size="A4" style={styles.page}>
        <AnomaliesRisks data={data} labels={labels} />
        <LifecycleDiagnostics
          text={data.lifecycleDiagnosticsText}
          oldest={data.oldestSubText}
          labels={labels}
        />
        <AppendixRegistry
          subscriptions={subscriptions}
          locale={locale}
          labels={labels}
        />
        <AppendixHistory
          billingEvents={billingEvents}
          locale={locale}
          labels={labels}
        />
        <Footer labels={labels} />
      </Page>
    </Document>
  );
}
