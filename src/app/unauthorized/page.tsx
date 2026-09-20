import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 text-6xl">🔒</div>
        <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have the required permissions to view this page. This route is restricted to <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">ADMIN</code> role users.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-border/80 bg-muted/40 px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
