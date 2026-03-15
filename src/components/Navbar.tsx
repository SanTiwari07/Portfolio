import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

interface NavbarProps {
  activeSection: string;
}

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Toolkit', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Build In Public', href: '#build' },
  { name: 'Presence', href: '#platforms' },
  { name: 'Contact', href: '#contact' }
];

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        className={clsx(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          isScrolled ? "py-4 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)]" : "py-6 bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 flex items-center justify-between">
          
          {/* Logo */}
          <a 
            href="#hero" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative group flex items-center gap-2"
          >
            <span className="font-heading font-black text-2xl tracking-tighter text-gray-950 uppercase">HOME</span>
            <div className="w-2.5 h-2.5 bg-primary group-hover:scale-150 group-hover:shadow-[0_0_10px_rgba(33,150,243,0.5)] transition-all duration-300" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative text-sm font-bold tracking-wide transition-colors duration-300 hover:text-primary group py-2 uppercase font-heading"
                >
                  <span className={clsx(
                    "relative z-10 transition-colors duration-300",
                    isActive ? "text-gray-950" : "text-gray-500"
                  )}>
                    {item.name}
                  </span>
                  
                  {/* Hover Underline */}
                  <span className="absolute bottom-1 left-0 w-0 h-[3px] bg-primary group-hover:w-full transition-all duration-300 ease-out opacity-0 group-hover:opacity-100" />
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.span 
                      layoutId="activeNav"
                      className="absolute bottom-1 left-0 w-full h-[3px] bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors cursor-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button 
              className="absolute top-6 right-6 p-4 text-gray-500 hover:text-gray-900 transition-colors cursor-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={40} />
            </button>

            <div className="flex flex-col items-center gap-8 w-full max-w-sm px-6">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-heading font-black text-gray-800 hover:text-primary transition-colors relative group uppercase tracking-tighter"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  {item.name}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[4px] bg-primary group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
