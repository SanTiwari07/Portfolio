import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// --- VISUALIZERS ---

const TrafficVisual = () => (
  <div className="relative w-full h-full min-h-[120px] bg-[#050505] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center mt-4">
    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 100">
      <line x1="100" y1="0" x2="100" y2="100" stroke="#fff" strokeWidth="2" strokeDasharray="5 5" />
      <motion.rect x="75" width="16" height="26" fill="transparent" stroke="#00E676" strokeWidth="1.5"
        animate={{ y: [-30, 110] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
      <motion.rect x="109" width="16" height="26" fill="transparent" stroke="#00E676" strokeWidth="1.5"
        animate={{ y: [110, -30] }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 0.5 }} />
      <motion.rect x="109" width="16" height="26" fill="transparent" stroke="#00E676" strokeWidth="1.5"
        animate={{ y: [110, -30] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 1.5 }} />
    </svg>
    <div className="absolute top-2 left-2 text-[8px] text-[#00E676] font-mono uppercase tracking-widest">Live Feed // YOLOv8</div>
  </div>
);

const PotholeVisual = () => (
  <div className="relative w-full h-full min-h-[100px] bg-[#050505] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center mt-2">
    <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 200 100">
      <path d="M 0 50 L 200 50 M 100 0 L 100 100" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" opacity="0.2" />
      <motion.rect x="40" y="30" width="30" height="20" fill="transparent" stroke="#FF3D00" strokeWidth="1.5" strokeDasharray="4 2" 
        animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.rect x="130" y="60" width="25" height="15" fill="transparent" stroke="#FF3D00" strokeWidth="1.5" strokeDasharray="4 2" 
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
      <motion.line x1="0" y1="20" x2="200" y2="20" stroke="#FF3D00" strokeWidth="1" strokeOpacity="0.5"
        animate={{ y: [0, 80, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
    </svg>
    <div className="absolute top-2 left-2 text-[8px] text-[#FF3D00] font-mono uppercase tracking-widest">Surface Scan // Active</div>
  </div>
);

const MarketVisual = () => (
  <div className="relative w-full h-full min-h-[120px] bg-[#050505] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center mt-2">
    <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 200 100">
      <path d="M 0 25 L 200 25 M 0 50 L 200 50 M 0 75 L 200 75" stroke="#fff" strokeWidth="1" opacity="0.1" />
      {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map((x, i) => {
        const isUp = i % 2 === 0 || i === 3 || i === 7;
        const c = isUp ? '#00E676' : '#FF3D00';
        const baseY = isUp ? 40 : 50;
        return (
          <motion.g key={i} animate={{ y: [0, Math.random() * 10 - 5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}>
            <line x1={x+4} y1={baseY - 10} x2={x+4} y2={baseY + 30} stroke={c} strokeWidth="1" />
            <rect x={x} y={baseY} width="8" height="20" fill={c} opacity="0.8" />
          </motion.g>
        );
      })}
    </svg>
    <div className="absolute top-2 left-2 text-[8px] text-[#2979FF] font-mono uppercase tracking-widest">API Data // Nominal</div>
  </div>
);

const ResearchVisual = () => (
  <div className="relative w-full h-full min-h-[120px] bg-[#050505] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center mt-2">
    <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 200 100">
      {[
        [40, 20], [40, 50], [40, 80],
        [100, 35], [100, 65],
        [160, 50]
      ].map((node, i) => (
        <circle key={i} cx={node[0]} cy={node[1]} r="4" fill="#D500F9" />
      ))}
      <motion.path d="M40 20 L100 35 M40 50 L100 35 M40 80 L100 65 M100 35 L160 50 M100 65 L160 50" 
        stroke="#D500F9" strokeWidth="1.5" strokeOpacity="0.2" fill="none"
        animate={{ strokeOpacity: [0.1, 0.8, 0.1] }} transition={{ duration: 2, repeat: Infinity }} />
    </svg>
    <div className="absolute top-2 left-2 text-[8px] text-[#D500F9] font-mono uppercase tracking-widest">Agent Logic // Evaluating</div>
  </div>
);

// --- COMPONENT ---

const ControlCenter: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <section ref={ref} id="projects" className="relative w-full bg-[#030303] py-24 md:py-32 px-4 md:px-8">
      {/* Background Engineering Grids */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }} />

      <div className="relative z-10 max-w-[1600px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-4 mb-12"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-[1px] bg-[#7A1E2C]" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-mono">05 / Projects</span>
          <div className="w-8 h-[1px] bg-[#7A1E2C]" />
          <h2 className="ml-4 text-2xl md:text-3xl font-black text-white tracking-widest uppercase">Operations Center</h2>
        </motion.div>

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-[minmax(280px,_1fr)_minmax(280px,_1fr)_minmax(280px,_1fr)] gap-4 md:gap-6 w-full">
          
          {/* PANEL 01: TRAFFIC (Tall Left) */}
          <motion.div 
            className="lg:col-span-1 lg:row-span-2 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#00E676]/50 transition-colors"
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[9px] text-[#00E676] uppercase tracking-[0.4em] font-mono bg-[#00E676]/10 px-2 py-1 rounded">Panel 01</span>
                 <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">Traffic Intelligence</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Dynamic Signal System</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] text-gray-400 font-mono uppercase">Vehicles Detected</span>
                  <span className="text-sm text-white font-bold">42,105</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] text-gray-400 font-mono uppercase">Avg Wait Time</span>
                  <span className="text-sm text-[#00E676] font-bold">-40%</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] text-gray-400 font-mono uppercase">Signal Duration</span>
                  <span className="text-sm text-white font-bold">Dynamic</span>
                </div>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col justify-end">
               <TrafficVisual />
               <div className="flex gap-2 mt-4 flex-wrap">
                 {['YOLOv8', 'OpenCV', 'Python', 'ESP32'].map(tech => (
                   <span key={tech} className="text-[8px] bg-white/5 text-gray-400 px-2 py-1 rounded border border-white/10 uppercase tracking-wider">{tech}</span>
                 ))}
               </div>
            </div>
          </motion.div>

          {/* PANEL 02: ROAD VISION (Top Middle Wide) */}
          <motion.div 
            className="lg:col-span-2 lg:row-span-1 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 group hover:border-[#FF3D00]/50 transition-colors"
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          >
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                   <span className="text-[9px] text-[#FF3D00] uppercase tracking-[0.4em] font-mono bg-[#FF3D00]/10 px-2 py-1 rounded">Panel 02</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Road Vision</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Intelligent Pothole Detection</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">Potholes Detected</div>
                   <div className="text-lg text-white font-bold">1,204</div>
                 </div>
                 <div>
                   <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">Confidence Score</div>
                   <div className="text-lg text-[#FF3D00] font-bold">94.2%</div>
                 </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
               <PotholeVisual />
            </div>
          </motion.div>

          {/* PANEL 05: ACHIEVEMENTS (Tall Right) */}
          <motion.div 
            className="lg:col-span-1 lg:row-span-2 bg-gradient-to-b from-[#7A1E2C]/20 to-[#0A0A0A]/80 backdrop-blur-md border border-[#7A1E2C]/40 rounded-2xl p-6 flex flex-col"
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
               <span className="text-[9px] text-[#F4C300] uppercase tracking-[0.4em] font-mono bg-[#F4C300]/10 px-2 py-1 rounded">Console</span>
               <div className="w-1.5 h-1.5 rounded-full bg-[#F4C300] animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Operator<br/>Record</h3>
            
            <div className="space-y-6 flex-grow">
              <div>
                <div className="text-[10px] text-gray-400 font-mono uppercase mb-1">Competitions</div>
                <div className="text-3xl text-white font-black tracking-tighter">4× Awardee</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-mono uppercase mb-1">Academia</div>
                <div className="text-3xl text-white font-black tracking-tighter">9.42 CGPA</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-mono uppercase mb-1">MHT-CET</div>
                <div className="text-3xl text-[#00E676] font-black tracking-tighter">99.34%</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-mono uppercase mb-1">Impact Radius</div>
                <div className="text-3xl text-white font-black tracking-tighter">700+ Teams</div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10">
               <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">Current Status</div>
               <div className="text-sm text-[#F4C300] font-black uppercase tracking-widest">Software Engineer Intern</div>
            </div>
          </motion.div>

          {/* CENTER PORTRAIT (Center 2x1) */}
          <motion.div 
            className="lg:col-span-2 lg:row-span-1 border border-[#7A1E2C]/50 rounded-2xl bg-[#050505] overflow-hidden relative flex items-center justify-center group"
            initial={{ opacity: 0, scale: 0.95 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Replace this src with actual imported image when available */}
            <img src="/assets/main_image.png" alt="Sanskar Tiwari" className="absolute inset-0 w-full h-full object-cover object-top opacity-60 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
            
            {/* Fallback text if image fails to load */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
               <span className="text-[#7A1E2C]/20 font-black text-6xl uppercase tracking-tighter">OPERATOR</span>
            </div>

            <div className="absolute bottom-6 left-6 z-10">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                 <span className="text-[10px] text-[#00E676] font-mono uppercase tracking-widest">System Architect Online</span>
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight">Sanskar Tiwari</h3>
            </div>
            
            {/* HUD Overlay Elements */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#7A1E2C]/50 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#7A1E2C]/50 rounded-bl-lg" />
          </motion.div>

          {/* PANEL 04: AI RESEARCH (Bottom Left Wide) */}
          <motion.div 
            className="lg:col-span-2 lg:row-span-1 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 group hover:border-[#D500F9]/50 transition-colors"
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
          >
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                   <span className="text-[9px] text-[#D500F9] uppercase tracking-[0.4em] font-mono bg-[#D500F9]/10 px-2 py-1 rounded">Panel 04</span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">AI Research</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Internship + LLM Systems</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">Agent Architecture</div>
                   <div className="text-sm text-white font-bold">LangChain Flow</div>
                 </div>
                 <div>
                   <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">Research Status</div>
                   <div className="text-sm text-[#D500F9] font-bold">Active Phase</div>
                 </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
               <ResearchVisual />
            </div>
          </motion.div>

          {/* PANEL 03: MARKET INTELLIGENCE (Bottom Right Wide) */}
          <motion.div 
            className="lg:col-span-2 lg:row-span-1 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 group hover:border-[#2979FF]/50 transition-colors"
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}
          >
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                   <span className="text-[9px] text-[#2979FF] uppercase tracking-[0.4em] font-mono bg-[#2979FF]/10 px-2 py-1 rounded">Panel 03</span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Market Intelligence</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">StockItUp Dashboard</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">Stocks Tracked</div>
                   <div className="text-sm text-white font-bold">Live API</div>
                 </div>
                 <div>
                   <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">Watchlist</div>
                   <div className="text-sm text-[#2979FF] font-bold">Synced</div>
                 </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
               <MarketVisual />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ControlCenter;
