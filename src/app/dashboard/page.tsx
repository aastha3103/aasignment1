import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "./sign-out-button"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  const userRole = (session.user as { role?: string }).role || "MEMBER"

  // Fetch user's recent transactions
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  // Fetch user's recent audit logs
  const auditLogs = await prisma.auditLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, <span className="font-semibold text-foreground">{session.user.name}</span>!
            </p>
          </div>
          <div className="flex items-center gap-3">
            {userRole === "ADMIN" && (
              <Link
                href="/admin"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Admin Panel 🛡️
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>

        {/* User Card */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active User Session
            </h3>
            <p className="mt-2 text-xl font-bold">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Role: {userRole}
              </span>
              <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                Active Session
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Transactions
            </h3>
            <p className="mt-2 text-3xl font-extrabold">{transactions.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Persisted in Prisma SQLite database
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Security Logs
            </h3>
            <p className="mt-2 text-3xl font-extrabold">{auditLogs.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Audit events registered to this account
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <Link href="/checkout" className="text-xs font-medium text-primary hover:underline">
              + New Transaction
            </Link>
          </div>

          {transactions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No transactions recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/60 text-xs text-muted-foreground uppercase bg-muted/30">
                  <tr>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{tx.description}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{tx.category}</td>
                      <td className="px-4 py-3 font-semibold">
                        {tx.currency} {tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          tx.status === "COMPLETED" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                          tx.status === "PENDING" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
