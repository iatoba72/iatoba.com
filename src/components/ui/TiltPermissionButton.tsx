"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Smartphone } from "lucide-react"
import { Button } from "./button"

interface TiltPermissionButtonProps {
  isVisible: boolean
  onRequestPermission: () => Promise<void>
}

export function TiltPermissionButton({ isVisible, onRequestPermission }: TiltPermissionButtonProps) {
  const [isRequesting, setIsRequesting] = React.useState(false)

  const handleClick = async () => {
    setIsRequesting(true)
    try {
      await onRequestPermission()
    } catch (error) {
      console.error('Failed to request permission:', error)
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                "0 0 0 10px rgba(59, 130, 246, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="rounded-lg"
          >
            <Button
              onClick={handleClick}
              disabled={isRequesting}
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Smartphone className="size-5" />
              {isRequesting ? "Requesting..." : "Enable Tilt Controls"}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
