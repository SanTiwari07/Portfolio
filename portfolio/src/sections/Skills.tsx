import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';

const techClusters = [
  {
    category: 'AI Systems',
    items: [
      { name: 'Python', usedIn: ['KrishiSaarthi', 'Traffic Analyzer'], icon: 'python', color: '#3776AB' },
      { name: 'TensorFlow', usedIn: ['Detection Models'], icon: 'tensorflow', color: '#FF6F00' },
      { name: 'PyTorch', usedIn: ['Model Training'], icon: 'pytorch', color: '#EE4C2C' },
      { name: 'OpenCV', usedIn: ['Computer Vision'], icon: 'opencv', color: '#5C3EE8' },
      { name: 'Scikit-Learn', usedIn: ['ML Pipelines'], icon: 'scikitlearn', color: '#F7931E' },
      { name: 'YOLOv8', usedIn: ['IPDS v2.0', 'Traffic Analyzer'], icon: 'ultralytics', color: '#00FFFF' },
      { name: 'LangChain', usedIn: ['RAG Systems'], icon: 'langchain', color: '#1C3C3C' },
      { name: 'Gemini', usedIn: ['AI Projects'], icon: 'googlegemini', color: '#8E75B2' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'FastAPI', usedIn: ['API Servers', 'AI Backends'], icon: 'fastapi', color: '#009688' },
      { name: 'Flask', usedIn: ['Web Apps', 'Prototypes'], icon: 'flask', color: '#000000' },
      { name: 'Node.js', usedIn: ['Web Projects', 'APIs'], icon: 'nodedotjs', color: '#339933' },
      { name: 'REST APIs', usedIn: ['MindstriX', 'All Projects'], icon: 'postman', color: '#FF6C37' },
    ],
  },
  {
    category: 'Mobile & Embedded',
    items: [
      { name: 'Kotlin', usedIn: ['Android apps'], icon: 'kotlin', color: '#7F52FF' },
      { name: 'Android', usedIn: ['Gemini + sensor apps'], icon: 'android', color: '#3DDC84' },
      { name: 'ESP32', usedIn: ['IPDS', 'SmartPot'], icon: 'espressif', color: '#E7352C' },
      { name: 'Arduino', usedIn: ['Embedded Projects', 'Sensors'], icon: 'arduino', color: '#00979D' },
      { name: 'Sensors', usedIn: ['Hardware Interfacing'], icon: 'lucide:Cpu', color: '#000000' },
      { name: 'Embedded C++', usedIn: ['Embedded Systems', 'Performance'], icon: 'cplusplus', color: '#00599C' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React', usedIn: ['Portfolio', 'Dashboards'], icon: 'react', color: '#61DAFB' },
      { name: 'JavaScript', usedIn: ['Web Logic', 'Interactivity'], icon: 'javascript', color: '#F7DF1E' },
      { name: 'Tailwind CSS', usedIn: ['UI Design', 'Styling'], icon: 'tailwindcss', color: '#06B6D4' },
      { name: 'Framer Motion', usedIn: ['Animations', 'Interactions'], icon: 'framer', color: '#0055FF' },
    ],
  },
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="relative w-full bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 md:py-32 border-t border-border-light">
        <SectionHeader index="03" label="Stack" title="What I build with." />

        <dl className="border-t border-border-light">
          {techClusters.map((cluster, i) => (
            <motion.div
              key={cluster.category}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-12 py-6 border-b border-border-light"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <dt className="md:col-span-4 font-mono text-xs text-text-secondary pt-1">{cluster.category}</dt>
              <dd className="md:col-span-8 flex flex-wrap gap-x-5 gap-y-2">
                {cluster.items.map((tech) => (
                  <span key={tech.name} className="text-base text-text-primary" title={`Used in: ${tech.usedIn.join(', ')}`}>
                    {tech.name}
                  </span>
                ))}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Skills;
