import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'

import { useStore } from '../store'

/**
 * Tilt steering: hold the phone like a steering wheel and lean it.
 *   forward (top edge away from you)  -> gas
 *   back (top edge towards you)       -> reverse
 *   left / right                      -> steer
 * Everything is measured against a calibration pose, so the player can hold the phone however is comfortable.
 */

export type TiltAccess = 'granted' | 'denied' | 'unsupported'

const STEER_DEAD = 6 // degrees of left/right lean before the car steers
const THROTTLE_DEAD = 9 // degrees of forward/back lean before the car drives
const RELEASE = 0.65 // a control lets go a little before it engaged, so it doesn't flicker at the edge
const NO_SENSOR_AFTER_MS = 2000

type PermissionedEvent = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> }

export const tiltSupported = (): boolean => typeof window !== 'undefined' && 'DeviceOrientationEvent' in window

/** Must be called from a tap: iOS only shows its motion-access prompt in response to a user gesture. */
export async function requestTiltAccess(): Promise<TiltAccess> {
  if (!tiltSupported()) return 'unsupported'
  const ev = DeviceOrientationEvent as PermissionedEvent
  if (typeof ev.requestPermission !== 'function') return 'granted' // Android / desktop: no prompt
  try {
    return (await ev.requestPermission()) === 'granted' ? 'granted' : 'denied'
  } catch {
    return 'denied'
  }
}

const screenAngle = (): number => {
  const a = window.screen?.orientation?.angle
  if (typeof a === 'number') return a
  const legacy = (window as unknown as { orientation?: number }).orientation
  return typeof legacy === 'number' ? ((legacy % 360) + 360) % 360 : 0
}

/** Device angles -> "lean to the player's right" (x) and "top edge rising towards the player" (y), for any rotation. */
const lean = (beta: number, gamma: number, angle: number): [number, number] => {
  switch (angle) {
    case 90:
      return [beta, -gamma]
    case 180:
      return [-gamma, -beta]
    case 270:
      return [-beta, gamma]
    default:
      return [gamma, beta]
  }
}

interface Options {
  enabled: boolean
  /** called when the device never reports orientation (a laptop, or a blocked sensor) */
  onUnavailable: () => void
  /** a dot inside this element follows the lean, so the player can see what the car is being told */
  dotRef: RefObject<HTMLElement>
}

export function useTilt({ enabled, onUnavailable, dotRef }: Options): { recenter: () => void } {
  const actions = useStore((s) => s.actions)
  const base = useRef<[number, number] | null>(null)
  const last = useRef<[number, number]>([0, 0])
  const onUnavailableRef = useRef(onUnavailable)
  onUnavailableRef.current = onUnavailable

  const recenter = useCallback(() => {
    base.current = null // the next reading becomes the new neutral pose
  }, [])

  useEffect(() => {
    if (!enabled) return
    let gotReading = false
    const held = { forward: false, backward: false, left: false, right: false }

    const set = (name: keyof typeof held, value: boolean) => {
      if (held[name] === value) return
      held[name] = value
      actions[name](value)
    }

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return
      gotReading = true
      const [x, y] = lean(e.beta, e.gamma, screenAngle())
      if (!base.current) base.current = [x, y]
      const dx = x - base.current[0]
      const dy = y - base.current[1]
      last.current = [dx, dy]

      const steer = (limit: number) => (held.left || held.right ? limit * RELEASE : limit)
      const drive = (limit: number) => (held.forward || held.backward ? limit * RELEASE : limit)
      set('right', dx > steer(STEER_DEAD))
      set('left', dx < -steer(STEER_DEAD))
      set('forward', dy < -drive(THROTTLE_DEAD))
      set('backward', dy > drive(THROTTLE_DEAD))

      const dot = dotRef.current
      if (dot) {
        const cx = Math.max(-1, Math.min(1, dx / 30)) * 22
        const cy = Math.max(-1, Math.min(1, dy / 30)) * 22
        dot.style.transform = `translate(${cx}px, ${cy}px)`
      }
    }

    // rotating the phone changes which axis is "left", so take a fresh neutral pose once it has settled
    let settle: ReturnType<typeof setTimeout> | undefined
    const onRotate = () => {
      clearTimeout(settle)
      settle = setTimeout(recenter, 400)
    }

    const releaseAll = () => {
      for (const name of Object.keys(held) as (keyof typeof held)[]) set(name, false)
    }
    const onVisibility = () => document.hidden && releaseAll()

    window.addEventListener('deviceorientation', onOrientation)
    window.addEventListener('orientationchange', onRotate)
    window.screen?.orientation?.addEventListener?.('change', onRotate)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', releaseAll)

    const noSensor = setTimeout(() => {
      if (!gotReading) onUnavailableRef.current()
    }, NO_SENSOR_AFTER_MS)

    return () => {
      clearTimeout(noSensor)
      clearTimeout(settle)
      window.removeEventListener('deviceorientation', onOrientation)
      window.removeEventListener('orientationchange', onRotate)
      window.screen?.orientation?.removeEventListener?.('change', onRotate)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', releaseAll)
      releaseAll()
      base.current = null
      if (dotRef.current) dotRef.current.style.transform = ''
    }
  }, [enabled, actions, dotRef, recenter])

  return { recenter }
}
