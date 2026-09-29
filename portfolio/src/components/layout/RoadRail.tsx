import React, { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { drive, onDriveFrame } from '../../sections/hero/driveState';

// After the hero, the 911 keeps driving: a slim road on the right edge where a
// top-down car tracks your position through the rest of the portfolio.

const STOPS = [
  { id: 'specs', label: 'About' },
  { id: 'mission', label: 'Experience' },
  { id: 'skills', label: 'Stack' },
  { id: 'awards', label: 'Awards' },
  { id: 'journey', label: 'Timeline' },
  { id: 'github', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

function TopDownCar({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 84" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]" aria-hidden="true">
      {/* tyres */}
      <rect x="1" y="14" width="6" height="14" rx="2" fill="#111" />
      <rect x="33" y="14" width="6" height="14" rx="2" fill="#111" />
      <rect x="0" y="56" width="7" height="15" rx="2" fill="#111" />
      <rect x="33" y="56" width="7" height="15" rx="2" fill="#111" />
      {/* body — 911 teardrop: narrow nose, wide rear haunches */}
      <path
        d="M20 2 C29 2 34 8 35 18 L36 50 C38 58 38 70 35 78 C33 82 28 83 20 83 C12 83 7 82 5 78 C2 70 2 58 4 50 L5 18 C6 8 11 2 20 2 Z"
        fill={color}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.8"
      />
      {/* headlights */}
      <ellipse cx="10" cy="8" rx="3.2" ry="2.4" fill="#f4f6ff" />
      <ellipse cx="30" cy="8" rx="3.2" ry="2.4" fill="#f4f6ff" />
      {/* glasshouse */}
      <path d="M9 30 C12 26 28 26 31 30 L30 38 C25 36 15 36 10 38 Z" fill="#141414" />
      <path d="M10 40 C15 38 25 38 30 40 L30 56 C25 58 15 58 10 56 Z" fill="#1d1d1d" opacity="0.85" />
      <path d="M11 58 C16 60 24 60 29 58 L28 66 C24 67 16 67 12 66 Z" fill="#141414" />
      {/* rear light bar + spoiler */}
      <rect x="6" y="78" width="28" height="1.6" rx="0.8" fill="#ff2a2a" />
      <rect x="9" y="70" width="22" height="3" rx="1.5" fill="rgba(0,0,0,0.35)" />
    </svg>
  );
}

const RoadRail: React.FC = () => {
  const lenis = useLenis();
  const rootRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const kmhRef = useRef<HTMLSpanElement>(null);
  const [stops, setStops] = useState<{ id: string; label: string; at: number }[]>([]);
  const [active, setActive] = useState(-1);
  const [color, setColor] = useState(drive.paint);

  useEffect(() => {
    const xl = window.matchMedia('(min-width: 1280px)');
    let range = { start: 0, end: 1 };
    let frame = 0;

    const measure = () => {
      const hero = document.getElementById('hero');
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : 0;
      const end = Math.max(document.documentElement.scrollHeight - window.innerHeight, heroEnd + 1);
      range = { start: heroEnd, end };
      const next = STOPS.flatMap((s) => {
        const el = document.getElementById(s.id);
        if (!el) return [];
        const top = el.getBoundingClientRect().top + window.scrollY;
        return [{ ...s, at: Math.min(Math.max((top - range.start) / (range.end - range.start), 0), 1) }];
      });
      setStops((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measure();
    window.addEventListener('resize', measure);

    let facing = 0; // 0 = heading down the page, 180 = reversing
    const off = onDriveFrame(() => {
      // rail is only shown at xl+; skip the per-frame work everywhere else
      if (!xl.matches) return;
      if (++frame % 90 === 0) measure(); // sections lazy-load images and grow
      const y = window.scrollY;
      const p = (y - range.start) / (range.end - range.start);
      const visible = Math.min(Math.max((y - (range.start - window.innerHeight * 0.4)) / (window.innerHeight * 0.4), 0), 1);
      if (rootRef.current) {
        rootRef.current.style.opacity = String(visible);
        rootRef.current.style.pointerEvents = visible > 0.5 ? 'auto' : 'none';
      }
      if (drive.speed < -0.5) facing = 180;
      else if (drive.speed > 0.5) facing = 0;
      if (carRef.current) {
        carRef.current.style.top = `${Math.min(Math.max(p, 0), 1) * 100}%`;
        carRef.current.style.transform = `translate(-50%, -50%) rotate(${facing}deg)`;
      }
      if (laneRef.current) laneRef.current.style.backgroundPositionY = `${-drive.distance * 14}px`;
      if (kmhRef.current) kmhRef.current.textContent = String(Math.min(Math.round(Math.abs(drive.speed) * 4), 330));
      setColor((c) => (c === drive.paint ? c : drive.paint));
      setActive((prev) => {
        let i = -1;
        stops.forEach((s, idx) => {
          if (p >= s.at - 0.01) i = idx;
        });
        return prev === i ? prev : i;
      });
    });

    return () => {
      off();
      window.removeEventListener('resize', measure);
    };
  }, [stops]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={rootRef}
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-[90] flex-col items-center gap-3 opacity-0"
      aria-label="Page progress"
    >
      <div className="relative h-[62vh] w-9">
        {/* asphalt + moving centre line */}
        <div className="absolute inset-0 rounded-full bg-text-primary/[0.06] border border-border-light overflow-hidden">
          <div
            ref={laneRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] opacity-40"
            style={{ backgroundImage: 'linear-gradient(to bottom, var(--text-secondary) 50%, transparent 50%)', backgroundSize: '2px 14px' }}
          />
        </div>

        {/* section stops */}
        {stops.map((s, i) => (
          <button
            key={s.id}
            onClick={() => jump(s.id)}
            className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-4 flex items-center justify-center"
            style={{ top: `${s.at * 100}%` }}
            aria-label={`Jump to ${s.label}`}
           
          >
            <span className={`block h-[2px] w-9 rounded-full transition-colors ${i <= active ? 'bg-primary' : 'bg-border-light'}`} />
            <span
              className={`absolute right-full mr-3 whitespace-nowrap text-[11px] font-mono transition-all duration-300 ${
                i === active ? 'opacity-100 text-text-primary font-semibold' : 'opacity-0 group-hover:opacity-100 text-text-secondary'
              }`}
            >
              {s.label}
            </span>
          </button>
        ))}

        {/* the car */}
        <div ref={carRef} className="absolute left-1/2 w-[18px] h-[38px] pointer-events-none" style={{ top: 0, transition: 'transform 0.4s ease' }}>
          <TopDownCar color={color} />
        </div>
      </div>

      <div className="text-center leading-none" aria-hidden="true">
        <span ref={kmhRef} className="counter-number block text-xs font-black text-text-primary">0</span>
        <span className="text-[11px] font-mono text-text-secondary">km/h</span>
      </div>
    </div>
  );
};

export default RoadRail;
