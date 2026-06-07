import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // negative moves faster (foreground), positive moves slower (background)
}

export const Parallax: React.FC<ParallaxProps> = ({ 
  children, 
  className = '', 
  speed = 1 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Calculate the movement based on the speed multiplier
  // speed = 1 means it moves 10% of its total height up/down
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -10}%`, `${speed * 10}%`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div 
        style={{ y }} 
        className="w-full h-full scale-[1.15] origin-center"
      >
        {children}
      </motion.div>
    </div>
  );
};
