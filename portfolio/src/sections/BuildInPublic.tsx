import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GITHUB_USER, useGithubData } from '../lib/github';

// Curated to match the featured projects on github.com/SanTiwari07.
// Star counts are refreshed from the GitHub API on load.
const featuredRepos = [
  {
    name: 'NarraReel',
    image: '/images/projects/narrareel.webp',
    fullName: 'Script to Reel',
    description: 'Turns a script into a finished Reel, Short or YouTube video: a free AI voice or your cloned voice, exact length, and word-by-word animated captions. Runs on your own computer.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['fastapi', 'react', 'ffmpeg', 'voice-cloning'],
    url: `https://github.com/${GITHUB_USER}/NarraReel`,
    stars: 0,
  },
  {
    name: 'Snipmint',
    image: '/images/projects/snipmint.webp',
    fullName: 'Long Video to Shorts',
    description: 'Paste a YouTube link and get vertical Shorts: best-moment detection, speaker-tracking 9:16 crops and animated captions. Free by default, smarter with an optional Gemini key.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['whisper', 'gemini', 'youtube-shorts', 'docker'],
    url: `https://github.com/${GITHUB_USER}/Snipmint`,
    stars: 0,
  },
  {
    name: 'Aviro',
    image: '/images/projects/aviro.webp',
    fullName: 'AI Finance Controller',
    description: 'Invariant-governed AI finance controller: Gemini investigates, deterministic rules verify, zero false auto-matches. Razorpay AI Buildathon 2026.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['fintech', 'fastapi', 'gemini', 'rule-engine'],
    url: `https://github.com/${GITHUB_USER}/Aviro`,
    stars: 0,
  },
  {
    name: 'Sudarshan',
    image: '/images/projects/sudarshan.webp',
    fullName: 'Banking Malware Intelligence',
    description: 'Android banking-malware analysis: static analysis, Frida dynamic sandboxing, risk scoring and MITRE ATT&CK mapping. CyberShield Hackathon 2026, IIT Hyderabad.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['security', 'frida', 'androguard', 'yara'],
    url: `https://github.com/${GITHUB_USER}/Sudarshan`,
    stars: 0,
  },
  {
    name: 'IPDS v2.0',
    image: '/images/projects/ipds.webp',
    fullName: 'Intelligent Pothole Detection System',
    description: 'Dual ESP32 pothole detection: YOLOv8-Nano (mAP 81.68%), MPU6050 sensor fusion and NEO-6M GPS mapping. Published with its own DOI.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['yolov8', 'esp32-cam', 'sensor-fusion', 'gps'],
    url: `https://github.com/${GITHUB_USER}/PotHoleDetection`,
    stars: 0,
  },
  {
    name: 'InsureRoute',
    initials: 'IR',
    fullName: 'Supply-Chain Intelligence',
    description: 'Predictive logistics: Isolation Forest anomaly detection, live weather rerouting and dynamic actuarial cargo pricing with a Gemini risk advisor.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['ml', 'networkx', 'gemini', 'logistics'],
    url: `https://github.com/${GITHUB_USER}/InsureRoute`,
    stars: 0,
  },
  {
    name: 'KrishiSahAI',
    image: '/images/projects/krishisahai.webp',
    fullName: 'AI Farmer Advisory',
    description: "AgriTech advisory platform bringing AI to the Indian farmhouse. 1st place, TechFiesta '26 International Hackathon.",
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['flask', 'langchain', 'ollama', 'tensorflow'],
    url: 'https://github.com/KrishiSahAI/KrishiSetu',
    stars: 0,
  },
  {
    name: 'Smart Traffic Flow Analyzer',
    image: '/images/projects/traffic.webp',
    fullName: 'Adaptive Signal Control',
    description: 'YOLOv8 + SORT vehicle detection that retimes traffic signals from live density, interfaced with an ESP32 controller.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['opencv', 'yolo', 'sort', 'esp32'],
    url: `https://github.com/${GITHUB_USER}/SmartTrafficFlowAnalyzer`,
    stars: 0,
  },
];

function ContributionGraph() {
  // On phones the full year is too small to read: keep it legible and let it scroll, starting at the latest weeks.
  const scrollToLatest = (img: HTMLImageElement) => {
    const box = img.parentElement;
    if (box) box.scrollLeft = box.scrollWidth;
  };
  return (
    <div className="w-full overflow-x-auto overscroll-x-contain">
      <img
        src={`https://ghchart.rshah.org/7A1E2C/${GITHUB_USER}`}
        alt={`${GITHUB_USER}'s GitHub contribution graph`}
        className="w-full min-w-[560px] h-auto"
        loading="lazy"
        onLoad={(e) => scrollToLatest(e.currentTarget)}
      />
    </div>
  );
}

type Repo = {
  name: string;
  /** README screenshot; rows without one show a typographic panel */
  image?: string;
  /** letters for the typographic panel when there is no image */
  initials?: string;
  fullName: string;
  description: string;
  lang: string;
  langColor: string;
  topics: string[];
  url: string;
  stars: number;
};

const LiveSystems: React.FC = () => {
  const gh = useGithubData();

  // Keep the curated order; only refresh live star counts.
  const repos = useMemo<Repo[]>(() => {
    if (!gh) return featuredRepos;
    const starsByUrl = new Map(gh.repos.map((r) => [r.html_url.toLowerCase(), r.stargazers_count]));
    return featuredRepos.map((repo) => ({ ...repo, stars: starsByUrl.get(repo.url.toLowerCase()) ?? repo.stars }));
  }, [gh]);

  const stats = [
    { value: gh ? String(gh.publicRepos) : '—', label: 'public repos' },
    { value: gh ? String(gh.stars) : '—', label: 'stars' },
  ];

  return (
    <section id="github" className="relative w-full bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 md:py-32 border-t border-border-light">
        <SectionHeader
          index="06"
          label="Projects"
          title="Selected projects."
          intro={
            <>
              Eight I'd point to first. Everything else is on{' '}
              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary underline underline-offset-4 decoration-border-light hover:decoration-primary"
              >
                GitHub
              </a>
              .
            </>
          }
        />

        <ul className="border-t border-border-light">
          {repos.map((repo, i) => (
            <motion.li
              key={repo.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.04 }}
            >
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-7 border-b border-border-light md:items-center"
              >
                <div className="md:col-span-4 aspect-[16/10] overflow-hidden rounded-sm border border-border-light bg-[#0b0b0b]" aria-hidden="true">
                  {repo.image ? (
                    <img
                      src={repo.image}
                      alt=""
                      width={960}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center blueprint-grid">
                      <span className="font-display text-5xl tracking-tighter text-primary">
                        {repo.initials ?? repo.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="md:col-span-8 md:pl-2">
                  <h3 className="text-xl text-text-primary group-hover:text-primary transition-colors">
                    {repo.name}
                    <span className="inline-block ml-1.5 text-text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">↗</span>
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">{repo.fullName}</p>
                  <p className="mt-4 text-base text-text-secondary leading-relaxed">{repo.description}</p>
                  <p className="mt-3 font-mono text-xs text-text-secondary">
                    {repo.lang} · {repo.topics.join(' · ')}
                    {repo.stars > 0 && ` · ★ ${repo.stars}`}
                  </p>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
          <dl className="md:col-span-4 flex gap-10">
            {stats.map((m) => (
              <div key={m.label}>
                <dt className="font-mono text-xs text-text-secondary">{m.label}</dt>
                <dd className="mt-1 font-display text-2xl text-text-primary">{m.value}</dd>
              </div>
            ))}
          </dl>
          <div className="md:col-span-8">
            <p className="font-mono text-xs text-text-secondary mb-3">contributions, last 12 months</p>
            <ContributionGraph />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSystems;
