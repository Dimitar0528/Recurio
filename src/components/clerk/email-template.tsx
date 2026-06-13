import { BillingCycle } from "@/lib/validations/enums";
import { format } from "date-fns";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

type RenewalReminderEmailProps = {
  subscriptionName: string;
  nextBilling: Date;
  price: string;
  billingCycle: BillingCycle;
};

export async function RenewalReminderEmail({
  subscriptionName,
  nextBilling,
  price,
  billingCycle,
}: RenewalReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{subscriptionName} renews in 7 days</Preview>
      <Body
        style={{
          backgroundColor: "#f8fafc",
          padding: "40px 0",
          fontFamily: "Inter, Arial, sans-serif",
        }}>
        <Container
          style={{
            maxWidth: "560px",
            backgroundColor: "#fff",
            borderRadius: "24px",
            padding: "40px",
          }}>
          <Text
            style={{
              fontSize: "14px",
              color: "#64748b",
            }}>
            SUBSCRIPTION REMINDER
          </Text>
          <Text
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#0f172a",
            }}>
            {subscriptionName}
          </Text>
          <Text
            style={{
              fontSize: "18px",
              color: "#475569",
            }}>
            This subscription renews in 7 days.
          </Text>

          <Section
            style={{
              marginTop: "24px",
              padding: "24px",
              borderRadius: "16px",
              backgroundColor: "#f8fafc",
            }}>
            <Text>Renewal Date: {format(nextBilling, "yyyy-MM-dd")}</Text>
            <Text>Amount: {price}</Text>
            <Text>Billing Cycle: {billingCycle}</Text>
          </Section>

          <Section style={{ marginTop: "24px" }}>
            <Button
              href={"https://recurio-gg.vercel.app/dashboard"}
              style={{
                backgroundColor: "#0f172a",
                color: "#fff",
                padding: "14px 24px",
                borderRadius: "12px",
                textDecoration: "none",
              }}>
              View Subscription
            </Button>
            <Text
              style={{
                marginTop: "40px",
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: "1.6",
              }}>
              You're receiving this email because renewal reminders are enabled
              in your notification settings.
            </Text>
          </Section>
          
        </Container>
      </Body>
    </Html>
  );
}
