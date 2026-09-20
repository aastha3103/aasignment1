"use client"

import { ShoppingCart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  const totalItems = useCartStore((s) => s.totalItems)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = mounted ? totalItems() : 0

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            A1
          </div>
          <span className="text-lg font-semibold tracking-tight">TechStore</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Products
          </Link>
          <Link href="/checkout" className="transition-colors hover:text-foreground">
            Checkout
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/checkout">
            <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in-50">
                  {count}
                </span>
              )}
              <span className="sr-only">Shopping cart with {count} items</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
