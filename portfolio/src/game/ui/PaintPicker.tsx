import { useEffect } from 'react'

import { GAME_PAINTS } from '../paint'
import { getState, useStore } from '../store'

/** Paint chooser for the car — click a swatch, or press C to cycle. */
export function PaintPicker() {
  const [color, actions] = useStore((s) => [s.color, s.actions])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'c' || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if ((e.target as HTMLElement).nodeName === 'INPUT') return
      const i = GAME_PAINTS.findIndex((p) => p.hex === getState().color)
      actions.setPaint(GAME_PAINTS[(i + 1) % GAME_PAINTS.length].hex)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [actions])

  const current = GAME_PAINTS.find((p) => p.hex === color)

  return (
    <div className="paint-picker" role="radiogroup" aria-label="Car paint colour">
      <span className="paint-name">{current?.name ?? 'Custom'}</span>
      {GAME_PAINTS.map((p) => (
        <button
          key={p.hex}
          type="button"
          role="radio"
          aria-checked={p.hex === color}
          aria-label={p.name}
          title={p.name}
          className={`paint-swatch ${p.hex === color ? 'active' : ''}`}
          style={{ background: `radial-gradient(circle at 30% 30%, #ffffff55, transparent 55%), ${p.hex}` }}
          onClick={(e) => {
            actions.setPaint(p.hex)
            e.currentTarget.blur() // keep Space (the brake) from re-clicking this button
          }}
        />
      ))}
      <span className="paint-hint">C</span>
    </div>
  )
}
