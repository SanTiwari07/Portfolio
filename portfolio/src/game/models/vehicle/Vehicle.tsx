import { MathUtils, Vector3, Euler, Quaternion } from 'three'
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
      if (camera === 'DEFAULT') {
        // Position: stay behind and above car in local space
        v.set(0, 2.5, -8)
        defaultCamera.position.lerp(v, delta * 5)

        // Rotation: counteract parent chassis pitch/roll every frame.
        // Camera is a child of chassis, so setting local rotation.z = 0 doesn't
        // help — parent rotation is inherited first. Instead we compute the
        // desired WORLD quaternion (yaw only, no pitch/roll) and convert it
        // into the local quaternion the camera needs.
        const euler = new Euler().setFromQuaternion(chassisBody.current.quaternion, 'YXZ')
        const worldCamQuat = new Quaternion().setFromEuler(new Euler(0, euler.y + Math.PI, 0, 'YXZ'))
        const localCamQuat = chassisBody.current.quaternion.clone().invert().multiply(worldCamQuat)
        defaultCamera.quaternion.slerp(localCamQuat, delta * 8)
      } else {
        v.set(0, 100, 0)
        defaultCamera.position.lerp(v, delta)
        defaultCamera.rotation.z = lerp(defaultCamera.rotation.z, Math.PI, delta)
      }
    }

    // Fixed steady chassis visual alignment
    chassisBody.current!.children[0].rotation.z = MathUtils.lerp(chassisBody.current!.children[0].rotation.z, MathUtils.clamp((-steeringValue * speed) / 200, -0.3, 0.3), delta * 4)

    // Recovery Detection
    if (chassisBody.current) {
      if (chassisBody.current.position.y < -50) {
        getState().actions.recoverVehicle()
        return
      }

      v.set(0, 1, 0).applyQuaternion(chassisBody.current.quaternion)
      const isFlipped = v.y < 0.5

      if (isFlipped) flipTimer += delta
      else flipTimer = 0

      if (speed < 0.5 && (controls.forward || controls.backward)) stuckTimer += delta
      else stuckTimer = 0

      currentRecoveryState = getState().recoveryState
      nextRecoveryState = 'none'

      if (flipTimer > 2) {
        const { x, y, z } = chassisBody.current.position
        chassisApi?.position.set(x, y + 1.5, z)
        chassisApi?.quaternion.set(0, 0, 0, 1)
        chassisApi?.velocity.set(0, 0, 0)
        chassisApi?.angularVelocity.set(0, 0, 0)
        flipTimer = 0
      } else if (stuckTimer > 8) {
        const { x, y, z } = chassisBody.current.position
        
        v.set(0, 0, 1).applyQuaternion(chassisBody.current.quaternion)
        v.normalize().multiplyScalar(5)
        
        chassisApi?.position.set(x, y + 1.5, z)
        chassisApi?.quaternion.set(0, 0, 0, 1)
        chassisApi?.velocity.set(v.x, v.y, v.z)
        chassisApi?.angularVelocity.set(0, 0, 0)
        stuckTimer = 0
      }

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
