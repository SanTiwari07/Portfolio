import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FlaskConical, Cpu } from 'lucide-react';

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
    category: 'Embedded Systems',
    items: [
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

interface TechItemProps {
  name: string;
  icon: string;
  usedIn: string[];
  color: string;
  delay: number;
}

function TechItem({ name, icon, usedIn, color, delay }: TechItemProps) {
  const [hovered, setHovered] = useState(false);
  const { actualTheme } = useTheme();
  
  const displayColor = (color === '#000000' && actualTheme === 'dark') ? '#F5F5F5' : color;
  
  const isLucide = icon.startsWith('lucide:');
  const LucideIcon = isLucide && icon === 'lucide:FlaskConical' ? FlaskConical : (isLucide && icon === 'lucide:Cpu' ? Cpu : null);

  return (
    <motion.div
      className="relative group cursor-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="hover"
    >
      <div
        className={`relative flex flex-col items-center justify-center p-4 transition-all duration-300 ${
          hovered ? 'scale-110 -translate-y-2' : ''
        }`}
      >
        {/* We use SimpleIcons CDN to fetch the real, official SVG logo */}
        <div
          className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-300"
          style={{
            filter: hovered 
              ? `drop-shadow(0 10px 20px ${displayColor}40)` 
              : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
            color: displayColor
          }}
        >
          {isLucide && LucideIcon ? (
            <LucideIcon size={56} strokeWidth={1.5} className="relative z-10 transition-colors duration-300" />
          ) : (
            <>
              {icon === 'javascript' && actualTheme === 'light' && (
                <div className="absolute inset-[2px] bg-black rounded-sm z-0" />
              )}
              <img 
                src={`https://cdn.simpleicons.org/${icon}/${displayColor.replace('#', '')}`} 
                alt={`${name} Official Logo`} 
                className="relative z-10 w-full h-full object-contain"
              />
            </>
          )}
        </div>
        
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none"
          >
            <div 
              className="bg-text-primary text-background px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold tracking-widest uppercase whitespace-nowrap shadow-2xl transition-colors duration-700"
              style={{ borderTop: `2px solid ${displayColor}` }}
            >
              {name}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

const TechEcosystem: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section ref={ref} id="skills" className="relative w-full bg-background overflow-hidden transition-colors duration-700">
      <div className="absolute inset-0 blueprint-grid opacity-40 pointer-events-none transition-colors duration-700" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-32 md:py-40 flex flex-col items-center text-center">
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-[1px] bg-primary transition-colors duration-700" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-text-secondary font-medium transition-colors duration-700">04 / Ecosystem</span>
          <div className="w-8 h-[1px] bg-primary transition-colors duration-700" />
        </motion.div>

        <div className="mb-24 flex flex-col items-center">
          <div className="overflow-hidden mb-4">
            <motion.h2
              className="text-[clamp(40px,5vw,80px)] font-black tracking-[-0.03em] text-text-primary leading-[0.9] uppercase transition-colors duration-700"
              initial={{ y: '100%' }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              Technology Stack.
            </motion.h2>
          </div>
          <motion.p
            className="text-text-secondary text-sm md:text-base max-w-lg mt-4 leading-relaxed transition-colors duration-700"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            The premium architecture powering every system I build, from neural networks to microcontrollers.
          </motion.p>
        </div>

        <div className="w-full flex flex-col items-center gap-24">
          {techClusters.map((cluster, clusterIdx) => (
            <motion.div
              key={cluster.category}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: clusterIdx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center w-full"
            >
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="w-[1px] h-4 bg-border-light transition-colors duration-700" />
                <h3 className="text-xs md:text-sm tracking-[0.4em] uppercase font-bold text-text-primary transition-colors duration-700">
                  {cluster.category}
                </h3>
                <div className="w-[1px] h-4 bg-border-light transition-colors duration-700" />
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 max-w-4xl">
                {cluster.items.map((tech, idx) => (
                  <TechItem
                    key={tech.name}
                    name={tech.name}
                    icon={tech.icon}
                    usedIn={tech.usedIn}
                    color={tech.color}
                    delay={isInView ? clusterIdx * 0.1 + idx * 0.05 : 0}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechEcosystem;
