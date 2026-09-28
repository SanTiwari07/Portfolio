import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';

const work = [
  'LLM integration, including production Gemini Vision pipelines',
  'API development for AI-powered features',
  'AI research and development',
];

const Experience: React.FC = () => {
  return (
    <section id="mission" className="relative w-full bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 md:py-32 border-t border-border-light">
        <SectionHeader index="02" label="Experience" title="Where I work now." />

        <motion.article
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:col-span-4">
            <p className="font-mono text-xs text-text-secondary">Mar 2026 — Present · Remote</p>
          </div>
          <div className="md:col-span-8">
            <h3 className="text-2xl md:text-3xl text-text-primary">Software Engineer Intern</h3>
            <p className="mt-1 text-text-secondary">MindstriX Technologies LLP</p>
            <ul className="mt-6 space-y-3">
              {work.map((item) => (
                <li key={item} className="flex gap-3 text-base text-text-secondary leading-relaxed">
                  <span className="mt-[0.7em] h-px w-3 shrink-0 bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-xs text-text-secondary">LLM integration · API development · AI R&amp;D</p>
          </div>
        </motion.article>
      </div>
    </section>
  );
};

export default Experience;
