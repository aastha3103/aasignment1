"use client"

// This is a Client Component ('use client') because it uses Zustand state + event handlers.
// It receives `product` props that were serialized across the RSC → Client hydration boundary.
// The Product type is a plain object (no functions, dates, or class instances) so it serializes safely.

import { Product } from "@/lib/products"
import { useCartStore } from "@/store/useCartStore"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  product: Product // Serialized from Server Component → Client Component across hydration boundary
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = () => {
    setIsAdding(true)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
    setTimeout(() => setIsAdding(false), 600)
  }

  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {/* Category badge */}
      <div className="absolute right-3 top-3 z-10">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {product.category}
        </span>
      </div>

      <CardHeader className="pb-3">
        {/* Emoji as product image stand-in */}
        <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-muted/50 text-6xl transition-transform duration-300 group-hover:scale-105">
          {product.image}
        </div>
        <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.floor(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">{product.rating}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <span className="text-2xl font-bold tracking-tight">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        <Button
          onClick={handleAdd}
          size="sm"
          className={`gap-2 transition-all duration-300 ${
            isAdding ? "bg-green-600 hover:bg-green-700" : ""
          }`}
          disabled={isAdding}
        >
          <ShoppingCart className={`h-4 w-4 transition-transform ${isAdding ? "scale-110" : ""}`} />
          {isAdding ? "Added!" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
