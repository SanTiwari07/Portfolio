import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';

const facts = [
  { label: 'CGPA', value: '9.31', note: 'ENTC, PICT Pune' },
  { label: 'MHT-CET', value: '99.34', note: 'percentile' },
  { label: 'Hackathons', value: '4 podiums', note: '2 first places' },
  { label: 'Current role', value: 'SWE Intern', note: 'MindstriX Technologies' },
];

const About: React.FC = () => {
  return (
    <section id="specs" className="relative w-full bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <SectionHeader index="01" label="About" title="I build software that has to work outside the lab." />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            className="lg:col-span-7 space-y-5 text-base md:text-lg leading-relaxed text-text-secondary"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
          >
            <p>
              I'm a third-year Electronics &amp; Telecommunication student at PICT, Pune, and a Software Engineer Intern at{' '}
              <span className="text-text-primary">MindstriX Technologies</span>, where I work on LLM integration, APIs and AI R&amp;D.
            </p>
            <p>
              Most of what I build sits where software, hardware and machine learning meet: a pothole-detection rig that fuses
              YOLOv8 with a dual-ESP32 setup, a traffic signal that retimes itself from live vehicle density, and an AI
              governance layer for agricultural insurance.
            </p>
            <p>Right now I'm building AI-native Android apps that combine the Gemini API with real sensor data.</p>

            <dl className="grid grid-cols-2 sm:grid-cols-4 border-t border-border-light pt-8 !mt-10 gap-y-6">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-xs text-text-secondary">{f.label}</dt>
                  <dd className="mt-1.5 font-display text-2xl text-text-primary tracking-tight">{f.value}</dd>
                  <dd className="text-xs text-text-secondary mt-0.5">{f.note}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.figure
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <picture>
              <source media="(min-width: 768px)" type="image/webp" srcSet="/images/hero/portrait.webp" />
              <source media="(min-width: 768px)" srcSet="/images/hero/portrait.png" />
              <source type="image/webp" srcSet="/images/hero/background.webp" />
              <img
                src="/images/hero/background.png"
                alt="Sanskar Tiwari"
                className="w-full aspect-[4/5] object-cover rounded-md border border-border-light"
                width={600}
                height={750}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </motion.figure>
        </div>
      </div>
    </section>
  );
};

export default About;
