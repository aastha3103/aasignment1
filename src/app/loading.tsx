import { Skeleton } from "@/components/ui/skeleton"

// This loading skeleton is automatically shown by Next.js App Router
// when navigating to this route, leveraging React <Suspense> under the hood.
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-64 rounded-full mb-4" />
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/60 p-6 space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
