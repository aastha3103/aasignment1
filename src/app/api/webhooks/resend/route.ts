import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/webhooks/resend — Resend webhook handler to update email delivery/bounce status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!data || !data.email_id) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      )
    }

    const emailId = data.email_id
    let status = "SENT"

    switch (type) {
      case "email.delivered":
        status = "DELIVERED"
        break
      case "email.bounced":
        status = "BOUNCED"
        break
      case "email.complained":
        status = "COMPLAINED"
        break
      default:
        status = type
    }

    // Update EmailLog table in DB
    const updated = await prisma.emailLog.updateMany({
      where: { resendId: emailId },
      data: { status },
    })

    console.log(`[RESEND WEBHOOK] Event: ${type} | ID: ${emailId} | Updated: ${updated.count}`)

    return NextResponse.json({ success: true, event: type, updatedCount: updated.count })
  } catch (error) {
    console.error("Resend Webhook Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
