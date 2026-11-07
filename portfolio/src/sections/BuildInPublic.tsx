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
    name: 'HumSight',
    image: '/images/projects/humsight.webp',
    fullName: 'Vibration Inspection by Camera',
    description: 'Finds machine vibration from ordinary video with OpenCV 5 and agentic vision, separates camera shake from real faults, and tells you what to check next.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['opencv', 'agentic-vision', 'signal-processing', 'aws'],
    url: `https://github.com/${GITHUB_USER}/HumSight`,
    stars: 0,
  },
  {
    name: 'FieldDX',
    image: '/images/projects/fielddx.webp',
    fullName: 'Crop Diagnostics from Satellites',
    description: 'Spots crop-health changes in satellite imagery, weighs the likely causes, rules out alternatives and recommends the cheapest field check to confirm the diagnosis.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['satellite-imagery', 'remote-sensing', 'agritech', 'crop-disease'],
    url: `https://github.com/${GITHUB_USER}/FieldDX`,
    stars: 0,
  },
  {
    name: 'RailYatri',
    image: '/images/projects/railyatri.webp',
    fullName: 'Railway Reservation System',
    description: 'Full-stack train booking where PostgreSQL itself guarantees a berth is sold once: real-time seat allocation, payments, cancellations and refunds, built on transactions, triggers and concurrency control.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['postgresql', 'fastapi', 'react', 'typescript'],
    url: `https://github.com/${GITHUB_USER}/RailYatri`,
    stars: 0,
  },
  {
    name: 'AcousticMirror',
    image: '/images/projects/acousticmirror.webp',
    fullName: 'AR Room Acoustics',
    description: 'An AR lens for Snap Spectacles that shows where each speaker’s sound bounces off the room and marks the exact points to treat, using real-time 3D geometry.',
    lang: 'TypeScript',
    langColor: '#3178C6',
    topics: ['snap-spectacles', 'lens-studio', 'spatial-computing', 'ar'],
    url: `https://github.com/${GITHUB_USER}/AcousticMirrorLens`,
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

// Every other public project whose README has a screenshot, shown as a compact grid under the main ten.
const moreProjects = [
  {
    name: 'Bhumi',
    summary: 'Crop-health investigation from satellite imagery, weather and verifiable field records, ending in the next best field check.',
    tags: ['satellite-imagery', 'sentinel-2', 'agritech'],
    image: '/images/projects/bhumi.webp',
    url: `https://github.com/${GITHUB_USER}/Bhumi`,
  },
  {
    name: 'Kounter',
    summary: 'Offline-first shop audit concept that turns the iQOO 15 into a delivery counter, expiry gate and Hindi voice assistant.',
    tags: ['offline-first', 'three.js', 'hackathon'],
    image: '/images/projects/kounter.webp',
    url: `https://github.com/${GITHUB_USER}/Kounter`,
  },
  {
    name: 'Smaran',
    summary: 'Offline-first memory for edge fleets: keeps working without a network and flags clashing field reports with version vectors.',
    tags: ['edge-computing', 'vector-search', 'qdrant'],
    image: '/images/projects/smaran.webp',
    url: `https://github.com/${GITHUB_USER}/Smaran`,
  },
  {
    name: 'Nova',
    summary: 'The intelligence layer for everyday commerce and household autonomy, built from cooperating AI agents on AWS.',
    tags: ['ai-agents', 'aws', 'strands-agents'],
    image: '/images/projects/nova.webp',
    url: `https://github.com/${GITHUB_USER}/Nova`,
  },
  {
    name: 'LeetCode Tracker',
    summary: 'Chrome extension that saves your LeetCode submissions to GitHub, sorts them by topic and shows a progress dashboard.',
    tags: ['chrome-extension', 'github-api', 'javascript'],
    image: '/images/projects/leetcodetracker.webp',
    url: `https://github.com/${GITHUB_USER}/LeetCodeTracker`,
  },
  {
    name: 'Electronics Component YOLO',
    summary: 'Custom YOLO model that detects Arduino and IoT parts in real time, reaching 83.8% mAP@0.5.',
    tags: ['yolo', 'object-detection', 'iot'],
    image: '/images/projects/yolomodel.webp',
    url: `https://github.com/${GITHUB_USER}/FirstCustomYOLOModel`,
  },
  {
    name: 'Smart Solar Panel',
    summary: 'Arduino solar tracker: two LDR sensors and a servo turn the panel to face the sun.',
    tags: ['arduino', 'ldr', 'servo'],
    image: '/images/projects/smartsolar.webp',
    url: `https://github.com/${GITHUB_USER}/SmartSolarPanel`,
  },
  {
    name: 'Smart Dustbin',
    summary: 'A bin that sorts waste into wet and dry using a soil-moisture sensor and an ultrasonic sensor.',
    tags: ['arduino', 'sensors', 'iot'],
    image: '/images/projects/smartdustbin.webp',
    url: `https://github.com/${GITHUB_USER}/SmartDustBin`,
  },
  {
    name: 'Smart Pot',
    summary: 'ESP32 plant monitor that reads temperature, humidity and soil moisture in real time, simulated on Wokwi.',
    tags: ['esp32', 'dht22', 'wokwi'],
    image: '/images/projects/smartpot.webp',
    url: `https://github.com/${GITHUB_USER}/SmartPot`,
  },
  {
    name: 'StockItUp',
    summary: 'Responsive, theme-aware stock-tracking web app written in plain HTML, CSS and JavaScript.',
    tags: ['vanilla-js', 'html-css', 'web-app'],
    image: '/images/projects/stockitup.webp',
    url: `https://github.com/${GITHUB_USER}/CodeZeroStockItUp`,
  },
  {
    name: 'Resistor Color Code',
    summary: 'Pick the colour bands on a resistor and read off its value, for 4, 5 and 6-band parts.',
    tags: ['electronics', 'html', 'javascript'],
    image: '/images/projects/resistor.webp',
    url: `https://github.com/${GITHUB_USER}/ResistorColorCode`,
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
  /** README screenshot */
  image: string;
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
              Ten I'd point to first, then every other project of mine that has a screenshot. The rest is on{' '}
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
                  <img
                    src={repo.image}
                    alt=""
                    width={960}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
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

        <div className="mt-16">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h3 className="font-display text-2xl text-text-primary">More builds</h3>
            <span className="font-mono text-xs text-text-secondary">{moreProjects.length} projects</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {moreProjects.map((p, i) => (
              <motion.li
                key={p.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.5, delay: Math.min(i % 3, 2) * 0.05 }}
              >
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="aspect-[16/10] overflow-hidden rounded-sm border border-border-light bg-[#0b0b0b]" aria-hidden="true">
                    <img
                      src={p.image}
                      alt=""
                      width={960}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h4 className="mt-4 text-lg text-text-primary group-hover:text-primary transition-colors">
                    {p.name}
                    <span className="inline-block ml-1.5 text-text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">↗</span>
                  </h4>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{p.summary}</p>
                  <p className="mt-2 font-mono text-[11px] text-text-secondary">{p.tags.join(' · ')}</p>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

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
