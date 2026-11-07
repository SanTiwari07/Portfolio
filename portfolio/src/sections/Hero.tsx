import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { Volume2, VolumeX, ArrowDown, ArrowUpRight, Gamepad2 } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { preloadGame } from '../lib/game';
import { useGithubData } from '../lib/github';
import { ShowroomScene, type SceneTheme } from './hero/ShowroomScene';
import { drive, onDriveFrame, PAINTS, startDriveLoop } from './hero/driveState';
import { SHOTS, shotIndexAt } from './hero/shots';
import { startEngine, stopEngine, honk } from './hero/engineAudio';
import { isLowPower } from '../lib/device';

const SCENE_THEMES: Record<'light' | 'dark', SceneTheme> = {
  light: { background: '#FAFAFA', floor: '#efefef', grid: '#dcc9cc', lane: '#7A1E2C', streak: '#7A1E2C', dark: false },
  dark: { background: '#030303', floor: '#070707', grid: '#2a2a2a', lane: '#E32636', streak: '#ffffff', dark: true },
};

const PAINT_KEY = 'portfolio-paint-v2';

// Frosted panels are costly over a live WebGL canvas on phones; use a denser solid tint there instead.
const GLASS = isLowPower ? 'bg-background/85' : 'bg-background/60 backdrop-blur-sm';
const GLASS_MD = isLowPower ? 'bg-background/85' : 'bg-background/50 backdrop-blur-md';

// ─── Error boundary for the WebGL layer ───────────────────────────
class CanvasBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-end pr-[8vw]">
          <img src="/images/car/911 Turbo S.webp" alt="" className="w-[55vw] max-w-[900px] object-contain opacity-90" />
        </div>
      );
    }
    return this.props.children;
  }
}

function ModelLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center wide:justify-end wide:pr-[18vw]" aria-hidden="true">
      <div className="text-center">
        <div className="w-14 h-14 border border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[11px] text-text-secondary font-mono">Warming up</p>
      </div>
    </div>
  );
}

// ─── A block of copy tied to a window of scroll progress ──────────
function Stage({
  progress,
  range,
  className = '',
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  className?: string;
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [48, 0, 0, -48]);
  // animated blur repaints the whole block every frame — desktop only
  const filter = useTransform(progress, range, ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.6 ? 'auto' : 'none'));
  return (
    <motion.div className={`absolute ${className}`} style={{ opacity, y, filter: isLowPower ? undefined : filter, pointerEvents }}>
      {children}
    </motion.div>
  );
}

function Eyebrow({ index, center, children }: { index: string; center?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-4 mb-5 ${center ? 'justify-center' : ''}`}>
      <span className="text-[11px] text-primary font-semibold">{index}</span>
      <div className="w-10 h-[1px] bg-primary" aria-hidden="true" />
      <span className="text-[11px] font-mono text-text-secondary font-medium">{children}</span>
    </div>
  );
}

// ─── Speedometer: scroll speed as km/h, with a PDK-style gear readout ──
function Speedometer() {
  const valueRef = useRef<HTMLSpanElement>(null);
  const gearRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const R = 42;
  const CIRC = 2 * Math.PI * R;
  const SWEEP = 0.75; // 270° dial

  useEffect(
    () =>
      onDriveFrame(() => {
        const kmh = Math.min(Math.round(Math.abs(drive.speed) * 4), 330);
        const gear = drive.speed < -0.5 ? 'R' : kmh < 2 ? 'N' : String(Math.min(8, 1 + Math.floor(kmh / 42)));
        if (valueRef.current) valueRef.current.textContent = String(kmh).padStart(3, '0');
        if (gearRef.current) gearRef.current.textContent = gear;
        if (arcRef.current) arcRef.current.style.strokeDashoffset = String(CIRC * (1 - SWEEP * (kmh / 330)));
      }),
    [CIRC],
  );

  return (
    <div className="relative w-[112px] h-[112px]" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full rotate-[135deg]">
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--border-light)" strokeWidth="2" strokeDasharray={`${CIRC * SWEEP} ${CIRC}`} />
        <circle
          ref={arcRef}
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${CIRC} ${CIRC}`}
          style={{ strokeDashoffset: CIRC, transition: 'none' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span ref={valueRef} className="counter-number text-2xl font-semibold tracking-tight text-text-primary leading-none">000</span>
        <span className="text-[11px] font-mono text-text-secondary mt-1">km/h</span>
        <span ref={gearRef} className="mt-1.5 text-[11px] font-bold text-primary">N</span>
      </div>
    </div>
  );
}

// ─── Shot navigator: a bottom rail of chapters with a live progress fill ──
function ShotNav({ onJump }: { onJump: (at: number) => void }) {
  const [active, setActive] = useState(0);
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      onDriveFrame(() => {
        const i = shotIndexAt(drive.progress);
        setActive((prev) => (prev === i ? prev : i));
        if (lineRef.current) lineRef.current.style.transform = `scaleX(${drive.progress})`;
      }),
    [],
  );
  return (
    <nav aria-label="Showcase chapters" className="relative flex items-center gap-7 pb-3">
      <div className="absolute left-0 right-0 bottom-0 h-[1px] bg-border-light" aria-hidden="true">
        <div ref={lineRef} className="h-full w-full bg-primary origin-left" style={{ transform: 'scaleX(0)' }} />
      </div>
      {SHOTS.map((shot, i) => (
        <button
          key={shot.id}
          onClick={() => onJump(shot.at)}
          className={`flex items-center gap-2 text-[11px] font-mono transition-colors ${
 i === active ? 'text-text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'
 }`}
          aria-current={i === active ? 'step' : undefined}
        >
          <span className="counter-number text-primary">{String(i + 1).padStart(2, '0')}</span>
          <span className="hidden lg:inline">{shot.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Paint configurator ───────────────────────────────────────────
function PaintPicker({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  return (
    <div className="flex wide:flex-col items-center gap-3" role="radiogroup" aria-label="Paint colour">
      <span className="hidden wide:block text-[11px] font-mono text-text-secondary [writing-mode:vertical-rl] rotate-180 mb-2">
        {PAINTS[value].name}
      </span>
      {PAINTS.map((paint, i) => (
        <button
          key={paint.name}
          role="radio"
          aria-checked={i === value}
          aria-label={paint.name}
          title={paint.name}
          onClick={() => onChange(i)}
          className={`relative w-5 h-5 rounded-full border transition-transform duration-300 hover:scale-125 before:absolute before:-inset-1.5 before:content-[''] ${
 i === value ? 'scale-125 border-text-primary' : 'border-text-primary/25'
 }`}
          style={{ background: `radial-gradient(circle at 30% 30%, #ffffff66, transparent 55%), ${paint.hex}` }}
        >
          {i === value && <span className="absolute -inset-1.5 rounded-full border border-primary/60" aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const github = useGithubData();
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const { actualTheme } = useTheme();
  const lenis = useLenis();

  const [inView, setInView] = useState(true);
  const [carHover, setCarHover] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  // drops to 1 if the frame rate can't keep up
  const [maxDpr, setMaxDpr] = useState(isLowPower ? 1.25 : 1.75);
  const [paint, setPaint] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(PAINT_KEY));
      return Number.isInteger(saved) && saved >= 0 && saved < PAINTS.length ? saved : 0;
    } catch {
      return 0;
    }
  });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const marqueeX = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
  const hudOpacity = useTransform(scrollYProgress, [0, 0.04, 0.97, 1], [0.55, 1, 1, 0]);
  const navOpacity = useTransform(scrollYProgress, [0.04, 0.1, 0.97, 1], [0, 1, 1, 0]);
  const navPointer = useTransform(navOpacity, (o) => (o > 0.5 ? 'auto' : 'none'));
  // on phones the paint picker sits where the award cards land — step aside for that stage
  const pickerOpacity = useTransform(scrollYProgress, [0.68, 0.71, 0.87, 0.9], [1, 0, 0, 1]);
  const pickerPointer = useTransform(pickerOpacity, (o) => (o > 0.5 ? 'auto' : 'none'));
  const handoff = useTransform(scrollYProgress, [0.955, 1], [0, 1]);
  // legibility wash on the left, only while left-aligned copy is on screen (intro, details)
  const washOpacity = useTransform(scrollYProgress, [0, 0.08, 0.12, 0.53, 0.57, 0.65, 0.69], [1, 1, 0, 0, 1, 1, 0]);

  // paint → shared state + persistence
  useEffect(() => {
    drive.paint = PAINTS[paint].hex;
    try {
      localStorage.setItem(PAINT_KEY, String(paint));
    } catch {
      /* storage unavailable — colour just won't persist */
    }
  }, [paint]);

  // Pause rendering while the hero is off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer → camera parallax + hover hint position
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      // a finger dragging to scroll shouldn't swing the camera around
      if (e.pointerType === 'touch') return;
      drive.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      drive.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
      if (hintRef.current) hintRef.current.style.transform = `translate3d(${e.clientX + 22}px, ${e.clientY + 18}px, 0)`;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => startDriveLoop(() => sectionRef.current), []);
  useEffect(() => () => stopEngine(), []);

  // Intro entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from('.hero-line-1', { yPercent: 110, duration: 1, ease: 'power4.out' })
        .from('.hero-line-2', { yPercent: 110, duration: 1, ease: 'power4.out' }, '-=0.7')
        .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.4')
        .from('.hero-cta', { opacity: 0, y: 16, stagger: 0.1, duration: 0.6, ease: 'power2.out' }, '-=0.2');
    }, introRef.current ?? undefined);
    return () => ctx.revert();
  }, []);

  const jumpTo = (at: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + at * (el.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(y, { duration: 2.2 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const toggleSound = async () => {
    if (soundOn) {
      stopEngine();
      setSoundOn(false);
    } else {
      setSoundOn(true);
      await startEngine();
    }
  };

  const onCarClick = () => {
    drive.flash = 1;
    if (soundOn) honk();
  };

  const openGame = () => window.dispatchEvent(new CustomEvent('navigate', { detail: '/dream-car' }));

  return (
    <section id="hero" ref={sectionRef} className="relative w-full h-[560vh] supports-[height:100svh]:h-[560svh] bg-background transition-colors duration-700">
      {/* svh: stays put when the mobile URL bar shows/hides, so the canvas isn't resized mid-scroll */}
      <div className="sticky top-0 h-screen supports-[height:100svh]:h-[100svh] w-full overflow-hidden">
        {/* ── Backdrop: blueprint grid + giant outlined type drifting behind the car ── */}
        <div className="absolute inset-0 blueprint-grid opacity-40 pointer-events-none" aria-hidden="true" />
        <motion.div
          className="absolute top-[14%] md:top-[18%] left-0 whitespace-nowrap pointer-events-none select-none font-display font-bold uppercase leading-none tracking-tighter text-transparent text-[26vw] md:text-[17vw]"
          style={{ x: marqueeX, WebkitTextStroke: '1px color-mix(in srgb, var(--text-primary) 9%, transparent)' }}
          aria-hidden="true"
        >
          Sanskar Tiwari · Turbo S · Sanskar Tiwari
        </motion.div>

        {/* ── WebGL ── */}
        <div className="absolute inset-0" style={{ cursor: carHover ? 'pointer' : undefined }}>
          <CanvasBoundary>
            <Suspense fallback={<ModelLoader />}>
              <Canvas
                frameloop={inView ? 'always' : 'never'}
                camera={{ position: [6, 1.5, 6], fov: 30, near: 0.1, far: 80 }}
                gl={{ antialias: !isLowPower, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, maxDpr]}
                // let vertical swipes over the car scroll the page on touch screens
                style={{ touchAction: 'pan-y' }}
                aria-label="Interactive 3D Porsche 911 Turbo S. Scroll to drive it; click it to flash the headlights."
                role="img"
              >
                <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
                <ShowroomScene
                  theme={SCENE_THEMES[actualTheme]}
                  onCarHover={setCarHover}
                  onCarClick={onCarClick}
                  lowPower={isLowPower}
                />
              </Canvas>
            </Suspense>
          </CanvasBoundary>
        </div>

        {/* keep the intro copy legible against the car */}
        <motion.div
          className="absolute inset-y-0 left-0 w-full wide:w-1/2 bg-gradient-to-b wide:bg-gradient-to-r from-background/85 via-background/40 to-transparent pointer-events-none"
          style={{ opacity: washOpacity }}
          aria-hidden="true"
        />

        {/* ── 00 · Intro ── */}
        <Stage progress={scrollYProgress} range={[-1, 0, 0.05, 0.1]} className="inset-x-0 top-[12%] wide:top-0 wide:bottom-0 wide:flex wide:items-center px-[var(--spacing-layout-x)]">
          <div ref={introRef} className="max-w-xl">
            <p className="mb-6 font-mono text-xs md:text-sm text-primary">
              Software Engineer Intern · AI, computer vision &amp; embedded systems
            </p>
            <h1 className="text-text-primary tracking-[-0.04em] leading-[0.95]">
              <div className="overflow-hidden mb-1">
                <span className="hero-line-1 block text-[clamp(44px,7vw,110px)] font-display">Sanskar</span>
              </div>
              <div className="overflow-hidden mb-6">
                <span className="hero-line-2 block text-[clamp(44px,7vw,110px)] font-display">Tiwari</span>
              </div>
            </h1>
            <p className="hero-subtitle text-sm md:text-base text-text-secondary leading-relaxed max-w-[400px] mb-8">
              Third-year ENTC student at PICT, Pune. I build AI and embedded systems that have to work outside the lab.
            </p>
            <div className="flex flex-wrap items-center gap-5">
                <a
                  href="#github"
                  className="hero-cta group relative px-8 py-4 bg-text-primary text-background text-sm font-medium overflow-hidden block"
                 
                >
                  <span className="absolute inset-0 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" aria-hidden="true" />
                  <span className="relative z-10">View Work</span>
                </a>
            </div>
            <button
              id="dream-car-btn"
              onClick={openGame}
              onMouseEnter={() => preloadGame()}
              onFocus={() => preloadGame()}
              className={`hero-cta inline-flex mt-8 items-center gap-3 px-5 py-3 border border-primary/40 ${GLASS} text-sm font-medium text-text-primary hover:bg-primary hover:border-primary hover:text-white transition-colors`}
              aria-label="Experience my dream car — opens the 3D driving game"
            >
              <Gamepad2 size={15} />
              Experience my dream car
            </button>
          </div>
        </Stage>

        {/* scroll cue */}
        <Stage progress={scrollYProgress} range={[-1, 0, 0.02, 0.05]} className="bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3" aria-hidden="true">
            <span className="text-[11px] font-mono text-text-secondary">Scroll to drive</span>
            <div className="w-[1px] h-12 bg-border-light overflow-hidden">
              <motion.div className="w-full h-full bg-primary" animate={{ y: ['-100%', '100%'] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
            </div>
          </div>
        </Stage>

        {/* ── 01 · About ── */}
        <Stage progress={scrollYProgress} range={[0.13, 0.17, 0.24, 0.29]} className="inset-x-0 top-[13%] md:top-[15%] px-[var(--spacing-layout-x)] text-center">
          <Eyebrow index="01" center>About</Eyebrow>
          <h2 className="font-display tracking-[-0.03em] leading-[1.02] text-text-primary text-[clamp(34px,5.4vw,84px)]">
            Built for the <span className="text-primary">physical world.</span>
          </h2>
          <p className="mt-5 text-sm md:text-base text-text-secondary max-w-lg mx-auto">
            I build systems where software, hardware and machine learning meet — from production Gemini pipelines to dual-ESP32 computer vision rigs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {['ENTC @ PICT · 3rd year', '9.31 CGPA', 'SWE Intern @ MindstriX', ...(github ? [`${github.publicRepos} Public Repos`] : [])].map((fact) => (
              <span key={fact} className={`px-3 py-1.5 border border-border-light ${GLASS} text-[11px] font-mono text-text-secondary font-medium`}>
                {fact}
              </span>
            ))}
          </div>
        </Stage>

        {/* ── 02 · Selected work (rear view) ── */}
        <Stage progress={scrollYProgress} range={[0.33, 0.37, 0.44, 0.49]} className="right-[var(--spacing-layout-x)] left-[var(--spacing-layout-x)] wide:left-auto top-[12%] wide:top-auto wide:bottom-[16%] wide:w-[min(480px,40vw)]">
          <Eyebrow index="02">Selected work</Eyebrow>
          <h2 className="font-display tracking-[-0.03em] leading-[1.02] text-text-primary text-[clamp(30px,3.8vw,60px)] mb-6">
            Things I've <span className="text-primary">built.</span>
          </h2>
          <ul className={`divide-y divide-border-light border-y border-border-light ${GLASS_MD}`}>
            {[
              ['Snipmint', 'Long YouTube videos to captioned Shorts', 'Snipmint'],
              ['NarraReel', 'Script to Reel · cloned voice, synced captions', 'NarraReel'],
              ['Aviro', 'AI finance controller · zero false auto-matches', 'Aviro'],
              ['Sudarshan', 'Android banking-malware intelligence', 'Sudarshan'],
              ['IPDS v2.0', 'YOLOv8 + dual ESP32 pothole detection · DOI', 'PotHoleDetection'],
              ['HumSight', 'Machine vibration found from ordinary video', 'HumSight'],
            ].map(([name, desc, repo]) => (
              <li key={name}>
                <a
                  href={`https://github.com/SanTiwari07/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-3 px-1"
                 
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      {name}
                      <ArrowUpRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                    <div className="text-xs text-text-secondary truncate">{desc}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </Stage>

        {/* ── 03 · Experience (wheel close-up) ── */}
        <Stage progress={scrollYProgress} range={[0.53, 0.57, 0.64, 0.69]} className="left-[var(--spacing-layout-x)] right-[var(--spacing-layout-x)] wide:right-auto top-[12%] wide:top-auto wide:bottom-[18%] wide:w-[min(440px,36vw)]">
          <Eyebrow index="03">Experience</Eyebrow>
          <h2 className="font-display tracking-[-0.03em] leading-[1.02] text-text-primary text-[clamp(30px,3.8vw,60px)] mb-3">
            Software Engineer <span className="text-primary">Intern.</span>
          </h2>
          <p className="text-[11px] font-mono text-text-secondary mb-5">MindstriX Technologies LLP · Mar 2026 → Present · Remote</p>
          <ul className="space-y-2.5">
            {[
              'LLM integration — production-grade Gemini pipelines',
              'API development for AI-powered applications',
              'AI R&D, now building AI-native Android systems on real sensor data',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                <span className="mt-2.5 w-4 h-[1px] bg-primary shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Stage>

        {/* ── 04 · Awards (headlights) ── */}
        <Stage progress={scrollYProgress} range={[0.72, 0.76, 0.82, 0.86]} className="inset-x-0 top-[13%] md:top-[14%] px-[var(--spacing-layout-x)] text-center">
          <Eyebrow index="04" center>Awards</Eyebrow>
          <h2 className="font-display tracking-[-0.03em] leading-[1.02] text-text-primary text-[clamp(34px,5.4vw,84px)]">
            Four times on <span className="text-primary">the podium.</span>
          </h2>
        </Stage>
        <Stage progress={scrollYProgress} range={[0.72, 0.76, 0.82, 0.86]} className="inset-x-0 bottom-[15%] md:bottom-24 px-[var(--spacing-layout-x)]">
          <ul className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {[
              ['1st', "TechFiesta '26 · International", 'KrishiSahAI'],
              ['1st', 'HackVenture 2026 · Agritech', 'GramDrishti'],
              ['Runner-Up', 'Pune Agri Intl. Hackathon', 'Krishi Prabandh'],
              ['Top 3', 'VOIS Innovation Marathon 2.0', 'KrishiSaarthi'],
            ].map(([place, event, project]) => (
              <li key={event}>
                <a href="#awards" className={`group block h-full px-4 py-3 md:py-4 border border-border-light ${GLASS_MD} hover:border-primary transition-colors`}>
                  <div className="font-display text-xl md:text-2xl text-primary leading-none">{place}</div>
                  <div className="mt-1.5 text-xs font-semibold text-text-primary">{event}</div>
                  <div className="text-[11px] font-mono text-text-secondary mt-0.5">{project}</div>
                </a>
              </li>
            ))}
          </ul>
        </Stage>

        {/* ── 05 · Drive ── */}
        <Stage progress={scrollYProgress} range={[0.88, 0.92, 1, 1.01]} className="inset-x-0 top-[14%] md:top-[16%] px-[var(--spacing-layout-x)] text-center">
          <Eyebrow index="05" center>Contact</Eyebrow>
          <h2 className="font-display tracking-[-0.03em] leading-[1.02] text-text-primary text-[clamp(38px,6.2vw,100px)]">
            Let's build <span className="text-primary">what's next.</span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openGame}
              onMouseEnter={() => preloadGame()}
              onFocus={() => preloadGame()}
              className={`group inline-flex items-center gap-3 px-7 py-4 bg-text-primary text-background text-sm font-medium hover:bg-primary transition-colors`}
            >
              Take the 911 for a drive
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-7 py-4 bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Get in touch <ArrowUpRight size={15} />
            </a>
            <a
              href="#specs"
              className="inline-flex items-center gap-3 px-7 py-4 border border-text-primary/20 text-text-primary text-sm font-medium hover:border-primary hover:text-primary transition-colors"
            >
              Continue <ArrowDown size={15} />
            </a>
          </div>
        </Stage>

        {/* ── HUD ── */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: hudOpacity }}>

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-[132px] wide:left-auto wide:translate-x-0 wide:right-[var(--spacing-layout-x)] wide:bottom-auto wide:top-1/2 wide:-translate-y-1/2 wide:!opacity-100 wide:!pointer-events-auto"
            style={{ opacity: pickerOpacity, pointerEvents: pickerPointer }}
          >
            <PaintPicker value={paint} onChange={setPaint} />
          </motion.div>

          <div className="hidden md:flex absolute right-[var(--spacing-layout-x)] bottom-8 items-end gap-5 pointer-events-auto">
            <button
              onClick={toggleSound}
              className="mb-3 inline-flex items-center gap-2 text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
              aria-pressed={soundOn}
            >
              {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
              Engine {soundOn ? 'on' : 'off'}
            </button>
            <Speedometer />
          </div>
        </motion.div>

        <motion.div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-9"
          style={{ opacity: navOpacity, pointerEvents: navPointer }}
        >
          <ShotNav onJump={jumpTo} />
        </motion.div>

        {/* handoff: the road dissolves into the page as the car drives off */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none"
          style={{ opacity: handoff }}
          aria-hidden="true"
        />

        {/* hover hint that trails the pointer over the car */}
        <div
          ref={hintRef}
          className={`fixed left-0 top-0 z-50 pointer-events-none px-3 py-1.5 rounded-full bg-text-primary text-background text-[11px] font-mono transition-opacity duration-300 ${
 carHover ? 'opacity-100' : 'opacity-0'
 }`}
          aria-hidden="true"
        >
          {soundOn ? 'Click · Honk' : 'Click · Lights'}
        </div>
      </div>
    </section>
  );
};

export default Hero;
