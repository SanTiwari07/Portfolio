import { useEffect, useState } from 'react'
import type { PointerEvent } from 'react'

import { wantsTouchControls } from '../../lib/device'
import { useStore } from '../store'
import type { Controls } from '../store'

function Pad({ control, label }: { control: keyof Controls; label: string }) {
  const [active, actions] = useStore((s) => [s.controls[control], s.actions])
  const press = (e: PointerEvent) => {
    e.preventDefault()
    // capturing keeps the control held while the finger slides; it can throw for a stale pointer, which must not eat the press
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    } catch {
      /* ignore */
    }
    actions[control](true)
  }
  const release = () => actions[control](false)
  return (
    <button
      type="button"
      aria-label={label}
      className={`touch-btn ${active ? 'active' : ''}`}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onContextMenu={(e) => e.preventDefault()}
    >
      {label}
    </button>
  )
}

/** On-screen controls for phones and tablets — the game was keyboard-only before. */
export function TouchControls() {
  const actions = useStore((s) => s.actions)
  const [show, setShow] = useState(wantsTouchControls)

  // follow rotation / resizing, and switch on the moment a finger touches the screen
  useEffect(() => {
    const update = () => setShow((v) => v || wantsTouchControls())
    const onPointer = (e: globalThis.PointerEvent) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') setShow(true)
    }
    window.addEventListener('resize', update)
    window.addEventListener('pointerdown', onPointer, { passive: true })
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  // a finger sliding off a pad or the tab losing focus must never leave a control stuck on
  useEffect(
    () => () => {
      for (const c of ['forward', 'backward', 'left', 'right', 'brake'] as const) actions[c](false)
    },
    [actions],
  )

  if (!show) return null
  return (
    <div className="touch-controls">
      <div className="touch-group">
        <Pad control="left" label="◀" />
        <Pad control="right" label="▶" />
      </div>
      <div className="touch-group">
        <Pad control="brake" label="BRAKE" />
        <Pad control="forward" label="GAS" />
      </div>
    </div>
  )
}
