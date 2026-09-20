"use client"

import { useTransition } from "react"
import { deleteUser } from "./actions"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteUserButtonProps {
  userId: string
  userEmail: string
}

export function DeleteUserButton({ userId, userEmail }: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      startTransition(async () => {
        const res = await deleteUser(userId)
        if (!res.success) {
          alert(res.message)
        }
      })
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
      title={`Delete ${userEmail}`}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin text-destructive" /> : <Trash2 className="h-4 w-4" />}
    </button>
  )
}
