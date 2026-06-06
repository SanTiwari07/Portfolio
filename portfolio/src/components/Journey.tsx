import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Flag, Brain, Trophy, Award, Medal, Star, Globe, 
  Leaf, Briefcase, Building2, Target, Zap 
} from 'lucide-react';

const Journey: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const carY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const desktopPath = "M 50 0 L 50 100";
  const mobilePath = "M 10 0 L 10 100";

  return (
    <section id="journey" className="relative w-full bg-[#fdfdfd]">
      
      {/* Background SVG Track */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30 md:opacity-50">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="trackGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7A1E2C" stopOpacity="1" />
              <stop offset="100%" stopColor="#7A1E2C" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d={isMobile ? mobilePath : desktopPath} stroke="#e5e7eb" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
          <motion.path d={isMobile ? mobilePath : desktopPath} stroke="url(#trackGradient)" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" style={{ pathLength: scrollYProgress }} />
        </svg>
      </div>

      {/* The Animated Racing Car */}
      <motion.div 
        className="absolute z-30 w-10 h-10 -ml-5 -mt-5 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-2xl text-black pointer-events-none"
        style={{ top: carY, left: isMobile ? '10%' : '50%' }}
      >
        <Zap size={18} fill="currentColor" />
      </motion.div>

      {/* Content Container */}
      <div ref={containerRef} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-32 flex flex-col gap-32 md:gap-40">
        
        {/* HEADER */}
        <div className="mb-10">
          <motion.div className="flex items-center gap-4 mb-8" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="w-8 h-[1px] bg-[#7A1E2C]" />
            <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 font-bold">06 / The Story</span>
          </motion.div>
          <motion.h2 className="text-[clamp(44px,7vw,110px)] font-black tracking-[-0.04em] text-black leading-none uppercase" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Road to AI.
          </motion.h2>
        </div>

        {/* SECTION 1: BUILT (LEFT) */}
        <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[60vh]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8 }}>
          <div className="md:col-span-6 flex flex-col items-start bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-black border border-gray-100"><Flag size={20} /></div>
              <span className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-[#7A1E2C] uppercase">2024 • Start Line</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black uppercase mb-2 tracking-tight">BUILT</h3>
            <p className="text-xl md:text-2xl text-gray-500 font-medium mb-10 border-b border-gray-100 pb-8 w-full">Started Building Systems</p>
            <div className="flex flex-wrap gap-3">
               {['Arduino', 'ESP32', 'Embedded Systems', 'Sensors', 'Hardware Prototyping'].map(t => (
                 <span key={t} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wide">{t}</span>
               ))}
            </div>
          </div>
          <div className="md:col-span-6 flex flex-col gap-6">
            <div className="bg-[#111] border border-[#222] rounded-[2rem] p-12 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 via-transparent to-transparent group-hover:scale-110 transition-transform duration-700" />
              <h4 className="text-7xl md:text-8xl font-black mb-4 tracking-tighter">50+</h4>
              <p className="text-[#00E676] font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-2">Hours Hardware Prototyping</p>
              <p className="text-gray-400 font-medium">Learning foundation established from the ground up.</p>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: LEARNED (RIGHT) */}
        <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[60vh]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8 }}>
          <div className="md:col-span-6 order-2 md:order-1 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-[#f8f9ff] to-[#eef2ff] border border-blue-100 shadow-[0_20px_60px_rgba(37,99,235,0.05)] rounded-[2rem] p-12 relative overflow-hidden group">
              <h4 className="text-5xl md:text-6xl font-black text-[#1e3a8a] mb-4 tracking-tight">Multiple</h4>
              <p className="text-[#2563eb] font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-6">AI Systems Built</p>
              <div className="flex gap-3 flex-wrap">
                 <span className="px-3 py-1.5 bg-white border border-blue-100 rounded-md text-xs font-bold text-blue-800 shadow-sm">Dynamic Traffic Signal</span>
                 <span className="px-3 py-1.5 bg-white border border-blue-100 rounded-md text-xs font-bold text-blue-800 shadow-sm">Intelligent Pothole Detection</span>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-lg flex items-center justify-between">
               <span className="font-black text-gray-300 text-2xl uppercase tracking-widest">Real-Time</span>
               <span className="font-bold text-black text-sm uppercase tracking-wider bg-gray-50 px-4 py-2 rounded-full">Pipelines Active</span>
            </div>
          </div>
          <div className="md:col-span-6 order-1 md:order-2 flex flex-col items-start md:items-end md:text-right bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-4 mb-6 md:flex-row-reverse">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-black border border-gray-100"><Brain size={20} /></div>
              <span className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-[#7A1E2C] uppercase">2025 • Checkpoint 1</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black uppercase mb-2 tracking-tight">LEARNED</h3>
            <p className="text-xl md:text-2xl text-gray-500 font-medium mb-10 border-b border-gray-100 pb-8 w-full">Computer Vision & AI</p>
            <div className="flex flex-wrap gap-3 md:justify-end">
               {['Python', 'OpenCV', 'YOLO', 'Machine Learning', 'Object Detection'].map(t => (
                 <span key={t} className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-wide">{t}</span>
               ))}
            </div>
          </div>
        </motion.div>

        {/* SECTION 3: COMPETED (LEFT) */}
        <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[60vh]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8 }}>
          <div className="md:col-span-6 flex flex-col items-start bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-black border border-gray-100"><Trophy size={20} /></div>
              <span className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-[#7A1E2C] uppercase">2026 • Checkpoint 2</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black uppercase mb-2 tracking-tight">COMPETED</h3>
            <p className="text-xl md:text-2xl text-gray-500 font-medium mb-10 border-b border-gray-100 pb-8 w-full">National Recognition</p>
            <div className="flex flex-col gap-4 w-full">
               <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"><span className="text-gray-600"><Medal size={24} /></span><span className="font-bold text-gray-800">Pune Agri Hackathon Runner-Up</span></div>
               <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"><span className="text-gray-600"><Award size={24} /></span><span className="font-bold text-gray-800">VOIS Innovation Marathon Top 3</span></div>
            </div>
          </div>
          <div className="md:col-span-6 grid grid-cols-2 gap-6">
            <div className="col-span-2 bg-[#7A1E2C] rounded-[2rem] p-12 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
               <h4 className="text-7xl md:text-8xl font-black mb-4 tracking-tighter">4×</h4>
               <p className="text-white/90 font-bold tracking-[0.2em] uppercase text-sm md:text-base">Competition Awardee</p>
            </div>
            <div className="col-span-2 md:col-span-1 bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl flex flex-col justify-center">
               <h4 className="text-4xl font-black mb-2 text-black">₹2L+</h4>
               <p className="text-gray-500 text-xs tracking-wider uppercase font-bold">Prize Pool Exposure</p>
            </div>
            <div className="col-span-2 md:col-span-1 bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl flex flex-col items-center justify-center text-center">
               <span className="mb-4 text-yellow-500"><Star size={40} fill="currentColor" /></span>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top National Rankings</span>
            </div>
          </div>
        </motion.div>

        {/* SECTION 4: SHIPPED (RIGHT) */}
        <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[60vh]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8 }}>
          <div className="md:col-span-6 order-2 md:order-1 flex flex-col gap-6">
            <div className="bg-black rounded-[2rem] p-12 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-500/20 blur-[80px] rounded-full group-hover:bg-yellow-500/40 transition-colors duration-700" />
               <div className="mb-8 text-yellow-500"><Trophy size={64} /></div>
               <h4 className="text-6xl md:text-7xl font-black mb-4 text-[#FFD700] tracking-tighter">700+</h4>
               <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-sm mb-8">International Teams Beaten</p>
               <div className="bg-white/10 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <p className="text-white text-lg font-bold">Potential 30-50% Farmer Income Increase</p>
                  <p className="text-gray-400 text-xs mt-2 uppercase tracking-wider">Real World Impact Verified</p>
               </div>
            </div>
          </div>
          <div className="md:col-span-6 order-1 md:order-2 flex flex-col items-start md:items-end md:text-right bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-4 mb-6 md:flex-row-reverse">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-black border border-gray-100"><Zap size={20} fill="currentColor" /></div>
              <span className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-[#7A1E2C] uppercase">2026 • Checkpoint 3</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black uppercase mb-2 tracking-tight">SHIPPED</h3>
            <p className="text-xl md:text-2xl text-gray-500 font-medium mb-10 border-b border-gray-100 pb-8 w-full">International Recognition</p>
            <div className="flex flex-col gap-4 w-full md:items-end">
               <div className="flex items-center gap-4 md:flex-row-reverse p-4 bg-yellow-50 rounded-xl border border-yellow-100"><span className="text-yellow-700"><Globe size={24} /></span><span className="font-bold text-yellow-900 text-right">TechFiesta International Winner</span></div>
               <div className="flex items-center gap-4 md:flex-row-reverse p-4 bg-gray-50 rounded-xl border border-gray-100"><span className="text-green-600"><Leaf size={24} /></span><span className="font-bold text-gray-800 text-right">Agriculture AI Solution</span></div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 5: INTERNED (LEFT) */}
        <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[60vh]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8 }}>
          <div className="md:col-span-6 flex flex-col items-start bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-black border border-gray-100"><Briefcase size={20} /></div>
              <span className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-[#7A1E2C] uppercase">Present • Checkpoint 4</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black uppercase mb-2 tracking-tight">INTERNED</h3>
            <p className="text-xl md:text-2xl text-gray-500 font-medium mb-10 border-b border-gray-100 pb-8 w-full">Industry Experience</p>
            <div className="flex flex-wrap gap-3">
               {['APIs', 'LLM Systems', 'AI Research', 'Product Development'].map(t => (
                 <span key={t} className="px-4 py-2 bg-gray-900 text-white rounded-md text-xs font-bold uppercase tracking-wide">{t}</span>
               ))}
            </div>
          </div>
          <div className="md:col-span-6 flex flex-col gap-6">
            <div className="bg-white border border-gray-100 rounded-[2rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="flex items-center gap-5 mb-10">
                 <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 border border-gray-100 shadow-sm"><Building2 size={28} /></div>
                 <div>
                   <h4 className="text-2xl font-black text-black tracking-tight">MindstriX Technologies</h4>
                   <p className="text-[#7A1E2C] font-bold text-sm tracking-widest uppercase mt-1">Software Eng Intern</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Production Pipeline</p>
                 <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner"><motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-black rounded-full" /></div>
                 <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                   <span>Research</span>
                   <span>Development</span>
                   <span className="text-black">Production</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 6: FUTURE (RIGHT) */}
        <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[60vh] pb-32" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8 }}>
          <div className="md:col-span-6 order-2 md:order-1 flex flex-col gap-6">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-12 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7A1E2C] rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
              <h4 className="text-4xl md:text-5xl font-black mb-10 leading-tight relative z-10 tracking-tight">Autonomous<br/>Systems Focus</h4>
              <div className="flex flex-col gap-6 relative z-10">
                 <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-[#00E676] shadow-[0_0_15px_#00E676]" /> <span className="font-bold text-gray-200 text-lg tracking-wide">Edge Intelligence</span></div>
                 <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-[#4285F4] shadow-[0_0_15px_#4285F4]" /> <span className="font-bold text-gray-200 text-lg tracking-wide">Smart Infrastructure</span></div>
                 <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_white]" /> <span className="font-bold text-gray-200 text-lg tracking-wide">Embedded AI</span></div>
              </div>
            </div>
          </div>
          <div className="md:col-span-6 order-1 md:order-2 flex flex-col items-start md:items-end md:text-right bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 relative">
            <div className="absolute -top-6 -right-6 text-[#7A1E2C] drop-shadow-2xl animate-pulse"><Target size={64} /></div>
            <div className="flex items-center gap-4 mb-6 md:flex-row-reverse">
              <div className="w-12 h-12 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-xl border border-gray-800"><Flag size={20} /></div>
              <span className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-gray-500 uppercase">Destination</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-black uppercase mb-2 tracking-tight">BUILDING THE FUTURE</h3>
            <p className="text-xl md:text-2xl text-[#7A1E2C] font-black mb-10 border-b border-gray-100 pb-8 w-full uppercase tracking-widest">AI Systems Engineer</p>
            <p className="text-2xl font-medium text-gray-800 italic">"The journey is still in progress."</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Journey;
