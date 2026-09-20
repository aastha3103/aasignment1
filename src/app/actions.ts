"use server"

import { checkoutSchema } from "@/lib/schemas"
import { prisma } from "@/lib/prisma"
import { sendTransactionalEmail } from "@/lib/email"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  transactionId?: string
}

export async function processCheckout(data: unknown): Promise<ActionResponse> {
  // Simulate network delay for transition state UI
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 1. Validate incoming data with Zod schema (CO2 / Topic 3)
  const result = checkoutSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      errors: result.error.flatten().fieldErrors,
    }
  }

  const formData = result.data

  try {
    // 2. Check for active session or find/create guest user
    const session = await auth.api.getSession({ headers: await headers() })

    let userId = session?.user?.id

    if (!userId) {
      // Find or create user for guest checkout
      let user = await prisma.user.findUnique({
        where: { email: formData.email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: formData.name,
            email: formData.email,
            role: "GUEST",
          },
        })
      }
      userId = user.id
    }

    // 3. Save Transaction to Prisma Relational DB (CO4)
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: 24999.0, // Order total
        currency: "INR",
        description: `Order for ${formData.name} (${formData.city})`,
        category: "PURCHASE",
        status: "COMPLETED",
      },
    })

    // 4. Create Audit Log Entry
    await prisma.auditLog.create({
      data: {
        userId,
        action: "CREATE_TRANSACTION",
        target: `Order ID: ${transaction.id}`,
        ipAddress: "127.0.0.1",
        metadata: JSON.stringify({
          shippingAddress: `${formData.address}, ${formData.city} - ${formData.zipCode}`,
        }),
      },
    })

    // 5. Trigger Transactional Email via Resend & React Email (Topic 5)
    await sendTransactionalEmail({
      to: formData.email,
      subject: `Order Confirmation #${transaction.id.slice(-6)}`,
      type: "TRANSACTION_ALERT",
      data: {
        amount: 24999.0,
        currency: "INR",
        description: `Order #${transaction.id.slice(-6)} — ${formData.address}, ${formData.city}`,
        status: "COMPLETED",
      },
    })

    return {
      success: true,
      message: `Order #${transaction.id.slice(-6)} placed successfully! A confirmation email was dispatched to ${formData.email}.`,
      transactionId: transaction.id,
    }
  } catch (error) {
    console.error("Error processing checkout:", error)
    return {
      success: false,
      message: "Database transaction failed. Please try again.",
    }
  }
}
