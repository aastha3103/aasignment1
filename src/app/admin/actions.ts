"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendTransactionalEmail } from "@/lib/email"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

// Verify Admin Session Helper
async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    throw new Error("Unauthorized")
  }
  const userRole = (session.user as { role?: string }).role
  if (userRole !== "ADMIN") {
    throw new Error("Forbidden: Admin access required")
  }
  return session
}

// 1. Update User Role Server Action
export async function updateUserRole(userId: string, newRole: string) {
  try {
    const session = await verifyAdmin()

    const validRoles = ["ADMIN", "MEMBER", "GUEST"]
    if (!validRoles.includes(newRole)) {
      return { success: false, message: "Invalid role specified" }
    }

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    // Audit Log Entry
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_ROLE",
        target: `User ${updatedUser.email} -> ${newRole}`,
        ipAddress: "127.0.0.1",
        metadata: JSON.stringify({ targetUserId: userId, newRole }),
      },
    })

    revalidatePath("/admin")
    return { success: true, message: `Updated role for ${updatedUser.email} to ${newRole}` }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { success: false, message: error instanceof Error ? error.message : "Failed to update role" }
  }
}

// 2. Dispatch Manual Resend Test Notification Action
export async function dispatchAdminTestEmail(recipientEmail: string) {
  try {
    await verifyAdmin()

    const result = await sendTransactionalEmail({
      to: recipientEmail,
      subject: "Admin System Alert Notification",
      type: "WELCOME",
      data: { name: recipientEmail.split("@")[0] },
    })

    revalidatePath("/admin")
    return {
      success: result.success,
      message: result.success
        ? `Test notification dispatched to ${recipientEmail} (ID: ${result.messageId})`
        : `Failed to dispatch email: ${result.error}`,
    }
  } catch (error) {
    console.error("Error dispatching test email:", error)
    return { success: false, message: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// 3. Delete User Action
export async function deleteUser(userId: string) {
  try {
    const session = await verifyAdmin()

    if (userId === session.user.id) {
      return { success: false, message: "Cannot delete your own admin account" }
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE_USER",
        target: `User ${deletedUser.email}`,
        ipAddress: "127.0.0.1",
      },
    })

    revalidatePath("/admin")
    return { success: true, message: `User ${deletedUser.email} deleted successfully` }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete user" }
  }
}
