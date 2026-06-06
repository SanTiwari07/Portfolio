import React, { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';

// Core
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';

// Sections
import Hero from './components/Hero';
import About from './components/About';
import CurrentMission from './components/CurrentMission';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import Journey from './components/Journey';
import BuildInPublic from './components/BuildInPublic';
import Contact from './components/Contact';

const sections = [
  'hero', 'specs', 'mission', 'skills', 'projects', 'awards', 'journey', 'github', 'contact',
];

const App: React.FC = () => {
  const [loaderDone, setLoaderDone] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (!loaderDone) return;
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
  }, [loaderDone]);

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {!loaderDone && (
          <Loader onComplete={() => setLoaderDone(true)} />
        )}
      </AnimatePresence>

      {loaderDone && (
        <ReactLenis
          root
          options={{
            lerp: 0.08,
            duration: 1.4,
            smoothWheel: true,
          }}
        >
          <div className="relative bg-white min-h-screen selection:bg-[#7A1E2C] selection:text-white">
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
      )}
    </>
  );
};

export default App;
