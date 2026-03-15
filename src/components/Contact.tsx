import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div ref={ref} className="w-full flex flex-col items-center justify-center min-h-[50vh] relative py-20 px-4 bg-gray-50 border-2 border-gray-200 shadow-[8px_8px_0_rgba(0,0,0,0.05)]">
      
      {/* Background glowing blob for text (Light version) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-multiply" />

      <motion.div 
        className="text-center space-y-12 max-w-4xl w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-[2px] w-8 bg-primary" />
          <span className="text-xs font-mono font-bold tracking-[0.4em] text-gray-400 uppercase">Signal Check</span>
          <div className="h-[2px] w-8 bg-primary" />
        </div>
        
        <h2 className="text-6xl md:text-8xl lg:text-[120px] font-black font-heading tracking-tighter leading-none text-gray-950 uppercase selection:bg-primary selection:text-white">
          LET'S CONNECT
        </h2>

        <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Currently open to freelance and full-time opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>

        <div className="pt-12 flex justify-center">
          <a 
            href="mailto:sanskartiwari.smt2@gmail.com"
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white border-2 border-gray-900 overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0_rgba(33,150,243,1)] hover:-translate-y-1 block"
          >
            <div className="absolute inset-x-0 bottom-0 h-0 bg-primary transition-all duration-300 ease-out group-hover:h-full z-0" />
            
            <span className="relative z-10 text-xl font-bold font-heading uppercase text-gray-900 group-hover:text-white transition-colors tracking-wide">Initiate Comms</span>
            <div className="relative z-10 w-10 h-10 bg-gray-100 border border-gray-300 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
              <ArrowRight className="w-5 h-5 text-gray-900 group-hover:-rotate-45 transition-all" />
            </div>
            
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
