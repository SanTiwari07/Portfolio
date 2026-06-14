import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float } from '@react-three/drei';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import * as THREE from 'three';

import { Parallax } from '../components/animations/Parallax';
import { MagneticButton } from '../components/animations/MagneticButton';
import { preloadGame } from '../App';

// Preload the model
useGLTF.preload('/models/game/porsche_911_turbo_s.glb');

// ─── 3D Car Model ────────────────────────────────────────────────
function PorscheModel({ mouseX, mouseY }: { mouseX: ReturnType<typeof useSpring>; mouseY: ReturnType<typeof useSpring> }) {
  const gltf = useGLTF('/models/game/porsche_911_turbo_s.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Base 3/4 angle
  const baseAngleY = -0.8;

  useFrame(() => {
    if (!groupRef.current) return;

    const targetRotX = (mouseY.get() - 0.5) * 0.15;
    const targetRotY = baseAngleY + (mouseX.get() - 0.5) * 0.35;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);

    const suspensionY = -0.6 - (mouseY.get() - 0.5) * 0.02;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, suspensionY, 0.08);
  });

  return (
    <group ref={groupRef} scale={[0.4, 0.4, 0.4]} position={[0, -0.6, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// ─── Mouse-driven camera ─────────────────────────────────────────
function CameraRig({ mouseX, mouseY }: { mouseX: ReturnType<typeof useSpring>; mouseY: ReturnType<typeof useSpring> }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetCamX = (mouseX.get() - 0.5) * 2.0;
    const targetCamY = 0.4 + (mouseY.get() - 0.5) * 1.0;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─── Dynamic Mouse Spotlight ───────────────────────────────────────
function DynamicSpotlight({ mouseX }: { mouseX: ReturnType<typeof useSpring> }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  useFrame(() => {
    if (!lightRef.current) return;
    const targetX = (mouseX.get() - 0.5) * 15;
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.05);
  });
  return <spotLight ref={lightRef} position={[0, 8, 2]} intensity={2.5} angle={0.5} penumbra={0.8} color="#ffffff" castShadow />;
}

// ─── Scene ───────────────────────────────────────────────────────
function Scene({ mouseX, mouseY }: { mouseX: ReturnType<typeof useSpring>; mouseY: ReturnType<typeof useSpring> }) {
  return (
    <>
      <CameraRig mouseX={mouseX} mouseY={mouseY} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-5, 4, -5]} intensity={0.5} color="#a0a0a0" />
      <DynamicSpotlight mouseX={mouseX} />
      <PorscheModel mouseX={mouseX} mouseY={mouseY} />
      <ContactShadows position={[0, -0.62, 0]} opacity={0.7} scale={6} blur={2.5} far={4} resolution={1024} color="#000000" />
      <Environment preset="studio" />
    </>
  );
}

// ─── Loading fallback ─────────────────────────────────────────────
function ModelLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-label="Loading 3D car model">
      <div className="text-center">
        <div className="w-16 h-16 border border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-hidden="true" />
        <p className="text-xs text-text-secondary tracking-[0.3em] uppercase">Loading Model</p>
      </div>
    </div>
  );
}

// ─── Rotating title ticker ────────────────────────────────────────
const titles = [
  'AI Systems Builder',
  'Computer Vision Engineer',
  'Embedded Systems Developer',
  'Software Engineer Intern',
];

function AnimatedTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % titles.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 overflow-hidden relative" aria-live="polite" aria-atomic="true">
      <motion.div
        key={index}
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -32, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-sm md:text-base tracking-[0.3em] uppercase text-primary font-semibold"
      >
        {titles[index]}
      </motion.div>
    </div>
  );
}

// ─── Scroll indicator ─────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.8, duration: 0.8 }}
      aria-hidden="true"
    >
      <span className="text-[10px] tracking-[0.4em] uppercase text-text-secondary">Scroll</span>
      <div className="w-[1px] h-12 bg-border-light overflow-hidden">
        <motion.div
          className="w-full bg-primary"
          style={{ height: '100%' }}
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

// ─── Error Boundary ─────────────────────────────────────────────────
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-text-secondary tracking-[0.3em] uppercase">3D Model Unavailable</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main Hero ───────────────────────────────────────────────────
const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const rawMouseX = useMotionValue(0.5);
  const rawMouseY = useMotionValue(0.5);
  const mouseX = useSpring(rawMouseX, { damping: 50, stiffness: 80 });
  const mouseY = useSpring(rawMouseY, { damping: 50, stiffness: 80 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawMouseX.set((e.clientX - rect.left) / rect.width);
    rawMouseY.set((e.clientY - rect.top) / rect.height);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.7 });
      tl.from('.hero-line-1', { yPercent: 110, duration: 1, ease: 'power4.out' })
        .from('.hero-line-2', { yPercent: 110, duration: 1, ease: 'power4.out' }, '-=0.7')
        .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.4')
        .from('.hero-tags', { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .from('.hero-cta', { opacity: 0, y: 16, stagger: 0.1, duration: 0.6, ease: 'power2.out' }, '-=0.2');
    }, containerRef.current ?? undefined);
    return () => ctx.revert();
  }, []);

  const textX = useTransform(mouseX, [0, 1], [-8, 8]);
  const textY = useTransform(mouseY, [0, 1], [-4, 4]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-background cursor-none transition-colors duration-700"
      onMouseMove={handleMouseMove}
    >
      {/* Background grid */}
      <Parallax speed={0.5} className="absolute inset-0 opacity-40 pointer-events-none z-0">
        <div className="w-full h-full blueprint-grid" aria-hidden="true" />
      </Parallax>

      {/* 3D Canvas — hidden on very small screens, reduced on mobile */}
      <div className="absolute inset-0 z-10" aria-hidden="true">
        <div className="absolute right-0 top-0 w-full md:w-[65%] h-full">
          <ErrorBoundary>
            <Suspense fallback={<ModelLoader />}>
              <Canvas
                camera={{ position: [0, 0.3, 3.5], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
              >
                <Scene mouseX={mouseX} mouseY={mouseY} />
              </Canvas>
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none z-20" />
      </div>

      {/* Text Content */}
      <div className="absolute inset-0 z-30 flex flex-col justify-center px-[var(--spacing-layout-x)]">
        <motion.div ref={textRef} style={{ x: textX, y: textY }}>
          <div className="mb-6 overflow-hidden">
            <AnimatedTitle />
          </div>

          {/* Single h1 containing both name lines — fixes duplicate h1 accessibility issue */}
          <h1 className="text-text-primary uppercase tracking-tighter leading-[0.9] transition-colors duration-700">
            <div className="overflow-hidden mb-1">
              <span className="hero-line-1 block text-[clamp(40px,7vw,110px)] font-display">
                SANSKAR
              </span>
            </div>
            <div className="overflow-hidden mb-6">
              <span className="hero-line-2 block text-[clamp(40px,7vw,110px)] font-display">
                TIWARI
              </span>
            </div>
          </h1>

          <p className="hero-subtitle text-sm md:text-base text-text-secondary leading-relaxed max-w-[400px] mb-8 transition-colors duration-700">
            Building intelligent systems across AI,
            Computer Vision, and Embedded Systems
            for the physical world.
          </p>

          <div className="hero-tags flex flex-wrap gap-3 mb-10">
            {['ENTC @ PICT', 'Intern @ MindstriX', 'Hackathon Winner'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 border border-border-light text-[10px] tracking-[0.25em] uppercase text-text-secondary font-medium transition-colors duration-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <MagneticButton>
              <a
                href="#github"
                className="hero-cta group relative px-8 py-4 bg-text-primary text-background text-xs tracking-[0.25em] uppercase font-semibold overflow-hidden transition-colors duration-700 block"
                data-cursor="hover"
              >
                <span className="absolute inset-0 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" aria-hidden="true" />
                <span className="relative z-10">View Work</span>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="/assets/resume/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta group flex items-center gap-3 text-xs tracking-[0.25em] uppercase font-semibold text-text-primary transition-colors duration-700"
                data-cursor="hover"
              >
                Resume
                <span className="w-8 h-[1px] bg-text-primary group-hover:w-14 group-hover:bg-primary transition-all duration-300" aria-hidden="true" />
              </a>
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      <ScrollIndicator />

      <motion.div
        className="absolute bottom-10 left-8 md:left-16 z-30 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.6 }}
        aria-hidden="true"
      >
        <div className="w-4 h-[1px] bg-border-light" />
        <span className="text-[9px] tracking-[0.4em] uppercase text-text-secondary">01 / 08</span>
      </motion.div>

      <motion.div
        className="absolute top-24 right-8 md:right-16 z-30 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        aria-hidden="true"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
        <span className="text-[9px] tracking-[0.3em] uppercase text-text-secondary">Engineering</span>
      </motion.div>

      <button
        id="dream-car-btn"
        onClick={() => { window.dispatchEvent(new CustomEvent('navigate', { detail: '/dream-car' })); }}
        onMouseEnter={() => preloadGame()}
        className="absolute bottom-10 right-8 md:right-16 z-30 px-6 py-3 border border-border-light bg-text-primary text-background text-[10px] tracking-[0.25em] uppercase font-semibold transition-all duration-300 hover:bg-primary hover:border-primary cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
        data-cursor="hover"
        aria-label="Experience my dream car — opens 3D driving game"
      >
        Experience My Dream Car
      </button>
    </div>
  );
};

export default Hero;
