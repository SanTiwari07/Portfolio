import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const RevealText: React.FC<RevealTextProps> = ({ text, className = '', delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 16,
        stiffness: 100,
      },
    },
    hidden: {
      y: '120%',
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 16,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      style={{ display: 'inline-flex', flexWrap: 'wrap' }}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {words.map((word, index) => (
        <span key={index} className="overflow-hidden inline-flex" style={{ marginRight: '0.25em' }}>
          <motion.span variants={child} style={{ display: 'inline-block' }}>{word}</motion.span>
        </span>
      ))}
    </motion.span>
  );
};
