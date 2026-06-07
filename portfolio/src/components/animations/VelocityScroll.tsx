import React, { useRef } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

interface VelocityScrollProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  skewType?: 'skewY' | 'skewX';
}

export const VelocityScroll: React.FC<VelocityScrollProps> = ({ 
  children, 
  className = '', 
  intensity = 1,
  skewType = 'skewY' 
}) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Smooth out the velocity so the skew isn't jittery
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Map velocity to skew degrees. 
  // Max scroll velocity on mousewheel is usually around 1000-2000
  const skewAmount = useTransform(smoothVelocity, [-1000, 0, 1000], [2 * intensity, 0, -2 * intensity]);

  return (
    <motion.div 
      className={className}
      style={{ [skewType]: skewAmount }}
    >
      {children}
    </motion.div>
  );
};
