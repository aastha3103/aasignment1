// This is a React Server Component (RSC) — it runs ONLY on the server.
// It fetches product data on the server and passes serialized props to Client Components.
// The ProductCard and CartSidebar are 'use client' components that cross the hydration boundary.

import { Suspense } from "react"
import { getProducts } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"
import { Header } from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"

// Loading skeleton for product grid (used by Suspense)
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/60 p-6 space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Server Component that fetches and renders products
async function ProductGrid() {
  // Simulate server-side data fetch delay for Suspense demonstration
  const products = getProducts()

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        // Props (product) serialize across the RSC → Client Component hydration boundary.
        // Only JSON-serializable values can cross this boundary.
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">


        {/* Products + Cart */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse our selection and add items to your cart. Cart state persists across page reloads via Zustand + localStorage.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
            {/* Suspense boundary wraps the server-fetched product grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid />
            </Suspense>

            {/* Cart sidebar — client component with Zustand state */}
            <div className="order-first lg:order-last">
              <CartSidebar />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Assignment 1 — FST Course | Next.js App Router Architecture
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>RSC Hydration</span>
              <span>•</span>
              <span>Zustand Persistence</span>
              <span>•</span>
              <span>Server Actions</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
