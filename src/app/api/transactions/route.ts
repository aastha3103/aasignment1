import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { sendTransactionalEmail } from "@/lib/email"

// GET /api/transactions — Fetch transactions for the authenticated user
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ transactions })
}

// POST /api/transactions — Create a new transaction & trigger audit log + email
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { amount, currency = "INR", description, category = "PURCHASE" } = body

    if (!amount || !description) {
      return NextResponse.json(
        { error: "Amount and description are required" },
        { status: 400 }
      )
    }

    // 1. Create Transaction in DB
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: parseFloat(amount),
        currency,
        description,
        category,
        status: "COMPLETED",
      },
    })

    // 2. Write Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_TRANSACTION",
        target: `Transaction ID: ${transaction.id}`,
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
        metadata: JSON.stringify({ amount, currency, description }),
      },
    })

    // 3. Dispatch Transactional Lifecycle Email via Resend
    const emailResult = await sendTransactionalEmail({
      to: session.user.email,
      subject: `Transaction Confirmation — ${currency} ${amount}`,
      type: "TRANSACTION_ALERT",
      data: { amount, currency, description, status: "COMPLETED" },
    })

    return NextResponse.json({
      success: true,
      transaction,
      emailSent: emailResult.success,
    })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
