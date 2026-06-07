import { useEffect, useState } from 'react'
import { useStore } from '../store'

export function Recovery() {
  const [recoveryState, actions] = useStore((state) => [state.recoveryState, state.actions])
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (recoveryState === 'flip' || recoveryState === 'stuck') {
      setShowPrompt(true)
    } else {
      setShowPrompt(false)
    }
  }, [recoveryState])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        if (e.shiftKey) {
          actions.restartRun()
        } else {
          actions.recoverVehicle()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [actions])

  if (!showPrompt) return null

  return (
    <div className="recovery-overlay">
      <div className="recovery-container">
        <h2>Vehicle Recovery Available</h2>
        <p className="recovery-desc">
          {recoveryState === 'flip' ? 'Your vehicle appears to have rolled over.' : 'Your vehicle appears to be stuck.'}
        </p>
        <div className="recovery-buttons">
          <button className="recovery-btn primary" onClick={() => actions.recoverVehicle()}>
            <span className="key">R</span> Recover Vehicle
          </button>
          <button className="recovery-btn secondary" onClick={() => actions.restartRun()}>
            <span className="key">⇧ R</span> Restart Run
          </button>
        </div>
      </div>
    </div>
  )
}
