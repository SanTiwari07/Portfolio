import { MathUtils, Vector3 } from 'three'
import { useLayoutEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRaycastVehicle } from '@react-three/cannon'

import type { PropsWithChildren } from 'react'
import type { BoxProps, RaycastVehicleProps, WheelInfoOptions } from '@react-three/cannon'

import { AccelerateAudio, BrakeAudio, Dust, EngineAudio, HonkAudio, Skid } from '../../effects'
import { getState, mutation, useStore } from '../../store'
import { useToggle } from '../../useToggle'
import { Chassis } from './Chassis'
import { Wheel } from './Wheel'

import type { Camera, Controls, WheelInfo, RecoveryState } from '../../store'

const { lerp } = MathUtils
const v = new Vector3()

type VehicleProps = PropsWithChildren<Pick<BoxProps, 'angularVelocity' | 'position' | 'rotation'>>
type DerivedWheelInfo = WheelInfo & Required<Pick<WheelInfoOptions, 'chassisConnectionPointLocal' | 'isFrontWheel'>>

export function Vehicle({ angularVelocity, children, position, rotation }: VehicleProps) {
  const defaultCamera = useThree((state) => state.camera)
  const [chassisBody, vehicleConfig, wheelInfo, wheels] = useStore((s) => [s.chassisBody, s.vehicleConfig, s.wheelInfo, s.wheels])
  const { back, force, front, height, maxBrake, steer, maxSpeed, width } = vehicleConfig

  const wheelInfos = wheels.map((_, index): DerivedWheelInfo => {
    const length = index < 2 ? front : back
    const sideMulti = index % 2 ? 0.5 : -0.5
    return { ...wheelInfo, chassisConnectionPointLocal: [width * sideMulti, height, length], isFrontWheel: Boolean(index % 2) }
  })

  const raycast: RaycastVehicleProps = { chassisBody, wheels, wheelInfos }
  const [, api] = useRaycastVehicle(() => raycast, null, [wheelInfo])

  // Store the chassis physics body api for applying stabilization torques
  const chassisApi = useStore((s) => s.api)

  useLayoutEffect(() => api.sliding.subscribe((sliding) => (mutation.sliding = sliding)), [api])

  let camera: Camera
  let editor: boolean
  let controls: Controls
  let engineValue = 0
  let i = 0
  let speed = 0
  let steeringValue = 0
  let flipTimer = 0
  let stuckTimer = 0
  let currentRecoveryState = 'none'
  let nextRecoveryState = 'none'

  useFrame((state, delta) => {
    camera = getState().camera
    editor = getState().editor
    controls = getState().controls
    speed = mutation.speed

    engineValue = lerp(
      engineValue,
      controls.forward || controls.backward ? force * (controls.forward && !controls.backward ? -1 : 1) : 0,
      delta * 20,
    )
    
    // Progressive Steering and Speed-sensitive steering reduction
    const steeringRate = 2.0 // steering speed (radians per second)
    const returnRate = 3.0 // return to center speed

    const speedMph = speed * 2.23694 // assuming speed is m/s
    let speedMultiplier = 1.0
    if (speedMph > 120) speedMultiplier = 0.35
    else if (speedMph > 80) speedMultiplier = 0.5 + 0.25 * (1 - (speedMph - 80) / 40)
    else if (speedMph > 40) speedMultiplier = 0.75 + 0.25 * (1 - (speedMph - 40) / 40)

    const targetSteer = (controls.left || controls.right) ? steer * (controls.left && !controls.right ? 1 : -1) * speedMultiplier : 0

    if (targetSteer !== 0) {
      const step = steeringRate * delta
      if (steeringValue < targetSteer) steeringValue = Math.min(steeringValue + step, targetSteer)
      else if (steeringValue > targetSteer) steeringValue = Math.max(steeringValue - step, targetSteer)
    } else {
      const step = returnRate * delta
      if (steeringValue > 0) steeringValue = Math.max(steeringValue - step, 0)
      else if (steeringValue < 0) steeringValue = Math.min(steeringValue + step, 0)
    }

    for (i = 2; i < 4; i++) api.applyEngineForce(speed < maxSpeed ? engineValue : 0, i)
    for (i = 0; i < 2; i++) api.setSteeringValue(steeringValue, i)
    for (i = 2; i < 4; i++) api.setBrake(controls.brake ? (controls.forward ? maxBrake / 1.5 : maxBrake) : 0, i)

    if (!editor) {
      // Fixed static camera offset behind the car: [0, 2.5, -8]
      if (camera === 'DEFAULT') {
        v.set(0, 2.5, -8)
      }
      defaultCamera.position.lerp(v, delta)
      defaultCamera.rotation.z = lerp(
        defaultCamera.rotation.z,
        camera !== 'BIRD_EYE' ? 0 : Math.PI,
        delta,
      )
    }

    // Fixed steady chassis visual alignment
    chassisBody.current!.children[0].rotation.z = MathUtils.lerp(chassisBody.current!.children[0].rotation.z, (-steeringValue * speed) / 200, delta * 4)

    // Recovery Detection
    if (chassisBody.current) {
      if (chassisBody.current.position.y < -50) {
        getState().actions.recoverVehicle()
        return
      }

      const rx = Math.abs(chassisBody.current.rotation.x)
      const rz = Math.abs(chassisBody.current.rotation.z)
      const isFlipped = rx > 2.09 || rz > 2.09 // 120 degrees

      if (isFlipped) flipTimer += delta
      else flipTimer = 0

      if (speed < 0.5 && (controls.forward || controls.backward)) stuckTimer += delta
      else stuckTimer = 0

      currentRecoveryState = getState().recoveryState
      nextRecoveryState = 'none'

      if (flipTimer > 2) nextRecoveryState = 'flip'
      else if (stuckTimer > 8) nextRecoveryState = 'stuck'

      if (nextRecoveryState !== currentRecoveryState) {
        getState().set({ recoveryState: nextRecoveryState as RecoveryState })
      }
    }
  })

  const ToggledAccelerateAudio = useToggle(AccelerateAudio, ['ready', 'sound'])
  const ToggledEngineAudio = useToggle(EngineAudio, ['ready', 'sound'])

  return (
    <group>
      <Chassis ref={chassisBody} {...{ angularVelocity, position, rotation }}>
        <ToggledAccelerateAudio />
        <BrakeAudio />
        <ToggledEngineAudio />
        <HonkAudio />
        {children}
      </Chassis>
      <>
        {wheels.map((wheel, index) => (
          <Wheel ref={wheel} leftSide={!(index % 2)} key={index} />
        ))}
      </>
      <Dust />
      <Skid />
    </group>
  )
}
