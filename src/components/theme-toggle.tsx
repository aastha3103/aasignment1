"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a skeleton placeholder to prevent layout shift (CLS optimization)
    return (
      <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
        <div className="h-8 w-8 rounded-full" />
        <div className="h-8 w-8 rounded-full" />
        <div className="h-8 w-8 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1 transition-colors">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={`h-8 w-8 rounded-full transition-all ${
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={`h-8 w-8 rounded-full transition-all ${
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={`h-8 w-8 rounded-full transition-all ${
          theme === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  )
}
