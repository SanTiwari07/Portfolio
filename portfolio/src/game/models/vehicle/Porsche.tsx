/*
Porsche 911 Turbo S by SeKali (https://sketchfab.com/zh.200.c)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/porsche-911-turbo-s-68d8ef218d7e42adbd4425dc43629705
*/

import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { getState } from '../../store'
import { MODEL_SCALE, usePorscheRig } from './porscheRig'

const paintTarget = new THREE.Color()

// The bodywork only — the wheels are the Porsche's own, driven by the physics wheels (see Wheel.tsx).
// Uses the same compressed model as the hero showroom (4.9 MB, normally already cached).
export function Model(props: JSX.IntrinsicElements['group']) {
  const rig = usePorscheRig(getState().color)

  useFrame((_, delta) => {
    const { color, controls } = getState()
    paintTarget.set(color)
    rig.paint.color.lerp(paintTarget, 1 - Math.exp(-delta * 8))
    // brake lights flare when braking or reversing
    if (rig.tail) rig.tail.emissiveIntensity = 1 + (controls.brake || (controls.backward && !controls.forward) ? 4 : 0)
  })

  return (
    <group {...props} scale={MODEL_SCALE} dispose={null}>
      <primitive object={rig.body} dispose={null} />
    </group>
  )
}
