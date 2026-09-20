import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RoleSelector } from "./role-selector"
import { EmailTriggerModal } from "./email-trigger-modal"
import { DeleteUserButton } from "./delete-user-button"
import { Shield, Users, CreditCard, Activity, Mail, ArrowLeft } from "lucide-react"

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

  // Fetch admin stats in parallel (RSC)
  const [userCount, transactionCount, auditLogCount, emailLogCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.auditLog.count(),
      prisma.emailLog.count(),
    ])

  // Fetch user accounts
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
  })

  // Fetch audit log telemetry
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  })

  // Fetch email logs
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
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <Shield className="h-3.5 w-3.5" /> Admin Authorization Gate (CO3 / RBAC Active)
            </div>
            <h1 className="text-3xl font-bold tracking-tight">System Admin Portal</h1>
            <p className="text-sm text-muted-foreground">
              User governance, role RBAC management, audit telemetry, and email dispatch logs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <EmailTriggerModal defaultEmail={session.user.email} />
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> User Dashboard
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Users</p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-extrabold">{userCount}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Transactions</p>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-extrabold">{transactionCount}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Audit Telemetry</p>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-extrabold">{auditLogCount}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Email Logs</p>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-extrabold">{emailLogCount}</p>
          </div>
        </div>

        {/* System User Table with Interactive RBAC Role Selector */}
        <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">User Governance & Role RBAC Management</h2>
              <p className="text-xs text-muted-foreground">
                Dynamically update roles (ADMIN / MEMBER / GUEST) with automated audit log telemetry.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Current Role & RBAC Mutation</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <RoleSelector userId={u.id} currentRole={u.role} userEmail={u.email} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteUserButton userId={u.id} userEmail={u.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Telemetry Stream */}
        <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold">Audit Log Telemetry Stream</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target / Detail</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-bold text-xs">
                      <span className="rounded bg-muted px-2 py-0.5 font-mono">{log.action}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{log.target || "N/A"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{log.ipAddress || "127.0.0.1"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resend Email Logs Table */}
        <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold">Resend Transactional Email Delivery Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Resend ID</th>
                  <th className="px-4 py-3">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {emailLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-xs">{log.recipient}</td>
                    <td className="px-4 py-3">{log.subject}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        log.status.includes("SENT") || log.status === "DELIVERED"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {log.resendId || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
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
