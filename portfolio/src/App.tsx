import React, { useState, useEffect, Suspense } from 'react';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';

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

const GamePage = React.lazy(() => import('./game/GamePage'));
export const preloadGame = () => import('./game/GamePage');

const sections = [
  'hero', 'specs', 'mission', 'skills', 'projects', 'awards', 'journey', 'github', 'contact',
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    const handleNavigate = (e: Event) => {
      const target = (e as CustomEvent).detail;
      if (target) {
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

  const isGameRoute = currentPath === '/dream-car' || currentPath === '/game';

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
      <AnimatePresence mode="wait">
        {isGameRoute ? (
          <Suspense key="game" fallback={<div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white text-xs tracking-widest uppercase">Initializing Engine...</div>}>
            <motion.div 
              className="fixed inset-0 z-50 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <GamePage />
            </motion.div>
          </Suspense>
        ) : (
          <motion.div 
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
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
