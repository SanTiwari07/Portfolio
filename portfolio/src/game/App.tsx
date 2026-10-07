import { useState } from 'react'
import { Layers } from 'three'
import { Canvas } from '@react-three/fiber'
import { Physics, Debug } from '@react-three/cannon'
import { Sky, Environment, PerspectiveCamera, OrbitControls, Stats, PerformanceMonitor } from '@react-three/drei'

import type { DirectionalLight } from 'three'

import { HideMouse, Keyboard } from './controls'
import { Cameras } from './effects'
import { BoundingBox, Track, Vehicle, Goal, Train, Heightmap, RailwayCollider } from './models'
import { angularVelocity, levelLayer, position, rotation, useStore } from './store'
import { Checkpoint, Clock, Speed, Minimap, Intro, Help, Editor, Finished, Recovery, TouchControls, SceneReady, PaintPicker } from './ui'
import { isLowPower } from '../lib/device'
import { useToggle } from './useToggle'

const layers = new Layers()
layers.enable(levelLayer)

export function App(): JSX.Element {
  const [light, setLight] = useState<DirectionalLight | null>(null)
  // starts sharp, steps down by itself if the machine can't hold the frame rate (no Canvas remount)
  const [maxDpr, setMaxDpr] = useState(isLowPower ? 1 : 1.25)
  const [actions, dpr, editor, shadows, sceneReady] = useStore((s) => [s.actions, s.dpr, s.editor, s.shadows, s.sceneReady])
  const { onCheckpoint, onFinish, onStart } = actions

  const ToggledCheckpoint = useToggle(Checkpoint, 'checkpoint')
  const ToggledDebug = useToggle(Debug, 'debug')
  const ToggledEditor = useToggle(Editor, 'editor')
  const ToggledFinished = useToggle(Finished, 'finished')
  const ToggledMap = useToggle(Minimap, 'map')
  const ToggledOrbitControls = useToggle(OrbitControls, 'editor')
  const ToggledStats = useToggle(Stats, 'stats')

  return (
    <Intro>
      <Canvas key={`${dpr}${shadows}`} dpr={[Math.min(1, maxDpr), Math.min(maxDpr, dpr)]} shadows={shadows} camera={{ position: [0, 5, 15], fov: 50 }}>
        <PerformanceMonitor onDecline={() => setMaxDpr((d) => Math.max(0.75, d - 0.25))} />
        <fog attach="fog" args={['white', 0, 500]} />
        <Sky sunPosition={[100, 10, 100]} distance={1000} />
        <ambientLight layers={layers} intensity={0.1} />
        <directionalLight
          ref={setLight}
          layers={layers}
          position={[0, 50, 150]}
          intensity={1}
          shadow-bias={-0.001}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-150}
          shadow-camera-right={150}
          shadow-camera-top={150}
          shadow-camera-bottom={-150}
          castShadow
        />
        <PerspectiveCamera makeDefault={editor} fov={75} position={[0, 20, 20]} />
        {/* hold the simulation until the track's colliders exist, otherwise the car can drop through the unbuilt road */}
        <Physics isPaused={!sceneReady} allowSleep={false} broadphase="SAP" defaultContactMaterial={{ contactEquationRelaxation: 10, friction: 0.5, restitution: 0.0 }}>
          <ToggledDebug scale={1.0001} color="white">
            <Vehicle angularVelocity={[...angularVelocity]} position={[...position]} rotation={[...rotation]}>
              {light && <primitive object={light.target} />}
            </Vehicle>
            {/* outside the chassis on purpose: a camera parented to the car inherits its roll and pitch */}
            <Cameras />
            <Train />
            <RailwayCollider />
            {/* The red jump ramp that used to sit on the start straight is gone: it was tilted sideways, so a car
                that hit it at speed launched, landed half-rolled and often flipped. */}
            <Heightmap elementSize={0.5085} position={[327 - 66.5, -3.3, -473 + 213]} rotation={[-Math.PI / 2, 0, -Math.PI]} />
            <Goal args={[0.001, 10, 18]} onCollideBegin={onStart} rotation={[0, 0.55, 0]} position={[-27, 1, 180]} />
            <Goal args={[0.001, 10, 18]} onCollideBegin={onFinish} rotation={[0, -1.2, 0]} position={[-104, 1, -189]} />
            <Goal args={[0.001, 10, 18]} onCollideBegin={onCheckpoint} rotation={[0, -0.5, 0]} position={[-50, 1, -5]} />
            <BoundingBox {...{ depth: 512, height: 100, position: [0, 40, 0], width: 512 }} />
          </ToggledDebug>
          <Track />
        </Physics>
        {/* PATCHED: /textures/ → /game/textures/ */}
        <Environment files="/game/textures/dikhololo_night_1k.hdr" />
        <ToggledMap />
        <ToggledOrbitControls />
        <SceneReady />
      </Canvas>
      <Clock />
      <ToggledEditor />
      <ToggledFinished />
      <Help />
      <Speed />
      <ToggledStats />
      <ToggledCheckpoint />
      <Recovery />
      <TouchControls />
      <PaintPicker />
      <HideMouse />
      <Keyboard />
    </Intro>
  )
}
