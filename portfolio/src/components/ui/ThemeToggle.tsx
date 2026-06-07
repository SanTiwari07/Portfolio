import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  // If theme is 'system', we'll just toggle to explicit 'light' or 'dark' on click.
  const isDark = actualTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div 
      className="relative flex items-center justify-center w-[48px] h-[48px] rounded-full bg-gradient-to-b from-[#e5e5e5] to-[#c0c0c0] dark:from-[#333] dark:to-[#1a1a1a] shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[#fff] dark:border-[#444]"
      title="Porsche Ignition Toggle"
    >
      {/* Deep socket */}
      <div className="absolute inset-[4px] rounded-full bg-white dark:bg-[#050505] shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] flex items-center justify-center border border-gray-200 dark:border-black">
        
        {/* OFF Marker */}
        <div className="absolute top-[8px] left-[8px] w-[3px] h-[3px] rounded-full bg-gray-400 shadow-[0_0_2px_rgba(255,255,255,0.3)]" />
        
        {/* ON Marker */}
        <div className={`absolute top-[8px] right-[8px] w-[4px] h-[4px] rounded-full bg-primary transition-all duration-500 ${isDark ? 'shadow-[0_0_8px_var(--color-primary)] opacity-100' : 'opacity-20'}`} />

        <button
          onClick={toggleTheme}
          data-cursor="hover"
          className="w-full h-full flex items-center justify-center rounded-full outline-none"
          aria-label="Toggle Theme"
        >
          {/* The Dummy Key */}
          <motion.div
            className="relative w-[12px] h-[28px] bg-gradient-to-b from-primary to-primary-hover rounded-t-[6px] rounded-b-[4px] flex flex-col items-center py-[3px] shadow-[0_3px_6px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-red-800/50"
            initial={false}
            animate={{ 
              rotate: isDark ? 60 : -40 
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              mass: 0.8
            }}
          >
            {/* Key Ridges (Grip) */}
            <div className="w-[6px] h-[1px] bg-white/40 rounded-full mb-[2px] shadow-[0_1px_0_rgba(0,0,0,0.2)]" />
            <div className="w-[6px] h-[1px] bg-white/40 rounded-full mb-[2px] shadow-[0_1px_0_rgba(0,0,0,0.2)]" />
            <div className="w-[6px] h-[1px] bg-white/40 rounded-full mb-[2px] shadow-[0_1px_0_rgba(0,0,0,0.2)]" />
            
            {/* Bottom crest */}
            <div className="mt-auto w-[6px] h-[6px] rounded-full border border-white/30 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
              <div className="w-[2px] h-[2px] rounded-full bg-white/60" />
            </div>
          </motion.div>
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
