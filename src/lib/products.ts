// Server-side product data — this file runs only on the server (RSC)
// Props from this data serialize across the hydration boundary to client components

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
}

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with adaptive noise cancellation, 30-hour battery life, and Hi-Res Audio support.",
    price: 24999,
    image: "🎧",
    category: "Audio",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Mechanical Keyboard RGB",
    description: "Hot-swappable switches, per-key RGB lighting, aircraft-grade aluminum frame with PBT keycaps.",
    price: 14999,
    image: "⌨️",
    category: "Peripherals",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Ultra-Wide Curved Monitor",
    description: "34-inch WQHD display with 165Hz refresh rate, 1ms response time, and USB-C connectivity.",
    price: 44999,
    image: "🖥️",
    category: "Displays",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Ergonomic Wireless Mouse",
    description: "Vertical design with 4000 DPI sensor, Bluetooth 5.0, and rechargeable battery lasting 3 months.",
    price: 5999,
    image: "🖱️",
    category: "Peripherals",
    rating: 4.5,
  },
  {
    id: "5",
    name: "Portable SSD 2TB",
    description: "NVMe external drive with 2000MB/s read speed, IP65 water resistance, and hardware encryption.",
    price: 15999,
    image: "💾",
    category: "Storage",
    rating: 4.6,
  },
  {
    id: "6",
    name: "Smart Desk Lamp Pro",
    description: "Auto-dimming LED with ambient light sensor, wireless charging base, and voice assistant support.",
    price: 6999,
    image: "💡",
    category: "Accessories",
    rating: 4.4,
  },
]

export function getProducts(): Product[] {
  return products
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
