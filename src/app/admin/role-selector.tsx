"use client"

import { useState, useTransition } from "react"
import { updateUserRole } from "./actions"
import { Loader2 } from "lucide-react"

interface RoleSelectorProps {
  userId: string
  currentRole: string
  userEmail: string
}

export function RoleSelector({ userId, currentRole, userEmail }: RoleSelectorProps) {
  const [role, setRole] = useState(currentRole)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setRole(newRole)
    setMessage(null)

    startTransition(async () => {
      const res = await updateUserRole(userId, newRole)
      if (res.success) {
        setMessage("Role updated!")
        setTimeout(() => setMessage(null), 3000)
      } else {
        setRole(currentRole)
        setMessage("Failed to update")
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={handleChange}
        disabled={isPending}
        className="rounded-md border border-border/80 bg-background px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
      >
        <option value="ADMIN">ADMIN</option>
        <option value="MEMBER">MEMBER</option>
        <option value="GUEST">GUEST</option>
      </select>
      {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
      {message && <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">{message}</span>}
    </div>
  )
}
