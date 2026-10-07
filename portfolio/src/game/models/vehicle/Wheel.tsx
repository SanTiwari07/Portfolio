import { forwardRef } from 'react'
import { useCompoundBody } from '@react-three/cannon'

import { getState, useStore } from '../../store'
import { usePorscheRig } from './porscheRig'

import type { CylinderProps } from '@react-three/cannon'
import type { Group } from 'three'

interface WheelProps extends CylinderProps {
  /** physics wheel index: 0/1 front left/right, 2/3 rear left/right */
  index: number
}

// A physics wheel that wears the Porsche's real tyre, rim and brake disc. The raycast vehicle
// moves, steers and spins this group, so the wheels roll with the car instead of being painted on.
export const Wheel = forwardRef<Group, WheelProps>(({ index, ...props }, ref) => {
  const { radius } = useStore((state) => state.wheelInfo)
  const rig = usePorscheRig(getState().color)
  useCompoundBody(
    () => ({
      mass: 50,
      type: 'Kinematic',
      material: 'wheel',
      collisionFilterGroup: 0,
      shapes: [{ args: [radius, radius, 0.5, 16], rotation: [0, 0, -Math.PI / 2], type: 'Cylinder' }],
      ...props,
    }),
    ref,
    [radius],
  )
  return (
    <group ref={ref} dispose={null}>
      <primitive object={rig.wheels[index]} dispose={null} />
    </group>
  )
})
