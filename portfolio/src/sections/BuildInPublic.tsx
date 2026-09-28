import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';

const GITHUB_USER = 'SanTiwari07';

// Curated to match the featured projects on github.com/SanTiwari07.
// Star counts are refreshed from the GitHub API on load.
const featuredRepos = [
  {
    name: 'Aviro',
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
    fullName: 'AI Farmer Advisory',
    description: "AgriTech advisory platform bringing AI to the Indian farmhouse. 1st place, TechFiesta '26 International Hackathon.",
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['flask', 'langchain', 'ollama', 'tensorflow'],
    url: `https://github.com/${GITHUB_USER}/KrishiSahAI`,
    stars: 0,
  },
  {
    name: 'Smart Traffic Flow Analyzer',
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
  return (
    <div className="w-full overflow-hidden">
      <img
        src={`https://ghchart.rshah.org/7A1E2C/${GITHUB_USER}`}
        alt={`${GITHUB_USER}'s GitHub contribution graph`}
        className="w-full h-auto"
        loading="lazy"
      />
    </div>
  );
}

type Repo = {
  name: string;
  fullName: string;
  description: string;
  lang: string;
  langColor: string;
  topics: string[];
  url: string;
  stars: number;
};

const LiveSystems: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>(featuredRepos);
  const [githubStats, setGithubStats] = useState({ repos: '35', stars: '2' });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
        return res.json();
      })
      .then((data: unknown[]) => {
        if (!Array.isArray(data)) return;

        const publicRepos = data.length;
        const totalStars = data.reduce((acc: number, repo: unknown) => {
          const r = repo as { stargazers_count: number };
          return acc + (r.stargazers_count || 0);
        }, 0);
        setGithubStats({ repos: publicRepos.toString(), stars: totalStars.toString() });

        // Keep the curated order; only refresh live star counts.
        const starsByUrl = new Map(
          (data as Array<{ html_url: string; stargazers_count: number }>).map((r) => [r.html_url.toLowerCase(), r.stargazers_count]),
        );
        setRepos((current) =>
          current.map((repo) => ({ ...repo, stars: starsByUrl.get(repo.url.toLowerCase()) ?? repo.stars })),
        );
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          console.warn('GitHub API unavailable, using cached data');
        }
      });

    return () => controller.abort();
  }, []);

  const stats = [
    { value: githubStats.repos, label: 'public repos' },
    { value: githubStats.stars, label: 'stars' },
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
              Six I'd point to first. Everything else is on{' '}
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
                className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-12 py-7 border-b border-border-light"
              >
                <div className="md:col-span-4">
                  <h3 className="text-xl text-text-primary group-hover:text-primary transition-colors">
                    {repo.name}
                    <span className="inline-block ml-1.5 text-text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true">↗</span>
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">{repo.fullName}</p>
                </div>
                <div className="md:col-span-8">
                  <p className="text-base text-text-secondary leading-relaxed">{repo.description}</p>
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
