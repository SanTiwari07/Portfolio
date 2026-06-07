import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const allImages = [
  { src: '/assets/awards/techfiesta/tech (1).jpg', alt: 'TechFiesta 2026 - Gold Award', event: 'TechFiesta' },
  { src: '/assets/awards/techfiesta/tech (2).jpg', alt: 'TechFiesta 2026 - Ceremony', event: 'TechFiesta' },
  { src: '/assets/awards/techfiesta/tech (3).jpg', alt: 'TechFiesta 2026 - Team', event: 'TechFiesta' },
  { src: '/assets/awards/Pune Agri/pune (1).JPG', alt: 'Pune Agri Hackathon - Award', event: 'Pune Agri' },
  { src: '/assets/awards/Pune Agri/pune (2).jpg', alt: 'Pune Agri Hackathon - Ceremony', event: 'Pune Agri' },
  { src: '/assets/awards/Pune Agri/pune (3).jpg', alt: 'Pune Agri Hackathon - Group', event: 'Pune Agri' },
  { src: '/assets/awards/vois/vois (1).jpg', alt: 'VOIS Innovation - Presenting', event: 'VOIS Marathon' },
  { src: '/assets/awards/vois/vois (2).jpg', alt: 'VOIS Innovation - Trophy', event: 'VOIS Marathon' },
  { src: '/assets/awards/vois/vois (3).jpg', alt: 'VOIS Innovation - Team', event: 'VOIS Marathon' },
  { src: '/assets/awards/vois/vois (4).jpg', alt: 'VOIS Innovation - Winner', event: 'VOIS Marathon' }
];

const detailedAwards = [
  {
    subtitle: 'VOIS INNOVATION MARATHON 2.0 BY VODAFONE IDEA',
    title: 'KrishiSaarthi',
    description: 'AI & Blockchain Powered Agricultural Intelligence Platform',
    image: '/assets/awards/vois/vois (1).jpg',
    bullets: [
      { icon: '🏆', text: 'Top 3 among 630+ teams' },
      { icon: '💰', text: '₹2,00,000 Cash Prize' },
    ],
    tags: ['React', 'Node.js', 'Machine Learning', 'Blockchain', 'Smart Contracts'],
    link: '#',
  },
  {
    subtitle: "TECHFIESTA '26 INTERNATIONAL HACKATHON",
    title: 'KrishiSahAI',
    description: 'AI Farmer Advisory Platform',
    image: '/assets/awards/techfiesta/tech (3).jpg',
    bullets: [
      { icon: '🏆', text: '1st Rank - Agriculture Domain' },
      { icon: '💰', text: '₹50,000 Grand Prize' },
      { icon: '🎯', text: 'Top of 700+ teams' },
    ],
    tags: ['Python', 'FastAPI', 'Computer Vision', 'React', 'IoT'],
    link: '#',
  },
  {
    subtitle: 'PUNE AGRI INTERNATIONAL HACKATHON',
    title: 'Krishi Prabandh',
    description: 'Upgrade to current government Existing website',
    image: '/assets/awards/Pune Agri/pune (2).jpg',
    bullets: [
      { icon: '🏆', text: 'National Runner-Up' },
      { icon: '💰', text: '₹15 Lakhs from government for development' },
      { icon: '🎯', text: 'Agriculture Innovation Category' }
    ],
    tags: ['Machine Learning', 'Scikit-Learn', 'IoT Sensors', 'Python'],
    link: '#',
  }
];

const metrics = [
  { value: '4+', label: 'Hackathon Podiums' },
  { value: '2', label: 'International Events' },
  { value: '1', label: 'Industry Internship' },
];

const marqueeImages = [...allImages, ...allImages];

const RaceRecord: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section ref={ref} id="awards" className="relative w-full bg-background overflow-hidden py-28 md:py-40 transition-colors duration-700">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-20">
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-[1px] bg-primary transition-colors duration-700" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-text-secondary font-medium transition-colors duration-700">05 / Race Record</span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h2
            className="text-[clamp(56px,8vw,120px)] font-black tracking-[-0.04em] text-text-primary leading-[0.85] uppercase transition-colors duration-700"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Race Record.
          </motion.h2>
        </div>
      </div>

      <div className="w-full overflow-hidden mb-28 relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-colors duration-700" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-colors duration-700" />

        <div className="marquee-track">
          {marqueeImages.map((img, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[320px] h-[220px] mx-3 overflow-hidden group cursor-none rounded-xl"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                <span className="text-[9px] tracking-[0.4em] uppercase text-card font-semibold bg-primary px-2 py-1 transition-colors duration-700">
                  {img.event}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 space-y-16 mb-32">
        {detailedAwards.map((award, i) => (
          <motion.div
            key={i}
            className="flex flex-col lg:flex-row bg-card rounded-[2rem] overflow-hidden border border-border-light shadow-[0_8px_40px_rgba(0,0,0,0.04)] group/card transition-colors duration-700"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left Image Section */}
            <div className="lg:w-[45%] h-[300px] lg:h-auto relative overflow-hidden group">
              <img
                src={award.image}
                alt={award.title}
                style={award.imageStyle}
                className={`w-full h-full object-cover transition-transform duration-700 ${award.imageStyle ? '' : 'group-hover:scale-105'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card opacity-0 lg:opacity-100 transition-colors duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-100 lg:opacity-0 transition-colors duration-700" />
            </div>

            {/* Right Content Section */}
            <div className="lg:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold mb-3 transition-colors duration-700">
                {award.subtitle}
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary mb-2 group-hover/card:text-primary transition-colors duration-500">
                {award.title}
              </h3>
              <p className="text-sm md:text-base text-text-secondary mb-8 transition-colors duration-700">
                {award.description}
              </p>

              <div className="space-y-3 mb-10">
                {award.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm md:text-base text-text-primary font-medium transition-colors duration-700">
                    <span>{bullet.icon}</span>
                    <span>{bullet.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                {award.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-full bg-background text-text-secondary border border-border-light transition-colors duration-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                <a
                  href={award.link}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary hover:bg-primary transition-colors duration-700 text-sm text-background font-semibold"
                  data-cursor="hover"
                >
                  Know More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-3 gap-0 border-t border-border-light transition-colors duration-700">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              className="py-12 text-center border-r border-border-light last:border-r-0 transition-colors duration-700"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.7 }}
            >
              <div className="text-[clamp(40px,5vw,72px)] font-black tracking-[-0.03em] text-text-primary leading-none mb-2 transition-colors duration-700">
                {m.value}
              </div>
              <div className="text-[10px] tracking-[0.4em] uppercase text-text-secondary font-medium transition-colors duration-700">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RaceRecord;
