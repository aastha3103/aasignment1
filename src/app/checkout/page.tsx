import { Suspense } from "react"
import { CheckoutForm } from "@/components/checkout-form"
import { Header } from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout | Assignment 1",
  description: "Checkout page with type-safe form validation using Zod and Server Actions",
}

function CheckoutSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 p-6 space-y-3">
        <Skeleton className="h-6 w-40" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border/60 p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Form validated with Zod schema (client + server). Submitted via Next.js Server Action (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">&apos;use server&apos;</code>).
            </p>
          </div>

          <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutForm />
          </Suspense>
        </div>
      </main>

      <footer className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Assignment 1 — End-to-End Type-Safe Server Action Form Mutation
          </p>
        </div>
      </footer>
    </div>
  )
}
