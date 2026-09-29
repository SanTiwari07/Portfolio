/*
Porsche 911 Turbo S by SeKali (https://sketchfab.com/zh.200.c)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/porsche-911-turbo-s-68d8ef218d7e42adbd4425dc43629705
*/

import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { HERO_MODEL_URL } from '../../../sections/hero/PorscheCar'

// Renders the same meshopt-compressed model the hero uses (4.9 MB, usually already cached)
// instead of the original 58 MB export, so the game opens without a long download.
export function Model(props: JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF(HERO_MODEL_URL)
  // Clone so the game and the hero showroom can each hold the car; geometry and materials stay shared.
  const car = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((o) => {
      o.castShadow = false
    })
    return clone
  }, [scene])

  return (
    <group {...props} dispose={null}>
      <primitive object={car} dispose={null} />
    </group>
  )
}

useGLTF.preload(HERO_MODEL_URL)
