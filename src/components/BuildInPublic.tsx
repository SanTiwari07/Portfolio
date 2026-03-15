import React, { useRef, useState } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { Instagram, Youtube } from 'lucide-react';
import clsx from 'clsx';

const INSTAGRAM_LOGO = (
  <svg className="w-full h-full" fill="white" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YOUTUBE_LOGO = (
  <svg className="w-full h-full" fill="white" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const BuildInPublic: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const TiltCard = ({ 
    title, icon: BrandLogo, type, url, followers, handle, purpose 
  }: { 
    title: string; icon: React.ReactNode; type: 'instagram' | 'youtube'; url: string; followers: string; handle: string; purpose: string;
  }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const smoothRotateX = useSpring(rotateX, springConfig);
    const smoothRotateY = useSpring(rotateY, springConfig);

    const gradientClass = type === 'instagram' 
      ? 'from-purple-500 via-pink-500 to-orange-500'
      : 'from-orange-500 via-red-600 to-red-500';

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // ... same logic
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const sensitivity = 10;
      const x = ((e.clientX - centerX) / (rect.width / 2)) * sensitivity;
      const y = -((e.clientY - centerY) / (rect.height / 2)) * sensitivity;

      setRotateY(x);
      setRotateX(y);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    return (
      <motion.a
        ref={cardRef}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative flex flex-col items-center justify-center p-12 md:p-16 border-2 border-gray-200 bg-white overflow-hidden group perspective-[1000px] h-[400px] transition-all duration-300 hover:border-black shadow-sm hover:shadow-[12px_12px_0_rgba(0,0,0,1)]`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Fill Expand */}
        <div className={clsx(
            "absolute bottom-0 left-0 w-full h-0 transition-all duration-500 group-hover:h-full z-0 opacity-10 bg-gradient-to-br",
            gradientClass
        )} />

        <div className="relative z-10 flex flex-col items-center gap-6" style={{ transform: "translateZ(50px)" }}>
          <div className={clsx(
              "w-24 h-24 md:w-32 md:h-32 p-7 md:p-9 rounded-2xl text-white shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex items-center justify-center bg-gradient-to-br",
              gradientClass
          )}>
            {BrandLogo}
          </div>
          
          <div className="text-center space-y-3">
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-3xl md:text-4xl font-black font-heading tracking-tighter text-gray-950 uppercase leading-none">{title}</h3>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">{handle}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 leading-relaxed italic max-w-[240px]">
              {purpose}
            </p>
            <div className="pt-2">
               <span className="px-4 py-1.5 bg-gray-950 text-white text-[10px] font-black font-heading tracking-[0.2em] uppercase">Follow Build</span>
            </div>
          </div>
        </div>

      </motion.a>
    );
  };

  return (
    <div ref={ref} className="w-full flex flex-col space-y-16">
      <motion.div 
        className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-8 bg-primary" />
          <span className="text-xs font-mono font-bold tracking-[0.4em] text-gray-400 uppercase">Build In Public</span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-[72px] font-black tracking-tighter text-gray-950 uppercase italic leading-[0.9]">
           I Share <br />
           <span className="text-primary italic">Everything</span> I Make.
        </h2>
        <div className="h-2 w-16 bg-primary" />
        <p className="text-gray-600 max-w-xl text-lg font-medium mt-6">Log my engineering journey, failures, and daily prototyping experiments for the world to see.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <TiltCard 
          title="Instagram"
          handle="@sanskarmakesstuff"
          purpose="Sharing projects, building journey, and short tech explainers."
          icon={INSTAGRAM_LOGO}
          type="instagram"
          url="https://www.instagram.com/sanskarmakesstuff/"
          followers="2.4k Builders"
        />
        <TiltCard 
          title="YouTube"
          handle="Sanskar Makes Stuff"
          purpose="Project breakdowns, tech explanations, and documenting the build process."
          icon={YOUTUBE_LOGO}
          type="youtube"
          url="https://www.youtube.com/@sanskarmakesstuff"
          followers="10k+ Views"
        />
      </div>
    </div>
  );
};

export default BuildInPublic;
