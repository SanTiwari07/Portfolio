import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
}

const navItems = [
  { name: 'Work', href: '#projects' },
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'py-4 bg-white/90 backdrop-blur-xl border-b border-gray-100'
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
          >
            <div className="w-8 h-8 bg-[#7A1E2C] flex items-center justify-center">
              <span className="text-white text-xs font-black tracking-tight leading-none">S.T</span>
            </div>
            <span className="font-bold text-sm tracking-[0.15em] uppercase text-black transition-colors duration-300">
              Sanskar Tiwari
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.name}
                  href={item.href}
                  data-cursor="hover"
                  className="relative text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors duration-300 group py-2"
                >
                  <span className={`transition-colors duration-300 ${isActive ? 'text-black' : ''}`}>
                    {item.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#7A1E2C] group-hover:w-full transition-all duration-400 ease-out" />
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-[#7A1E2C]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
            <a
              href="mailto:sanskartiwari.smt2@gmail.com"
              data-cursor="hover"
              className="ml-4 px-5 py-2.5 bg-black text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#7A1E2C] transition-colors duration-300"
            >
              Say Hello
            </a>
          </div>

          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setMobileMenuOpen(true)}
            data-cursor="hover"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[200] bg-white flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-7">
              <div className="w-8 h-8 bg-[#7A1E2C] flex items-center justify-center">
                <span className="text-white text-xs font-black">S.T</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={28} className="text-black" />
              </button>
            </div>

            <div className="flex flex-col px-8 pt-16 gap-10">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-5xl font-black text-black uppercase tracking-[-0.02em] hover:text-[#7A1E2C] transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.07 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            <div className="mt-auto px-8 pb-12">
              <p className="text-xs text-gray-400 tracking-[0.3em] uppercase">
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
