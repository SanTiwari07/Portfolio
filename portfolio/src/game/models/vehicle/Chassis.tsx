import debounce from 'lodash-es/debounce'
import clamp from 'lodash-es/clamp'
import React, { forwardRef, useRef, useCallback, useEffect, useLayoutEffect, Suspense } from 'react'
import { useBox } from '@react-three/cannon'
import { PositionalAudio } from '@react-three/drei'
import { Vector3 } from 'three'

import type { PropsWithChildren } from 'react'
import type { BoxProps } from '@react-three/cannon'
import type { Group, PositionalAudio as PositionalAudioImpl } from 'three'
import type { CollideEvent } from '@react-three/cannon'

import { Model as PorscheModel } from './Porsche'
import { getState, setState, mutation, useStore } from '../../store'
import { vehicleConfig, wheelInfo } from '../../store'

const gears = 10
const v = new Vector3()

// Where the tyres touch the ground relative to the body's centre: wheel mount height, minus the
// suspension's resting length (slightly compressed under the car's weight), minus the tyre radius.
const GROUND_Y = vehicleConfig.height - (wheelInfo.suspensionRestLength - 0.08) - wheelInfo.radius

// The collision box is a proper car-sized slab (its height gives the body real rotational inertia —
// the old 0.1 m sliver flipped at the slightest bump) but sits well above the ground thanks to the
// suspension, so it still clears the road's rough edges.
export const Chassis = forwardRef<Group, PropsWithChildren<BoxProps>>(({ args = [1.75, 0.55, 4.0], mass = 1725, children, ...props }, ref) => {
  const crashAudio = useRef<PositionalAudioImpl>(null!)
  const [maxSpeed] = useStore((s) => [s.vehicleConfig.maxSpeed])

  const onCollide = useCallback(
    debounce<(e: CollideEvent) => void>((e) => {
      if (e.body?.userData?.trigger) return

      const impact = e.contact.impactVelocity

      if (!getState().sound || !crashAudio.current) return
      crashAudio.current.setVolume(clamp(impact / 10, 0.2, 1))
      if (!crashAudio.current.isPlaying) crashAudio.current.play()
    }, 200),
    [],
  )

  const [, api] = useBox(() => ({ mass, args, allowSleep: false, onCollide, linearDamping: 0.2, angularDamping: 0.99, ...props }), ref)

  useEffect(() => {
    setState({ api })
    return () => setState({ api: null })
  }, [api])

  useLayoutEffect(
    () =>
      api.velocity.subscribe((velocity) => {
        const speed = v.set(...velocity).length()
        const gearPosition = speed / (maxSpeed / gears)
        const rpmTarget = Math.max(((gearPosition % 1) + Math.log(gearPosition)) / 6, 0)
        Object.assign(mutation, { rpmTarget, speed, velocity })
      }),
    [maxSpeed],
  )

  useLayoutEffect(() => api.angularVelocity.subscribe((w) => (mutation.angularVelocity = w)), [api])

  return (
    <group ref={ref} dispose={null}>
      <group position={[0, GROUND_Y, 0]}>
        <Suspense fallback={null}>
          <PorscheModel />
        </Suspense>
      </group>
      {children}
      {/* PATCHED: /sounds/ → /sounds/game/ */}
      <PositionalAudio ref={crashAudio} url="/sounds/game/crash.mp3" loop={false} distance={5} />
    </group>
  )
})
