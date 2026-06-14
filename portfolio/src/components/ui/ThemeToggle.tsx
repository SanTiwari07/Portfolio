import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { actualTheme, setTheme } = useTheme();

  const isDark = actualTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div
      className="relative flex items-center justify-center w-[48px] h-[48px] rounded-full border"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, #333, #1a1a1a)'
          : 'linear-gradient(to bottom, #e5e5e5, #c0c0c0)',
        boxShadow: isDark
          ? '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
          : '0 2px 4px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.4)',
        borderColor: isDark ? '#444' : '#fff',
      }}
      title="Toggle light/dark theme"
    >
      {/* Deep socket */}
      <div
        className="absolute inset-[4px] rounded-full flex items-center justify-center border"
        style={{
          background: isDark ? '#050505' : '#ffffff',
          boxShadow: isDark
            ? 'inset 0 4px 8px rgba(0,0,0,0.8)'
            : 'inset 0 4px 8px rgba(0,0,0,0.05)',
          borderColor: isDark ? '#000' : '#e5e5e5',
        }}
      >
        {/* OFF Marker */}
        <div
          className="absolute top-[8px] left-[8px] w-[3px] h-[3px] rounded-full"
          style={{ background: '#9ca3af' }}
          aria-hidden="true"
        />

        {/* ON Marker */}
        <div
          className="absolute top-[8px] right-[8px] w-[4px] h-[4px] rounded-full transition-opacity duration-500"
          style={{
            background: 'var(--primary)',
            boxShadow: isDark ? '0 0 8px var(--primary)' : 'none',
            opacity: isDark ? 1 : 0.2,
          }}
          aria-hidden="true"
        />

        <button
          onClick={toggleTheme}
          data-cursor="hover"
          className="w-full h-full flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-primary"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-pressed={isDark}
        >
          {/* Ignition Key */}
          <motion.div
            className="relative w-[12px] h-[28px] rounded-t-[6px] rounded-b-[4px] flex flex-col items-center py-[3px]"
            style={{
              background: 'linear-gradient(to bottom, var(--primary), var(--primary-hover))',
              boxShadow: '0 3px 6px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.4)',
              border: '1px solid rgba(139, 0, 20, 0.5)',
            }}
            initial={false}
            animate={{ rotate: isDark ? 60 : -40 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
            aria-hidden="true"
          >
            {/* Key Ridges */}
            <div className="w-[6px] h-[1px] bg-white/40 rounded-full mb-[2px]" />
            <div className="w-[6px] h-[1px] bg-white/40 rounded-full mb-[2px]" />
            <div className="w-[6px] h-[1px] bg-white/40 rounded-full mb-[2px]" />

            {/* Bottom crest */}
            <div className="mt-auto w-[6px] h-[6px] rounded-full border border-white/30 flex items-center justify-center">
              <div className="w-[2px] h-[2px] rounded-full bg-white/60" />
            </div>
          </motion.div>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
