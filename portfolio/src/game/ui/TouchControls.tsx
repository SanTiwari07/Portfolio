import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

import { wantsTouchControls } from '../../lib/device'
import { requestTiltAccess, tiltSupported, useTilt } from '../controls/tilt'
import { useStore } from '../store'
import type { Controls } from '../store'

type Mode = 'buttons' | 'tilt'

const STORAGE_KEY = 'dream-car-controls'

const readMode = (): Mode | null => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'buttons') return 'buttons'
    // iOS asks for motion access again every visit and only from a tap, so a remembered "tilt" has to go through the choice screen
    const needsTap = typeof (window.DeviceOrientationEvent as unknown as { requestPermission?: unknown })?.requestPermission === 'function'
    if (v === 'tilt' && !needsTap && tiltSupported()) return 'tilt'
  } catch {
    /* storage blocked */
  }
  return null
}

const saveMode = (mode: Mode) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    /* storage blocked */
  }
}

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

/** On-screen controls for phones and tablets: touch buttons, or tilt the phone like a steering wheel. */
export function TouchControls() {
  const [actions, ready] = useStore((s) => [s.actions, s.ready])
  const [show, setShow] = useState(wantsTouchControls)
  const [mode, setMode] = useState<Mode | null>(readMode)
  const [notice, setNotice] = useState<string | null>(null)
  const dotRef = useRef<HTMLSpanElement>(null)

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

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 6000)
    return () => clearTimeout(t)
  }, [notice])

  const fallBackToButtons = useCallback((why?: string) => {
    setMode('buttons')
    if (why) setNotice(why)
  }, [])

  const { recenter } = useTilt({
    enabled: show && mode === 'tilt',
    onUnavailable: () => fallBackToButtons("Tilt isn't available on this device, so the buttons are on."),
    dotRef,
  })

  const chooseTilt = async () => {
    const access = await requestTiltAccess()
    if (access === 'granted') {
      setMode('tilt')
      saveMode('tilt')
      setNotice('Lean forward to go, back to reverse, left or right to steer. Tap the ring to re-centre.')
    } else if (access === 'denied') {
      fallBackToButtons('Motion access was blocked, so the buttons are on. Allow it in your browser settings to use tilt.')
    } else {
      fallBackToButtons("Tilt isn't available on this device, so the buttons are on.")
    }
  }

  const chooseButtons = () => {
    setMode('buttons')
    saveMode('buttons')
    setNotice(null)
  }

  if (!show) return null

  // first visit: ask, once the car is on the road
  if (mode === null && ready) {
    return (
      <div className="control-sheet" role="dialog" aria-modal="true" aria-label="Choose how to drive">
        <div className="control-sheet-card">
          <h2>How do you want to drive?</h2>
          <button type="button" className="control-option" onClick={chooseButtons}>
            <strong>Touch buttons</strong>
            <span>◀ ▶ to steer, GAS and BRAKE with your thumbs.</span>
          </button>
          {tiltSupported() && (
            <button type="button" className="control-option" onClick={chooseTilt}>
              <strong>Tilt your phone</strong>
              <span>Lean forward to go, back to reverse, left or right to steer.</span>
            </button>
          )}
          <p>You can switch any time with the control button on the left.</p>
        </div>
      </div>
    )
  }
  if (mode === null) return null

  return (
    <>
      <button
        type="button"
        className="touch-mode"
        onClick={() => (mode === 'tilt' ? chooseButtons() : chooseTilt())}
        aria-label={mode === 'tilt' ? 'Switch to touch buttons' : 'Switch to tilt steering'}
      >
        {mode === 'tilt' ? 'Tilt' : 'Buttons'} <span aria-hidden="true">⇄</span>
      </button>

      {notice && (
        <p className="control-notice" role="status">
          {notice}
        </p>
      )}

      <div className="touch-controls">
        {mode === 'tilt' ? (
          <>
            <div className="touch-group">
              <button type="button" className="tilt-pad" onClick={recenter} aria-label="Re-centre tilt">
                <span className="tilt-ring" aria-hidden="true" />
                <span className="tilt-dot" ref={dotRef} aria-hidden="true" />
                <span className="tilt-label">CENTRE</span>
              </button>
            </div>
            <div className="touch-group">
              <Pad control="brake" label="BRAKE" />
            </div>
          </>
        ) : (
          <>
            <div className="touch-group">
              <Pad control="left" label="◀" />
              <Pad control="right" label="▶" />
            </div>
            <div className="touch-group">
              <Pad control="brake" label="BRAKE" />
              <Pad control="forward" label="GAS" />
            </div>
          </>
        )}
      </div>
    </>
  )
}
