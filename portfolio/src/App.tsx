import React, { useState, useEffect, useLayoutEffect, useRef, Suspense } from 'react';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { GAME_PATHS, GamePage, preloadGame } from './lib/game';
import { isLowPower } from './lib/device';

// Core
import Navbar from './components/layout/Navbar';
import RoadRail from './components/layout/RoadRail';

// Sections
import Hero from './sections/Hero';
import About from './sections/About';
import CurrentMission from './sections/CurrentMission';
import Skills from './sections/Skills';
import Achievements from './sections/Achievements';
import Journey from './sections/Journey';
import BuildInPublic from './sections/BuildInPublic';
import Contact from './sections/Contact';

export { preloadGame };

const sections = [
  'hero', 'specs', 'mission', 'skills', 'projects', 'awards', 'journey', 'github', 'contact',
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const savedScroll = useRef(0);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    const handleNavigate = (e: Event) => {
      const target = (e as CustomEvent).detail;
      if (target && target !== window.location.pathname) {
        // leaving the portfolio: remember where we were so "Return to Portfolio" lands back there
        if (!GAME_PATHS.includes(window.location.pathname)) savedScroll.current = window.scrollY;
        window.history.pushState({}, '', target);
        setCurrentPath(target);
      }
    };
    window.addEventListener('navigate', handleNavigate);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  const isGameRoute = GAME_PATHS.includes(currentPath);

  // Warm the game chunk once the page has settled, so clicking the CTA is instant.
  useEffect(() => {
    if (isLowPower || isGameRoute) return;
    const warm = () => void preloadGame();
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 2500);
    return () => clearTimeout(id);
  }, [isGameRoute]);

  // Coming back from the game: the page was unmounted (so the browser reset scroll to the top) — put it back.
  useLayoutEffect(() => {
    if (isGameRoute || !savedScroll.current) return;
    const y = savedScroll.current;
    savedScroll.current = 0;
    window.scrollTo(0, y);
    requestAnimationFrame(() => window.scrollTo(0, y));
  }, [isGameRoute]);

  useEffect(() => {
    if (isGameRoute) return;
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isGameRoute]);

  return (
    <ThemeProvider>
      <AnimatePresence initial={false}>
        {isGameRoute ? (
          <Suspense key="game" fallback={<div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white text-xs tracking-widest uppercase">Initializing Engine...</div>}>
            <motion.div 
              className="fixed inset-0 z-50 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <GamePage />
            </motion.div>
          </Suspense>
        ) : (
          <motion.div 
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <ReactLenis
              root
              options={{
                lerp: 0.1,
                smoothWheel: true,
                anchors: true,
              }}
            >
              <div className="relative bg-background min-h-screen selection:bg-primary selection:text-card transition-colors duration-700">
                <Navbar activeSection={activeSection} />
                <RoadRail />

                <main>
                  <Hero />
                  <About />
                  <CurrentMission />
                  <Skills />
                  <Achievements />
                  <Journey />
                  <BuildInPublic />
                  <Contact />
                </main>
              </div>
            </ReactLenis>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default App;
