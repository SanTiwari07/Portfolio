import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  // If theme is 'system', we'll just toggle to explicit 'light' or 'dark' on click.
  const isDark = actualTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      data-cursor="hover"
      className="relative flex items-center justify-between w-[120px] h-[36px] bg-gray-100 dark:bg-[#1A1A1A] rounded-full p-1 cursor-none overflow-hidden border border-gray-200 dark:border-[#333] transition-colors duration-500 hover:border-gray-300 dark:hover:border-[#444]"
      aria-label="Toggle Theme"
    >
      <div className="absolute inset-0 pointer-events-none rounded-full shadow-inner" />
      
      {/* Background slide animation */}
      <motion.div
        className="absolute top-1 bottom-1 w-[50%] bg-white dark:bg-[#333] rounded-full shadow-sm"
        animate={{
          left: isDark ? 'auto' : '4px',
          right: isDark ? '4px' : 'auto',
          x: isDark ? '98%' : '0%',
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ originX: 0.5 }}
      />

      <span
        className={`relative z-10 w-1/2 text-center text-[10px] font-bold tracking-widest transition-colors duration-500 ${
          !isDark ? 'text-black' : 'text-gray-500'
        }`}
      >
        LIGHT
      </span>
      <span
        className={`relative z-10 w-1/2 text-center text-[10px] font-bold tracking-widest transition-colors duration-500 ${
          isDark ? 'text-white' : 'text-gray-400'
        }`}
      >
        DARK
      </span>
    </button>
  );
};

export default ThemeToggle;
