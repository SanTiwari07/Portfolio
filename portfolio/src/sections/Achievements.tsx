import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { VelocityScroll } from '../components/animations/VelocityScroll';

const allImages = [
  { src: '/images/awards/techfiesta/tech (1).webp', alt: 'TechFiesta 2026 - Gold Award', event: 'TechFiesta' },
  { src: '/images/awards/techfiesta/tech (2).webp', alt: 'TechFiesta 2026 - Ceremony', event: 'TechFiesta' },
  { src: '/images/awards/techfiesta/tech (3).webp', alt: 'TechFiesta 2026 - Team', event: 'TechFiesta' },
  { src: '/images/awards/Pune Agri/pune (1).webp', alt: 'Pune Agri Hackathon - Award', event: 'Pune Agri' },
  { src: '/images/awards/Pune Agri/pune (2).webp', alt: 'Pune Agri Hackathon - Ceremony', event: 'Pune Agri' },
  { src: '/images/awards/Pune Agri/pune (3).webp', alt: 'Pune Agri Hackathon - Group', event: 'Pune Agri' },
  { src: '/images/awards/vois/vois (1).webp', alt: 'VOIS Innovation - Presenting', event: 'VOIS Marathon' },
  { src: '/images/awards/vois/vois (2).webp', alt: 'VOIS Innovation - Trophy', event: 'VOIS Marathon' },
  { src: '/images/awards/vois/vois (3).webp', alt: 'VOIS Innovation - Team', event: 'VOIS Marathon' },
  { src: '/images/awards/vois/vois (4).webp', alt: 'VOIS Innovation - Winner', event: 'VOIS Marathon' }
];

const detailedAwards = [
  {
    subtitle: 'VOIS INNOVATION MARATHON 2.0 BY VODAFONE IDEA',
    title: 'KrishiSaarthi',
    description: 'AI & Blockchain Powered Agricultural Intelligence Platform',
    image: '/images/awards/vois/vois (1).webp',
    bullets: [
      { icon: '🏆', text: 'Top 3 among 630+ teams' },
      { icon: '💰', text: '₹2,00,000 Cash Prize' },
    ],
    tags: ['React', 'Node.js', 'Machine Learning', 'Blockchain', 'Smart Contracts'],
    modalTitle: 'Finalist (Top 3) – VOIS Innovation Marathon 2.0',
    modalSubtitle: 'Issued by Vodafone Idea Foundation in collaboration with Edunet Foundation · Feb 2026',
    modalDetails: `Selected among the top finalist teams in VOIS Innovation Marathon 2.0 on Emerging Technologies organized by Vodafone Idea Foundation in collaboration with Edunet Foundation.

Our team developed and presented an innovative technology solution addressing real-world challenges during the multi-phase hackathon, which included ideation, project development, mentorship, and final showcase.

The competition involved 600+ team registrations across universities, with only the top teams advancing to the final evaluation round. The event concluded with project demonstrations before an industry jury panel.

The program focused on emerging technologies, innovation, and practical problem-solving while collaborating with students from different universities across India.`,
  },
  {
    subtitle: "TECHFIESTA '26 INTERNATIONAL HACKATHON",
    title: 'KrishiSahAI',
    description: 'AI Farmer Advisory Platform',
    image: '/images/awards/techfiesta/tech (3).webp',
    bullets: [
      { icon: '🏆', text: '1st Rank - Agriculture Domain' },
      { icon: '💰', text: '₹50,000 Grand Prize' },
      { icon: '🎯', text: 'Top of 700+ teams' },
    ],
    tags: ['Python', 'FastAPI', 'Computer Vision', 'React', 'IoT'],
    modalTitle: 'Winner – Agriculture Domain, TechFiesta’26 International Hackathon',
    modalSubtitle: 'Issued by TechFiesta’26, PICT Pune · Mar 2026',
    modalDetails: `Secured 1st Rank in the Agriculture Domain at TechFiesta’26 – International Hackathon hosted by PICT, Pune. The event brought together 700+ teams and more than 3500 participants from across India and several international institutions, making it one of the largest student-led innovation hackathons.

Representing Team HoloSquad, we developed KrishiSahAI Advisory, an intelligent technology platform aimed at supporting farmers with better agricultural decision-making through modern digital tools and AI-driven insights. The solution focused on addressing real-world agricultural challenges by integrating multiple features such as crop monitoring, advisory support, and data-driven insights to assist farmers in improving productivity and sustainability.

The project was evaluated by a panel of industry experts, mentors, and technical judges, and was recognized for its innovation, practical impact, and potential for real-world implementation in the agricultural sector.

This achievement reflects our commitment to building meaningful technology solutions, collaborative teamwork, and applying engineering skills to solve real-world problems, especially in a domain as important as agriculture.`,
  },
  {
    subtitle: 'PUNE AGRI INTERNATIONAL HACKATHON',
    title: 'Krishi Prabandh',
    description: 'Upgrade to current government Existing website',
    image: '/images/awards/Pune Agri/pune (2).webp',
    bullets: [
      { icon: '🏆', text: 'National Runner-Up' },
      { icon: '💰', text: '₹15 Lakhs from government for development' },
      { icon: '🎯', text: 'Agriculture Innovation Category' }
    ],
    tags: ['Machine Learning', 'Scikit-Learn', 'IoT Sensors', 'Python'],
    modalTitle: 'Runner-Up – Pune Agri Hackathon 2026',
    modalSubtitle: 'Issued by Pune International Agri Hackathon 2026 · May 2026',
    modalDetails: `Secured the Runner-Up position at Pune Agri Hackathon 2026 while competing against established startups, companies, and experienced professionals from across Maharashtra. Being among the very few student teams in the competition made this achievement especially meaningful.

Our team developed Krishi Prabandh, an AI-powered agricultural governance and intelligence platform designed to support faster, smarter, and more transparent agricultural administration workflows. The solution focused on solving real-world challenges in areas such as crop insurance claim verification, subsidy approvals, grievance handling, and document validation.

One of the key innovations of the platform was an AI-assisted geo-tagged video verification system for crop insurance claims, enabling remote verification through guided video workflows. The system integrated:
• AI-based video analysis
• Geo-tagging
• OCR-based fraud detection
• Satellite NDVI validation
• Intelligent workflow routing
• Real-time dashboards for officers

The project was presented before government officials, senior officers, and administrative authorities, including the Collector. Our team was honored to receive recognition from:
• Devendra Fadnavis – Chief Minister of Maharashtra
• Dattatraya Bharane – Agriculture Minister, Maharashtra
• Chandrakant Patil – Higher & Technical Education Minister, Maharashtra

This achievement reflects innovation, teamwork, and the application of AI and engineering to solve impactful real-world problems in agriculture and governance.`,
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
  const [selectedAward, setSelectedAward] = useState<(typeof detailedAwards)[0] | null>(null);

  // Lock scroll when modal is open
  React.useEffect(() => {
    if (selectedAward) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedAward]);

  return (
    <section ref={ref} id="awards" className="relative w-full bg-background overflow-hidden py-28 md:py-40 transition-colors duration-700">
      
      {/* Modal */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent="true"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAward(null)} />
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col z-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-background/50 backdrop-blur-md rounded-full flex items-center justify-center text-text-primary hover:bg-background transition-colors z-20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div 
                className="flex-1 overflow-y-auto p-6 md:p-12 no-scrollbar"
                data-lenis-prevent="true"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight text-text-primary mb-3">
                  {selectedAward.modalTitle}
                </h2>
                <div className="text-sm md:text-base text-primary font-semibold tracking-wide mb-8">
                  {selectedAward.modalSubtitle}
                </div>
                
                <div className="w-full h-[1px] bg-border-light mb-8" />
                
                <div className="text-text-secondary text-sm md:text-base leading-relaxed space-y-6 whitespace-pre-wrap">
                  {selectedAward.modalDetails}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <VelocityScroll intensity={0.5}>
            <motion.h2
              className="text-[clamp(56px,8vw,120px)] font-display tracking-[-0.04em] text-text-primary leading-[0.85] uppercase transition-colors duration-700"
              initial={{ y: '100%' }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              Race Record.
            </motion.h2>
          </VelocityScroll>
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
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card opacity-0 lg:opacity-100 transition-colors duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-100 lg:opacity-0 transition-colors duration-700" />
            </div>

            {/* Right Content Section */}
            <div className="lg:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold mb-3 transition-colors duration-700">
                {award.subtitle}
              </div>
              <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-2 group-hover/card:text-primary transition-colors duration-500">
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
                <button
                  onClick={() => setSelectedAward(award)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary hover:bg-primary transition-colors duration-700 text-sm text-background font-semibold"
                  data-cursor="hover"
                >
                  Know More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
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
              <div className="text-[clamp(40px,5vw,72px)] font-display tracking-tighter text-text-primary leading-none mb-2 transition-colors duration-700">
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
