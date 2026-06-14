import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

interface NavbarProps {
  activeSection: string;
}

const navItems = [
  { name: 'Skills', href: '#skills' },
  { name: 'Awards', href: '#awards' },
  { name: 'Journey', href: '#journey' },
  { name: 'Contact', href: '#contact' },
];

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-[100] transition-[padding,background-color,border-color,backdrop-filter] duration-500 ${
          isScrolled
            ? 'py-4 bg-background/90 backdrop-blur-xl border-b border-border-light'
            : 'py-7 bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.8 }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group flex items-center gap-3"
            data-cursor="hover"
            aria-label="Sanskar Tiwari — scroll to top"
          >
            <span className="font-bold text-sm tracking-[0.15em] uppercase text-text-primary">
              Sanskar Tiwari
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-10" role="menubar">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.name}
                  href={item.href}
                  role="menuitem"
                  data-cursor="hover"
                  aria-current={isActive ? 'true' : undefined}
                  className="relative text-xs font-semibold tracking-[0.2em] uppercase text-text-secondary hover:text-text-primary transition-colors duration-300 group py-2"
                >
                  <span className={`transition-colors duration-300 ${isActive ? 'text-text-primary' : ''}`}>
                    {item.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300 ease-out" aria-hidden="true" />
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-primary"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
            <ThemeToggle />
          </div>

          <button
            className="lg:hidden p-2 text-text-primary rounded-md focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setMobileMenuOpen(true)}
            data-cursor="hover"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[200] bg-background flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-7">
              <span className="font-bold text-sm tracking-[0.15em] uppercase text-text-primary">
                Sanskar Tiwari
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-md focus-visible:outline-2 focus-visible:outline-primary"
              >
                <X size={28} className="text-text-primary" aria-hidden="true" />
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <ThemeToggle />
            </div>

            <nav className="flex flex-col px-8 pt-16 gap-10">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-5xl font-black text-text-primary uppercase tracking-[-0.02em] hover:text-primary transition-colors duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.07 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto px-8 pb-12">
              <p className="text-xs text-text-secondary tracking-[0.3em] uppercase">
                Sanskar Tiwari · AI Systems Builder
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
