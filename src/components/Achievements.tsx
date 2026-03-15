import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const achievements = [
  {
    title: "TechFiesta ’26",
    category: "International Hackathon",
    meta: "1st Rank / 700+ Teams",
    prize: "₹1,00,000 Prize",
    description: "Built KrishiSahAI Advisory, an AI-driven agriculture platform solving real farmer-level challenges through Generative AI and Computer Vision.",
    outcome: "Secured Grand Prize among 700+ teams. Recognized for real-world viability and potential to increase farmer income by 30-50%."
  },
  {
    title: "VOIS Innovation",
    category: "Marathon 2.0",
    meta: "Top 3 Finisher",
    prize: "₹2,00,000 Prize",
    description: "Developed KrishiSaarthi, an AI & Blockchain 'Phygital' platform for Indian agriculture featuring deep learning disease detection.",
    outcome: "Awarded ₹2,00,000. Validated through Phase Zero ground research directly with local farmers."
  }
];

const Achievements: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div ref={ref} className="w-full">
      <motion.div 
        className="mb-20 space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-8 bg-primary" />
          <span className="text-xs font-mono font-bold tracking-[0.4em] text-gray-400 uppercase">Credentials</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-950 uppercase italic leading-none">
          Achievements & <br />
          <span className="text-primary italic">Hackathon Wins</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-12">
        {achievements.map((item, index) => (
          <motion.div
            key={index}
            className="group relative bg-white border border-gray-100 p-8 md:p-12 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
            
            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
              {/* Left Side: Meta */}
              <div className="lg:w-1/3 space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary uppercase font-mono font-black text-[10px] tracking-widest italic font-heading">
                    {item.meta}
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 uppercase font-mono font-black text-[10px] tracking-widest italic font-heading">
                    {item.prize}
                  </span>
                </div>
                <div className="space-y-1">
                   <h3 className="text-3xl md:text-4xl font-black font-heading text-gray-950 tracking-tighter uppercase">{item.title}</h3>
                   <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.3em]">{item.category}</p>
                </div>
              </div>

              {/* Right Side: Content */}
              <div className="lg:w-2/3 space-y-8">
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
                  {item.description}
                </p>
                
                <div className="p-6 bg-gray-50/80 border-l-4 border-primary rounded-r-xl">
                   <h4 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                     Impact / Outcome
                   </h4>
                   <p className="text-gray-700 font-medium leading-relaxed">
                     {item.outcome}
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
