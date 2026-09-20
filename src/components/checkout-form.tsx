"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutSchema, CheckoutFormData } from "@/lib/schemas"
import { processCheckout, ActionResponse } from "@/app/actions"
import { useCartStore } from "@/store/useCartStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useState, useTransition, useEffect } from "react"
import { Loader2, CheckCircle2, AlertCircle, CreditCard, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function CheckoutForm() {
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const totalItems = useCartStore((s) => s.totalItems)
  const clearCart = useCartStore((s) => s.clearCart)
  const [isPending, startTransition] = useTransition()
  const [response, setResponse] = useState<ActionResponse | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
    },
  })

  const onSubmit = (data: CheckoutFormData) => {
    setResponse(null)
    startTransition(async () => {
      const result = await processCheckout(data)
      setResponse(result)
      if (result.success) {
        clearCart()
        reset()
      }
    })
  }

  if (!mounted) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  // Success state
  if (response?.success) {
    return (
      <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
            Order Placed Successfully!
          </h3>
          <p className="text-center text-sm text-green-700 dark:text-green-300 max-w-sm">
            {response.message}
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-2 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No items in cart</p>
              <Link href="/">
                <Button variant="link" className="mt-2 gap-1">
                  <ArrowLeft className="h-4 w-4" /> Browse products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div className="border-t border-border/60 pt-2 mt-3 flex justify-between font-semibold">
                <span>Total ({totalItems()} items)</span>
                <span>₹{totalPrice().toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Shipping Information
          </CardTitle>
          <CardDescription>
            Enter your shipping details. All fields are validated client-side (Zod + react-hook-form) and server-side (Server Action).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Server-side error toast */}
          {response && !response.success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {response.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Rahul Sharma"
                {...register("name")}
                aria-invalid={!!errors.name}
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="rahul.sharma@example.in"
                {...register("email")}
                aria-invalid={!!errors.email}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Street Address / Locality</Label>
              <Input
                id="address"
                placeholder="42, MG Road, Sector 15"
                {...register("address")}
                aria-invalid={!!errors.address}
                className={errors.address ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>

            {/* City & Zip */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Mumbai"
                  {...register("city")}
                  aria-invalid={!!errors.city}
                  className={errors.city ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.city && (
                  <p className="text-xs text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">PIN Code</Label>
                <Input
                  id="zipCode"
                  placeholder="400001"
                  {...register("zipCode")}
                  aria-invalid={!!errors.zipCode}
                  className={errors.zipCode ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.zipCode && (
                  <p className="text-xs text-destructive">{errors.zipCode.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={isPending || items.length === 0}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Place Order
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
