import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { dateFormatter, priceFormatter } from "@/lib/utils";
import { Subscription, BillingEvent } from "@/lib/validations/schemas";
import { styles, categoryColorsMap } from "./audit-styles";
import { CATEGORY_VALUES } from "@/lib/validations/enums";
import { AuditAnalyticsData } from "./audit-analytics";
import { Locale } from "next-intl";
import type { AuditPdfLabels } from "./audit-pdf-i18n";

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <View style={styles.card} wrap={false}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export const CoverHeader = ({
  locale,
  labels,
}: {
  locale: Locale;
  labels: AuditPdfLabels;
}) => (
  <View style={styles.coverContainer}>
    <Text style={styles.coverSubtitle}>{labels.cover.subtitle}</Text>
    <Text style={styles.coverTitle}>{labels.cover.title}</Text>
    <View style={styles.coverMeta}>
      <Text>{labels.cover.systemCheck}</Text>
      <Text>
        {labels.cover.generationTimestamp(
          dateFormatter(new Date(), locale, "numeric"),
        )}
      </Text>
    </View>
  </View>
);

export const ExecutiveSummary = ({
  text,
  labels,
}: {
  text: string;
  labels: AuditPdfLabels;
}) => (
  <SectionCard title={labels.sections.executiveSummary}>
    <Text style={styles.bodyText}>{text}</Text>
  </SectionCard>
);

export const FinancialHealth = ({
  data,
  labels,
}: {
  data: AuditAnalyticsData;
  labels: AuditPdfLabels;
}) => (
  <SectionCard title={labels.sections.financialHealth}>
    <View style={styles.kpiGrid}>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>
          {labels.financialHealth.currentBurnRate}
        </Text>
        <Text style={styles.kpiValue}>
          {priceFormatter(data.monthlyBurn)} {labels.financialHealth.perMonth}
        </Text>
      </View>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>
          {labels.financialHealth.projectedYearlyCost}
        </Text>
        <Text style={styles.kpiValue}>
          {priceFormatter(data.annualBurn)} {labels.financialHealth.perYear}
        </Text>
      </View>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>
          {labels.financialHealth.lifetimeAggregatedSpend}
        </Text>
        <Text style={styles.kpiValue}>
          {priceFormatter(data.lifetimeSpend)}
        </Text>
      </View>
    </View>
    <Text style={[styles.bodyText, { marginTop: 8 }]}>
      {data.financialHealthText}
    </Text>
  </SectionCard>
);

export const CategoryAnalysis = ({
  data,
  labels,
}: {
  data: AuditAnalyticsData;
  labels: AuditPdfLabels;
}) => (
  <SectionCard title={labels.sections.categoryAnalysis}>
    {data.hasNoSubs ? (
      <View style={styles.splitGrid}>
        <View style={styles.splitCol}>
          {CATEGORY_VALUES.map((category) => (
            <View key={category} style={{ marginBottom: 6 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 2,
                }}>
                <View
                  style={[
                    styles.categoryPill,
                    { backgroundColor: categoryColorsMap[category] },
                  ]}
                />
                <Text
                  style={{
                    fontSize: 7,
                    fontFamily: "NotoSans",
                    fontWeight: "bold",
                  }}>
                  {labels.formatCategory(category)}
                </Text>
              </View>
              <Text
                style={{ fontSize: 6.5, color: "#64748B", lineHeight: 1.2 }}>
                {labels.categoryDescriptions[category]}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.splitCol}>
          {CATEGORY_VALUES.map((category) => (
            <View key={`${category}-b`} style={{ marginBottom: 6 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 2,
                }}>
                <View
                  style={[
                    styles.categoryPill,
                    { backgroundColor: categoryColorsMap[category] },
                  ]}
                />
                <Text
                  style={{
                    fontSize: 7,
                    fontFamily: "NotoSans",
                    fontWeight: "bold",
                  }}>
                  {labels.formatCategory(category)}
                </Text>
              </View>
              <Text
                style={{ fontSize: 6.5, color: "#64748B", lineHeight: 1.2 }}>
                {labels.categoryDescriptions[category]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    ) : (
      <View style={styles.splitGrid}>
        <View style={styles.splitCol}>
          {data.categoryList.map(({ category, total, percentage }) => (
            <View key={category} style={{ marginBottom: 6 }}>
              <View style={styles.progressRow}>
                <Text
                  style={{
                    fontSize: 7,
                    fontFamily: "NotoSans",
                    fontWeight: "bold",
                  }}>
                  {labels.formatCategory(category)}
                </Text>
                <Text style={{ fontSize: 7, color: "#64748B" }}>
                  {priceFormatter(total)} ({percentage.toFixed(2)}%)
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: categoryColorsMap[category],
                      width: `${Math.max(percentage, 3)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.splitCol}>
          <Text
            style={[
              styles.bodyText,
              {
                fontSize: 7.5,
                fontFamily: "NotoSans",
                fontWeight: "bold",
                marginBottom: 4,
              },
            ]}>
            {labels.categories.diversificationIndex}
          </Text>
          <Text style={styles.bodyText}>
            {data.categoryDiversityText}
            {data.categoryList.length > 0 && (
              <Text>
                {"\n\n"}
                {labels.categories.primaryCostCenterPrefix}
                <Text style={styles.boldText}>
                  {labels.formatCategory(data.categoryList[0].category)}
                </Text>
                {labels.categories.primaryCostCenterMiddle}
                <Text style={styles.boldText}>
                  {data.categoryList[0].percentage.toFixed(2)}%
                </Text>
                {labels.categories.primaryCostCenterSuffix}
              </Text>
            )}
          </Text>
        </View>
      </View>
    )}
  </SectionCard>
);

export const BehavioralInsights = ({
  data,
  labels,
}: {
  data: AuditAnalyticsData;
  labels: AuditPdfLabels;
}) => (
  <SectionCard title={labels.sections.behavioralInsights}>
    <Text style={styles.bodyText}>
      {data.behavioralAutomationText}
      {data.totalEvents > 0 && !data.hasNoSubs && (
        <Text>
          {"\n\n"}&bull;{" "}
          <Text style={styles.boldText}>
            {labels.behavioral.transactionAutonomyLabel}
          </Text>{" "}
          {labels.behavioral.transactionAutonomy({
            totalEvents: data.totalEvents,
            autoEventsCount: data.autoEventsCount,
            autoEventRatio: data.autoEventRatio.toFixed(0),
          })}
        </Text>
      )}
    </Text>
  </SectionCard>
);

export const TopCostCenters = ({
  data,
  locale,
  labels,
}: {
  data: AuditAnalyticsData;
  locale: Locale;
  labels: AuditPdfLabels;
}) => (
  <SectionCard title={labels.sections.topCostCenters}>
    <View style={styles.splitGrid}>
      <View
        style={[
          styles.splitCol,
          {
            borderRightWidth: 1,
            borderRightColor: "#F1F5F9",
            paddingRight: 6,
          },
        ]}>
        <Text
          style={[
            styles.bodyText,
            { fontFamily: "NotoSans", fontWeight: "bold", marginBottom: 4 },
          ]}>
          {labels.topCostCenters.costliestAccounts}
        </Text>
        {data.costliestActive.length > 0 ? (
          data.costliestActive.map((sub, idx) => (
            <Text
              key={sub.id}
              style={[styles.bodyText, { fontSize: 7.5, marginBottom: 2 }]}>
              {idx + 1}. {sub.name} &bull;{" "}
              <Text style={styles.boldText}>{priceFormatter(sub.price)}</Text> (
              {labels.formatBillingCycle(sub.billingCycle)})
            </Text>
          ))
        ) : (
          <Text style={styles.bodyText}>
            {labels.topCostCenters.noActiveSubscriptions}
          </Text>
        )}
      </View>
      <View style={styles.splitCol}>
        <Text
          style={[
            styles.bodyText,
            { fontFamily: "NotoSans", fontWeight: "bold", marginBottom: 4 },
          ]}>
          {labels.topCostCenters.upcomingRenewalTimeline}
        </Text>
        {data.upcomingObligations.length > 0 ? (
          data.upcomingObligations.map((s) => (
            <View key={s.id} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View>
                <Text style={styles.timelineMeta}>
                  {dateFormatter(s.nextBilling, locale, "numeric")} &bull;{" "}
                  {s.name}
                </Text>
                <Text style={{ fontSize: 6.5, color: "#64748B" }}>
                  {labels.topCostCenters.dueLine(
                    priceFormatter(s.price),
                    labels.formatBillingCycle(s.billingCycle),
                  )}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.bodyText}>
            {labels.topCostCenters.noUpcomingRenewals}
          </Text>
        )}
      </View>
    </View>
  </SectionCard>
);

export const AnomaliesRisks = ({
  data,
  labels,
}: {
  data: AuditAnalyticsData;
  labels: AuditPdfLabels;
}) => (
  <SectionCard title={labels.sections.anomaliesRisks}>
    <Text
      style={[
        styles.bodyText,
        {
          color: "#E11D48",
          fontFamily: "NotoSans",
          fontWeight: "bold",
          marginBottom: 4,
        },
      ]}>
      {labels.anomalies.passiveWasteTitle}
    </Text>
    {data.hasNoSubs ? (
      <View style={{ marginBottom: 4 }}>
        <Text
          style={[
            styles.bodyText,
            { fontSize: 7.5, marginBottom: 2, color: "#64748B" },
          ]}>
          &bull; {labels.anomalies.inactiveAccountDrift}
        </Text>
        <Text
          style={[
            styles.bodyText,
            { fontSize: 7.5, marginBottom: 2, color: "#64748B" },
          ]}>
          &bull; {labels.anomalies.uncappedUtilityChecks}
        </Text>
        <Text style={[styles.bodyText, { fontSize: 7.5, color: "#64748B" }]}>
          &bull; {labels.anomalies.pausedServiceLeakage}
        </Text>
      </View>
    ) : data.wasteList.length > 0 ? (
      data.wasteList.map((waste, idx) => (
        <Text
          key={idx}
          style={[
            styles.bodyText,
            { fontSize: 7.5, marginBottom: 2, color: "#9F1239" },
          ]}>
          &bull; {waste}
        </Text>
      ))
    ) : (
      <Text style={[styles.bodyText, { fontSize: 7.5, color: "#059669" }]}>
        &bull; {labels.anomalies.secureWaste}
      </Text>
    )}
    <Text
      style={[
        styles.bodyText,
        {
          color: "#D97706",
          fontFamily: "NotoSans",
          fontWeight: "bold",
          marginTop: 6,
          marginBottom: 4,
        },
      ]}>
      {labels.anomalies.renewalRiskTitle}
    </Text>
    {data.hasNoSubs ? (
      <View>
        <Text
          style={[
            styles.bodyText,
            { fontSize: 7.5, marginBottom: 2, color: "#64748B" },
          ]}>
          &bull; {labels.anomalies.lumpSumRenewals}
        </Text>
        <Text style={[styles.bodyText, { fontSize: 7.5, color: "#64748B" }]}>
          &bull; {labels.anomalies.gracePeriodExpirations}
        </Text>
      </View>
    ) : data.riskList.length > 0 ? (
      data.riskList.map((risk, idx) => (
        <Text
          key={idx}
          style={[
            styles.bodyText,
            { fontSize: 7.5, marginBottom: 2, color: "#92400E" },
          ]}>
          &bull; {risk}
        </Text>
      ))
    ) : (
      <Text style={[styles.bodyText, { fontSize: 7.5, color: "#059669" }]}>
        &bull; {labels.anomalies.secureRenewal}
      </Text>
    )}
  </SectionCard>
);

export const LifecycleDiagnostics = ({
  text,
  oldest,
  labels,
}: {
  text: string;
  oldest: string;
  labels: AuditPdfLabels;
}) => (
  <SectionCard title={labels.sections.lifecycleDiagnostics}>
    <Text style={styles.bodyText}>
      &bull; <Text style={styles.boldText}>{labels.lifecycle.legacyScans}</Text>{" "}
      {oldest}
      {"\n"}&bull;{" "}
      <Text style={styles.boldText}>
        {labels.lifecycle.planPricingConsistency}
      </Text>{" "}
      {text}
    </Text>
  </SectionCard>
);

export const AppendixRegistry = ({
  subscriptions,
  locale,
  labels,
}: {
  subscriptions: Subscription[];
  locale: Locale;
  labels: AuditPdfLabels;
}) => (
  <SectionCard title={labels.sections.appendixRegistry}>
    <View style={styles.tableHeader}>
      <Text style={styles.colName}>
        {labels.appendix.registry.columns.name}
      </Text>
      <Text style={styles.colCategory}>
        {labels.appendix.registry.columns.category}
      </Text>
      <Text style={styles.colCycle}>
        {labels.appendix.registry.columns.billingCycle}
      </Text>
      <Text style={styles.colPrice}>
        {labels.appendix.registry.columns.amount}
      </Text>
      <Text style={styles.colStatus}>
        {labels.appendix.registry.columns.nextBilling}
      </Text>
      <Text style={styles.colStatus}>
        {labels.appendix.registry.columns.status}
      </Text>
    </View>
    {subscriptions.length > 0 ? (
      subscriptions.map((sub, idx) => (
        <View
          key={sub.id}
          style={[
            styles.tableRow,
            idx % 2 === 1 ? styles.tableRowAlternate : {},
          ]}
          wrap={false}>
          <View style={styles.colName}>
            <View
              style={[
                styles.categoryPill,
                { backgroundColor: categoryColorsMap[sub.category] },
              ]}
            />
            <Text style={{ fontFamily: "NotoSans", fontWeight: "bold" }}>
              {sub.name}
            </Text>
          </View>
          <Text style={styles.colCategory}>
            {labels.formatCategory(sub.category)}
          </Text>
          <Text style={styles.colCycle}>
            {labels.formatBillingCycle(sub.billingCycle)}
          </Text>
          <Text style={styles.colPrice}>{priceFormatter(sub.price)}</Text>
          <Text style={styles.colStatus}>
            {dateFormatter(sub.nextBilling, locale, "numeric")}
          </Text>
          <Text style={styles.colStatus}>
            {labels.formatStatus(sub.status)}
          </Text>
        </View>
      ))
    ) : (
      <View style={styles.tableRow}>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: "#64748B",
            fontSize: 7,
          }}>
          {labels.appendix.registry.empty}
        </Text>
      </View>
    )}
  </SectionCard>
);

export const AppendixHistory = ({
  billingEvents,
  locale,
  labels,
}: {
  billingEvents: BillingEvent[];
  locale: Locale;
  labels: AuditPdfLabels;
}) => (
  <SectionCard title={labels.sections.appendixHistory}>
    <View style={styles.tableHeader}>
      <Text style={styles.colEventDate}>
        {labels.appendix.history.columns.chargedAt}
      </Text>
      <Text style={styles.colEventName}>
        {labels.appendix.history.columns.subscription}
      </Text>
      <Text style={styles.colEventCategory}>
        {labels.appendix.history.columns.category}
      </Text>
      <Text style={styles.colEventSource}>
        {labels.appendix.history.columns.renewalType}
      </Text>
      <Text style={styles.colEventAmount}>
        {labels.appendix.history.columns.amount}
      </Text>
    </View>
    {billingEvents.length > 0 ? (
      billingEvents.map((event, idx) => (
        <View
          key={event.id}
          style={[
            styles.tableRow,
            idx % 2 === 1 ? styles.tableRowAlternate : {},
          ]}
          wrap={false}>
          <Text style={styles.colEventDate}>
            {dateFormatter(event.chargedAt, locale, "numeric")}
          </Text>
          <View style={styles.colEventName}>
            <View
              style={[
                styles.categoryPill,
                {
                  backgroundColor:
                    categoryColorsMap[event.subscriptionCategory],
                },
              ]}
            />
            <Text style={{ fontFamily: "NotoSans", fontWeight: "bold" }}>
              {event.subscriptionName}
            </Text>
          </View>
          <Text style={styles.colEventCategory}>
            {labels.formatCategory(event.subscriptionCategory)}
          </Text>
          <Text style={styles.colEventSource}>
            {labels.formatEventSource(event.source)}
          </Text>
          <Text style={styles.colEventAmount}>
            {priceFormatter(event.amount)}
          </Text>
        </View>
      ))
    ) : (
      <View style={styles.tableRow}>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: "#64748B",
            fontSize: 7,
          }}>
          {labels.appendix.history.empty}
        </Text>
      </View>
    )}
  </SectionCard>
);

export const Footer = ({ labels }: { labels: AuditPdfLabels }) => (
  <View style={styles.footer}>
    <Text>{labels.footer.brand}</Text>
    <Text
      render={({ pageNumber, totalPages }) =>
        labels.footer.page(pageNumber, totalPages)
      }
    />
  </View>
);
