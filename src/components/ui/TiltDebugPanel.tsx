"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Bug, AlertCircle } from "lucide-react"
import { Button } from "./button"
import type { DeviceTiltData } from "@/hooks/useDeviceTilt"

interface TiltDebugPanelProps {
  tiltData: DeviceTiltData
}

export function TiltDebugPanel({ tiltData }: TiltDebugPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [showTroubleshooting, setShowTroubleshooting] = React.useState(false)

  // Only show on mobile
  if (!tiltData.isMobile) return null

  const getStatusIcon = (isOk: boolean) => isOk ? "✅" : "❌"
  const getStatusColor = (isOk: boolean) => isOk ? "text-green-500" : "text-red-500"

  const timeSinceLastEvent = tiltData.lastEventTime
    ? Math.floor((Date.now() - tiltData.lastEventTime) / 1000)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50 max-w-[90vw] md:max-w-sm"
    >
      <div className="rounded-lg border bg-background/95 backdrop-blur shadow-lg">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-3 text-left hover:bg-accent/50 transition-colors rounded-t-lg"
        >
          <div className="flex items-center gap-2">
            <Bug className="size-4" />
            <span className="text-sm font-semibold">Tilt Debug</span>
          </div>
          {isExpanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </button>

        {/* Debug Info */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t overflow-hidden"
            >
              <div className="p-3 space-y-2 text-xs font-mono">
                {/* Device Detection */}
                <div className="space-y-1">
                  <div className={getStatusColor(tiltData.isIOS || tiltData.isAndroid)}>
                    {getStatusIcon(tiltData.isIOS || tiltData.isAndroid)} Device: {
                      tiltData.isIOS ? "iOS" : tiltData.isAndroid ? "Android" : "Unknown"
                    }
                  </div>
                  <div className={getStatusColor(tiltData.apiAvailable)}>
                    {getStatusIcon(tiltData.apiAvailable)} API Available
                  </div>
                </div>

                {/* Permission Status */}
                <div className="pt-2 border-t">
                  <div className={getStatusColor(tiltData.permissionStatus === 'granted')}>
                    {getStatusIcon(tiltData.permissionStatus === 'granted')} Permission: {
                      tiltData.permissionStatus === 'not_requested' ? 'Not Requested' :
                      tiltData.permissionStatus === 'requesting' ? 'Requesting...' :
                      tiltData.permissionStatus === 'granted' ? 'Granted' :
                      tiltData.permissionStatus === 'denied' ? 'Denied' :
                      'Error'
                    }
                  </div>
                  <div className={getStatusColor(tiltData.listenerAttached)}>
                    {getStatusIcon(tiltData.listenerAttached)} Listener Attached
                  </div>
                </div>

                {/* Event Data */}
                <div className="pt-2 border-t">
                  <div className={getStatusColor(tiltData.eventCount > 0)}>
                    {getStatusIcon(tiltData.eventCount > 0)} Events: {tiltData.eventCount}
                    {timeSinceLastEvent !== null && (
                      <span className="ml-2 text-muted-foreground">
                        ({timeSinceLastEvent}s ago)
                      </span>
                    )}
                  </div>
                </div>

                {/* Raw Values */}
                <div className="pt-2 border-t">
                  <div className="text-muted-foreground">Raw Values:</div>
                  <div className={getStatusColor(tiltData.rawBeta !== null && tiltData.rawBeta !== 0)}>
                    Beta: {tiltData.rawBeta !== null ? tiltData.rawBeta.toFixed(2) : "null"}
                  </div>
                  <div className={getStatusColor(tiltData.rawGamma !== null && tiltData.rawGamma !== 0)}>
                    Gamma: {tiltData.rawGamma !== null ? tiltData.rawGamma.toFixed(2) : "null"}
                  </div>
                </div>

                {/* Processed Values */}
                <div className="pt-2 border-t">
                  <div className="text-muted-foreground">Processed:</div>
                  <div>TiltX: {tiltData.tiltX.toFixed(3)}</div>
                  <div>TiltY: {tiltData.tiltY.toFixed(3)}</div>
                </div>

                {/* Troubleshooting */}
                {(tiltData.permissionStatus === 'granted' && tiltData.eventCount === 0) && (
                  <div className="pt-2 border-t">
                    <div className="flex items-start gap-2 text-yellow-500">
                      <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                      <div className="text-xs leading-tight">
                        Permission granted but no events firing!
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                      className="mt-2 w-full text-xs h-7"
                    >
                      {showTroubleshooting ? "Hide" : "Show"} Troubleshooting
                    </Button>
                  </div>
                )}

                {/* Troubleshooting Steps */}
                <AnimatePresence>
                  {showTroubleshooting && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pt-2 border-t space-y-2 overflow-hidden"
                    >
                      <div className="text-muted-foreground font-semibold">iOS Safari Settings:</div>
                      <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed">
                        <li>Open <strong>Settings</strong> app</li>
                        <li>Scroll to <strong>Safari</strong></li>
                        <li>Disable <strong>"Prevent Cross-Site Tracking"</strong></li>
                        <li>Check for <strong>"Motion & Orientation Access"</strong> (if available)</li>
                        <li>Return to browser and <strong>refresh page</strong></li>
                      </ol>
                      <div className="text-xs text-muted-foreground italic mt-2">
                        Note: Some iOS versions may have additional privacy settings that block sensor access.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
