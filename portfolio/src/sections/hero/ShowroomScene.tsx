import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Grid, Lightformer, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { PorscheCar } from './PorscheCar';
import { drive } from './driveState';
import { poseAt, type CameraPose } from './shots';

export interface SceneTheme {
  background: string;
  floor: string;
  grid: string;
  lane: string;
  streak: string;
  dark: boolean;
}

const LANE_SPACING = 3;
const LANE_COUNT = 24;

// ─── Camera choreography ──────────────────────────────────────────
function CameraRig() {
  const { camera, size } = useThree();
  const pose = useMemo<CameraPose>(() => ({ position: new THREE.Vector3(), target: new THREE.Vector3(), shift: 0, fov: 30 }), []);
  const current = useRef({ target: new THREE.Vector3(0, 0.5, 0), shift: 0, init: false });

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const portrait = aspect < 1;
    // pull back on narrow screens so the whole car stays in frame
    const radiusScale = portrait ? THREE.MathUtils.clamp(0.72 / aspect, 1, 1.7) : THREE.MathUtils.clamp(1.55 / aspect, 0.9, 1.25);
    const fovScale = portrait ? 1.35 : 1;
    poseAt(drive.progress, pose, radiusScale);

    // pointer parallax: orbit a touch around the target
    const offset = pose.position.clone().sub(pose.target);
    offset.applyAxisAngle(THREE.Object3D.DEFAULT_UP, -drive.pointerX * 0.1);
    offset.y += drive.pointerY * 0.35;
    pose.position.copy(pose.target).add(offset);

    const c = current.current;
    if (!c.init) {
      cam.position.copy(pose.position);
      c.target.copy(pose.target);
      c.shift = pose.shift;
      c.init = true;
    }
    const k = 1 - Math.exp(-dt * 4.5);
    cam.position.lerp(pose.position, k);
    c.target.lerp(pose.target, k);
    c.shift += (pose.shift - c.shift) * k;
    cam.fov += (pose.fov * fovScale - cam.fov) * k;
    cam.lookAt(c.target);

    // Shift the framing (not the perspective) so copy can sit beside the car.
    const shiftX = portrait ? 0 : c.shift;
    // portrait: drop the car into the lower half, under the copy
    const shiftY = portrait ? 0.17 : 0;
    cam.setViewOffset(size.width, size.height, -shiftX * size.width, -shiftY * size.height, size.width, size.height);
    cam.updateProjectionMatrix();
  });
  return null;
}

// ─── Road: moving grid + lane dashes ──────────────────────────────
function Road({ theme }: { theme: SceneTheme }) {
  const grid = useRef<THREE.Group>(null);
  const dashes = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const offset = -(((drive.distance % LANE_SPACING) + LANE_SPACING) % LANE_SPACING);
    if (grid.current) grid.current.position.z = offset;
    const mesh = dashes.current;
    if (!mesh) return;
    let n = 0;
    for (const side of [-1.55, 1.55]) {
      for (let i = 0; i < LANE_COUNT; i++) {
        dummy.position.set(side, 0.002, offset + (i - LANE_COUNT / 2) * LANE_SPACING);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(n++, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <group ref={grid}>
        <Grid
          position={[0, 0.001, 0]}
          args={[60, 60]}
          cellSize={0.5}
          cellThickness={0.6}
          cellColor={theme.grid}
          sectionSize={LANE_SPACING}
          sectionThickness={1}
          sectionColor={theme.grid}
          fadeDistance={26}
          fadeStrength={1.6}
          infiniteGrid
        />
      </group>
      <instancedMesh ref={dashes} args={[undefined, undefined, LANE_COUNT * 2]} frustumCulled={false}>
        <planeGeometry args={[0.035, 1.1]} />
        <meshBasicMaterial color={theme.lane} toneMapped={false} transparent opacity={0.6} />
      </instancedMesh>
    </>
  );
}

// ─── Speed streaks: light trails that appear as you go faster ─────
function SpeedStreaks({ color }: { color: string }) {
  const COUNT = 60;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, () => {
        const side = Math.random() < 0.5 ? -1 : 1;
        return {
          x: side * (2.2 + Math.random() * 5),
          y: 0.15 + Math.random() * 2.6,
          z: Math.random() * 60 - 30,
          len: 0.6 + Math.random() * 2.2,
          speed: 0.7 + Math.random() * 0.8,
        };
      }),
    [],
  );

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const m = mesh.current;
    if (!m || !material.current) return;
    const intensity = THREE.MathUtils.smoothstep(Math.abs(drive.speed), 6, 40);
    material.current.opacity = intensity * 0.55;
    m.visible = intensity > 0.01;
    seeds.forEach((s, i) => {
      s.z -= drive.speed * s.speed * 1.6 * dt;
      if (s.z < -30) s.z += 60;
      if (s.z > 30) s.z -= 60;
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(1, 1, s.len * (0.4 + intensity * 2));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[0.012, 0.012, 1]} />
      <meshBasicMaterial ref={material} color={color} transparent opacity={0} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  );
}

// ─── Lighting: studio lightformers (no HDR download) ──────────────
function Studio({ dark, lowPower }: { dark: boolean; lowPower: boolean }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.15 : 0.45} />
      <directionalLight position={[4, 8, 5]} intensity={dark ? 1.2 : 1.8} />
      <spotLight position={[-6, 6, -4]} angle={0.5} penumbra={1} intensity={dark ? 40 : 25} color="#ffffff" />
      <Environment resolution={lowPower ? 128 : 256} frames={1}>
        <color attach="background" args={[dark ? '#050505' : '#d8d8d8']} />
        {/* long overhead softbox — the signature highlight along the roofline */}
        <Lightformer form="rect" intensity={dark ? 3 : 4} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[12, 2.5, 1]} />
        <Lightformer form="rect" intensity={2} position={[0, 4, -6]} rotation-x={Math.PI / 2.5} scale={[10, 1, 1]} />
        {/* side strips for crisp flank reflections */}
        <Lightformer form="rect" intensity={dark ? 2 : 2.5} position={[-6, 1.5, 0]} rotation-y={Math.PI / 2} scale={[14, 0.6, 1]} />
        <Lightformer form="rect" intensity={dark ? 2 : 2.5} position={[6, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[14, 0.6, 1]} />
        {/* warm kicker from the brand colour */}
        <Lightformer form="ring" color="#e32636" intensity={dark ? 3 : 1.2} position={[-5, 2, 6]} scale={3} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
    </>
  );
}

// ─── Scene root ───────────────────────────────────────────────────
interface ShowroomSceneProps {
  theme: SceneTheme;
  onCarHover?: (hovering: boolean) => void;
  onCarClick?: () => void;
  /** skip the real-time floor reflection (a second full scene render every frame) */
  lowPower?: boolean;
}

export function ShowroomScene({ theme, onCarHover, onCarClick, lowPower = false }: ShowroomSceneProps) {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog(theme.background, 11, 30);
    return () => {
      scene.fog = null;
    };
  }, [scene, theme.background]);

  return (
    <>
      <CameraRig />
      <Studio dark={theme.dark} lowPower={lowPower} />

      <PorscheCar
        shadowOpacity={theme.dark ? 0.9 : 0.65}
        onPointerOver={() => onCarHover?.(true)}
        onPointerOut={() => onCarHover?.(false)}
        onClick={onCarClick}
      />

      <Road theme={theme} />
      <SpeedStreaks color={theme.streak} />

      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        {lowPower ? (
          <meshStandardMaterial color={theme.floor} roughness={0.85} metalness={theme.dark ? 0.4 : 0.05} />
        ) : (
          <MeshReflectorMaterial
            color={theme.floor}
            resolution={512}
            mirror={theme.dark ? 0.6 : 0.35}
            mixBlur={6}
            mixStrength={theme.dark ? 3 : 1.4}
            blur={[400, 120]}
            roughness={0.9}
            metalness={theme.dark ? 0.5 : 0.1}
            depthScale={0.8}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.2}
          />
        )}
      </mesh>
    </>
  );
}
