"use server"

import { checkoutSchema, CheckoutFormData } from "@/lib/schemas"

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function processCheckout(data: unknown): Promise<ActionResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Validate the incoming data with Zod
  const result = checkoutSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      errors: result.error.flatten().fieldErrors
    }
  }

  // At this point result.data is fully typed and sanitized
  console.log("Processing order for:", result.data)

  // In a real app we'd save to DB here...
  
  return {
    success: true,
    message: "Order placed successfully!"
  }
}
