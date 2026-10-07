import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

import { setState } from '../store'

/**
 * Lives inside the Canvas. R3F holds back everything under a suspended boundary, so this only
 * mounts once the track, car and physics have resolved; after a few real frames it tells the
 * loading screen the scene is genuinely on screen (the asset loader alone says "100%" long before
 * that, and always says it instantly on a second visit).
 */
export function SceneReady() {
  const three = useThree()
  if (import.meta.env.DEV) (window as unknown as { __r3f: unknown }).__r3f = three
  const seen = useRef({ frames: 0, first: 0, done: false })
  useFrame(() => {
    const s = seen.current
    if (s.done) return
    const now = performance.now()
    if (!s.first) s.first = now
    // a handful of frames is plenty; on slow GPUs frames are scarce, so also stop waiting after ~1.5s
    if (++s.frames >= 4 || now - s.first > 1500) {
      s.done = true
      setState({ sceneReady: true })
    }
  })
  return null
}
