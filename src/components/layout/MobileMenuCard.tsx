"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MobileMenuCardProps {
  href: string
  label: string
  index: number
  onClick: (e: React.MouseEvent) => void
}

export function MobileMenuCard({
  href,
  label,
  index,
  onClick
}: MobileMenuCardProps) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={cn(
        // Base layout
        "block relative overflow-hidden rounded-[10px] cursor-pointer",
        "px-6 py-5",

        // Glassmorphism
        "bg-card/90 backdrop-blur-md",
        "border border-border/20",

        // 3D depth shadows
        "shadow-xl shadow-black/10 dark:shadow-black/30",

        // Hover enhancements
        "hover:shadow-2xl hover:border-primary/30",
        "transition-shadow duration-300",

        // Focus state
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary focus-visible:ring-offset-2"
      )}

      // Entrance animation (staggered)
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.08  // 80ms stagger between cards
      }}

      // Hover interaction
      whileHover={{
        scale: 1.03,
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}

      // Press/tap feedback
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <span className="text-xl font-semibold tracking-tight">
        {label}
      </span>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.a>
  )
}
