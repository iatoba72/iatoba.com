"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MobileMenuCardProps {
  href: string
  label: string
  index: number
  onNavigate: () => void
}

export function MobileMenuCard({
  href,
  label,
  index,
  onNavigate
}: MobileMenuCardProps) {
  const handleClick = () => {
    // Scroll to the target section
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }

    // Close menu immediately on mobile
    onNavigate()
  }

  return (
    <motion.div
      // Entrance animation (staggered)
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.05
      }}
    >
      <button
        onClick={handleClick}
        className={cn(
          // Base layout
          "w-full text-left relative overflow-hidden rounded-[10px] cursor-pointer",
          "px-6 py-5",

          // Touch optimization
          "touch-manipulation",

          // Glassmorphism
          "bg-card/90 backdrop-blur-md",
          "border border-border/20",

          // 3D depth shadows
          "shadow-xl shadow-black/10 dark:shadow-black/30",

          // Hover enhancements
          "hover:shadow-2xl hover:border-primary/30",
          "hover:scale-[1.03] hover:-translate-y-1",
          "transition-all duration-300",

          // Active/tap state
          "active:scale-[0.97]",

          // Focus state
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
      >
        <span className="text-xl font-semibold tracking-tight block relative z-10">
          {label}
        </span>

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </button>
    </motion.div>
  )
}
