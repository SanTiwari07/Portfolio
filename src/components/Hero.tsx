import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [isHovered, setIsHovered] = useState(false);

  // Motion values for raw mouse coordinates (0-100)
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  // Springs for smooth movement
  const springConfig = { damping: 40, stiffness: 100, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Mask specific springs (slightly more lag for fluid feel)
  const maskSpringConfig = { damping: 25, stiffness: 60 };
  const maskX = useSpring(mouseX, maskSpringConfig);
  const maskY = useSpring(mouseY, maskSpringConfig);

  // Radius spring to handle isHovered transition smoothly and prevent "stuck" feeling
  const hoverValue = useMotionValue(0);
  const radiusSpring = useSpring(hoverValue, { damping: 20, stiffness: 100 });
  const radiusMain = useTransform(radiusSpring, [0, 1], ["0vw", "11vw"]);
  
  // Update hover state and motion value
  React.useEffect(() => {
    hoverValue.set(isHovered ? 1 : 0);
  }, [isHovered, hoverValue]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalize to percentage (0-100)
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    mouseX.set(x);
    mouseY.set(y);
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Mobile Orientation Logic
  const [hasSensorPermission, setHasSensorPermission] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const requestSensorPermission = async () => {
    // @ts-ignore - DeviceOrientationEvent.requestPermission is specific to iOS/WebKit
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setHasSensorPermission(true);
        }
      } catch (err) {
        console.error("Sensor permission denied:", err);
      }
    } else {
      setHasSensorPermission(true);
    }
  };

  useEffect(() => {
    if (!hasSensorPermission) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;

      const beta = e.beta; 
      const gamma = e.gamma; 

      const targetX = Math.max(0, Math.min(100, ((gamma + 30) / 60) * 100));
      const targetY = Math.max(0, Math.min(100, ((beta - 30) / 60) * 100));

      mouseX.set(targetX);
      mouseY.set(targetY);
      if (!isHovered) setIsHovered(true);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [hasSensorPermission, mouseX, mouseY, isHovered]);

  const maskCx = useTransform(maskX, (v) => v + "%");
  const maskCy = useTransform(maskY, (v) => v + "%");

  return (
    <motion.div 
      ref={containerRef}
      className={`relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-white ${isMobile ? '' : 'cursor-none'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={(e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        mouseX.set(x);
        mouseY.set(y);
        if (!isHovered) setIsHovered(true);
      }}
    >
      <motion.div className="absolute inset-0 z-[-1]" style={{ y: yBg }}>
        {/* Typo Background can go here if we want it to shift */}
      </motion.div>
      {/* Huge Background Typography - ENGINEER (Z-0) */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none px-4"
        style={{ 
          opacity: opacityText, 
          x: useTransform(smoothX, [0, 100], [-30, 30]), 
          y: useTransform(smoothY, [0, 100], [-30, 30]) 
        }}
      >
        <h1 className="text-[22vw] md:text-[24vw] font-black leading-none tracking-[-0.05em] text-gray-950/5 select-none font-heading uppercase whitespace-nowrap">
          ENGINEER
        </h1>
      </motion.div>

      {/* Main Full-Screen Content Wrapper - Z-INDEX 10 */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none pt-[160px]">
        {/* SVG Definition for Clean Mask */}
        <svg className="absolute w-full h-full pointer-events-none opacity-0" aria-hidden="true">
          <defs>
            <mask id="fluid-mask-clean">
              <rect x="0" y="0" width="100%" height="100%" fill="black" />
              {/* Main following circle */}
              <motion.circle 
                cx={maskCx} 
                cy={maskCy} 
                r={radiusMain} 
                fill="white" 
                style={{ filter: "blur(40px)" }}
              />
              {/* Organic blobs */}
              {[...Array(3)].map((_, i) => (
                <motion.circle 
                  key={i}
                  cx={useTransform(maskX, (v) => v + Math.sin(i * 2) * 8 + "%")}
                  cy={useTransform(maskY, (v) => v + Math.cos(i * 2) * 8 + "%")}
                  r={useTransform(radiusSpring, [0, 1], ["0vw", (10 + i * 4) + "vw"])}
                  fill="white"
                  style={{ filter: "blur(35px)" }}
                />
              ))}
            </mask>
          </defs>
        </svg>

        {/* Layer 1: Base Image */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            scale: 1.05,
            x: useTransform(smoothX, [0, 100], [-10, 10]),
            y: useTransform(smoothY, [0, 100], [-10, 10])
          }}
        >
          <img 
            src="/images/main_fullscreen.png" 
            alt="Base View" 
            className="w-full h-full object-cover object-[50%_0%]"
          />
        </motion.div>

        {/* Layer 2: Reveal Image (Helmet) */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ 
            maskImage: "url(#fluid-mask-clean)", 
            WebkitMaskImage: "url(#fluid-mask-clean)",
            mask: "url(#fluid-mask-clean)",
            scale: 1.05,
            x: useTransform(smoothX, [0, 100], [-10, 10]),
            y: useTransform(smoothY, [0, 100], [-10, 10])
          }}
        >
          <img 
            src="/images/second_fullscreen.png" 
            alt="Helmet Reveal" 
            className="w-full h-full object-cover object-[50%_0%]"
          />
        </motion.div>
      </div>

      {/* Interactive Racing Widgets - Z-INDEX 30 */}
      <div className="absolute inset-x-8 inset-y-12 pointer-events-none z-30">
        <div className="absolute top-10 md:top-0 left-0 flex flex-col gap-1 border-l-2 border-primary pl-4 py-2 bg-white/10 backdrop-blur-md">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Status</div>
          <div className="text-xl font-heading font-black text-gray-950 uppercase italic tracking-tighter">Live Feed</div>
        </div>

        <div className="absolute bottom-0 right-0 text-right flex flex-col gap-1 border-r-2 border-primary pr-4 py-2 bg-white/10 backdrop-blur-md">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Input Matrix</div>
          <motion.div className="text-lg font-mono font-bold text-gray-950">
            {Math.round(maskX.get())} / {Math.round(maskY.get())}
          </motion.div>
        </div>
      </div>

      {/* Nameplate - Z-INDEX 40 */}
      <motion.div 
        className="absolute bottom-8 left-8 z-40 flex flex-col items-start pointer-events-none"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-white/90 backdrop-blur-xl p-5 border-b-4 border-primary shadow-2xl skew-x-[-4deg]">
          <h2 className="text-3xl md:text-5xl font-black font-heading text-gray-950 tracking-tighter leading-none uppercase italic">
            SANSKAR <span className="text-primary italic">TIWARI</span>
          </h2>
          
          <div className="mt-6 pointer-events-auto">
            <a 
              href="#projects" 
              className="px-6 py-3 bg-gray-950 text-white text-[10px] font-black font-heading tracking-[0.2em] uppercase hover:bg-primary transition-all duration-300 shadow-lg inline-block"
            >
              Enter Experience
            </a>

            {isMobile && !hasSensorPermission && (
              <button 
                onClick={requestSensorPermission}
                className="ml-4 px-4 py-3 bg-primary text-white text-[10px] font-black font-heading tracking-[0.2em] uppercase hover:bg-gray-950 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Sync Sensors
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40 pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={24} className="text-primary" />
      </motion.div>
    </motion.div>
  );
};

export default Hero;
