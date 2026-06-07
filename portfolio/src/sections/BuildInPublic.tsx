import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { VelocityScroll } from '../components/animations/VelocityScroll';
import { Parallax } from '../components/animations/Parallax';

const GITHUB_USER = 'SanTiwari07';

const featuredRepos = [
  {
    name: 'IPDS',
    fullName: 'Intelligent Pest Detection System',
    description: 'YOLOv8 + ESP32 real-time crop pest detection with edge computing',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['computer-vision', 'yolov8', 'esp32', 'agriculture'],
    url: `https://github.com/${GITHUB_USER}`,
    stars: 12,
  },
  {
    name: 'KrishiSaarthi',
    fullName: 'AI Agricultural Assistant',
    description: 'VOIS Innovation Marathon winner. AI + Blockchain agriculture platform.',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['ai', 'blockchain', 'agriculture', 'langchain'],
    url: `https://github.com/${GITHUB_USER}/KrishiSaarthi`,
    stars: 18,
  },
  {
    name: 'Traffic-Analyzer',
    fullName: 'Smart Traffic Flow Analyzer',
    description: 'Computer vision system for real-time traffic density analysis',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['computer-vision', 'traffic', 'yolo'],
    url: `https://github.com/${GITHUB_USER}/Smart-Traffic-Flow-Analyzer`,
    stars: 9,
  },
  {
    name: 'StockItUp',
    fullName: 'AI Inventory Intelligence',
    description: 'ML-powered Android inventory management with predictive restocking',
    lang: 'Kotlin',
    langColor: '#A97BFF',
    topics: ['android', 'kotlin', 'ml', 'inventory'],
    url: `https://github.com/${GITHUB_USER}`,
    stars: 7,
  },
  {
    name: 'Text2Reel',
    fullName: 'AI Video Content Generator',
    description: 'LLM pipeline that converts text prompts to short-form video reels',
    lang: 'Python',
    langColor: '#3572A5',
    topics: ['llm', 'generative-ai', 'video', 'automation'],
    url: `https://github.com/${GITHUB_USER}`,
    stars: 15,
  },
];

function ContributionGraph() {
  return (
    <div className="w-full overflow-hidden">
      <motion.img 
        src={`https://ghchart.rshah.org/7A1E2C/${GITHUB_USER}`}
        alt={`${GITHUB_USER}'s GitHub Contribution Graph`}
        className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

const getLangColor = (lang: string) => {
  const colors: Record<string, string> = {
    Python: '#3572A5',
    Kotlin: '#A97BFF',
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    'C++': '#f34b7d',
    'Jupyter Notebook': '#DA5B0B'
  };
  return colors[lang] || '#7A1E2C';
};

const LiveSystems: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const [repos, setRepos] = useState(featuredRepos);
  const [githubStats, setGithubStats] = useState({ repos: '20+', stars: '500+' });

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Calculate real metrics
          const publicRepos = data.length;
          const totalStars = data.reduce((acc, repo) => acc + repo.stargazers_count, 0);
          setGithubStats({ repos: publicRepos.toString(), stars: totalStars.toString() });

          // Get top 5 repos by stars
          const sorted = data
            .filter(r => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5)
            .map(r => ({
              name: r.name.replace(/-/g, ' '),
              fullName: r.full_name,
              description: r.description || 'No description provided.',
              lang: r.language || 'Code',
              langColor: getLangColor(r.language || ''),
              topics: r.topics || [],
              url: r.html_url,
              stars: r.stargazers_count,
            }));
          if (sorted.length > 0) {
            setRepos(sorted);
          }
        }
      })
      .catch(console.error);
  }, []);

  const dynamicMetrics = [
    { value: githubStats.repos, label: 'Repositories' },
    { value: githubStats.stars, label: 'Total Stars' },
    { value: repos.length.toString(), label: 'Top Projects' },
  ];

  return (
    <section ref={ref} id="github" className="relative w-full overflow-hidden bg-background py-28 md:py-40 transition-colors duration-700">
      <Parallax speed={-0.3} className="absolute right-0 top-0 bottom-0 w-[35%] pointer-events-none hidden lg:block z-0">
        <img
          src="/images/car/911 Turbo S side view.webp"
          alt="911 Turbo S Side"
          className="w-full h-[120%] object-cover opacity-[0.06] transform -translate-y-[10%]"
        />
      </Parallax>
      <div className="absolute right-0 top-0 bottom-0 w-[35%] pointer-events-none hidden lg:block z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent transition-colors duration-700" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-[1px] bg-primary transition-colors duration-700" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-text-secondary font-medium transition-colors duration-700">07 / Live Systems</span>
        </motion.div>

        <div className="overflow-hidden mb-4">
          <VelocityScroll intensity={0.5}>
            <motion.h2
              className="text-[clamp(44px,6vw,96px)] font-black tracking-[-0.03em] text-text-primary leading-[0.9] uppercase transition-colors duration-700"
              initial={{ y: '100%' }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              Live Systems.
            </motion.h2>
          </VelocityScroll>
        </div>
        <motion.p
          className="text-text-secondary text-base max-w-md mb-16 transition-colors duration-700"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Active repositories and engineering metrics on GitHub.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-12">
            <div className="grid grid-cols-3 gap-0 border border-border-light transition-colors duration-700">
              {dynamicMetrics.map((m, i) => (
                <motion.div
                  key={i}
                  className="p-6 text-center border-r border-border-light last:border-r-0 transition-colors duration-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className="text-3xl font-black text-text-primary tracking-tight mb-1 transition-colors duration-700">{m.value}</div>
                  <div className="text-[9px] tracking-[0.3em] uppercase text-text-secondary transition-colors duration-700">{m.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="p-8 border border-border-light transition-colors duration-700"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot transition-colors duration-700" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-text-secondary font-medium transition-colors duration-700">Contribution Activity</span>
              </div>
              {isInView && <ContributionGraph />}

            </motion.div>

            <motion.a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 text-xs tracking-[0.25em] uppercase font-semibold text-text-primary hover:text-primary transition-colors duration-700"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              data-cursor="hover"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              @{GITHUB_USER}
              <span className="w-8 h-[1px] bg-current group-hover:w-14 transition-all duration-400" />
            </motion.a>
          </div>

          <div className="lg:col-span-7 space-y-0">
            {repos.map((repo, i) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-8 border-b border-border-light py-8 hover:border-primary/30 transition-colors duration-700"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                data-cursor="hover"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-black uppercase tracking-tight text-text-primary group-hover:text-primary transition-colors duration-700">
                      {repo.name}
                    </h3>
                    <span
                      className="text-[8px] tracking-[0.3em] uppercase px-2 py-0.5 font-semibold"
                      style={{ color: repo.langColor, background: `${repo.langColor}15` }}
                    >
                      {repo.lang}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mb-3 transition-colors duration-700">{repo.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {repo.topics.map((t) => (
                      <span key={t} className="text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border border-border-light text-text-secondary transition-colors duration-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-text-secondary transition-colors duration-700">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-xs font-mono">{repo.stars}</span>
                  </div>
                  <div className="w-6 h-[1px] bg-border-light group-hover:w-10 group-hover:bg-primary transition-all duration-400" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSystems;
