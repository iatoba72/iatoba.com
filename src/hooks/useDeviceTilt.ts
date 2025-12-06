import { useEffect, useState, useCallback, useRef } from 'react'

export interface DeviceTiltData {
  // Core tilt data
  tiltX: number
  tiltY: number
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  needsPermission: boolean
  hasPermission: boolean
  requestPermission: () => Promise<void>

  // Diagnostic data for debugging
  permissionStatus: 'not_requested' | 'requesting' | 'granted' | 'denied' | 'error'
  listenerAttached: boolean
  eventCount: number
  lastEventTime: number | null
  rawBeta: number | null
  rawGamma: number | null
  apiAvailable: boolean
}

// Clamp utility function
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Lerp utility for smoothing
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

export function useDeviceTilt(): DeviceTiltData {
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [hasPermission, setHasPermission] = useState(false)
  const [needsPermission, setNeedsPermission] = useState(false)

  // Diagnostic states
  const [permissionStatus, setPermissionStatus] = useState<'not_requested' | 'requesting' | 'granted' | 'denied' | 'error'>('not_requested')
  const [listenerAttached, setListenerAttached] = useState(false)
  const [eventCount, setEventCount] = useState(0)
  const [lastEventTime, setLastEventTime] = useState<number | null>(null)
  const [rawBeta, setRawBeta] = useState<number | null>(null)
  const [rawGamma, setRawGamma] = useState<number | null>(null)

  // Smoothed tilt values
  const smoothedTiltX = useRef(0)
  const smoothedTiltY = useRef(0)

  // Event counter for tracking
  const eventCountRef = useRef(0)
  const eventCountIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Device detection
  // Enhanced iPad detection for iPadOS 13+ which reports as "Macintosh"
  const isIOS = typeof window !== 'undefined' && (() => {
    const ua = navigator.userAgent
    const isIPad = /iPad/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isIPhone = /iPhone|iPod/.test(ua)
    return isIPad || isIPhone
  })()
  const isAndroid = typeof window !== 'undefined' && /Android/.test(navigator.userAgent)
  const isMobile = isIOS || isAndroid

  // Check if API is available
  const apiAvailable = typeof window !== 'undefined' && typeof DeviceOrientationEvent !== 'undefined'

  // Check if iOS requires permission
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if this is iOS 13+ that requires permission
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      setNeedsPermission(true)
    } else if (isMobile) {
      // Android or older iOS - can start listening immediately
      setHasPermission(true)
      setPermissionStatus('granted')
    }
  }, [isMobile])

  // Request permission for iOS
  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent === 'undefined') return

    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setPermissionStatus('requesting')
        console.log('[DeviceTilt] Requesting iOS device orientation permission...')

        const permission = await (DeviceOrientationEvent as any).requestPermission()
        console.log('[DeviceTilt] Permission response:', permission)

        if (permission === 'granted') {
          setHasPermission(true)
          setNeedsPermission(false)
          setPermissionStatus('granted')
          console.log('[DeviceTilt] ✓ Permission granted')
          console.log('[DeviceTilt] Note: If tilt still does not work, disable "Prevent Cross-Site Tracking" in Settings > Safari')
        } else {
          setHasPermission(false)
          setNeedsPermission(false)
          setPermissionStatus('denied')
          console.warn('[DeviceTilt] Permission denied by user')
        }
      }
    } catch (error) {
      console.error('[DeviceTilt] Error requesting device orientation permission:', error)
      console.error('[DeviceTilt] Common causes:')
      console.error('[DeviceTilt] - Not called from user gesture (button click)')
      console.error('[DeviceTilt] - Site not served over HTTPS')
      console.error('[DeviceTilt] - Cross-Site Tracking Prevention is enabled')
      setHasPermission(false)
      setNeedsPermission(false)
      setPermissionStatus('error')
    }
  }, [])

  // Handle device orientation
  useEffect(() => {
    if (typeof window === 'undefined' || !hasPermission) {
      setListenerAttached(false)
      return
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Get orientation values - check for null/undefined
      // iOS Safari may return null if sensors are blocked
      const beta = event.beta ?? 0   // Front-to-back tilt (-180 to 180)
      const gamma = event.gamma ?? 0 // Left-to-right tilt (-90 to 90)

      // Update diagnostic data
      setRawBeta(event.beta)
      setRawGamma(event.gamma)
      setLastEventTime(Date.now())
      eventCountRef.current += 1

      // Debug: Log values on iOS to help troubleshoot
      if (isIOS && (smoothedTiltX.current === 0 && smoothedTiltY.current === 0)) {
        // Only log once when first non-zero values are received
        if (beta !== 0 || gamma !== 0) {
          console.log('[DeviceTilt] iOS orientation values received:', { beta, gamma })
        }
      }

      // Normalize to -1 to 1 range
      // Divide by 45 degrees to get a good range of motion
      const rawTiltX = clamp(gamma / 45, -1, 1)
      const rawTiltY = clamp(beta / 45, -1, 1)

      // Apply smoothing to reduce jitter (lerp factor of 0.15 = smooth)
      smoothedTiltX.current = lerp(smoothedTiltX.current, rawTiltX, 0.15)
      smoothedTiltY.current = lerp(smoothedTiltY.current, rawTiltY, 0.15)

      setTiltX(smoothedTiltX.current)
      setTiltY(smoothedTiltY.current)
    }

    // Remove capture phase flag - not needed for deviceorientation
    window.addEventListener('deviceorientation', handleOrientation, false)
    setListenerAttached(true)

    // Set up interval to update event count every 100ms
    eventCountIntervalRef.current = setInterval(() => {
      setEventCount(eventCountRef.current)
    }, 100)

    // Log when listener is attached (helps debugging)
    if (isIOS) {
      console.log('[DeviceTilt] iOS orientation listener attached')
      console.log('[DeviceTilt] If tilt is not working, check Settings > Safari > Prevent Cross-Site Tracking (should be OFF)')
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, false)
      setListenerAttached(false)
      if (eventCountIntervalRef.current) {
        clearInterval(eventCountIntervalRef.current)
        eventCountIntervalRef.current = null
      }
    }
  }, [hasPermission, isIOS])

  return {
    tiltX,
    tiltY,
    isIOS,
    isAndroid,
    isMobile,
    needsPermission,
    hasPermission,
    requestPermission,
    permissionStatus,
    listenerAttached,
    eventCount,
    lastEventTime,
    rawBeta,
    rawGamma,
    apiAvailable,
  }
}
