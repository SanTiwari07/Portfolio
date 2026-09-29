// One-time device capability check, used to scale back expensive effects on
// phones, tablets and low-end machines so scrolling stays smooth.

const mq = (query: string) => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches;

const nav = (typeof navigator !== 'undefined' ? navigator : {}) as Navigator & { deviceMemory?: number };

/** Touch-first device (phones, tablets) — no hover, coarse pointer. */
export const isTouchDevice = mq('(hover: none) and (pointer: coarse)');

export const prefersReducedMotion = mq('(prefers-reduced-motion: reduce)');

/**
 * Devices that can't afford the full showroom (real-time reflections, blur
 * filters, high pixel ratio): touch devices, small screens, few CPU cores or
 * little memory.
 */
export const isLowPower =
  isTouchDevice ||
  mq('(max-width: 1023px)') ||
  (nav.hardwareConcurrency ?? 8) <= 4 ||
  (nav.deviceMemory ?? 8) <= 4;
