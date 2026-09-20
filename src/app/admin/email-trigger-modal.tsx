"use client"

import { useState, useTransition } from "react"
import { dispatchAdminTestEmail } from "./actions"
import { Send, Loader2, CheckCircle2 } from "lucide-react"

interface EmailTriggerModalProps {
  defaultEmail?: string
}

export function EmailTriggerModal({ defaultEmail = "admin@example.com" }: EmailTriggerModalProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)

    startTransition(async () => {
      const res = await dispatchAdminTestEmail(email)
      setResult(res)
    })
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
      >
        <Send className="h-3.5 w-3.5" /> Dispatch Test Email
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                Resend Transactional Email Trigger
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Renders React Email templates (`WelcomeEmail`) and dispatches via Resend API to the target email address.
            </p>

            {result && (
              <div
                className={`rounded-lg border p-3 text-xs flex items-center gap-2 ${
                  result.success
                    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
                }`}
              >
                {result.success && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />}
                {result.message}
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="user@example.com"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-border/80 px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" /> Dispatch Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
