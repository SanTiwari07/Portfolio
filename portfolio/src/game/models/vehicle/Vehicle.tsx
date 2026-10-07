import { MathUtils, Vector3, Quaternion } from 'three'
import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useRaycastVehicle } from '@react-three/cannon'

import type { PropsWithChildren } from 'react'
import type { BoxProps, RaycastVehicleProps, WheelInfoOptions } from '@react-three/cannon'

import { AccelerateAudio, BrakeAudio, Dust, EngineAudio, HonkAudio, Skid } from '../../effects'
import { getState, mutation, readChassisPose, useStore } from '../../store'
import { useToggle } from '../../useToggle'
import { Chassis } from './Chassis'
import { Wheel } from './Wheel'

import type { WheelInfo, RecoveryState } from '../../store'

const { lerp, clamp } = MathUtils

type VehicleProps = PropsWithChildren<Pick<BoxProps, 'angularVelocity' | 'position' | 'rotation'>>
type DerivedWheelInfo = WheelInfo & Required<Pick<WheelInfoOptions, 'chassisConnectionPointLocal' | 'isFrontWheel'>>

const WORLD_UP = new Vector3(0, 1, 0)
const CHASE_BEHIND = 8
const CHASE_HEIGHT = 3.1

// Handling assists, scaled by the car's mass so they stay meaningful if the mass is retuned.
const STABILISE_STIFFNESS = 5.5 // torque per radian of tilt
const STABILISE_DAMPING = 1.4 // torque per rad/s of roll/pitch speed
const DOWNFORCE = 0.0026 // × speed² — keeps the tyres planted at high speed

// scratch objects — allocated once, never per frame
const up = new Vector3()
const fwd = new Vector3()
const heading = new Vector3(0, 0, 1)
const target = new Vector3()
const look = new Vector3()
const yawQuat = new Quaternion()

/** Turn the car upright where it is, keeping the direction it was facing. */
function uprightPose(q: { x: number; y: number; z: number; w: number }) {
  fwd.set(0, 0, 1).applyQuaternion(yawQuat.set(q.x, q.y, q.z, q.w))
  fwd.y = 0
  if (fwd.lengthSq() < 1e-4) fwd.set(0, 0, 1)
  fwd.normalize()
  return yawQuat.setFromAxisAngle(WORLD_UP, Math.atan2(fwd.x, fwd.z))
}

export function Vehicle({ angularVelocity, children, position, rotation }: VehicleProps) {
  const [chassisBody, vehicleConfig, wheelInfo, wheels] = useStore((s) => [s.chassisBody, s.vehicleConfig, s.wheelInfo, s.wheels])
  const { back, force, front, height, maxBrake, steer, maxSpeed, width } = vehicleConfig

  const wheelInfos = wheels.map((_, index): DerivedWheelInfo => {
    const length = index < 2 ? front : back
    const sideMulti = index % 2 ? 0.5 : -0.5
    return { ...wheelInfo, chassisConnectionPointLocal: [width * sideMulti, height, length], isFrontWheel: index < 2 }
  })

  const raycast: RaycastVehicleProps = { chassisBody, wheels, wheelInfos }
  const [, api] = useRaycastVehicle(() => raycast, null, [wheelInfo])

  useLayoutEffect(() => api.sliding.subscribe((sliding) => (mutation.sliding = sliding)), [api])

  // Per-frame state lives in a ref: plain `let`s in the render body were reset on every re-render.
  const st = useRef({ engine: 0, steering: 0, flip: 0, stuck: 0, airborne: 0, cam: new Vector3(), camInit: false }).current

  useFrame((state, delta) => {
    const body = chassisBody.current
    if (!body) return
    // a stalled tab or a long frame must never feed the vehicle a huge timestep
    const dt = Math.min(delta, 1 / 20)
    const { camera: cameraMode, editor, controls, api: chassisApi } = getState()
    const speed = mutation.speed

    // ── drive inputs ──
    st.engine = lerp(st.engine, controls.forward || controls.backward ? force * (controls.forward && !controls.backward ? -1 : 1) : 0, Math.min(dt * 20, 1))

    // progressive steering, narrower at speed so the car can't be flung sideways
    const steeringRate = 2.0
    const returnRate = 3.0
    const speedMph = speed * 2.23694
    let speedMultiplier = 1.0
    if (speedMph > 120) speedMultiplier = 0.3
    else if (speedMph > 80) speedMultiplier = 0.45 + 0.3 * (1 - (speedMph - 80) / 40)
    else if (speedMph > 40) speedMultiplier = 0.75 + 0.25 * (1 - (speedMph - 40) / 40)

    const targetSteer = controls.left || controls.right ? steer * (controls.left && !controls.right ? 1 : -1) * speedMultiplier : 0
    if (targetSteer !== 0) {
      const step = steeringRate * dt
      if (st.steering < targetSteer) st.steering = Math.min(st.steering + step, targetSteer)
      else if (st.steering > targetSteer) st.steering = Math.max(st.steering - step, targetSteer)
    } else {
      const step = returnRate * dt
      if (st.steering > 0) st.steering = Math.max(st.steering - step, 0)
      else if (st.steering < 0) st.steering = Math.min(st.steering + step, 0)
    }

    for (let i = 2; i < 4; i++) api.applyEngineForce(speed < maxSpeed ? st.engine : 0, i)
    for (let i = 0; i < 2; i++) api.setSteeringValue(st.steering, i)
    for (let i = 2; i < 4; i++) api.setBrake(controls.brake ? (controls.forward ? maxBrake / 1.5 : maxBrake) : 0, i)

    // ── orientation of the car ──
    // NB: body.position/.quaternion are stale (the physics lib writes the matrix) — read the real pose
    const pose = readChassisPose()
    const q = pose.quaternion
    // If anything ever drives the physics to NaN/Infinity, put the car back rather than leaving a dead camera.
    if (!Number.isFinite(pose.position.x + pose.position.y + pose.position.z + q.x + q.y + q.z + q.w)) {
      getState().actions.recoverVehicle()
      return
    }
    up.set(0, 1, 0).applyQuaternion(q)
    const tiltCos = clamp(up.y, -1, 1) // 1 = upright, 0 = on its side, -1 = roof down

    // ── handling assists ──
    if (chassisApi && getState().ready) {
      const mass = 1725
      // Forces only last for a single physics sub-step, but a slow frame spans several of them
      // (the engine runs fixed 1/60 s steps). Scale by the sub-steps this frame will contain so the
      // assists feel the same at 15 fps as at 144.
      const sub = clamp(Math.round(Math.min(delta, 1 / 6) * 60), 1, 10)
      // Self-righting: a torque that rotates the car's up vector back toward world up. It is strongest
      // for ordinary roll/pitch and fades out past ~100° so a genuine rollover isn't fought forever —
      // the recovery below handles that.
      const assist = tiltCos > 0.17 ? 1 : MathUtils.smoothstep(tiltCos, -0.35, 0.17)
      if (assist > 0) {
        const w = mutation.angularVelocity
        const tx = -up.z * mass * STABILISE_STIFFNESS - w[0] * mass * STABILISE_DAMPING
        const tz = up.x * mass * STABILISE_STIFFNESS - w[2] * mass * STABILISE_DAMPING
        chassisApi.applyTorque([tx * assist * sub, 0, tz * assist * sub])
      }
      // Downforce presses the car into the road as it speeds up.
      // Horizontal speed only, and capped: using total speed made a falling car (huge vertical speed)
      // generate ever more downforce — a feedback loop that ended in NaN and a dead camera.
      const driveSpeed = Math.min(Math.hypot(mutation.velocity[0], mutation.velocity[2]), 70)
      if (driveSpeed > 8 && tiltCos > 0.3) {
        // The point is an *offset from the centre of mass* (despite the library's "worldPoint" name). Passing the
        // car's world position put the force ~250 m from the centre and tumbled the car as soon as it sped up.
        chassisApi.applyForce([0, -mass * DOWNFORCE * driveSpeed * driveSpeed * sub, 0], [0, 0, 0])
      }
    }

    // ── camera: lives in world space so it never inherits the car's roll or pitch ──
    const cam = state.camera
    if (!editor) {
      // smoothed heading (yaw only)
      fwd.set(0, 0, 1).applyQuaternion(q)
      fwd.y = 0
      if (fwd.lengthSq() > 1e-3) {
        fwd.normalize()
        heading.lerp(fwd, 1 - Math.exp(-dt * 9)).normalize()
      }
      const p = pose.position
      if (cameraMode === 'DEFAULT') {
        // Rigid chase: horizontally the camera is locked to the car (an eased follow falls further behind the
        // faster you go — the car crept up the screen and the view felt laggy). Only height is smoothed, so
        // bumps don't shake the picture, and the heading above is already smoothed for gentle cornering.
        const fx = p.x - heading.x * CHASE_BEHIND
        const fz = p.z - heading.z * CHASE_BEHIND
        const fy = p.y + CHASE_HEIGHT
        if (!st.camInit || cam.position.distanceToSquared(target.set(fx, fy, fz)) > 900) {
          cam.position.set(fx, fy, fz)
          st.camInit = true
        } else {
          cam.position.set(fx, lerp(cam.position.y, fy, 1 - Math.exp(-dt * 8)), fz)
        }
        look.set(p.x + heading.x * 3, p.y + 1.1, p.z + heading.z * 3)
        cam.up.copy(WORLD_UP)
        cam.lookAt(look)
      } else {
        target.set(p.x, 100, p.z)
        cam.position.lerp(target, 1 - Math.exp(-dt * 4))
        cam.up.set(heading.x, 0, heading.z)
        look.set(p.x, 0, p.z)
        cam.lookAt(look)
      }
    }

    // ── recovery ──
    const p = pose.position
    if (p.y < -50) {
      getState().actions.recoverVehicle()
      return
    }

    const flipped = tiltCos < 0.45
    st.flip = flipped ? st.flip + dt : 0
    st.stuck = speed < 0.5 && (controls.forward || controls.backward) ? st.stuck + dt : 0

    let next: RecoveryState = 'none'
    if (st.flip > 0.6) next = 'flip'
    else if (st.stuck > 3) next = 'stuck'

    if (st.flip > 2.2 || st.stuck > 8) {
      // set the car back on its wheels right where it is, still facing the way it was going
      const upright = uprightPose(q)
      chassisApi?.position.set(p.x, p.y + 1.2, p.z)
      chassisApi?.quaternion.set(upright.x, upright.y, upright.z, upright.w)
      const push = st.stuck > 8 ? 5 : 0
      chassisApi?.velocity.set(fwd.x * push, 0, fwd.z * push)
      chassisApi?.angularVelocity.set(0, 0, 0)
      st.flip = 0
      st.stuck = 0
      st.engine = 0
      next = 'none'
    }

    if (next !== getState().recoveryState) getState().set({ recoveryState: next })
  })

  // keep the chase camera from lerping across the map after a respawn / re-entry
  useLayoutEffect(() => {
    st.camInit = false
  }, [st])

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
          <Wheel ref={wheel} index={index} key={index} />
        ))}
      </>
      <Dust />
      <Skid />
    </group>
  )
}
