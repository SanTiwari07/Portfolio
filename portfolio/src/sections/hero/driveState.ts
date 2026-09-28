// Shared, mutable drive state for the hero showcase.
// Written by the scroll/pointer handlers and the R3F frame loop, read every frame
// by the scene and the HUD — kept outside React to avoid re-rendering at 60fps.

export const PAINTS = [
  { name: 'Carrara White', hex: '#eeeeea' },
  { name: 'GT Silver', hex: '#a9adb0' },
  { name: 'Chalk', hex: '#c8c7c0' },
  { name: 'Agate Grey', hex: '#5d5f61' },
] as const;

export type Paint = (typeof PAINTS)[number];

export const drive = {
  /** 0..1 progress through the pinned hero sequence */
  progress: 0,
  /** smoothed signed speed in scene units / second (negative = reversing) */
  speed: 0,
  /** distance travelled due to scrolling (drives road + wheels) */
  distance: 0,
  /** normalised pointer position, -1..1 */
  pointerX: 0,
  pointerY: 0,
  /** 0..1 extra headlight flash, decays automatically */
  flash: 0,
  paint: PAINTS[0].hex as string,
};

type Listener = () => void;
const listeners = new Set<Listener>();

/** Subscribe to per-frame updates (called from inside the R3F frame loop). */
export function onDriveFrame(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function emitDriveFrame() {
  listeners.forEach((fn) => fn());
}
