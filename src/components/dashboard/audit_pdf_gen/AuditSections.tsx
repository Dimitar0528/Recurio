import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { priceFormatter } from "@/lib/utils";
import { Subscription, BillingEvent } from "@/lib/validations/schemas";
import {
  styles,
  categoryColorsMap,
  formatDate,
} from "./audit-styles";
import { CATEGORY_VALUES } from "@/lib/validations/enums";
import { AuditAnalyticsData } from "./audit-analytics";

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

export const CoverHeader = () => (
  <View style={styles.coverContainer}>
    <Text style={styles.coverSubtitle}>System Scan Intelligence Audit</Text>
    <Text style={styles.coverTitle}>RECURIO FINANCIAL LEDGER AUDIT</Text>
    <View style={styles.coverMeta}>
      <Text>System Check: Verified & Confirmed</Text>
      <Text>Generation Timestamp: {formatDate(new Date())}</Text>
    </View>
  </View>
);

export const ExecutiveSummary = ({ text }: { text: string }) => (
  <SectionCard title="I. Executive Summary">
    <Text style={styles.bodyText}>{text}</Text>
  </SectionCard>
);

export const FinancialHealth = ({ data }: { data: AuditAnalyticsData }) => (
  <SectionCard title="II. Financial Health Indicators & Projections">
    <View style={styles.kpiGrid}>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>Current Burn Rate</Text>
        <Text style={styles.kpiValue}>
          {priceFormatter(data.monthlyBurn)} / mo
        </Text>
      </View>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>PROJECTED YEARLY COST</Text>
        <Text style={styles.kpiValue}>
          {priceFormatter(data.annualBurn)} / yr
        </Text>
      </View>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>Lifetime Aggregated Spend</Text>
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

export const CategoryAnalysis = ({ data }: { data: AuditAnalyticsData }) => {
  const categoryDescriptionsMap: Record<string, string> = {
    Entertainment:
        "Streaming platforms (Netflix, Spotify), gaming, and recreational content subscriptions.",
    Software:
        "Desktop licenses, digital design tools, general productivity suites, and software keys.",
    Utilities:
        "Core operational overhead such as internet access, mobile plans, and recurring utility bills.",
    Productivity:
        "Task managers, note-taking apps, collaborative digital whiteboards, and organizational tools.",
    "Cloud & Infrastructure":
        "Hosting platforms (AWS, Vercel), web databases, domain names, and developer API lines.",
    Finance:
        "Accounting tools, personal budgeting software, premium bank memberships, and taxation plans.",
    "Health & Fitness":
        "Gym access, wellness trackers, running/cycling applications, and wellness subscriptions.",
    Education:
        "E-learning platforms, language training portals, academic resources, and educational courseware.",
    "News & Media":
        "Newspaper portals, specialized newsletters, online publications, and trade magazines.",
    Other:
        "Miscellaneous recurring spend, hardware leases, and other hybrid digital subscriptions.",
    };

return(
  <SectionCard title="III. Spending & Category Analysis">
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
                  {category}
                </Text>
              </View>
              <Text
                style={{ fontSize: 6.5, color: "#64748B", lineHeight: 1.2 }}>
                {categoryDescriptionsMap[category]}
              </Text>
            </View>
          ))}
        </View>
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
                  {category}
                </Text>
              </View>
              <Text
                style={{ fontSize: 6.5, color: "#64748B", lineHeight: 1.2 }}>
                {categoryDescriptionsMap[category]}
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
                  {category}
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
            Category Diversification Index
          </Text>
          <Text style={styles.bodyText}>
            {data.categoryDiversityText}
            {data.categoryList.length > 0 && (
              <Text>
                {"\n\n"}The diagnostic metrics locate your primary cost center
                within the{" "}
                <Text style={styles.boldText}>
                  {data.categoryList[0].category}
                </Text>{" "}
                sector, responsible for{" "}
                <Text style={styles.boldText}>
                  {data.categoryList[0].percentage.toFixed(2)}%
                </Text>{" "}
                of your active tool overhead.
              </Text>
            )}
          </Text>
        </View>
      </View>
    )}
  </SectionCard>
)};

export const BehavioralInsights = ({ data }: { data: AuditAnalyticsData }) => (
  <SectionCard title="IV. Behavioral Insights">
    <Text style={styles.bodyText}>
      {data.behavioralAutomationText}
      {data.totalEvents > 0 && !data.hasNoSubs && (
        <Text>
          {"\n\n"}&bull;{" "}
          <Text style={styles.boldText}>Transaction Autonomy:</Text> Out of{" "}
          {data.totalEvents} payment operations processed,{" "}
          {data.autoEventsCount} ({data.autoEventRatio.toFixed(0)}%) were
          initialized on fully autonomous API lines, while the remaining
          represent manual renewal adjustments.
        </Text>
      )}
    </Text>
  </SectionCard>
);

export const TopCostCenters = ({ data }: { data: AuditAnalyticsData }) => (
  <SectionCard title="V. Top Cost Centers & High-Cost Services">
    <View style={styles.splitGrid}>
      <View
        style={[
          styles.splitCol,
          { borderRightWidth: 1, borderRightColor: "#F1F5F9", paddingRight: 6 },
        ]}>
        <Text
          style={[
            styles.bodyText,
            { fontFamily: "NotoSans", fontWeight: "bold", marginBottom: 4 },
          ]}>
          Costliest Active Accounts:
        </Text>
        {data.costliestActive.length > 0 ? (
          data.costliestActive.map((sub, idx) => (
            <Text
              key={sub.id}
              style={[styles.bodyText, { fontSize: 7.5, marginBottom: 2 }]}>
              {idx + 1}. {sub.name} &bull;{" "}
              <Text style={styles.boldText}>{priceFormatter(sub.price)}</Text> (
              {sub.billingCycle})
            </Text>
          ))
        ) : (
          <Text style={styles.bodyText}>No active subscriptions found.</Text>
        )}
      </View>
      <View style={styles.splitCol}>
        <Text
          style={[
            styles.bodyText,
            { fontFamily: "NotoSans", fontWeight: "bold", marginBottom: 4 },
          ]}>
          Upcoming Renewal Timeline:
        </Text>
        {data.upcomingObligations.length > 0 ? (
          data.upcomingObligations.map((s) => (
            <View key={s.id} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View>
                <Text style={styles.timelineMeta}>
                  {formatDate(s.nextBilling)} &bull; {s.name}
                </Text>
                <Text style={{ fontSize: 6.5, color: "#64748B" }}>
                  Due: {priceFormatter(s.price)} ({s.billingCycle})
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.bodyText}>No upcoming renewals scheduled.</Text>
        )}
      </View>
    </View>
  </SectionCard>
);

export const AnomaliesRisks = ({ data }: { data: AuditAnalyticsData }) => (
  <SectionCard title="VI. Anomalies, Hidden Waste & Renewal Risks">
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
      Passive Waste & Leakage Indicators:
    </Text>
    {data.hasNoSubs ? (
      <View style={{ marginBottom: 4 }}>
        <Text
          style={[
            styles.bodyText,
            { fontSize: 7.5, marginBottom: 2, color: "#64748B" },
          ]}>
          &bull; Inactive account drift: Ghost accounts quietly drawing capital
          after team departures.
        </Text>
        <Text
          style={[
            styles.bodyText,
            { fontSize: 7.5, marginBottom: 2, color: "#64748B" },
          ]}>
          &bull; Uncapped utility checks: Automated warnings identifying
          high-cost unmapped software items.
        </Text>
        <Text style={[styles.bodyText, { fontSize: 7.5, color: "#64748B" }]}>
          &bull; Paused service leakage: Automated system scans to ensure paused
          subscriptions stop executing transactions.
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
        &bull; Secure: No post-cancel charges or uncategorized leak vectors
        detected.
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
      Active Renewal Risk Indicators:
    </Text>
    {data.hasNoSubs ? (
      <View>
        <Text
          style={[
            styles.bodyText,
            { fontSize: 7.5, marginBottom: 2, color: "#64748B" },
          ]}>
          &bull; Lump-sum renewals: Visual highlights identifying upcoming
          large-value annual platform renewals.
        </Text>
        <Text style={[styles.bodyText, { fontSize: 7.5, color: "#64748B" }]}>
          &bull; Grace period expirations: System safeguards to prevent manual
          payment plans from unexpected shutdowns.
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
        &bull; Secure: All monitored services mapped to active, automatic
        renewal pipelines.
      </Text>
    )}
  </SectionCard>
);

export const LifecycleDiagnostics = ({
  text,
  oldest,
}: {
  text: string;
  oldest: string;
}) => (
  <SectionCard title="VII. Lifecycle & Consistency Diagnostics">
    <Text style={styles.bodyText}>
      &bull; <Text style={styles.boldText}>Legacy Scans:</Text> {oldest}
      {"\n"}&bull;{" "}
      <Text style={styles.boldText}>Plan Pricing Consistency:</Text> {text}
    </Text>
  </SectionCard>
);

export const AppendixRegistry = ({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) => (
  <SectionCard title="Appendix A: Your Subscriptions Registry">
    <View style={styles.tableHeader}>
      <Text style={styles.colName}>Name</Text>
      <Text style={styles.colCategory}>Category</Text>
      <Text style={styles.colCycle}>Billing Cycle</Text>
      <Text style={styles.colPrice}>Amount</Text>
      <Text style={styles.colStatus}>Next Billing</Text>
      <Text style={styles.colStatus}>Status</Text>
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
          <Text style={styles.colCategory}>{sub.category}</Text>
          <Text style={styles.colCycle}>{sub.billingCycle}</Text>
          <Text style={styles.colPrice}>{priceFormatter(sub.price)}</Text>
          <Text style={styles.colStatus}>{formatDate(sub.nextBilling)}</Text>
          <Text style={styles.colStatus}>{sub.status}</Text>
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
          No subscription data recorded. Build your registry inside the
          dashboard to initialize tracking tables.
        </Text>
      </View>
    )}
  </SectionCard>
);

export const AppendixHistory = ({
  billingEvents,
}: {
  billingEvents: BillingEvent[];
}) => (
  <SectionCard title="Appendix B: Historical Ledger History">
    <View style={styles.tableHeader}>
      <Text style={styles.colEventDate}>Charged At</Text>
      <Text style={styles.colEventName}>Subscription</Text>
      <Text style={styles.colEventCategory}>Category</Text>
      <Text style={styles.colEventSource}>Renewal Type</Text>
      <Text style={styles.colEventAmount}>Amount</Text>
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
          <Text style={styles.colEventDate}>{formatDate(event.chargedAt)}</Text>
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
            {event.subscriptionCategory}
          </Text>
          <Text style={styles.colEventSource}>{event.source}</Text>
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
          No transaction history logged. Charges will populate as recurring
          billing processes.
        </Text>
      </View>
    )}
  </SectionCard>
);

export const Footer = () => (
  <View style={styles.footer}>
    <Text>Recurio Financial Audit</Text>
    <Text
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} of ${totalPages}`
      }
    />
  </View>
);
