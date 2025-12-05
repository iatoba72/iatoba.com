import { useEffect, useState, useCallback, useRef } from 'react'

export interface DeviceTiltData {
  tiltX: number
  tiltY: number
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  needsPermission: boolean
  hasPermission: boolean
  requestPermission: () => Promise<void>
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

  // Smoothed tilt values
  const smoothedTiltX = useRef(0)
  const smoothedTiltY = useRef(0)

  // Device detection
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = typeof window !== 'undefined' && /Android/.test(navigator.userAgent)
  const isMobile = isIOS || isAndroid

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
    }
  }, [isMobile])

  // Request permission for iOS
  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent === 'undefined') return

    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          setHasPermission(true)
          setNeedsPermission(false)
        } else {
          setHasPermission(false)
          setNeedsPermission(false)
        }
      }
    } catch (error) {
      console.error('Error requesting device orientation permission:', error)
      setHasPermission(false)
      setNeedsPermission(false)
    }
  }, [])

  // Handle device orientation
  useEffect(() => {
    if (typeof window === 'undefined' || !hasPermission) return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Get orientation values
      const beta = event.beta ?? 0   // Front-to-back tilt (-180 to 180)
      const gamma = event.gamma ?? 0 // Left-to-right tilt (-90 to 90)

      // Normalize to -1 to 1 range
      // Divide by 45 degrees to get a good range of motion
      const rawTiltX = clamp(gamma / 45, -1, 1)
      const rawTiltY = clamp(beta / 45, -1, 1)

      // Apply smoothing to reduce jitter (lerp factor of 0.1 = very smooth)
      smoothedTiltX.current = lerp(smoothedTiltX.current, rawTiltX, 0.15)
      smoothedTiltY.current = lerp(smoothedTiltY.current, rawTiltY, 0.15)

      setTiltX(smoothedTiltX.current)
      setTiltY(smoothedTiltY.current)
    }

    window.addEventListener('deviceorientation', handleOrientation, true)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true)
    }
  }, [hasPermission])

  return {
    tiltX,
    tiltY,
    isIOS,
    isAndroid,
    isMobile,
    needsPermission,
    hasPermission,
    requestPermission,
  }
}
