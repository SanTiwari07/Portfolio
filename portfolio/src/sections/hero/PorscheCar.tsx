import React, { useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { drive } from './driveState';

// Meshopt-compressed Porsche 911 Turbo S (4.9 MB, down from the 58 MB original). Also used by the game.
export const HERO_MODEL_URL = '/models/porsche-hero.glb';
useGLTF.preload(HERO_MODEL_URL);

/** Uniform scale applied to the raw model (≈9.4 units long → ≈4 units). */
export const CAR_SCALE = 0.42;
/** Raw-model offsets that put the car's footprint centre on the origin, tyres on y=0. */
const MODEL_OFFSET = new THREE.Vector3(-0.02, -0.17, 0.755);

// Wheel hubs in raw model space, measured from the GLB's mesh bounds.
const WHEEL_HUBS = [
  new THREE.Vector3(1.76, 0.87, 1.81),
  new THREE.Vector3(-1.72, 0.87, 1.81),
  new THREE.Vector3(1.79, 0.9, -3.27),
  new THREE.Vector3(-1.77, 0.9, -3.27),
];
export const WHEEL_RADIUS = 0.72 * CAR_SCALE;

interface CarMaterials {
  paint: THREE.MeshPhysicalMaterial;
  tail: THREE.MeshStandardMaterial | null;
  drl: THREE.MeshStandardMaterial | null;
}

/**
 * Moves every rotating wheel part (tyre, rim, disc — anything centred on the hub and
 * round in the Y/Z plane) under a pivot so the wheel can spin. Calipers are off-centre
 * and stay attached to the body.
 */
function rigWheels(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  const pivots = WHEEL_HUBS.map((hub) => {
    const pivot = new THREE.Group();
    pivot.position.copy(hub);
    root.add(pivot);
    return pivot;
  });
  root.updateMatrixWorld(true);

  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });

  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  for (const mesh of meshes) {
    box.setFromObject(mesh);
    box.getCenter(center);
    box.getSize(size);
    const hub = WHEEL_HUBS.findIndex(
      (h) => Math.abs(center.x - h.x) < 0.45 && Math.abs(center.y - h.y) < 0.06 && Math.abs(center.z - h.z) < 0.06,
    );
    const round = Math.abs(size.y - size.z) < 0.06 && size.y > 0.07;
    if (hub >= 0 && round) pivots[hub].attach(mesh);
  }
  return pivots;
}

function upgradeMaterials(root: THREE.Object3D): CarMaterials {
  const found: Record<string, THREE.MeshStandardMaterial> = {};
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (mat?.name) found[mat.name] = mat;
  });

  // Body: swap the flat glossy white for a clear-coated car paint.
  const paint = new THREE.MeshPhysicalMaterial({
    color: drive.paint,
    metalness: 0.55,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.25,
  });
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && (mesh.material as THREE.Material).name === 'Material.024') mesh.material = paint;
  });

  // Window glass reflected the studio lights as a white haze — tint it like privacy glass.
  const glass = found['Material.026'];
  if (glass) {
    glass.color.set('#0a0a0a');
    glass.opacity = 0.55;
    glass.envMapIntensity = 0.5;
  }
  // Lighten the smoked lens stack over the rear light bar so it can read as lit.
  if (found['Material.019']) found['Material.019'].opacity = 0.12;
  if (found['Material.011']) found['Material.011'].opacity = 0.5;

  const tail = found['Material'] ?? null; // red emissive rear light bar
  const drl = found['Material.005'] ?? null; // headlight daytime running lights
  if (tail) tail.toneMapped = false;
  if (drl) drl.toneMapped = false;
  return { paint, tail, drl };
}

// Soft radial sprite used to fake bloom around the lamps (no post-processing pass needed).
let glowTexture: THREE.Texture | null = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}

// Lamp positions in raw model space.
const HEADLAMPS: [number, number, number][] = [
  [1.47, 1.58, 3.12],
  [-1.43, 1.58, 3.12],
];
const TAIL_BAR: [number, number, number] = [0.02, 1.76, -5.02];

function Lamps({ front, rear }: { front: React.MutableRefObject<number>; rear: React.MutableRefObject<number> }) {
  const tex = useMemo(getGlowTexture, []);
  const headGlows = useRef<THREE.SpriteMaterial[]>([]);
  const tailGlow = useRef<THREE.SpriteMaterial>(null);
  const beams = useRef<THREE.SpotLight[]>([]);
  const wash = useRef<THREE.PointLight>(null);
  const beamTargets = useMemo(() => HEADLAMPS.map(([x]) => {
    const o = new THREE.Object3D();
    o.position.set(x * 1.1, -1.4, 20);
    return o;
  }), []);

  useFrame(() => {
    const f = front.current;
    const r = rear.current;
    headGlows.current.forEach((m) => m && (m.opacity = 0.06 + f * 0.9));
    if (tailGlow.current) tailGlow.current.opacity = 0.1 + r * 0.9;
    beams.current.forEach((b) => b && (b.intensity = f * 22));
    if (wash.current) wash.current.intensity = r * 6;
  });

  return (
    <group position={MODEL_OFFSET}>
      {HEADLAMPS.map((pos, i) => (
        <group key={i} position={pos}>
          <sprite scale={[1.5, 1.1, 1]}>
            <spriteMaterial ref={(m: THREE.SpriteMaterial | null) => { if (m) headGlows.current[i] = m; }} map={tex} color="#dfe9ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
          <primitive object={beamTargets[i]} />
          <spotLight
            ref={(l: THREE.SpotLight | null) => { if (l) beams.current[i] = l; }}
            target={beamTargets[i]}
            angle={0.42}
            penumbra={0.7}
            distance={9}
            decay={1.2}
            color="#eef3ff"
            intensity={0}
          />
        </group>
      ))}
      <sprite position={TAIL_BAR} scale={[5.4, 0.55, 1]}>
        <spriteMaterial ref={tailGlow} map={tex} color="#ff1a1a" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      <pointLight ref={wash} position={[0, 1.2, -6.5]} color="#ff1f1f" distance={5} decay={1.5} intensity={0} />
    </group>
  );
}

// Kept off scene.userData: Object3D.clone() JSON-copies userData, which would serialise the whole rig.
const rigs = new WeakMap<THREE.Object3D, { pivots: THREE.Group[]; mats: CarMaterials }>();

interface PorscheCarProps {
  shadowOpacity?: number;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: () => void;
}

export function PorscheCar({ shadowOpacity = 0.7, onPointerOver, onPointerOut, onClick }: PorscheCarProps) {
  const { scene } = useGLTF(HERO_MODEL_URL);
  const body = useRef<THREE.Group>(null);
  const chassis = useRef<THREE.Group>(null);
  const paintColor = useMemo(() => new THREE.Color(drive.paint), []);
  const state = useRef({ lastSpeed: 0, pitch: 0, roll: 0, wheelAngle: 0, lastLaunch: 0 });
  const frontLight = useRef(0);
  const rearLight = useRef(0);

  // Rig once per loaded scene (useGLTF caches it, so remounts/HMR reuse the rig).
  const rig = useMemo(() => {
    const cached = rigs.get(scene);
    if (cached) return cached;
    // Measure in the model's own space, detached from any scaled parent.
    const parent = scene.parent;
    parent?.remove(scene);
    const savedPosition = scene.position.clone();
    scene.position.set(0, 0, 0);
    const result = { mats: upgradeMaterials(scene), pivots: rigWheels(scene) };
    scene.position.copy(savedPosition);
    parent?.add(scene);
    rigs.set(scene, result);
    return result;
  }, [scene]);

  useFrame((_, rawDelta) => {
    const r = rig;
    if (!chassis.current || !body.current) return;
    const dt = Math.min(rawDelta, 1 / 20);
    const s = state.current;
    const p = drive.progress;

    // Final shot: the car pulls away down the road.
    const launch = THREE.MathUtils.smoothstep(p, 0.9, 1);
    const launchZ = launch * launch * 12;
    chassis.current.position.z = launchZ;
    const launchDelta = launchZ - s.lastLaunch;
    s.lastLaunch = launchZ;

    // Wheels roll with the distance actually travelled.
    s.wheelAngle += (drive.speed * dt + launchDelta) / WHEEL_RADIUS;
    for (const pivot of r.pivots) pivot.rotation.x = s.wheelAngle;

    // Body pitches under acceleration/braking and settles with a spring-ish damp.
    const accel = (drive.speed - s.lastSpeed) / Math.max(dt, 1e-3);
    s.lastSpeed = drive.speed;
    const targetPitch = THREE.MathUtils.clamp(-accel * 0.0022, -0.035, 0.035) - launch * 0.02;
    s.pitch = THREE.MathUtils.damp(s.pitch, targetPitch, 6, dt);
    const targetRoll = drive.pointerX * 0.012;
    s.roll = THREE.MathUtils.damp(s.roll, targetRoll, 3, dt);
    body.current.rotation.x = s.pitch;
    body.current.rotation.z = s.roll;
    // idle engine shimmer
    body.current.position.y = Math.sin(performance.now() * 0.045) * 0.0012 * (1 - Math.min(Math.abs(drive.speed) / 6, 1));

    // Lights: taillights come up for the rear shot, headlights for the front shot.
    const rearGlow = THREE.MathUtils.smoothstep(p, 0.28, 0.4) * (1 - THREE.MathUtils.smoothstep(p, 0.5, 0.6));
    const frontGlow = THREE.MathUtils.smoothstep(p, 0.66, 0.78);
    drive.flash = Math.max(0, drive.flash - dt * 1.6);
    const braking = drive.speed < -0.2 || (accel < -25 && drive.speed > 0) ? 1 : 0;
    rearLight.current = THREE.MathUtils.damp(rearLight.current, Math.min(1, rearGlow + launch + braking * 0.8), 8, dt);
    frontLight.current = THREE.MathUtils.damp(frontLight.current, Math.min(1, frontGlow + launch + drive.flash), 10, dt);
    if (r.mats.tail) r.mats.tail.emissiveIntensity = 1 + rearLight.current * 4;
    if (r.mats.drl) r.mats.drl.emissiveIntensity = 2 + frontLight.current * 8;

    // Paint changes ease across rather than snapping.
    paintColor.set(drive.paint);
    r.mats.paint.color.lerp(paintColor, 1 - Math.exp(-dt * 5));
  });

  return (
    <group ref={chassis}>
      <group ref={body}>
        <group
          scale={CAR_SCALE}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onPointerOver?.();
          }}
          onPointerOut={() => onPointerOut?.()}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <primitive object={scene} position={MODEL_OFFSET} />
          <Lamps front={frontLight} rear={rearLight} />
        </group>
      </group>
      {/* lives on the chassis (not the body) so it follows the car but ignores pitch */}
      {/* baked once: the car never moves relative to its own shadow, so re-rendering it every frame is wasted work */}
      <ContactShadows position={[0, 0.005, 0]} scale={[5, 8]} opacity={shadowOpacity} blur={2.2} far={1.6} resolution={512} frames={1} color="#000000" />
    </group>
  );
}
