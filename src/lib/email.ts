import { Resend } from "resend"
import { prisma } from "@/lib/prisma"
import { render } from "@react-email/components"
import { WelcomeEmail } from "../emails/welcome"
import { TransactionAlertEmail } from "../emails/transaction-alert"

const resendApiKey = process.env.RESEND_API_KEY || "re_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export const resend = new Resend(resendApiKey)

type EmailType = "WELCOME" | "TRANSACTION_ALERT"

interface SendEmailParams {
  to: string
  subject: string
  type: EmailType
  data: Record<string, unknown>
}

export async function sendTransactionalEmail({ to, subject, type, data }: SendEmailParams) {
  try {
    let html = ""

    if (type === "WELCOME") {
      html = await render(WelcomeEmail({ name: (data.name as string) || "Customer" }))
    } else if (type === "TRANSACTION_ALERT") {
      html = await render(
        TransactionAlertEmail({
          amount: (data.amount as number) || 0,
          currency: (data.currency as string) || "INR",
          description: (data.description as string) || "Purchase",
          status: (data.status as string) || "COMPLETED",
        })
      )
    }

    let messageId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`
    let isMock = false

    // If key is a test key or placeholder, mock send
    if (resendApiKey.startsWith("re_test_") || resendApiKey.includes("xxx")) {
      console.log(`[MOCK EMAIL] To: ${to} | Subject: "${subject}" | Type: ${type}`)
      isMock = true
    } else {
      const response = await resend.emails.send({
        from: "TechStore <onboarding@resend.dev>",
        to,
        subject,
        html,
      })

      if (response.error) {
        throw new Error(response.error.message)
      }
      if (response.data?.id) {
        messageId = response.data.id
      }
    }

    // Persist to EmailLog database table
    await prisma.emailLog.create({
      data: {
        recipient: to,
        subject,
        status: isMock ? "SENT (MOCK)" : "SENT",
        resendId: messageId,
      },
    })

    return { success: true, messageId, isMock }
  } catch (error) {
    console.error("Failed to send email:", error)

    await prisma.emailLog.create({
      data: {
        recipient: to,
        subject,
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    })

    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
