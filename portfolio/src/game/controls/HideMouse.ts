import { useEffect } from 'react'
import debounce from 'lodash-es/debounce'

export function HideMouse({ delay = 3000 }) {
  useEffect(() => {
    let isIdle = true

    const hideMouse = debounce(() => {
      isIdle = true
      document.documentElement.style.cursor = 'none'
    }, delay)

    const onMouseMovement = () => {
      if (isIdle) {
        isIdle = false
        document.documentElement.style.cursor = ''
      }
      hideMouse()
    }

    window.addEventListener('mousemove', onMouseMovement, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMovement)
      // a pending hide would otherwise fire after we've left and leave the portfolio with no cursor
      hideMouse.cancel()
      document.documentElement.style.cursor = ''
    }
  }, [delay])
  return null
}
