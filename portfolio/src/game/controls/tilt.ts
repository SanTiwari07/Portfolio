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

// All angles are degrees away from the calibration pose.
const STEER_DEAD = 9 // lean this far before the car starts to steer at all (hand shake stays below it)
const STEER_FULL = 30 // lean this far for full lock; in between the steering is proportional
const THROTTLE_ON = 15 // forward / back lean that starts driving
const THROTTLE_OFF = 9 // ...and the lean it has to fall below to stop, so it doesn't flicker at the edge
const SMOOTHING = 0.18 // 0..1, how fast the filtered tilt follows the phone (lower = steadier, slower)
const TICK_MS = 40 // the car reads on/off controls, so steering strength is pulsed 25 times a second
const NO_SENSOR_AFTER_MS = 2000

/** Steering strength 0..1 for a lean, with a dead zone and a gentle ramp. */
export const steerDuty = (lean: number): number => {
  const a = Math.abs(lean)
  if (a <= STEER_DEAD) return 0
  return Math.min(1, (a - STEER_DEAD) / (STEER_FULL - STEER_DEAD))
}

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
    // smoothed lean relative to the calibration pose
    const filtered: [number, number] = [0, 0]
    let acc = 0 // pulse accumulator for proportional steering
    let lastDir = 0

    const set = (name: keyof typeof held, value: boolean) => {
      if (held[name] === value) return
      held[name] = value
      actions[name](value)
    }

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return
      gotReading = true
      const [x, y] = lean(e.beta, e.gamma, screenAngle())
      if (!base.current) {
        base.current = [x, y]
        filtered[0] = 0
        filtered[1] = 0
      }
      // a low-pass filter takes the tremor out of a hand-held phone before anything reacts to it
      filtered[0] += SMOOTHING * (x - base.current[0] - filtered[0])
      filtered[1] += SMOOTHING * (y - base.current[1] - filtered[1])
      last.current = [filtered[0], filtered[1]]

      const dot = dotRef.current
      if (dot) {
        const cx = Math.max(-1, Math.min(1, filtered[0] / STEER_FULL)) * 22
        const cy = Math.max(-1, Math.min(1, filtered[1] / (THROTTLE_ON * 2))) * 22
        dot.style.transform = `translate(${cx}px, ${cy}px)`
      }
    }

    const tick = () => {
      const [dx, dy] = filtered

      // gas / reverse: switch on past THROTTLE_ON, off again below THROTTLE_OFF
      set('forward', dy < -(held.forward ? THROTTLE_OFF : THROTTLE_ON))
      set('backward', dy > (held.backward ? THROTTLE_OFF : THROTTLE_ON))

      // steering: strength = how far past the dead zone, delivered as pulses the car's own steering smooths out
      const duty = steerDuty(dx)
      const dir = dx > 0 ? 1 : -1
      if (duty === 0 || dir !== lastDir) acc = 0
      lastDir = duty === 0 ? 0 : dir
      let on = false
      if (duty > 0) {
        acc += duty
        if (acc >= 1) {
          acc -= 1
          on = true
        }
      }
      set('right', on && dir > 0)
      set('left', on && dir < 0)
    }
    const ticker = setInterval(tick, TICK_MS)

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
      clearInterval(ticker)
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
