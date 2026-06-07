import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { VelocityScroll } from '../components/animations/VelocityScroll';
import { RevealText } from '../components/animations/RevealText';

const CurrentMission: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const missions = [
    { label: 'LLM Integration', desc: 'Building production-grade AI pipelines with large language models.' },
    { label: 'AI Research', desc: 'Exploring novel applications of generative AI in real-world systems.' },
    { label: 'API Development', desc: 'Designing scalable REST APIs that power intelligent applications.' },
    { label: 'Production AI Systems', desc: 'Shipping AI features that operate in real, live environments.' },
  ];

  return (
    <section ref={ref} id="mission" className="relative w-full bg-background overflow-hidden transition-colors duration-700">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-32 md:py-40">
        <motion.div
          className="flex items-center gap-4 mb-20"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-[1px] bg-primary transition-colors duration-700" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-text-secondary font-medium transition-colors duration-700">03 / Current Mission</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <div className="overflow-hidden mb-4">
              <VelocityScroll intensity={0.5}>
                <RevealText 
                  text="Current" 
                  className="text-[clamp(44px,5.5vw,80px)] font-black tracking-[-0.03em] text-text-primary leading-[0.9] uppercase transition-colors duration-700"
                  delay={0.1}
                />
              </VelocityScroll>
            </div>
            <div className="overflow-hidden mb-10">
              <VelocityScroll intensity={0.5}>
                <RevealText 
                  text="Mission." 
                  className="text-[clamp(44px,5.5vw,80px)] font-black tracking-[-0.03em] text-accent leading-[0.9] uppercase transition-colors duration-700"
                  delay={0.3}
                />
              </VelocityScroll>
            </div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot transition-colors duration-700" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-primary transition-colors duration-700">Active · 2026 → Present</span>
              </div>
              <div className="text-2xl font-black text-text-primary uppercase tracking-tight transition-colors duration-700">
                Software Engineer Intern
              </div>
              <div className="text-sm text-text-secondary tracking-[0.2em] uppercase font-medium transition-colors duration-700">
                MindstriX Technologies LLP
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-0">
              {missions.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="group border-b border-border-light py-8 flex items-start justify-between gap-8 hover:border-primary/40 transition-colors duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-start gap-6 flex-1">
                    <span className="text-[10px] text-text-secondary tracking-[0.2em] mt-1 tabular-nums transition-colors duration-700">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors duration-300 mb-2">
                        {item.label}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed transition-colors duration-700">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-6 h-[1px] bg-border-light group-hover:w-12 group-hover:bg-primary transition-all duration-400 mt-3 flex-shrink-0" />
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-xs text-text-secondary tracking-[0.3em] uppercase mt-10 transition-colors duration-700"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Pune, Maharashtra · Full-Time
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentMission;
