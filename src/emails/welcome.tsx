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

interface WelcomeEmailProps {
  name: string
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to TechStore!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome, {name}! 🎉</Heading>
        <Text style={text}>
          Thank you for signing up for TechStore. We are excited to have you on board!
        </Text>
        <Section style={card}>
          <Text style={cardText}>
            Your account is ready. Explore our product catalog, perform secure transactions, and access your dashboard.
          </Text>
        </Section>
        <Text style={footer}>
          TechStore Inc. • App Router Architecture & Server Actions
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

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
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
}

const text = {
  color: "#444444",
  fontSize: "16px",
  lineHeight: "24px",
}

const card = {
  backgroundColor: "#f0f4f8",
  padding: "16px",
  borderRadius: "6px",
  marginTop: "20px",
}

const cardText = {
  color: "#2b4c7e",
  fontSize: "14px",
}

const footer = {
  color: "#888888",
  fontSize: "12px",
  marginTop: "30px",
}
