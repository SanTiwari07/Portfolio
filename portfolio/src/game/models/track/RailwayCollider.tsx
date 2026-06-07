import { useCylinder } from '@react-three/cannon'
import { useRef } from 'react'

export function RailwayCollider() {
  // A giant buried cylinder acts as a perfectly smooth speed bump.
  // Radius: 500 (creates a nearly flat but perfectly smooth bridge)
  // Height (Length): 40 (covers the entire railway crossing)
  // Position: Buried 499.35 meters deep so the top is EXACTLY at 0.65m (flush with the road)
  useCylinder(
    () => ({
      args: [500, 500, 40, 64], // top radius, bottom radius, height, segments
      position: [69.3, -499.35, 131.5], // The center of the track gap, height perfectly flush
      rotation: [Math.PI / 2, -1.143, 0], // X lays it flat, Y yaws it perfectly along the rail vector
      type: 'Static',
    }),
    useRef<import('three').Group>(null)
  )

  return null
}
