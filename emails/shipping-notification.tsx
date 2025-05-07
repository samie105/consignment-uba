import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { Package } from "@/types/package"

interface ShippingNotificationEmailProps {
  package: Package
  trackingUrl: string
}

export function ShippingNotificationEmail({
  package: pkg,
  trackingUrl,
}: ShippingNotificationEmailProps) {
  const previewText = `New shipping request from ${pkg.sender.fullName}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://your-logo-url.com/logo.png"
            width="150"
            height="50"
            alt="DeliveryOne"
            style={logo}
          />
          <Heading style={h1}>New Shipping Request</Heading>
          
          <Section style={section}>
            <Text style={text}>
              A new shipping request has been submitted. Here are the details:
            </Text>

            <Section style={box}>
              <Text style={label}>Tracking Number:</Text>
              <Text style={value}>{pkg.tracking_number}</Text>

              <Text style={label}>Package Type:</Text>
              <Text style={value}>{pkg.package_type}</Text>

              <Text style={label}>Weight:</Text>
              <Text style={value}>{pkg.weight} kg</Text>

              <Text style={label}>Dimensions:</Text>
              <Text style={value}>
                {pkg.dimensions.length} x {pkg.dimensions.width} x {pkg.dimensions.height} cm
              </Text>
            </Section>

            <Section style={box}>
              <Text style={subheading}>Sender Information</Text>
              <Text style={text}>
                {pkg.sender.fullName}
                <br />
                {pkg.sender.email}
                <br />
                {pkg.sender.phone}
                <br />
                {pkg.sender.address}
              </Text>
            </Section>

            <Section style={box}>
              <Text style={subheading}>Recipient Information</Text>
              <Text style={text}>
                {pkg.recipient.fullName}
                <br />
                {pkg.recipient.email}
                <br />
                {pkg.recipient.phone}
                <br />
                {pkg.recipient.address}
              </Text>
            </Section>

            {pkg.description && (
              <Section style={box}>
                <Text style={subheading}>Package Description</Text>
                <Text style={text}>{pkg.description}</Text>
              </Section>
            )}

            <Section style={buttonContainer}>
              <Link style={button} href={trackingUrl}>
                View Tracking Details
              </Link>
            </Section>
          </Section>

          <Text style={footer}>
            This is an automated message from DeliveryOne. Please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const logo = {
  margin: "0 auto",
  marginBottom: "24px",
}

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  padding: "0 48px",
  margin: "0 0 24px",
}

const section = {
  padding: "0 48px",
}

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const box = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "24px",
  margin: "16px 0",
}

const subheading = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
}

const label = {
  color: "#525f7f",
  fontSize: "14px",
  fontWeight: "500",
  margin: "8px 0 4px",
}

const value = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0 0 16px",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
}

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
  margin: "32px 0 0",
} 