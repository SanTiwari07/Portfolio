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

const gears = 10
const v = new Vector3()

// We reduce the chassis physics box height to 0.1 (was 0.4) to increase ground clearance
// for the rigid body, preventing it from snagging on sharp terrain bumps like the railway.
export const Chassis = forwardRef<Group, PropsWithChildren<BoxProps>>(({ args = [1.4, 0.1, 2.45], mass = 1725, children, ...props }, ref) => {
  const crashAudio = useRef<PositionalAudioImpl>(null!)
  const [maxSpeed] = useStore((s) => [s.vehicleConfig.maxSpeed])

  const onCollide = useCallback(
    debounce<(e: CollideEvent) => void>((e) => {
      if (e.body.userData.trigger) return

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

  return (
    <group ref={ref} dispose={null}>
      <group position={[0, -0.6, 0.4]} scale={0.55}>
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
