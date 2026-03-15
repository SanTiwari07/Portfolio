import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const projects = [
  {
    name: "KrishiSetu",
    description: "A platform I built to help Indian farmers make better decisions. It uses AI to provide real-time sustainability insights and automates their daily workflows.",
    stack: ["AI", "System Architecture", "Impact"],
    url: "https://github.com/SanTiwari07/KrishiSetu"
  },
  {
    name: "KrishiSaarthi",
    description: "A smart assistant created to guide farmers through everyday crop issues. It uses machine learning to offer practical, actionable advice exactly when it's needed most.",
    stack: ["ML", "Applied Intelligence", "Social Impact"],
    url: "https://github.com/SanTiwari07/KrishiSaarthi"
  },
  {
    name: "Smart Traffic Flow Analyzer",
    description: "Vision-based system to analyze traffic density in real-time and dynamically adjust signal timings based on vehicle count.",
    stack: ["Computer Vision", "ML", "Systems Thinking"],
    url: "https://github.com/SanTiwari07/Smart-Traffic-Flow-Analyzer"
  },
  {
    name: "UniFit Health",
    description: "Platform that helps students stay healthy despite crazy schedules. Performance tracking, hydration, and nutrition into one AI-driven app.",
    stack: ["AI Systems", "Product Thinking"],
    url: "https://github.com/SanTiwari07/UniFit-Health"
  }
];

const Projects: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className="w-full">
      <motion.div 
        className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="h-[2px] w-8 bg-primary" />
              <span className="text-xs font-mono font-bold tracking-[0.4em] text-gray-400 uppercase">Works</span>
           </div>
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-950 uppercase italic leading-none">
              Selected <span className="text-primary italic">Projects</span>
           </h2>
        </div>
        
        <a 
          href="https://github.com/SanTiwari07" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-3 text-sm font-black font-heading uppercase tracking-widest text-gray-500 hover:text-primary transition-all duration-300"
        >
          View GitHub 
          <span className="w-10 h-[1px] bg-gray-200 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((item, index) => (
          <motion.a
             key={index}
             href={item.url}
             target="_blank"
             rel="noopener noreferrer"
             className="group relative p-10 bg-white border border-gray-100 rounded-[2rem] hover:border-primary/20 transition-all duration-500 hover:shadow-2xl flex flex-col items-start overflow-hidden"
             initial={{ opacity: 0, y: 40 }}
             animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
             transition={{ duration: 0.8, delay: index * 0.15 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>

            <h3 className="text-2xl md:text-3xl font-black font-heading text-gray-950 uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
              {item.name}
            </h3>

            <p className="text-lg text-gray-500 leading-relaxed font-medium mb-10 line-clamp-3">
              {item.description}
            </p>

            <div className="mt-auto flex flex-wrap gap-2">
              {item.stack.map((tech, tIdx) => (
                <span key={tIdx} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest italic group-hover:border-primary/20 group-hover:text-primary transition-all">
                  {tech}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default Projects;
