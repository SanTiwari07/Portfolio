import React, { useState, useEffect, Suspense } from 'react';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';

// Core
import Loader from './components/ui/Loader';
import CustomCursor from './components/ui/CustomCursor';
import Navbar from './components/layout/Navbar';

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
  const [loaderDone, setLoaderDone] = useState(false);
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
    if (!loaderDone || isGameRoute) return;
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
  }, [loaderDone, isGameRoute]);

  return (
    <ThemeProvider>
      <CustomCursor />

      <AnimatePresence mode="wait">
        {!loaderDone && (
          <Loader key="loader" onComplete={() => setLoaderDone(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isGameRoute && loaderDone ? (
          <motion.div 
            key="game" 
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-black text-white text-xs tracking-widest uppercase">Initializing Engine...</div>}>
              <GamePage />
            </Suspense>
          </motion.div>
        ) : loaderDone ? (
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
                lerp: 0.08,
                duration: 1.4,
                smoothWheel: true,
              }}
            >
              <div className="relative bg-background min-h-screen selection:bg-primary selection:text-card transition-colors duration-700">
                <Navbar activeSection={activeSection} />

                <main>
                  <section id="hero" className="w-full h-screen relative">
                    <Hero />
                  </section>
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
        ) : null}
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default App;
