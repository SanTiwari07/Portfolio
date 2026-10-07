import { createRef } from 'react'
import { Euler, Quaternion, Vector3 } from 'three'
import create from 'zustand'
import shallow from 'zustand/shallow'
import type { RefObject } from 'react'
import type { PublicApi, WheelInfoOptions } from '@react-three/cannon'
import type { Group } from 'three'
import type { GetState, SetState, StateSelector } from 'zustand'

import { drive } from '../sections/hero/driveState'
import { keys } from './keys'
import { loadGamePaint, saveGamePaint } from './paint'

// No spin on spawn (it used to start with a yaw spin).
export const angularVelocity = [0, 0, 0] as const
export const cameras = ['DEFAULT', 'BIRD_EYE'] as const

export const dpr = 1.5 as const
export const levelLayer = 1 as const
export const maxBoost = 100 as const
// Starts just above the road: it used to drop in from 5 m, so the first thing the player saw was a hard landing and a bounce.
export const position = [-110, 1.15, 220] as const
export const rotation = [0, Math.PI / 2 + 0.35, 0] as const

export const SHOW_PHYSICS_DEBUG = false

export type RecoveryState = 'none' | 'flip' | 'stuck' | 'fall'

// Dimensions match the Porsche model at MODEL_SCALE 0.48 (wheelbase 2.45 m, track 1.7 m).
export const vehicleConfig = {
  width: 1.7,
  // wheel mounts sit close to the centre of mass: a low centre of mass relative to the track is what stops flips
  height: -0.12,
  front: 1.225,
  back: -1.225,
  steer: 0.22,
  force: 5500,
  maxBrake: 120,
  maxSpeed: 40,
} as const

type VehicleConfig = typeof vehicleConfig

export type WheelInfo = Required<
  Pick<
    WheelInfoOptions,
    | 'axleLocal'
    | 'customSlidingRotationalSpeed'
    | 'directionLocal'
    | 'frictionSlip'
    | 'maxSuspensionForce'
    | 'maxSuspensionTravel'
    | 'radius'
    | 'rollInfluence'
    | 'sideAcceleration'
    | 'suspensionRestLength'
    | 'suspensionStiffness'
    | 'dampingCompression'
    | 'dampingRelaxation'
    | 'useCustomSlidingRotationalSpeed'
  >
>

export const wheelInfo: WheelInfo = {
  axleLocal: [-1, 0, 0],
  customSlidingRotationalSpeed: -0.01,
  directionLocal: [0, -1, 0],
  frictionSlip: 3.6,
  // maxSuspensionForce caps the impulse the suspension can apply in one physics tick.
  // Without this, sharp heightfield triangles (e.g. railway crossing) produce
  // infinite upward forces that launch the vehicle. 100000 is the standard value.
  maxSuspensionForce: 100000,
  // By increasing max travel, we disable the internal Cannon.js "bump stop" hard constraint
  // which causes infinite forces when a raycast hits a sharp terrain bump.
  maxSuspensionTravel: 5.0,
  radius: 0.345,
  rollInfluence: 0.01,
  sideAcceleration: 3,
  suspensionRestLength: 0.35,
  // Soft suspension absorbs bumps instead of transmitting them as impulses.
  // Stiff suspension = every bump becomes a launch pad.
  suspensionStiffness: 30,
  dampingCompression: 4.4,
  dampingRelaxation: 5.4,
  useCustomSlidingRotationalSpeed: true,
}

export const booleans = {
  binding: false,
  debug: SHOW_PHYSICS_DEBUG,
  editor: false,
  help: false,
  map: true,
  ready: false,
  shadows: true,
  stats: false,
  sound: true,
}

type Booleans = keyof typeof booleans

const exclusiveBooleans = ['help'] as const
type ExclusiveBoolean = typeof exclusiveBooleans[number]
const isExclusiveBoolean = (v: unknown): v is ExclusiveBoolean => exclusiveBooleans.includes(v as ExclusiveBoolean)

export type Camera = typeof cameras[number]

const controls = {
  backward: false,
  brake: false,
  forward: false,
  honk: false,
  left: false,
  right: false,
}
export type Controls = typeof controls
type Control = keyof Controls
export const isControl = (v: PropertyKey): v is Control => Object.hasOwnProperty.call(controls, v)

export type BindableActionName = Control | ExclusiveBoolean | Extract<Booleans, 'editor' | 'map' | 'sound'>

export type ActionInputMap = Record<BindableActionName, string[]>

const actionInputMap: ActionInputMap = {
  backward: ['arrowdown', 's'],
  brake: [' '],
  editor: ['.'],
  forward: ['arrowup', 'w', 'z'],
  help: ['i'],
  honk: ['h'],
  left: ['arrowleft', 'a', 'q'],
  map: ['m'],
  right: ['arrowright', 'd', 'e'],
  sound: ['u'],
}

type Getter = GetState<IState>
export type Setter = SetState<IState>

type BaseState = Record<Booleans, boolean>

type BooleanActions = Record<Booleans, () => void>
type ControlActions = Record<Control, (v: boolean) => void>
type TimerActions = Record<'onCheckpoint' | 'onFinish' | 'onStart', () => void>

type Actions = BooleanActions &
  ControlActions &
  TimerActions & {
    recoverVehicle: () => void
    restartRun: () => void
    setPaint: (hex: string) => void
  }

export interface IState extends BaseState {
  actions: Actions
  api: PublicApi | null
  bestCheckpoint: number
  camera: Camera
  chassisBody: RefObject<Group>
  checkpoint: number
  color: string
  controls: Controls
  actionInputMap: ActionInputMap
  keyBindingsWithError: number[]
  dpr: number
  finished: number
  get: Getter
  level: RefObject<Group>
  // TODO: Migrate game leaderboard from Supabase v1 → v2 or remove auth feature
  session: unknown | null
  set: Setter
  start: number
  vehicleConfig: VehicleConfig
  wheelInfo: WheelInfo
  wheels: [RefObject<Group>, RefObject<Group>, RefObject<Group>, RefObject<Group>]
  keyInput: string | null
  lastCheckpointPos: [number, number, number]
  lastCheckpointRot: [number, number, number]
  recoveryState: RecoveryState
  /** the 3D scene has resolved and rendered real frames */
  sceneReady: boolean
}

const setExclusiveBoolean = (set: Setter, boolean: ExclusiveBoolean) => () =>
  set((state) => ({ ...exclusiveBooleans.reduce((o, key) => ({ ...o, [key]: key === boolean ? !state[boolean] : false }), state) }))

const useStoreImpl = create<IState>((set: SetState<IState>, get: GetState<IState>) => {
  const controlActions = keys(controls).reduce<Record<Control, (value: boolean) => void>>((o, control) => {
    o[control] = (value: boolean) => set((state) => ({ controls: { ...state.controls, [control]: value } }))
    return o
  }, {} as Record<Control, (value: boolean) => void>)

  const booleanActions = keys(booleans).reduce<Record<Booleans, () => void>>((o, boolean) => {
    o[boolean] = isExclusiveBoolean(boolean) ? setExclusiveBoolean(set, boolean) : () => set((state) => ({ ...state, [boolean]: !state[boolean] }))
    return o
  }, {} as Record<Booleans, () => void>)

  const actions: Actions = {
    ...booleanActions,
    ...controlActions,
    onCheckpoint: () => {
      const { start, chassisBody } = get()
      if (start) {
        const checkpoint = Date.now() - start
        
        if (chassisBody.current) {
          const pose = readChassisPose()
          // respawn a little above the road, facing the way the car was going (yaw only — never restore a roll)
          const yaw = new Euler().setFromQuaternion(pose.quaternion, 'YXZ').y
          set({
            checkpoint,
            lastCheckpointPos: [pose.position.x, pose.position.y + 0.5, pose.position.z],
            lastCheckpointRot: [0, yaw, 0],
          })
        } else {
          set({ checkpoint })
        }
      }
    },
    onFinish: () => {
      const { finished, start } = get()
      if (start && !finished) {
        set({ finished: Math.max(Date.now() - start, 0) })
      }
    },
    onStart: () => {
      const { start } = get()
      if (start !== 0) return // already racing, ignore re-trigger
      set({ 
        finished: 0, 
        start: Date.now(),
        lastCheckpointPos: [...position],
        lastCheckpointRot: [...rotation],
        recoveryState: 'none'
      })
    },
    recoverVehicle: () => {
      set((state) => {
        state.api?.angularVelocity.set(0, 0, 0)
        state.api?.velocity.set(0, 0, 0)
        state.api?.position.set(...state.lastCheckpointPos)
        state.api?.rotation.set(...state.lastCheckpointRot)
        
        state.wheels.forEach(wheel => {
            // wheels might not expose an explicit api if they are kinematic and updated via raycast vehicle
            // But we should reset what we can.
        })

        return { ...state, recoveryState: 'none' }
      })
    },
    setPaint: (hex: string) => {
      saveGamePaint(hex)
      set({ color: hex })
    },
    restartRun: () => {
      set((state) => {
        state.api?.angularVelocity.set(...angularVelocity)
        state.api?.position.set(...position)
        state.api?.rotation.set(...rotation)
        state.api?.velocity.set(0, 0, 0)

        return { 
          ...state, 
          finished: 0, 
          start: 0, 
          checkpoint: 0,
          lastCheckpointPos: [...position],
          lastCheckpointRot: [...rotation],
          recoveryState: 'none'
        }
      })
    },
  }

  return {
    ...booleans,
    actionInputMap,
    actions,
    api: null,
    bestCheckpoint: 0,
    camera: cameras[0],
    chassisBody: createRef<Group>(),
    checkpoint: 0,
    color: loadGamePaint(drive.paint),
    controls,
    keyBindingsWithError: [],
    dpr,
    finished: 0,
    get,
    keyInput: null,
    lastCheckpointPos: [...position],
    lastCheckpointRot: [...rotation],
    recoveryState: 'none',
    sceneReady: false,
    level: createRef<Group>(),
    session: null,
    set,
    start: 0,
    vehicleConfig,
    wheelInfo,
    wheels: [createRef<Group>(), createRef<Group>(), createRef<Group>(), createRef<Group>()],
  }
})

/**
 * The store is a module singleton, so it outlives the game page. Without a reset, leaving and
 * re-entering kept the old race clock running, ignored the start line (it thought a run was
 * already in progress) and left whatever keys were held stuck down.
 */
export const resetGameState = () => {
  setState({
    start: 0,
    finished: 0,
    checkpoint: 0,
    bestCheckpoint: 0,
    ready: false,
    sceneReady: false,
    help: false,
    binding: false,
    editor: false,
    camera: cameras[0],
    controls: { ...controls },
    keyInput: null,
    keyBindingsWithError: [],
    lastCheckpointPos: [...position],
    lastCheckpointRot: [...rotation],
    recoveryState: 'none',
  })
  Object.assign(mutation, { angularVelocity: [0, 0, 0], rpmTarget: 0, sliding: false, speed: 0, velocity: [0, 0, 0] })
}

const poseScale = new Vector3()
const poseEuler = new Euler()
/** Scratch outputs of {@link readChassisPose} — copy them if you need to keep them. */
export const chassisPose = { position: new Vector3(), quaternion: new Quaternion(), valid: false }

/**
 * The physics library moves the chassis by writing its matrix (matrixAutoUpdate is off); the
 * object's `.position` / `.quaternion` are never updated and stay at their spawn values. Anything
 * that needs where the car really is has to decompose the matrix.
 */
export function readChassisPose(): typeof chassisPose {
  const body = getState().chassisBody.current
  chassisPose.valid = !!body
  if (body) body.matrix.decompose(chassisPose.position, chassisPose.quaternion, poseScale)
  return chassisPose
}

export const chassisEuler = () => poseEuler.setFromQuaternion(chassisPose.quaternion)

export interface Mutation {
  raycastVehicles: {
    setBrake: (brake: number, wheelIndex: number) => void
    setSteeringValue: (steer: number, wheelIndex: number) => void
    applyEngineForce: (force: number, wheelIndex: number) => void
  }[]
  angularVelocity: [number, number, number]
  rpmTarget: number
  sliding: boolean
  speed: number
  velocity: [number, number, number]
}

export const mutation: Mutation = {
  // Everything in here is mutated to avoid even slight overhead
  raycastVehicles: [],
  angularVelocity: [0, 0, 0],
  rpmTarget: 0,
  sliding: false,
  speed: 0,
  velocity: [0, 0, 0],
}

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<IState, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState } = useStoreImpl

// Dev-only handle for scripted driving tests from the browser console.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  ;(window as unknown as { __game: unknown }).__game = { getState, setState, mutation }
}

export { getState, setState, useStore }
