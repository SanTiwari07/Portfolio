import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start"
      >
        {/* Left Column: Visual & Header */}
        <div className="lg:col-span-5 space-y-12">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-8 bg-primary" />
              <span className="text-xs font-mono font-bold tracking-[0.4em] text-gray-400 uppercase">About Me</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black font-heading text-gray-950 tracking-tighter leading-none uppercase italic">
              Driven by curiosity, <br />
              <span className="text-primary italic">guided by data.</span>
            </h2>
          </motion.div>

          {/* Impact Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 bg-gray-50 border border-gray-100 rounded-2xl hover:border-primary/30 transition-all duration-500">
              <div className="text-2xl md:text-4xl font-black text-gray-950 mb-1">9.38</div>
              <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">CGPA (Current)</div>
            </div>
            <div className="p-6 md:p-8 bg-gray-50 border border-gray-100 rounded-2xl hover:border-primary/30 transition-all duration-500">
              <div className="text-2xl md:text-4xl font-black text-gray-950 mb-1">12+</div>
              <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Active Projects</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Narrative Content */}
        <div className="lg:col-span-7 pt-4 space-y-10">
          <motion.p variants={itemVariants} className="text-2xl md:text-3xl text-gray-700 leading-tight font-medium">
            I’m an <span className="text-gray-950 font-bold border-b-2 border-primary/20">Electronics & Telecommunication</span> engineering student exploring how hardware, software, and intelligence come together to form real-world systems.
          </motion.p>

          <motion.p variants={itemVariants} className="text-xl text-gray-500 leading-relaxed">
            My journey is driven by a deep curiosity about how low-level components, communication, and code scale into reliable, impactful solutions.
          </motion.p>

          <motion.div variants={itemVariants} className="h-[1px] w-full bg-gray-100" />

          <motion.p variants={itemVariants} className="text-xl text-gray-500 leading-relaxed italic">
            I build and improve systems by connecting hardware, software, and machine learning into practical projects. Along the way, I document what I learn and share my process openly.
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Building in Public // Learning from Feedback</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
