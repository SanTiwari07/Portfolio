import { Suspense, useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

import type { ReactNode } from 'react'

import { useStore } from '../store'
import { setupSession } from '../data'

const steps = [
  "Loading Vehicle",
  "Loading Physics",
  "Loading Track"
];

export function Intro({ children }: { children: ReactNode }): JSX.Element {
  const [clicked, setClicked] = useState(false)
  const [loading, setLoading] = useState(true)
  const { progress } = useProgress()
  const [session, set] = useStore((state) => [state.session, state.set])

  const [visualSequenceDone, setVisualSequenceDone] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // 1.8s total sequence
    const intervals = [600, 600, 600]; 
    let active = true;
    
    const runSequence = async () => {
      for (let i = 0; i < intervals.length; i++) {
        if (!active) return;
        setStepIndex(i);
        await new Promise(r => setTimeout(r, intervals[i]));
      }
      if (active) {
        setVisualSequenceDone(true);
      }
    };
    runSequence();
    return () => { active = false };
  }, []);

  useEffect(() => {
    if (visualSequenceDone && progress === 100) {
      setLoading(false);
      setStepIndex(3); // 100%
    }
  }, [visualSequenceDone, progress]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        setClicked(true);
        set({ ready: true });
      }, 500); // Hold at 100% for 0.5s before dismissing
      return () => clearTimeout(t);
    }
  }, [loading, set]);

  useEffect(() => {
    setupSession(set)
  }, [set])

  return (
    <>
      <Suspense fallback={null}>{children}</Suspense>
      <AnimatePresence>
        {!clicked && (
          <motion.div 
            className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white font-mono"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          >
            <div className="text-center w-full max-w-md px-8">
              <h2 className="text-lg md:text-2xl mb-12 tracking-[0.2em] text-gray-400">INITIALIZING EXPERIENCE</h2>
              
              <div className="h-8 mb-4">
                <p className="text-base md:text-lg tracking-[0.1em] uppercase">
                  {stepIndex < 3 ? steps[stepIndex] : "100% READY"}
                  {stepIndex < 3 && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >...</motion.span>
                  )}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-[1px] bg-white/20 mt-4 overflow-hidden">
                <motion.div 
                  className="h-full bg-white" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.max((stepIndex / 3) * 100, progress)}%` }}
                  transition={{ ease: "linear", duration: 0.3 }}
                />
              </div>

              {/* Controls Help */}
              <motion.p 
                className="mt-16 text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                Controls: W A S D / Arrows • Space to Brake • R to Reset
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
