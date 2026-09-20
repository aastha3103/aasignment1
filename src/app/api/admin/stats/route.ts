import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

// GET /api/admin/stats — Admin-only endpoint for platform statistics
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userRole = (session.user as { role?: string }).role
  if (userRole !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: Admin role required" },
      { status: 403 }
    )
  }

  const [userCount, transactionCount, auditLogCount, emailLogCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.auditLog.count(),
      prisma.emailLog.count(),
    ])

  return NextResponse.json({
    stats: {
      users: userCount,
      transactions: transactionCount,
      auditLogs: auditLogCount,
      emailLogs: emailLogCount,
    },
  })
}
