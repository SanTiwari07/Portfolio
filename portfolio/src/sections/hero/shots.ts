import * as THREE from 'three';

// Camera choreography for the pinned hero. The car sits at the origin facing +Z;
// the camera orbits it in cylindrical coordinates so transitions sweep around
// the body instead of cutting through it.

export interface Shot {
  id: string;
  label: string;
  /** scroll progress at which this shot is fully settled */
  at: number;
  /** azimuth in degrees: 0 = in front of the car, 90 = its right-hand side (+X) */
  azimuth: number;
  radius: number;
  height: number;
  target: [number, number, number];
  /** horizontal frame shift as a fraction of viewport width (+ moves the car right) */
  shift: number;
  fov: number;
}

export const SHOTS: Shot[] = [
  { id: 'hero',    label: 'Intro',      at: 0.0,  azimuth: 38,  radius: 9.2, height: 1.55, target: [0, 0.5, 0],     shift: 0.17,   fov: 30 },
  { id: 'profile', label: 'About',      at: 0.2,  azimuth: 90,  radius: 8.6, height: 0.85, target: [0, 0.55, 0],    shift: 0,     fov: 30 },
  { id: 'rear',    label: 'Work',       at: 0.4,  azimuth: 148, radius: 7.2, height: 1.05, target: [0, 0.55, -0.4], shift: -0.2,  fov: 30 },
  { id: 'detail',  label: 'Experience', at: 0.6,  azimuth: 292, radius: 3.7, height: 0.6,  target: [-0.74, 0.34, 1.1], shift: 0.25, fov: 34 },
  { id: 'lights',  label: 'Awards',     at: 0.78, azimuth: 360, radius: 7.6, height: 1.1,  target: [0, 0.45, 0],    shift: 0,     fov: 30 },
  { id: 'launch',  label: 'Contact',    at: 0.92, azimuth: 540, radius: 7.4, height: 1.05, target: [0, 0.75, 4],     shift: 0,     fov: 34 },
];

/** Fraction of each gap between shots during which the camera holds still. */
const HOLD = 0.4;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export interface CameraPose {
  position: THREE.Vector3;
  target: THREE.Vector3;
  shift: number;
  fov: number;
}

const tmpTarget = new THREE.Vector3();

/** Blend the shot list at progress `p` into a camera pose. */
export function poseAt(p: number, out: CameraPose, radiusScale = 1): CameraPose {
  let i = 0;
  while (i < SHOTS.length - 1 && p > SHOTS[i + 1].at) i++;
  const a = SHOTS[i];
  const b = SHOTS[Math.min(i + 1, SHOTS.length - 1)];

  let t = 0;
  if (a !== b) {
    const span = b.at - a.at;
    const local = (p - a.at) / span;
    // hold the camera at the start and end of every transition so copy is readable
    t = easeInOutCubic(THREE.MathUtils.clamp((local - HOLD / 2) / (1 - HOLD), 0, 1));
  }

  const lerp = THREE.MathUtils.lerp;
  const az = THREE.MathUtils.degToRad(lerp(a.azimuth, b.azimuth, t));
  const radius = lerp(a.radius, b.radius, t) * radiusScale;
  const height = lerp(a.height, b.height, t);
  tmpTarget.set(
    lerp(a.target[0], b.target[0], t),
    lerp(a.target[1], b.target[1], t),
    lerp(a.target[2], b.target[2], t),
  );

  out.target.copy(tmpTarget);
  out.position.set(tmpTarget.x + Math.sin(az) * radius, height, tmpTarget.z + Math.cos(az) * radius);
  out.shift = lerp(a.shift, b.shift, t);
  out.fov = lerp(a.fov, b.fov, t);
  return out;
}

/** Index of the shot closest to progress `p` (for HUD labels). */
export function shotIndexAt(p: number) {
  let best = 0;
  for (let i = 0; i < SHOTS.length; i++) {
    if (Math.abs(SHOTS[i].at - p) < Math.abs(SHOTS[best].at - p)) best = i;
  }
  return best;
}
