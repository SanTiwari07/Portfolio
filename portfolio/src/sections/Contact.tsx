import React, { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { MagneticButton } from '../components/animations/MagneticButton';

const contactLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/sanskarmakesstuff/',
    display: 'instagram.com/sanskarmakesstuff',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sanskar-tiwari-b781a9315/',
    display: 'linkedin.com/in/sanskar-tiwari',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/SanTiwari07',
    display: 'github.com/SanTiwari07',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'Resume',
    href: `${import.meta.env.BASE_URL}assets/resume/resume.pdf`,
    display: 'Download Resume',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
      aria-label="Contact section"
    >
      <div
        ref={containerRef}
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
        aria-hidden="true"
      >
        <motion.div className="absolute inset-0 scale-110" style={{ x: bgX, y: bgY }}>
          <img
            src="/images/car/911 Turbo S pure back.webp"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />

        {/* Rear light glow effect */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none" aria-hidden="true">
          <div
            className="absolute bottom-[15%] left-[30%] w-24 h-6 rear-glow rounded-full"
            style={{ background: 'var(--primary)', filter: 'blur(20px)' }}
          />
          <div
            className="absolute bottom-[15%] right-[30%] w-24 h-6 rear-glow rounded-full"
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
          aria-hidden="true"
        >
          <div className="w-8 h-[1px] bg-primary" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-text-secondary font-medium">08 / Contact</span>
          <div className="w-8 h-[1px] bg-primary" />
        </motion.div>

        <div className="overflow-hidden mb-6">
          <motion.h2
            className="text-[clamp(44px,7vw,110px)] font-black tracking-[-0.04em] text-text-primary leading-[0.85] uppercase"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Get In
          </motion.h2>
        </div>
        <div className="overflow-hidden mb-16">
          <motion.h2
            className="text-[clamp(44px,7vw,110px)] font-black tracking-[-0.04em] text-primary leading-[0.85] uppercase"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Touch.
          </motion.h2>
        </div>

        <motion.p
          className="text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Got a project in mind, or just want to chat about tech?
        </motion.p>
        <motion.p
          className="text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          I'm always open to new opportunities and collaborations.
        </motion.p>

        <motion.p
          className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tight mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Drop a message.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full mb-24">
          {contactLinks.map((link, i) => (
            <MagneticButton key={link.label} strength={20}>
              <motion.a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex flex-col items-center gap-3 p-6 border border-border-light hover:border-primary hover:bg-primary/10 transition-all duration-300 w-full h-full focus-visible:outline-2 focus-visible:outline-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.6 }}
                data-cursor="hover"
                aria-label={`${link.label}: ${link.display}`}
              >
                <div className="text-text-secondary group-hover:text-primary transition-colors duration-300">
                  {link.icon}
                </div>
                <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                  {link.label}
                </span>
              </motion.a>
            </MagneticButton>
          ))}
        </div>

        <motion.footer
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.1 }}
        >
          <div className="w-24 h-[1px] bg-border-light mx-auto mb-6" aria-hidden="true" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-text-secondary font-medium">
            Designed and engineered by Sanskar Tiwari · 2026
          </p>
          <p className="text-[9px] tracking-[0.2em] text-text-secondary mt-2">
            PICT · Electronics &amp; Telecom · Pune
          </p>
        </motion.footer>
      </div>
    </section>
  );
};

export default JourneyContinues;
