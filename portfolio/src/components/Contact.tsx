import React, { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:sanskartiwari.smt2@gmail.com',
    display: 'sanskartiwari.smt2@gmail.com',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sanskar-tiwari-b781a9315/',
    display: 'linkedin.com/in/sanskar-tiwari',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/SanTiwari07',
    display: 'github.com/SanTiwari07',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'Resume',
    href: 'https://drive.google.com/file/d/your-resume-id/view',
    display: 'Download Resume',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const JourneyContinues: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });

  const rawMouseX = useMotionValue(0.5);
  const rawMouseY = useMotionValue(0.5);
  const mouseX = useSpring(rawMouseX, { damping: 50, stiffness: 80 });
  const mouseY = useSpring(rawMouseY, { damping: 50, stiffness: 80 });

  const bgX = useTransform(mouseX, [0, 1], [-6, 6]);
  const bgY = useTransform(mouseY, [0, 1], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawMouseX.set((e.clientX - rect.left) / rect.width);
    rawMouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="relative w-full overflow-hidden cursor-none"
      style={{ minHeight: '100vh' }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
      >
        <motion.div className="absolute inset-0 scale-110" style={{ x: bgX, y: bgY }}>
          <img
            src="/assets/car/911 Turbo S pure back.jpg"
            alt="911 Turbo S Rear"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40 transition-colors duration-700" />

        <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none">
          <div
            className="absolute bottom-[15%] left-[30%] w-24 h-6 rear-glow rounded-full transition-colors duration-700"
            style={{ background: 'var(--primary)', filter: 'blur(20px)' }}
          />
          <div
            className="absolute bottom-[15%] right-[30%] w-24 h-6 rear-glow rounded-full transition-colors duration-700"
            style={{ background: 'var(--primary)', filter: 'blur(20px)', animationDelay: '0.5s' }}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 md:px-12 text-center py-24">
        <motion.div
          className="flex items-center gap-3 mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="w-8 h-[1px] bg-primary transition-colors duration-700" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-text-secondary font-medium transition-colors duration-700">08 / The Journey</span>
          <div className="w-8 h-[1px] bg-primary transition-colors duration-700" />
        </motion.div>

        <div className="overflow-hidden mb-6">
          <motion.h2
            className="text-[clamp(44px,7vw,110px)] font-black tracking-[-0.04em] text-text-primary leading-[0.85] uppercase transition-colors duration-700"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            The Journey
          </motion.h2>
        </div>
        <div className="overflow-hidden mb-16">
          <motion.h2
            className="text-[clamp(44px,7vw,110px)] font-black tracking-[-0.04em] text-primary leading-[0.85] uppercase transition-colors duration-700"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Continues.
          </motion.h2>
        </div>

        <motion.p
          className="text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed mb-6 transition-colors duration-700"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Whether it's AI, Computer Vision, Embedded Systems, or a bold new idea,
        </motion.p>
        <motion.p
          className="text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed mb-4 transition-colors duration-700"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          I'm always interested in building meaningful technology.
        </motion.p>

        <motion.p
          className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tight mb-16 transition-colors duration-700"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Let's Build Something Meaningful.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full mb-24">
          {contactLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex flex-col items-center gap-3 p-6 border border-border-light hover:border-primary hover:bg-primary/10 transition-all duration-400"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.6 }}
              data-cursor="hover"
            >
              <div className="text-text-secondary group-hover:text-primary transition-colors duration-300">
                {link.icon}
              </div>
              <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                {link.label}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.1 }}
        >
          <div className="w-24 h-[1px] bg-border-light mx-auto mb-6 transition-colors duration-700" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-text-secondary font-medium transition-colors duration-700">
            Designed and engineered by Sanskar Tiwari · 2026
          </p>
          <p className="text-[9px] tracking-[0.2em] text-text-secondary mt-2 transition-colors duration-700">
            PICT · Electronics & Telecom · Pune
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneyContinues;
