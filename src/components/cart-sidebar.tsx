"use client"

import { useCartStore, CartItem } from "@/store/useCartStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function CartSidebar() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const totalItems = useCartStore((s) => s.totalItems)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Cart ({totalItems()})
          </CardTitle>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive">
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
            <p className="text-xs text-muted-foreground/70">Add products to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{item.price.toLocaleString('en-IN')} each
                  </p>
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      item.quantity > 1
                        ? updateQuantity(item.id, item.quantity - 1)
                        : removeItem(item.id)
                    }
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="h-3 w-3 text-destructive" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{totalPrice().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">₹{totalPrice().toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full mt-2 gap-2" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
