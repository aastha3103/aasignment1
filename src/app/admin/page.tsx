import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  const userRole = (session.user as { role?: string }).role
  if (userRole !== "ADMIN") {
    redirect("/unauthorized")
  }

  // Fetch admin stats
  const [userCount, transactionCount, auditLogCount, emailLogCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.auditLog.count(),
      prisma.emailLog.count(),
    ])

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  const emailLogs = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  })

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              🛡️ Admin Authorization Gate (CO3 / RBAC)
            </div>
            <h1 className="text-3xl font-bold tracking-tight">System Admin Portal</h1>
            <p className="text-sm text-muted-foreground">
              Platform administration, user governance, audit telemetry, and email dispatch logs.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-border/80 bg-muted/40 px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            ← Back to User Dashboard
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Users</p>
            <p className="mt-2 text-3xl font-bold">{userCount}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Transactions</p>
            <p className="mt-2 text-3xl font-bold">{transactionCount}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Audit Logs</p>
            <p className="mt-2 text-3xl font-bold">{auditLogCount}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Email Logs</p>
            <p className="mt-2 text-3xl font-bold">{emailLogCount}</p>
          </div>
        </div>

        {/* System User Table */}
        <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
          <h2 className="text-lg font-bold">Registered Users (Prisma Relational Model)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        u.role === "ADMIN" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" :
                        u.role === "MEMBER" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-gray-500/10 text-gray-600"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Logs Table */}
        <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
          <h2 className="text-lg font-bold">Resend Transactional Email Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Resend ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {emailLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-xs">{log.recipient}</td>
                    <td className="px-4 py-3">{log.subject}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-600 dark:text-green-400">
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {log.resendId || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
