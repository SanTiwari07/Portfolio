import { createRef } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'
import type { RefObject } from 'react'
import type { PublicApi, WheelInfoOptions } from '@react-three/cannon'
import type { Session } from '@supabase/supabase-js'
import type { Group } from 'three'
import type { GetState, SetState, StateSelector } from 'zustand'

import { keys } from './keys'

export const angularVelocity = [0, 0.5, 0] as const
export const cameras = ['DEFAULT', 'BIRD_EYE'] as const

export const dpr = 1.5 as const
export const levelLayer = 1 as const
export const maxBoost = 100 as const
export const position = [-110, 5.0, 220] as const
export const rotation = [0, Math.PI / 2 + 0.35, 0] as const

export const SHOW_PHYSICS_DEBUG = false

export type RecoveryState = 'none' | 'flip' | 'stuck' | 'fall'

export const vehicleConfig = {
  width: 1.65,
  height: -0.3,
  front: 1.225,
  back: -1.225,
  steer: 0.22,
  force: 7000,
  maxBrake: 120,
  maxSpeed: 94,
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
  frictionSlip: 5.0,
  // maxSuspensionForce caps the impulse the suspension can apply in one physics tick.
  // Without this, sharp heightfield triangles (e.g. railway crossing) produce
  // infinite upward forces that launch the vehicle. 100000 is the standard value.
  maxSuspensionForce: 100000,
  // By increasing max travel, we disable the internal Cannon.js "bump stop" hard constraint
  // which causes infinite forces when a raycast hits a sharp terrain bump.
  maxSuspensionTravel: 5.0,
  radius: 0.38,
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

export type BindableActionName = Control | ExclusiveBoolean | Extract<Booleans, 'editor' | 'map' | 'sound'> | 'camera'

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
  session: Session | null
  set: Setter
  start: number
  vehicleConfig: VehicleConfig
  wheelInfo: WheelInfo
  wheels: [RefObject<Group>, RefObject<Group>, RefObject<Group>, RefObject<Group>]
  keyInput: string | null
  lastCheckpointPos: [number, number, number]
  lastCheckpointRot: [number, number, number]
  recoveryState: RecoveryState
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
          set({ 
            checkpoint,
            lastCheckpointPos: chassisBody.current.position.toArray() as [number, number, number],
            lastCheckpointRot: chassisBody.current.rotation.toArray().slice(0, 3) as [number, number, number]
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
    color: '#FFFF00',
    controls,
    keyBindingsWithError: [],
    dpr,
    finished: 0,
    get,
    keyInput: null,
    lastCheckpointPos: [...position],
    lastCheckpointRot: [...rotation],
    recoveryState: 'none',
    level: createRef<Group>(),
    session: null,
    set,
    start: 0,
    vehicleConfig,
    wheelInfo,
    wheels: [createRef<Group>(), createRef<Group>(), createRef<Group>(), createRef<Group>()],
  }
})

export interface Mutation {
  raycastVehicles: {
    setBrake: (brake: number, wheelIndex: number) => void
    setSteeringValue: (steer: number, wheelIndex: number) => void
    applyEngineForce: (force: number, wheelIndex: number) => void
  }[]
  rpmTarget: number
  sliding: boolean
  speed: number
  velocity: [number, number, number]
}

export const mutation: Mutation = {
  // Everything in here is mutated to avoid even slight overhead
  raycastVehicles: [],
  rpmTarget: 0,
  sliding: false,
  speed: 0,
  velocity: [0, 0, 0],
}

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<IState, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState } = useStoreImpl

export { getState, setState, useStore }
