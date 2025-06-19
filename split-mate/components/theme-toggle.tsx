"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <div className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
