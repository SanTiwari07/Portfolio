import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Code2, BarChart3, ArrowRight } from 'lucide-react';

const platforms = [
  {
    name: "GitHub",
    description: "Where I build and ship technical projects, hardware designs, and ML models.",
    icon: () => (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    link: "https://github.com/SanTiwari07"
  },
  {
    name: "LinkedIn",
    description: "Professional profile, achievements, and updates on my engineering journey.",
    icon: () => (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
    link: "https://www.linkedin.com/in/sanskar-tiwari-b781a9315/"
  },
  {
    name: "LeetCode",
    description: "Algorithmic problem solving and technical preparation.",
    icon: () => (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.303c.467-.467 1.125-.662 1.837-.662s1.357.195 1.824-.662l2.697 2.606c.514.515 1.335.515 1.849 0 .515-.515.515-1.335 0-1.849l-2.697-2.606c-1.081-1.081-2.608-1.538-4.247-1.538-1.64 0-3.166.457-4.247 1.538L3.93 11.23c-1.081 1.081-1.538 2.607-1.538 4.247s.457 3.166 1.538 4.247l4.331 4.363c1.081 1.081 2.608 1.538 4.247 1.538s3.166-.457 4.247-1.538l2.697-2.607c.515-.515.515-1.334 0-1.848a1.309 1.309 0 00-1.848 0z" />
      </svg>
    ),
    link: "https://leetcode.com/u/cmy7RSNHvA/"
  },
  {
    name: "Kaggle",
    description: "Machine learning datasets, competitions, and notebooks.",
    icon: () => (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.825 23.859c-.022.028-.117.141-.285.141h-4.83c-.33 0-.615-.128-.854-.383l-5.907-7.465-1.839 1.887v5.578c0 .35-.143.662-.428.93-.285.268-.597.403-.934.403H1.011c-.348 0-.663-.134-.944-.403a1.24 1.24 0 0 1-.42-.93V1.07c0-.348.14-.664.42-.944.281-.281.596-.421.944-.421h2.737c.337 0 .649.14.934.421.285.28.428.596.428.944v11.753l7.05-7.411c.218-.236.48-.354.786-.354h5.235c.18 0 .285.105.315.315.012.158-.04.285-.157.383l-7.394 7.507 7.822 9.802c.11.146.162.274.157.383a.434.434 0 0 1-.314.314z" />
      </svg>
    ),
    link: "https://www.kaggle.com/santiwari07"
  }
];

const Platforms: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div ref={ref} className="w-full flex flex-col space-y-16 bg-gray-50/50 p-8 md:p-16 border border-gray-100 rounded-[2rem]">
      <motion.div 
        className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="h-[2px] w-8 bg-primary" />
             <span className="text-xs font-mono font-bold tracking-[0.4em] text-gray-400 uppercase">Digital Presence</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-gray-950 uppercase italic leading-none">NETWORK.</h2>
        </div>

        <a 
          href="#contact" 
          className="group flex items-center gap-3 text-sm font-black font-heading uppercase tracking-widest text-gray-500 hover:text-primary transition-all duration-300"
        >
          Let's Talk
          <span className="w-10 h-[1px] bg-gray-200 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {platforms.map((platform, idx) => {
          const Icon = platform.icon;
          return (
            <motion.a
              key={idx}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col p-10 md:p-12 bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl min-h-[360px] md:min-h-[420px]"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
            >
              {/* Highlight background */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-50 group-hover:h-full group-hover:bg-primary/5 transition-all duration-500" />
              
              <div className="relative z-10 flex flex-col h-full gap-5">
                <div className="p-4 bg-gray-100 border border-gray-200 w-fit rounded-2xl group-hover:bg-primary group-hover:border-primary text-gray-950 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                  <Icon />
                </div>
                
                <div className="space-y-2 flex-grow">
                   <h3 className="text-2xl font-black font-heading text-gray-950 group-hover:text-primary transition-colors uppercase tracking-tight italic">{platform.name}</h3>
                   <p className="text-sm font-medium text-gray-500 leading-relaxed italic">{platform.description}</p>
                </div>
                
                <div className="pt-6 flex items-center justify-between border-t border-gray-100 mt-auto">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-mono font-black group-hover:text-primary transition-colors">Connect</span>
                  <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default Platforms;
