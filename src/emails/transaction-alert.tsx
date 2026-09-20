import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from "@react-email/components"

interface TransactionAlertEmailProps {
  amount: number
  currency: string
  description: string
  status: string
}

export const TransactionAlertEmail = ({
  amount,
  currency,
  description,
  status,
}: TransactionAlertEmailProps) => (
  <Html>
    <Head />
    <Preview>{`Transaction Confirmation: ${currency} ${amount}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Transaction Confirmed ✅</Heading>
        <Text style={text}>
          Your order / transaction has been processed successfully.
        </Text>
        <Section style={box}>
          <Text style={detailsHeader}>Transaction Details</Text>
          <Text style={details}>
            <strong>Item/Description:</strong> {description}
          </Text>
          <Text style={details}>
            <strong>Amount:</strong> {currency} {String(amount.toLocaleString())}
          </Text>
          <Text style={details}>
            <strong>Status:</strong> {status}
          </Text>
        </Section>
        <Text style={footer}>
          TechStore — Secured by Better Auth & Prisma ORM
        </Text>
      </Container>
    </Body>
  </Html>
)

export default TransactionAlertEmail

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
}

const h1 = {
  color: "#16a34a",
  fontSize: "22px",
  fontWeight: "600",
}

const text = {
  color: "#444444",
  fontSize: "15px",
}

const box = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  padding: "16px",
  borderRadius: "6px",
  marginTop: "16px",
}

const detailsHeader = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#334155",
  marginBottom: "8px",
}

const details = {
  fontSize: "13px",
  color: "#475569",
  margin: "4px 0",
}

const footer = {
  color: "#94a3b8",
  fontSize: "12px",
  marginTop: "30px",
}
