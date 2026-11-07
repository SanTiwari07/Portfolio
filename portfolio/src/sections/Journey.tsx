import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';

interface Entry {
  date: string;
  title: string;
  detail: string;
  highlight?: boolean;
}

const timeline: Entry[] = [
  {
    date: '2024',
    title: 'Started Electronics & Telecommunication at PICT, Pune',
    detail: 'First hardware builds on Arduino and ESP32: a smart plant monitor, a wet/dry waste-sorting dustbin and a sun-tracking solar panel.',
  },
  {
    date: '2025',
    title: 'Moved into computer vision',
    detail: 'Built the Smart Traffic Flow Analyzer (YOLOv8 + SORT) and the first version of IPDS, a pothole detection system.',
  },
  {
    date: 'Feb 2026',
    title: 'Top 3, VOIS Innovation Marathon 2.0',
    detail: 'KrishiSaarthi, an AI and blockchain agriculture platform. Vodafone Idea Foundation, 630+ teams.',
  },
  {
    date: 'Mar 2026',
    title: "1st place, TechFiesta '26 International Hackathon",
    detail: 'KrishiSahAI, an AI advisory platform for farmers. Agriculture domain, 700+ teams.',
    highlight: true,
  },
  {
    date: 'Mar 2026',
    title: 'Joined MindstriX Technologies as a Software Engineer Intern',
    detail: 'Remote. LLM integration, API development and AI R&D.',
  },
  {
    date: 'May 2026',
    title: 'Runner-Up, Pune Agri International Hackathon',
    detail: 'Krishi Prabandh, an AI governance platform for agriculture, presented to the Chief Minister of Maharashtra.',
  },
  {
    date: 'Jul 2026',
    title: '1st place, HackVenture 2026 (Agritech)',
    detail: 'GramDrishti, a satellite and AI climate-intelligence platform for villages, started by and built with Shweta Patil.',
    highlight: true,
  },
  {
    date: 'Now',
    title: 'Building AI-native Android apps',
    detail: 'Combining the Gemini API with real sensor data.',
  },
];

const Journey: React.FC = () => {
  return (
    <section id="journey" className="relative w-full bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 md:py-32 border-t border-border-light">
        <SectionHeader index="05" label="Timeline" title="How I got here." />

        <ol className="relative border-l border-border-light ml-1 md:ml-0">
          {timeline.map((entry, i) => (
            <motion.li
              key={`${entry.date}-${entry.title}`}
              className="relative grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-12 pl-8 md:pl-10 pb-10 last:pb-0"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.04 }}
            >
              <span
                className={`absolute -left-[5px] top-[0.45rem] h-[9px] w-[9px] rounded-full border ${
                  entry.highlight ? 'bg-primary border-primary' : 'bg-background border-text-secondary'
                }`}
                aria-hidden="true"
              />
              <p className="md:col-span-3 font-mono text-xs text-text-secondary pt-1">{entry.date}</p>
              <div className="md:col-span-9">
                <h3 className="text-lg md:text-xl text-text-primary">{entry.title}</h3>
                <p className="mt-1.5 text-base text-text-secondary leading-relaxed max-w-2xl">{entry.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Journey;
