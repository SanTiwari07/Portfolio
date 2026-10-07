import { PAINTS } from '../sections/hero/driveState'

/** Colours offered in the game: the showroom's four neutrals plus some louder 911 classics. */
export const GAME_PAINTS: readonly { name: string; hex: string }[] = [
  ...PAINTS,
  { name: 'Jet Black', hex: '#15161a' },
  { name: 'Guards Red', hex: '#c8102e' },
  { name: 'Racing Yellow', hex: '#f2c500' },
  { name: 'Shark Blue', hex: '#1d4f91' },
  { name: 'Miami Blue', hex: '#2fa8d8' },
  { name: 'Python Green', hex: '#3f7d3a' },
  { name: 'Lava Orange', hex: '#e8590c' },
]

const KEY = 'portfolio-game-paint-v1'

export const loadGamePaint = (fallback: string): string => {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved && GAME_PAINTS.some((p) => p.hex === saved)) return saved
  } catch {
    /* storage blocked — the colour just won't persist */
  }
  return fallback
}

export const saveGamePaint = (hex: string) => {
  try {
    localStorage.setItem(KEY, hex)
  } catch {
    /* ignore */
  }
}
