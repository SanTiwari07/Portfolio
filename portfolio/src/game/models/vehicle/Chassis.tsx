import debounce from 'lodash-es/debounce'
import clamp from 'lodash-es/clamp'
import React, { forwardRef, useRef, useCallback, useEffect, useLayoutEffect, Suspense } from 'react'
import { useBox } from '@react-three/cannon'
import { useGLTF, PositionalAudio } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Color, Vector3, MathUtils } from 'three'

import type { PropsWithChildren } from 'react'
import type { BoxProps } from '@react-three/cannon'
import type { GLTF } from 'three-stdlib'
import type { BoxBufferGeometry, Group, Mesh, MeshStandardMaterial, PositionalAudio as PositionalAudioImpl } from 'three'
import type { CollideEvent } from '@react-three/cannon'

import { Model as PorscheModel } from './Porsche'
import { getState, setState, mutation, useStore } from '../../store'

import type { Camera, Controls } from '../../store'

const { lerp } = MathUtils

interface ChassisGLTF extends GLTF {
  nodes: {
    Chassis_1: Mesh; Chassis_2: Mesh; Glass: Mesh; BrakeLights: Mesh; HeadLights: Mesh
    Cabin_Grilles: Mesh; Undercarriage: Mesh; TurnSignals: Mesh; Chrome: Mesh
    Wheel_1: Mesh; Wheel_2: Mesh; License_1: Mesh; License_2: Mesh
    Cube013: Mesh; Cube013_1: Mesh; Cube013_2: Mesh
    'pointer-left': Mesh; 'pointer-right': Mesh
  }
  materials: {
    BodyPaint: MeshStandardMaterial; License: MeshStandardMaterial; Chassis_2: MeshStandardMaterial
    Glass: MeshStandardMaterial; BrakeLight: MeshStandardMaterial; defaultMatClone: MeshStandardMaterial
    HeadLight: MeshStandardMaterial; Black: MeshStandardMaterial; Undercarriage: MeshStandardMaterial
    TurnSignal: MeshStandardMaterial
  }
}

type MaterialMesh = Mesh<BoxBufferGeometry, MeshStandardMaterial>

const gears = 10
const c = new Color()
const v = new Vector3()

// We reduce the chassis physics box height to 0.1 (was 0.4) to increase ground clearance
// for the rigid body, preventing it from snagging on sharp terrain bumps like the railway.
export const Chassis = forwardRef<Group, PropsWithChildren<BoxProps>>(({ args = [1.4, 0.1, 2.45], mass = 1725, children, ...props }, ref) => {
  const glass = useRef<MaterialMesh>(null!)
  const brake = useRef<MaterialMesh>(null!)
  const wheel = useRef<Group>(null)
  const needle = useRef<MaterialMesh>(null!)
  const chassis_1 = useRef<MaterialMesh>(null!)
  const crashAudio = useRef<PositionalAudioImpl>(null!)
  const [maxSpeed] = useStore((s) => [s.vehicleConfig.maxSpeed])
  // The default chassis-draco.glb has been replaced by the Porsche model.

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

  let camera: Camera
  let controls: Controls
  useFrame((_, delta) => {
    camera = getState().camera
    controls = getState().controls
    
    if (brake.current) {
      brake.current.material.color.lerp(c.set(controls.brake ? '#555' : 'white'), delta * 10)
      brake.current.material.emissive.lerp(c.set(controls.brake ? 'red' : 'red'), delta * 10)
      brake.current.material.opacity = lerp(brake.current.material.opacity, controls.brake ? 1 : 0.3, delta * 10)
    }
    if (glass.current) {
      glass.current.material.opacity = lerp(glass.current.material.opacity, camera === 'FIRST_PERSON' ? 0.1 : 0.75, delta)
      glass.current.material.color.lerp(c.set(camera === 'FIRST_PERSON' ? 'white' : 'black'), delta)
    }
    if (wheel.current) wheel.current.rotation.z = lerp(wheel.current.rotation.z, controls.left ? -Math.PI : controls.right ? Math.PI : 0, delta)
    if (needle.current) needle.current.rotation.y = (mutation.speed / maxSpeed) * -Math.PI * 2 - 0.9
    if (chassis_1.current) chassis_1.current.material.color.lerp(c.set(getState().color), 0.1)
  })

  return (
    <group ref={ref} dispose={null}>
      <group position={[0, -0.6, 0.4]} scale={0.55}>
        <Suspense fallback={null}>
          <PorscheModel />
        </Suspense>
      </group>
      {children}
      {/* PATCHED: /sounds/ → /game/sounds/ */}
      <PositionalAudio ref={crashAudio} url="/game/sounds/crash.mp3" loop={false} distance={5} />
    </group>
  )
})
