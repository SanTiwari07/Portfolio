import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';

const allImages = [
  { src: '/images/awards/techfiesta/tech (1).webp', alt: 'TechFiesta 2026 - Gold Award ceremony', event: 'TechFiesta' },
  { src: '/images/awards/techfiesta/tech (2).webp', alt: 'TechFiesta 2026 - Stage ceremony', event: 'TechFiesta' },
  { src: '/images/awards/techfiesta/tech (3).webp', alt: 'TechFiesta 2026 - Team photo', event: 'TechFiesta' },
  { src: '/images/awards/hackventure/gramdrishti.webp', alt: 'GramDrishti - satellite village health dashboard (HackVenture 2026 winner)', event: 'HackVenture' },
  { src: '/images/awards/Pune Agri/pune (1).webp', alt: 'Pune Agri Hackathon - Award presentation', event: 'Pune Agri' },
  { src: '/images/awards/Pune Agri/pune (2).webp', alt: 'Pune Agri Hackathon - Award ceremony', event: 'Pune Agri' },
  { src: '/images/awards/Pune Agri/pune (3).webp', alt: 'Pune Agri Hackathon - Group photo', event: 'Pune Agri' },
  { src: '/images/awards/vois/vois (1).webp', alt: 'VOIS Innovation Marathon - Presenting solution', event: 'VOIS Marathon' },
  { src: '/images/awards/vois/vois (2).webp', alt: 'VOIS Innovation Marathon - Trophy', event: 'VOIS Marathon' },
  { src: '/images/awards/vois/vois (3).webp', alt: 'VOIS Innovation Marathon - Team photo', event: 'VOIS Marathon' },
  { src: '/images/awards/vois/vois (4).webp', alt: 'VOIS Innovation Marathon - Winner announcement', event: 'VOIS Marathon' },
];

interface Award {
  subtitle: string;
  title: string;
  description: string;
  /** photo for the card; without one the card shows a typographic panel */
  image?: string;
  placeholder?: { big: string; small: string };
  bullets: { text: string }[];
  tags: string[];
  modalTitle: string;
  modalSubtitle: string;
  modalDetails: string;
  /** teammates credited on the card and in the modal */
  team?: { name: string; role: string; github: string }[];
}

const detailedAwards: Award[] = [
  {
    subtitle: 'HACKVENTURE 2026 · NATIONAL HACKATHON BY SPONFEST',
    title: 'GramDrishti',
    description: 'AI Climate Intelligence & Geospatial Decision Support Platform',
    image: '/images/awards/hackventure/gramdrishti.webp',
    bullets: [
      { text: '1st Place - Agritech Domain' },
      { text: 'Started by Shweta Patil, built together' },
      { text: 'Satellite NDVI & NDWI monitoring' },
      { text: 'National-level competition' },
    ],
    team: [{ name: 'Shweta Patil', role: 'Started GramDrishti and built it with me', github: 'https://github.com/Shwetapatil13' }],
    tags: ['AI', 'Geospatial', 'Satellite Analytics', 'Multilingual AI', 'Dashboards'],
    modalTitle: 'Winner – HackVenture 2026 (Agritech Domain)',
    modalSubtitle: 'Issued by SponFest · Jul 2026',
    modalDetails: `Secured 1st Place in the Agritech Domain at HackVenture 2026, a national-level virtual hackathon organized by SponFest. Competing against innovative teams from across the country, our solution was recognized for combining artificial intelligence, geospatial intelligence, and practical engineering to address real-world agricultural challenges.

GramDrishti was started by my teammate Shweta Patil, and her ideas, hard work and steady encouragement shaped what it became. We built it together: an AI-powered climate intelligence and geospatial decision support platform designed to help farmers, village administrations, and government authorities make faster, data-driven decisions. The platform transforms satellite observations and environmental data into actionable insights for crop monitoring, water resource management, and rural planning.

One of the key innovations of the platform was its ability to combine satellite analytics with AI-generated recommendations, enabling users to understand environmental conditions without requiring technical GIS expertise. The solution integrated:

• AI-powered climate and environmental analysis
• Satellite-based NDVI and NDWI monitoring
• Interactive geospatial visualization and village insights
• Multilingual AI assistance for rural accessibility
• Government scheme recommendations based on local conditions
• Real-time dashboards for environmental monitoring

The project demonstrated how satellite intelligence, artificial intelligence, and modern web technologies can be combined into a practical platform that supports sustainable agriculture and climate-resilient rural development. The solution emphasized usability, scalability, and real-world impact for Indian villages.

Winning 1st place was a team effort, and GramDrishti would not exist without Shweta. This achievement reflects innovation, teamwork, and the application of AI and geospatial technologies to solve meaningful agricultural and environmental challenges while contributing toward smarter, data-driven rural governance.`,
  },
  {
    subtitle: 'VOIS INNOVATION MARATHON 2.0 BY VODAFONE IDEA',
    title: 'KrishiSaarthi',
    description: 'AI & Blockchain Powered Agricultural Intelligence Platform',
    image: '/images/awards/vois/vois (1).webp',
    bullets: [
      { text: 'Top 3 among 630+ teams' },
      { text: '₹2,00,000 Cash Prize' },
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
      { text: '1st Rank - Agriculture Domain' },
      { text: '₹50,000 Grand Prize' },
      { text: 'Top of 700+ teams' },
    ],
    tags: ['Python', 'FastAPI', 'Computer Vision', 'React', 'IoT'],
    modalTitle: "Winner – Agriculture Domain, TechFiesta'26 International Hackathon",
    modalSubtitle: "Issued by TechFiesta'26, PICT Pune · Mar 2026",
    modalDetails: `Secured 1st Rank in the Agriculture Domain at TechFiesta'26 – International Hackathon hosted by PICT, Pune. The event brought together 700+ teams and more than 3500 participants from across India and several international institutions, making it one of the largest student-led innovation hackathons.

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
      { text: 'National Runner-Up' },
      { text: '₹15 Lakhs from government for development' },
      { text: 'Agriculture Innovation Category' },
    ],
    tags: ['Machine Learning', 'Scikit-Learn', 'IoT Sensors', 'Python'],
    modalTitle: 'Runner-Up – Pune Agri Hackathon 2026',
    modalSubtitle: 'Issued by Pune International Agri Hackathon 2026 · May 2026',
    modalDetails: `Secured the Runner-Up position at Pune Agri Hackathon 2026 while competing against established startups, companies, and experienced professionals from across Maharashtra.

Our team developed Krishi Prabandh, an AI-powered agricultural governance and intelligence platform designed to support faster, smarter, and more transparent agricultural administration workflows.

Key innovations:
• AI-based video analysis for crop insurance claims
• Geo-tagging and OCR-based fraud detection
• Satellite NDVI validation
• Intelligent workflow routing
• Real-time dashboards for officers

The project was presented before government officials including:
• Devendra Fadnavis – Chief Minister of Maharashtra
• Dattatraya Bharane – Agriculture Minister, Maharashtra
• Chandrakant Patil – Higher & Technical Education Minister, Maharashtra`,
  },
];


const marqueeImages = [...allImages, ...allImages];



const RaceRecord: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const modalTitleId = 'award-modal-title';

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

  // Close modal on Escape key
  React.useEffect(() => {
    if (!selectedAward) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedAward(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [selectedAward]);

  const closeModal = useCallback(() => setSelectedAward(null), []);

  return (
    <section ref={ref} id="awards" className="relative w-full bg-background overflow-hidden">

      {/* Award Detail Modal */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
              aria-hidden="true"
            />
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-md overflow-hidden shadow-2xl flex flex-col z-10"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-background/50 backdrop-blur-md rounded-full flex items-center justify-center text-text-primary hover:bg-background transition-colors z-20 focus-visible:outline-2 focus-visible:outline-primary"
                aria-label="Close award details modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div
                className="flex-1 overflow-y-auto p-6 md:p-12 no-scrollbar"
                data-lenis-prevent="true"
              >
                <h2 id={modalTitleId} className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight text-text-primary mb-3">
                  {selectedAward.modalTitle}
                </h2>
                <div className="text-sm md:text-base text-primary font-semibold tracking-wide mb-8">
                  {selectedAward.modalSubtitle}
                </div>

                <div className="w-full h-[1px] bg-border-light mb-8" aria-hidden="true" />

                <div className="text-text-secondary text-sm md:text-base leading-relaxed space-y-6 whitespace-pre-wrap">
                  {selectedAward.modalDetails}
                </div>

                {selectedAward.team && (
                  <div className="mt-10 pt-6 border-t border-border-light">
                    <div className="font-mono text-xs text-primary mb-3">TEAMMATE</div>
                    {selectedAward.team.map((m) => (
                      <p key={m.name} className="text-sm md:text-base text-text-secondary">
                        <a
                          href={m.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-text-primary underline underline-offset-4 decoration-border-light hover:decoration-primary hover:text-primary transition-colors"
                        >
                          {m.name}
                        </a>
                        {' '}· {m.role} ·{' '}
                        <a
                          href={m.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 decoration-border-light hover:decoration-primary hover:text-primary transition-colors"
                        >
                          github.com/{m.github.split('/').pop()}
                        </a>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-24 md:pt-32 border-t border-border-light">
        <SectionHeader index="04" label="Awards" title="Four podiums, two first places." />
      </div>

      {/* Photo Marquee */}
      <div className="w-full overflow-hidden mb-20 relative" aria-label="Award ceremony photos">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" aria-hidden="true" />

        <div className="marquee-track" aria-hidden="true">
          {marqueeImages.map((img, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[280px] sm:w-[320px] h-[200px] sm:h-[220px] mx-2 overflow-hidden group cursor-default rounded-md"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                width={320}
                height={220}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300" aria-hidden="true">
                <span className="font-mono text-[11px] text-white bg-black/70 px-2 py-1 rounded-sm">
                  {img.event}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Award Cards */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 space-y-8 pb-24 md:pb-32">
        {detailedAwards.map((award, i) => (
          <motion.article
            key={i}
            className="flex flex-col lg:flex-row bg-card rounded-md overflow-hidden border border-border-light"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
          >
            {/* Left Image */}
            <div className="lg:w-[45%] h-[280px] lg:h-auto relative overflow-hidden group" aria-hidden="true">
              {award.image ? (
                <img
                  src={award.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={540}
                  height={400}
                />
              ) : (
                <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center bg-[#0b0b0b] blueprint-grid transition-transform duration-700 group-hover:scale-105">
                  <span className="font-display text-[clamp(72px,9vw,140px)] leading-none tracking-tighter text-primary">
                    {award.placeholder?.big}
                  </span>
                  <span className="mt-3 font-mono text-xs text-white/60">{award.placeholder?.small}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card opacity-0 lg:opacity-100" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-100 lg:opacity-0" aria-hidden="true" />
            </div>

            {/* Right Content */}
            <div className="lg:w-[55%] p-8 md:p-10 lg:p-12 flex flex-col justify-center">
              <div className="font-mono text-xs text-primary mb-3">
                {award.subtitle}
              </div>
              <h3 className="text-2xl md:text-3xl text-text-primary mb-2">
                {award.title}
              </h3>
              <p className="text-sm md:text-base text-text-secondary mb-8">
                {award.description}
              </p>

              <ul className="space-y-2.5 mb-8" aria-label="Achievement highlights">
                {award.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm md:text-base text-text-primary">
                    <span className="h-px w-3 shrink-0 bg-primary" aria-hidden="true" />
                    <span>{bullet.text}</span>
                  </li>
                ))}
              </ul>

              {award.team && (
                <p className="mb-8 text-sm text-text-secondary">
                  Built with{' '}
                  {award.team.map((m) => (
                    <a
                      key={m.name}
                      href={m.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-text-primary underline underline-offset-4 decoration-border-light hover:decoration-primary hover:text-primary transition-colors"
                    >
                      {m.name} (@{m.github.split('/').pop()})
                    </a>
                  ))}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 mb-8">
                {award.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[11px] px-2 py-1 rounded-sm text-text-secondary border border-border-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                <button
                  onClick={() => setSelectedAward(award)}
                  className="inline-flex items-center gap-2 py-2 -my-2 text-sm font-medium text-text-primary underline underline-offset-4 decoration-border-light hover:decoration-primary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label={`Read more about ${award.title}`}
                >
                  Read the full story
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

    </section>
  );
};

export default RaceRecord;
