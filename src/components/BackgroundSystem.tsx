import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundSystem: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    
    const updateMousePosition = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
      
      {/* Topographical Lines Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-38 340C12 360 48 316 120 306 192 296 242 334 316 338 390 342 458 318 534 306 610 294 676 292 730 310 784 328 828 368 860 380' stroke='rgba(0,0,0,0.2)' fill='none' stroke-width='1.5'/%3E%3Cpath d='M-24 532C30 528 88 474 156 462 224 450 286 480 348 480 410 480 448 458 514 438 580 418 644 402 710 404 776 406 828 412 858 436' stroke='rgba(0,0,0,0.2)' fill='none' stroke-width='1.5'/%3E%3Cpath d='M-46 128C10 128 70 82 144 88 218 94 286 150 358 148 430 146 500 88 574 80 648 72 724 104 782 118 840 132 878 132 894 136' stroke='rgba(0,0,0,0.2)' fill='none' stroke-width='1.5'/%3E%3Cpath d='M-18 732C24 732 66 690 128 662 190 634 250 622 322 612 394 602 470 600 538 584 606 568 678 522 748 506 818 490 878 506 908 530' stroke='rgba(0,0,0,0.2)' fill='none' stroke-width='1.5'/%3E%3Cpath d='M-88 238C-28 250 22 226 86 208 150 190 220 186 288 190 356 194 404 200 464 212 524 224 576 250 640 248 704 246 786 210 848 184' stroke='rgba(0,0,0,0.2)' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100% 100%',
        }}
      />

      {/* Subtle Noise */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cursor-reactive blob gradient (Light version) */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] bg-primary/20 mix-blend-multiply"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{
          type: 'tween',
          ease: 'easeOut',
          duration: 1.5,
        }}
      />
    </div>
  );
};

export default BackgroundSystem;
