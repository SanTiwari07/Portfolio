import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animFrame: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      // Ring trails behind for the smooth effect, increased to 0.2 for tighter response
      ringX = lerp(ringX, mouseX, 0.2);
      ringY = lerp(ringY, mouseY, 0.2);
      
      if (dotRef.current) {
        // GPU accelerated transform for zero-lag dot
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        // GPU accelerated transform for the trailing ring
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      animFrame = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('mousemove', onMouseMove);

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="hover"]')) {
        setIsHovering(true);
      }
    };
    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="hover"]')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor-dot ${isHovering ? 'hovering' : ''}`}
        style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 9999 }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovering ? 'hovering' : ''}`}
        style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 9998 }}
      />
    </>
  );
};

export default CustomCursor;
