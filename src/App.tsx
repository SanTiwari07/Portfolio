
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import BuildInPublic from './components/BuildInPublic';
import Platforms from './components/Platforms';
import Journey from './components/Journey';
import Contact from './components/Contact';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'build', 'platforms', 'journey', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      <Navbar activeSection={activeSection} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 md:pt-20">
        <section id="hero" className="min-h-[70vh] md:min-h-[80vh] flex items-center mb-12 md:mb-24">
          <Hero />
        </section>

        <section id="about" className="py-16 md:py-24 border-t border-white/5">
          <About />
        </section>

        <section id="skills" className="py-16 md:py-24 border-t border-white/5">
          <Skills />
        </section>

        <section id="projects" className="py-16 md:py-24 border-t border-white/5">
          <Projects />
        </section>

        <section id="build" className="py-16 md:py-24 border-t border-white/5">
          <BuildInPublic />
        </section>

        <section id="platforms" className="py-16 md:py-24 border-t border-white/5">
          <Platforms />
        </section>

        <section id="journey" className="py-16 md:py-24 border-t border-white/5">
          <Journey />
        </section>

        <section id="contact" className="py-16 md:py-24 border-t border-white/5">
          <Contact />
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-sm text-gray-500">
        <p className="mono">&copy; {new Date().getFullYear()} / Built with intention / Student Engineer</p>
      </footer>
    </div>
  );
};

export default App;
