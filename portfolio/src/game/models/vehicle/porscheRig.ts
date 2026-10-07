import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'


// The game gets its own copy of the Porsche (a distinct URL = a distinct drei cache entry), so
// painting it, pulling the wheels off it, or tweaking materials never touches the hero showroom's
// car — and the game works whichever page was opened first. The file itself is cached by the browser.
export const GAME_MODEL_URL = '/models/porsche-hero.glb?game'
useGLTF.preload(GAME_MODEL_URL)

/**
 * Raw model → metres. At 0.48 the 911's wheelbase (2.45 m) and track (1.7 m) match the physics
 * vehicle's wheel layout, and tyre radius comes out at 0.345 m.
 */
export const MODEL_SCALE = 0.48
/** Puts the footprint centre at the origin with the tyres on y = 0 (same offsets as the showroom). */
export const MODEL_OFFSET = new THREE.Vector3(-0.02, -0.17, 0.755)
export const WHEEL_RADIUS = 0.72 * MODEL_SCALE

// Hub centres in raw model space, indexed by *physics* wheel: 0/1 front left/right, 2/3 rear left/right
// (physics puts even indices on −X). Measured from the GLB's mesh bounds.
const HUBS = [
  new THREE.Vector3(-1.72, 0.87, 1.81),
  new THREE.Vector3(1.76, 0.87, 1.81),
  new THREE.Vector3(-1.77, 0.9, -3.27),
  new THREE.Vector3(1.79, 0.9, -3.27),
]

export interface PorscheRig {
  /** the bodywork, wheels removed, ready to sit in a MODEL_SCALE group */
  body: THREE.Group
  /** one group of tyre + rim + disc meshes per physics wheel, centred on its hub, already at MODEL_SCALE */
  wheels: THREE.Group[]
  paint: THREE.MeshPhysicalMaterial
  tail: THREE.MeshStandardMaterial | null
}

const cache = new WeakMap<THREE.Object3D, PorscheRig>()

export function getPorscheRig(scene: THREE.Object3D, initialColor: string): PorscheRig {
  const hit = cache.get(scene)
  if (hit) return hit

  const body = scene.clone(true) as THREE.Group
  body.position.set(0, 0, 0)
  body.rotation.set(0, 0, 0)
  body.scale.set(1, 1, 1)
  body.updateMatrixWorld(true)

  // ── wheels: find the round tyre/rim/disc meshes around each hub ──
  const wheelMeshes: THREE.Mesh[][] = HUBS.map(() => [])
  const box = new THREE.Box3()
  const center = new THREE.Vector3()
  const size = new THREE.Vector3()
  body.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    box.setFromObject(mesh)
    box.getCenter(center)
    box.getSize(size)
    const hub = HUBS.findIndex((h) => Math.abs(center.x - h.x) < 0.45 && Math.abs(center.y - h.y) < 0.06 && Math.abs(center.z - h.z) < 0.06)
    const round = Math.abs(size.y - size.z) < 0.06 && size.y > 0.07
    if (hub >= 0 && round) wheelMeshes[hub].push(mesh)
  })

  const scale = new THREE.Matrix4().makeScale(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE)
  const wheels = HUBS.map((hub, i) => {
    const group = new THREE.Group()
    const toHub = new THREE.Matrix4().makeTranslation(-hub.x, -hub.y, -hub.z)
    for (const src of wheelMeshes[i]) {
      const part = new THREE.Mesh(src.geometry, src.material)
      part.castShadow = true
      part.matrixAutoUpdate = false
      // meshes carry their own node transform in model space; re-express it relative to the hub
      part.matrix.copy(scale).multiply(toHub).multiply(src.matrixWorld)
      group.add(part)
    }
    return group
  })
  wheelMeshes.flat().forEach((m) => m.removeFromParent())

  // ── materials ──
  const found: Record<string, THREE.MeshStandardMaterial> = {}
  body.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = false
    const mat = mesh.material as THREE.MeshStandardMaterial
    if (mat?.name) found[mat.name] = mat
  })

  const paint = new THREE.MeshPhysicalMaterial({
    color: initialColor,
    metalness: 0.55,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.25,
  })
  body.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (mesh.isMesh && (mesh.material as THREE.Material).name === 'Material.024') mesh.material = paint
  })

  const glass = found['Material.026']
  if (glass) {
    glass.color.set('#0a0a0a')
    glass.opacity = 0.55
    glass.envMapIntensity = 0.5
  }
  if (found['Material.019']) found['Material.019'].opacity = 0.12
  if (found['Material.011']) found['Material.011'].opacity = 0.5

  const tail = found['Material'] ?? null
  if (tail) tail.toneMapped = false

  body.position.copy(MODEL_OFFSET)

  const rig = { body, wheels, paint, tail }
  cache.set(scene, rig)
  return rig
}

export function usePorscheRig(initialColor: string): PorscheRig {
  const { scene } = useGLTF(GAME_MODEL_URL)
  return getPorscheRig(scene, initialColor)
}
