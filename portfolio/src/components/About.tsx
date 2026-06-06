import React, { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portraitUrl from '../../../old portfolio/Hero Image/Main Image (1).png?url';
import backgroundUrl from '../../../old portfolio/Hero Image/Second Image (1).png?url';

gsap.registerPlugin(ScrollTrigger);

interface StatProps {
  value: string;
  label: string;
  sublabel?: string;
}

function StatBlock({ value, label, sublabel }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');
  const count = useMotionValue(0);
  const springCount = useSpring(count, { damping: 40, stiffness: 80 });
  const displayCount = useTransform(springCount, (v) =>
    Number.isInteger(numericValue)
      ? Math.round(v) + suffix
      : v.toFixed(2) + suffix
  );

  useEffect(() => {
    if (isInView) {
      count.set(numericValue);
    }
  }, [isInView, numericValue, count]);

  return (
    <div ref={ref} className="group relative py-10 border-l border-gray-100 pl-8">
      <div className="absolute left-0 top-0 h-0 w-[2px] bg-[#7A1E2C] group-hover:h-full transition-all duration-700 ease-out" />
      <motion.div
        className="text-[clamp(48px,6vw,80px)] font-black tracking-[-0.03em] text-black leading-none counter-number"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {isInView ? <motion.span>{displayCount}</motion.span> : '0'}
      </motion.div>
      <motion.p
        className="text-xs tracking-[0.35em] uppercase text-gray-500 mt-2 font-medium"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {label}
      </motion.p>
      {sublabel && (
        <motion.p
          className="text-[10px] tracking-[0.2em] uppercase text-[#7A1E2C] mt-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {sublabel}
        </motion.p>
      )}
    </div>
  );
}

function FloatingBadge({ title, top, left, right, bottom, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="absolute z-30 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_15px_35px_rgba(0,0,0,0.1)] px-5 py-3 rounded-full hidden md:block"
      style={{ top, left, right, bottom }}
    >
      <span className="text-[10px] md:text-xs font-black text-black tracking-widest uppercase">{title}</span>
    </motion.div>
  );
}

function InteractivePortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Default values set far off-screen so the mask doesn't start in the middle
  const x = useMotionValue(-1);
  const y = useMotionValue(-1);
  
  const springConfig = { damping: 40, stiffness: 120, mass: 1.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Softer spring for the spotlight mask to create an elegant trailing effect
  const maskSpringConfig = { damping: 30, stiffness: 80, mass: 1.2 };
  const maskSpringX = useSpring(x, maskSpringConfig);
  const maskSpringY = useSpring(y, maskSpringConfig);

  // Core container rotation (Increased for more dramatic 3D effect)
  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);
  
  // Foreground parallax (moves with mouse)
  const translateX = useTransform(springX, [0, 1], [-25, 25]);
  const translateY = useTransform(springY, [0, 1], [-25, 25]);
  
  // Spotlight Mask template (Massively increased radius to 400px so more of the image reveals)
  const maskX = useTransform(maskSpringX, [-1, 0, 1], ['-100%', '0%', '100%']);
  const maskY = useTransform(maskSpringY, [-1, 0, 1], ['-100%', '0%', '100%']);
  const maskImage = useMotionTemplate`radial-gradient(400px at ${maskX} ${maskY}, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)`;

  // Shadow movement (opposite to light)
  const shadowX = useTransform(springX, [0, 1], [30, -30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    // Send the mask far away so it fades out completely
    x.set(-2);
    y.set(-2);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center overflow-visible"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        className="relative w-full h-full flex items-center justify-center z-10 scale-[1.15] md:scale-[1.3] -translate-y-12 md:-translate-y-16"
      >
        {/* Soft Drop Shadow for physical grounding */}
        <motion.div 
          className="absolute bottom-10 w-[60%] h-8 bg-black/30 blur-[25px] rounded-[100%] z-0"
          style={{ x: shadowX }}
        />

        {/* The Base Portrait (Image 1) */}
        <motion.img 
          src={portraitUrl} 
          alt="Sanskar Tiwari" 
          className="relative z-10 w-full h-full object-contain object-center drop-shadow-2xl pointer-events-none" 
          style={{
            x: translateX,
            y: translateY,
          }}
        />

        {/* The Revealed Portrait (Image 2) with Cursor Masking */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none hidden md:block"
          style={{
            x: translateX,
            y: translateY,
            maskImage: maskImage,
            WebkitMaskImage: maskImage,
          }}
        >
          {/* Full color reveal image */}
          <img 
            src={backgroundUrl} 
            alt="Sanskar Tiwari Alternate" 
            className="w-full h-full object-contain object-center pointer-events-none" 
          />
        </motion.div>

        {/* Floating Badges */}
        <FloatingBadge title="9.38 CGPA" top="20%" left="0%" delay={0.2} />
        <FloatingBadge title="99.34% MHTCET" top="45%" right="-10%" delay={0.3} />
        <FloatingBadge title="Software Eng Intern" bottom="25%" left="-5%" delay={0.4} />
        <FloatingBadge title="4× Awardee" bottom="15%" right="0%" delay={0.5} />
      </motion.div>
    </div>
  );
}

const PerformanceSpecs: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  return (
    <section ref={sectionRef} id="specs" className="relative w-full overflow-hidden bg-[#FAFAFA]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-32 md:py-40">
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-[1px] bg-[#7A1E2C]" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 font-medium">02 / Performance</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="w-full">
            <div className="overflow-hidden mb-4">
              <motion.h2
                className="text-[clamp(40px,5vw,90px)] font-black tracking-[-0.03em] text-black leading-[0.9] uppercase break-words"
                initial={{ y: '100%' }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                Engineered
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-12">
              <motion.h2
                className="text-[clamp(40px,5vw,90px)] font-black tracking-[-0.03em] text-[#7A1E2C] leading-[0.9] uppercase break-words"
                initial={{ y: '100%' }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                for Performance.
              </motion.h2>
            </div>

            <motion.p
              className="text-base text-gray-500 max-w-md leading-relaxed mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Every metric a reflection of systems thinking, relentless building, and a commitment to real-world impact.
            </motion.p>

            <div className="grid grid-cols-2 gap-0">
              <StatBlock value="9.38" label="CGPA" sublabel="ENTC · PICT" />
              <StatBlock value="12+" label="Systems Built" />
              <StatBlock value="4+" label="Hackathon Podiums" />
              <div className="group relative py-10 border-l border-gray-100 pl-8">
                <div className="absolute left-0 top-0 h-0 w-[2px] bg-[#7A1E2C] group-hover:h-full transition-all duration-700 ease-out" />
                <div className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">Current Role</div>
                <div className="text-lg font-black text-black uppercase tracking-tight leading-tight">Software<br />Engineer Intern</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#7A1E2C] mt-2">MindstriX Technologies</div>
              </div>
            </div>
          </div>

          <div className="relative w-full overflow-visible">
            <InteractivePortrait />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSpecs;
