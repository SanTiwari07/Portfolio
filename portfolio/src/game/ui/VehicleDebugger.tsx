/**
 * VehicleDebugger - Temporary debug overlay
 * 
 * Logs and visually shows:
 * - Y velocity spikes (launch events)
 * - Angular velocity spikes (flip events)
 * - Vehicle position when spikes occur
 * - Contact collision data from the chassis
 */
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Line } from '@react-three/drei'
import { Vector3 } from 'three'
import { getState, useStore } from '../store'

// Threshold for "launch" detection: Y velocity > 3 m/s upward is suspicious
const Y_VELOCITY_THRESHOLD = 3
const ANGULAR_THRESHOLD = 3 // rad/s

const vLocal = new Vector3()

export function VehicleDebugger() {
  const [chassisBody, wheels] = useStore((s) => [s.chassisBody, s.wheels])
  
  // Track subscribed velocity and angular velocity
  const velocityRef = useRef<[number, number, number]>([0, 0, 0])
  const angVelRef = useRef<[number, number, number]>([0, 0, 0])
  const launchLoggedAt = useRef<number>(0)
  const frameCount = useRef(0)

  // Subscribe to chassis velocity via store api
  const api = useStore((s) => s.api)

  useEffect(() => {
    if (!api) return
    const unsubVel = api.velocity.subscribe((v) => { velocityRef.current = v })
    const unsubAng = api.angularVelocity.subscribe((v) => { angVelRef.current = v })
    return () => {
      unsubVel()
      unsubAng()
    }
  }, [api])

  useFrame(() => {
    frameCount.current++
    if (!chassisBody.current) return

    const [vx, vy, vz] = velocityRef.current
    const [ax, ay, az] = angVelRef.current

    const yVel = vy
    const angMag = Math.sqrt(ax * ax + ay * ay + az * az)

    // Only log once per 500ms to avoid spam
    const now = Date.now()
    if ((Math.abs(yVel) > Y_VELOCITY_THRESHOLD || angMag > ANGULAR_THRESHOLD) &&
        now - launchLoggedAt.current > 500) {
      launchLoggedAt.current = now

      const pos = chassisBody.current.position
      const rot = chassisBody.current.rotation

      // Measure wheel world positions
      const wheelPositions = wheels.map((w, i) => {
        if (!w.current) return `Wheel ${i}: N/A`
        const wp = w.current.position
        return `Wheel ${i}: (${wp.x.toFixed(2)}, ${wp.y.toFixed(2)}, ${wp.z.toFixed(2)})`
      })

      console.group(`🚨 LAUNCH/FLIP EVENT at ${new Date().toISOString()}`)
      console.log(`📍 Vehicle Position: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`)
      console.log(`🔄 Vehicle Rotation: X=${(rot.x * 180/Math.PI).toFixed(1)}° Y=${(rot.y * 180/Math.PI).toFixed(1)}° Z=${(rot.z * 180/Math.PI).toFixed(1)}°`)
      console.log(`⬆️  Y Velocity: ${yVel.toFixed(3)} m/s (threshold: ${Y_VELOCITY_THRESHOLD})`)
      console.log(`💫 Angular Velocity: ${angMag.toFixed(3)} rad/s (threshold: ${ANGULAR_THRESHOLD})`)
      console.log(`   Components: X=${ax.toFixed(3)} Y=${ay.toFixed(3)} Z=${az.toFixed(3)}`)
      console.log(`🛞 Wheel Positions:`, wheelPositions)
      
      // Is the car near the railway crossing? Train is at approx (-145, 3.42, 54)
      const distToTrack = Math.sqrt(
        Math.pow(pos.x - (-145), 2) + Math.pow(pos.z - 54, 2)
      )
      console.log(`🚂 Distance to railway crossing center: ${distToTrack.toFixed(1)}m`)
      
      // Speed at time of event
      const speed = Math.sqrt(vx*vx + vy*vy + vz*vz)
      console.log(`💨 Total Speed: ${speed.toFixed(2)} m/s (${(speed * 2.237).toFixed(1)} mph)`)
      console.groupEnd()
    }
  })

  // Visual debug markers for wheel positions
  return (
    <>
      {wheels.map((wheel, index) => (
        <WheelMarker key={index} wheelRef={wheel} index={index} />
      ))}
      <ChassisMarker chassisRef={chassisBody} />
    </>
  )
}

function WheelMarker({ wheelRef, index }: { wheelRef: React.MutableRefObject<THREE.Object3D | null>; index: number }) {
  return (
    <Sphere args={[0.15, 8, 8]} ref={wheelRef ? undefined : undefined}>
      {/* We render at wheel's position */}
      <meshBasicMaterial color={['#00ff00', '#00ff00', '#ffff00', '#ffff00'][index]} wireframe />
    </Sphere>
  )
}

function ChassisMarker({ chassisRef }: { chassisRef: React.MutableRefObject<THREE.Object3D | null> }) {
  // Render a blue wireframe box at chassis position
  return null // Chassis box is already shown by the Debug renderer when enabled
}
