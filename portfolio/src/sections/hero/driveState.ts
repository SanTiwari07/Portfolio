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

function emitDriveFrame() {
  listeners.forEach((fn) => fn());
}

/** Scroll pixels/second → scene units/second. ~2000px/s reads as ~100 km/h on the HUD. */
const SCROLL_TO_SPEED = 0.0125;

/**
 * Page-wide drive loop: turns scrolling into progress/speed/distance every animation
 * frame, even after the hero canvas has paused, so the HUD, road rail and engine keep
 * responding across the whole portfolio.
 */
export function startDriveLoop(getSection: () => HTMLElement | null) {
  let raf = 0;
  let lastY = window.scrollY;
  let lastT = performance.now();

  const tick = (t: number) => {
    const dt = Math.min(Math.max((t - lastT) / 1000, 1e-3), 1 / 20);
    lastT = t;

    const el = getSection();
    if (el) {
      const rect = el.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      drive.progress = Math.min(Math.max(-rect.top / travel, 0), 1);
    }

    const y = window.scrollY;
    const target = Math.min(Math.max(((y - lastY) / dt) * SCROLL_TO_SPEED, -40), 90);
    lastY = y;
    // accelerate quickly, coast down gently — feels like a car, not a scrollbar
    const rate = Math.abs(target) > Math.abs(drive.speed) ? 5 : 1.6;
    drive.speed += (target - drive.speed) * (1 - Math.exp(-rate * dt));
    if (Math.abs(drive.speed) < 0.01) drive.speed = 0;
    drive.distance += drive.speed * dt;

    emitDriveFrame();
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
