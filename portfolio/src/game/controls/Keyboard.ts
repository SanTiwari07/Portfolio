import { useEffect } from 'react'
import { keys } from '../keys'
import { isControl, useStore } from '../store'
import type { BindableActionName } from '../store'

// Keys the browser would otherwise act on (scroll the page, "click" a focused button).
const SWALLOWED = new Set([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'])

export function Keyboard() {
  const [actionInputMap, actions, binding] = useStore(({ actionInputMap, actions, binding }) => [actionInputMap, actions, binding])

  useEffect(() => {
    if (binding) return
    const keyMap: Partial<Record<string, BindableActionName>> = keys(actionInputMap).reduce(
      (out, actionName) => ({ ...out, ...actionInputMap[actionName].reduce((inputs, input) => ({ ...inputs, [input]: actionName }), {}) }),
      {},
    )

    const releaseAll = () => {
      for (const name of ['forward', 'backward', 'left', 'right', 'brake', 'honk'] as const) actions[name](false)
    }

    const downHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const key = e.key.toLowerCase()
      const actionName = keyMap[key]
      if (!actionName || (e.target as HTMLElement).nodeName === 'INPUT' || !isControl(actionName)) return
      // Space is the brake: without this it also "clicks" whichever button last had focus.
      if (SWALLOWED.has(key)) e.preventDefault()
      actions[actionName](true)
    }

    const upHandler = (e: KeyboardEvent) => {
      const actionName = keyMap[e.key.toLowerCase()]
      if (!actionName || (e.target as HTMLElement).nodeName === 'INPUT') return
      actions[actionName](false)
    }

    // Alt-tabbing away swallows the keyup, which left the car accelerating (or steering) forever.
    const onVisibility = () => document.hidden && releaseAll()

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    window.addEventListener('blur', releaseAll)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
      window.removeEventListener('blur', releaseAll)
      document.removeEventListener('visibilitychange', onVisibility)
      releaseAll()
    }
  }, [actionInputMap, actions, binding])

  return null
}
