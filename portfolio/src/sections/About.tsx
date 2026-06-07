import React, { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { VelocityScroll } from '../components/animations/VelocityScroll';
import { RevealText } from '../components/animations/RevealText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portraitUrl from '/images/hero/portrait.png';
import backgroundUrl from '/images/hero/background.png';

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
    <div ref={ref} className="group relative py-10 border-l border-border-light pl-8 transition-colors duration-700">
      <div className="absolute left-0 top-0 h-0 w-[2px] bg-primary group-hover:h-full transition-all duration-700 ease-out" />
      <motion.div
        className="text-[clamp(48px,6vw,80px)] font-black tracking-[-0.03em] text-text-primary leading-none counter-number transition-colors duration-700"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {isInView ? <motion.span>{displayCount}</motion.span> : '0'}
      </motion.div>
      <motion.p
        className="text-xs tracking-[0.35em] uppercase text-text-secondary mt-2 font-medium transition-colors duration-700"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {label}
      </motion.p>
      {sublabel && (
        <motion.p
          className="text-[10px] tracking-[0.2em] uppercase text-primary mt-1 transition-colors duration-700"
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

interface FloatingBadgeProps {
  title: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay: number;
}

function FloatingBadge({ title, top, left, right, bottom, delay }: FloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="absolute z-30 bg-card/70 backdrop-blur-xl border border-border-light/40 shadow-[0_15px_35px_rgba(0,0,0,0.1)] px-5 py-3 rounded-full hidden md:block transition-colors duration-700"
      style={{ top, left, right, bottom }}
    >
      <span className="text-[10px] md:text-xs font-black text-text-primary tracking-widest uppercase transition-colors duration-700">{title}</span>
    </motion.div>
  );
}

function InteractivePortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track mouse coordinates in pixels relative to container
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  
  // Core parallax springs
  const springConfig = { damping: 40, stiffness: 120, mass: 1.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Softer spring for the mask to create a luxury trailing effect
  const maskSpringConfig = { damping: 30, stiffness: 60, mass: 1.5 };
  const maskSpringX = useSpring(x, maskSpringConfig);
  const maskSpringY = useSpring(y, maskSpringConfig);

  // Rotation
  const rotateX = useTransform(springY, (v) => {
    if (!containerRef.current) return 0;
    return ((v / containerRef.current.clientHeight) - 0.5) * -10;
  });
  const rotateY = useTransform(springX, (v) => {
    if (!containerRef.current) return 0;
    return ((v / containerRef.current.clientWidth) - 0.5) * 10;
  });

  // Spotlight Mask template (Feathered edges, 800px radius)
  const maskImage = useMotionTemplate`radial-gradient(800px circle at ${maskSpringX}px ${maskSpringY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`;


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(-1000);
    y.set(-1000);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center overflow-visible group"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center z-10 scale-[1.0] md:scale-[1.1]"
      >
        {/* Soft Drop Shadow for physical grounding */}
        <div 
          className="absolute bottom-4 w-[80%] h-12 bg-black/30 blur-[30px] rounded-[100%] z-0"
        />

        {/* Base Layer: Image 1 (Professional Portrait) */}
        <div className="absolute inset-0 z-10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-border-light/20 bg-background">
          <img 
            src={portraitUrl} 
            alt="Sanskar Tiwari - Professional" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mobile Static Blend (Disabled on Desktop) */}
        <div className="absolute inset-0 z-20 rounded-[2rem] overflow-hidden md:hidden opacity-40 mix-blend-overlay pointer-events-none">
          <img 
            src={backgroundUrl} 
            alt="Sanskar Tiwari - Blend" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Reveal Layer: Image 2 (Alternative Portrait) - Masked */}
        <motion.div 
          className="absolute inset-0 z-20 rounded-[2rem] overflow-hidden hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ WebkitMaskImage: maskImage, maskImage }}
        >
          <img 
            src={backgroundUrl} 
            alt="Sanskar Tiwari - Alternative" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating Badges */}
        <FloatingBadge title="9.38 CGPA" top="15%" left="-5%" delay={0.2} />
        <FloatingBadge title="99.34% MHTCET" top="40%" right="-10%" delay={0.3} />
        <FloatingBadge title="Software Eng Intern" bottom="20%" left="-8%" delay={0.4} />
        <FloatingBadge title="4× Awardee" bottom="10%" right="-5%" delay={0.5} />
      </motion.div>
    </div>
  );
}

const PerformanceSpecs: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  return (
    <section ref={sectionRef} id="specs" className="relative w-full overflow-hidden bg-background transition-colors duration-700">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-32 md:py-40">
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-[1px] bg-primary transition-colors duration-700" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-text-secondary font-medium transition-colors duration-700">02 / Performance</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="w-full">
            <div className="overflow-hidden mb-4">
              <VelocityScroll intensity={0.5}>
                <RevealText 
                  text="Engineered" 
                  className="text-[clamp(40px,5vw,90px)] font-black tracking-[-0.03em] text-text-primary leading-[0.9] uppercase break-words transition-colors duration-700"
                  delay={0.1}
                />
              </VelocityScroll>
            </div>
            <div className="overflow-hidden mb-12">
              <VelocityScroll intensity={0.5}>
                <RevealText 
                  text="for Performance." 
                  className="text-[clamp(40px,5vw,90px)] font-black tracking-[-0.03em] text-primary leading-[0.9] uppercase break-words transition-colors duration-700"
                  delay={0.3}
                />
              </VelocityScroll>
            </div>

            <motion.p
              className="text-base text-text-secondary max-w-md leading-relaxed mb-16 transition-colors duration-700"
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
              <div className="group relative py-10 border-l border-border-light pl-8 transition-colors duration-700">
                <div className="absolute left-0 top-0 h-0 w-[2px] bg-primary group-hover:h-full transition-all duration-700 ease-out" />
                <div className="text-xs tracking-[0.3em] uppercase text-text-secondary mb-2 transition-colors duration-700">Current Role</div>
                <div className="text-lg font-black text-text-primary uppercase tracking-tight leading-tight transition-colors duration-700">Software<br />Engineer Intern</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-primary mt-2 transition-colors duration-700">MindstriX Technologies</div>
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
