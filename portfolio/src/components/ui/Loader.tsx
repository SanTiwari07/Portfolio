import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: onComplete,
          });
        },
      });

      tl.from('.loader-name-char', {
        yPercent: 110,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power3.out',
      })
        .from(
          '.loader-tagline',
          { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        )
        .to(
          lineRef.current,
          { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
          '-=0.1'
        )
        .to({}, { duration: 0.3 });
    }, containerRef.current);

    return () => ctx.revert();
  }, [onComplete]);

  const name = 'SanTiwari07'.split('');

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center transition-colors duration-700"
    >
      <div className="overflow-hidden mb-6">
        <h1 className="text-[clamp(60px,12vw,160px)] font-black leading-none tracking-[-0.04em] text-text-primary flex transition-colors duration-700">
          {name.map((char, i) => (
            <span
              key={i}
              className="loader-name-char inline-block"
              style={{
                display: char === ' ' ? 'inline-block' : undefined,
                minWidth: char === ' ' ? '0.4em' : undefined,
              }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>

      <p className="loader-tagline text-[clamp(10px,1.2vw,16px)] tracking-[0.5em] text-text-secondary uppercase font-medium mb-12 transition-colors duration-700">
        Engineered for Performance
      </p>

      <div className="w-[min(280px,60vw)] h-[1px] bg-border-light overflow-hidden transition-colors duration-700">
        <div
          ref={lineRef}
          className="w-full h-full bg-primary origin-left transition-colors duration-700"
          style={{ scaleX: 0 }}
        />
      </div>
    </div>
  );
};

export default Loader;
