import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const skillCategories = [
  {
    title: "Programming",
    skills: ["Python", "Java", "C", "C++"]
  },
  {
    title: "Web Development",
    skills: ["HTML", "CSS", "React", "Node.js"]
  },
  {
    title: "Machine Learning / AI",
    skills: ["PyTorch", "Scikit-Learn", "Computer Vision", "LLM"]
  },
  {
    title: "Tools & Platforms",
    skills: ["AWS", "GitHub", "Git", "Linux"]
  }
];

const Skills: React.FC = () => {
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
          <span className="text-xs font-mono font-bold tracking-[0.4em] text-gray-400 uppercase">Toolkit</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-950 uppercase italic leading-none">
          Technical <span className="text-primary italic">Arsenal</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {skillCategories.map((category, idx) => (
          <motion.div
            key={idx}
            className="group p-10 bg-white border border-gray-100 rounded-3xl hover:border-primary/30 transition-all duration-500 hover:shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <h3 className="text-2xl font-bold font-heading text-gray-950 uppercase mb-8 flex items-center gap-4">
              <div className="w-3 h-3 bg-primary group-hover:scale-150 transition-transform" />
              {category.title}
            </h3>
            
            <ul className="space-y-4">
              {category.skills.map((skill, sIdx) => (
                <li key={sIdx} className="flex items-center gap-4 text-gray-400 group-hover:text-gray-950 transition-colors duration-300 font-medium">
                   <div className="h-[1px] w-6 bg-gray-100 group-hover:bg-primary transition-colors" />
                   <span className="font-mono text-lg tracking-wide uppercase italic">{skill}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
