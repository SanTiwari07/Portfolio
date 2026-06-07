import React, { useEffect, useCallback } from 'react'
import { App as GameApp } from './App'
import { ArrowLeft } from 'lucide-react'
import './styles.css'

export default function GamePage() {
  const handleExit = useCallback(() => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }))
  }, [])

  useEffect(() => {
    // Add game specific resets to body
    const originalOverflow = document.body.style.overflow
    const originalMargin = document.body.style.margin
    const originalPadding = document.body.style.padding

    document.body.style.overflow = 'hidden'
    document.body.style.margin = '0'
    document.body.style.padding = '0'

    // Pressing 'Esc' releases pointer lock so the user can click the exit button.
    // Let's also allow pressing 'Escape' twice or when not locked to exit? 
    // Actually just an on-screen button is fine since Esc unlocks the mouse by default in PointerLock.

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = originalOverflow
      document.body.style.margin = originalMargin
      document.body.style.padding = originalPadding
    }
  }, [])

  return (
    <div className="game-root relative w-full h-full">
      <button 
        onClick={handleExit}
        className="absolute top-6 left-6 z-[100] flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all duration-300 border border-white/10 group cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium tracking-wide">Return to Portfolio</span>
      </button>
      
      <GameApp />
    </div>
  )
}
