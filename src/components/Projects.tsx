
import React from 'react';
import { PROJECTS } from '../constants.tsx';

const Projects: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <h2 className="text-sm md:text-base font-bold mono text-blue-500 uppercase tracking-widest mb-4">03. Selected Work</h2>
          <h3 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Building with <br />
            <span className="text-gray-500">quality and intent.</span>
          </h3>
        </div>
        <a
          href="https://github.com/SanTiwari07"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-sm md:text-base mono text-gray-500 hover:text-blue-500 transition-colors border-b border-white/10 pb-1"
        >
          View all on GitHub
          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {PROJECTS.map((project) => (
          <a
            key={project.id}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-6 md:p-10 rounded-3xl bg-neutral-900 border border-white/5 hover:border-blue-500/40 hover:bg-neutral-800/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] group-hover:bg-blue-500/20 transition-all duration-500"></div>

            <div className="flex justify-between items-center mb-10">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="text-gray-600 group-hover:text-blue-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
            </div>

            <h4 className="text-2xl font-bold text-white mb-6 group-hover:text-blue-400 transition-colors tracking-tight">
              {project.name}
            </h4>

            <p className="text-gray-400 text-lg mb-10 flex-grow leading-relaxed font-light line-clamp-4">
              {project.problem}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-[10px] mono uppercase font-bold tracking-widest border border-white/10 rounded-full text-gray-500 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* View Project Indicator */}
            <div className="mt-8 flex items-center gap-2 text-sm mono font-bold text-white/0 group-hover:text-white transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              View Project <span className="text-blue-500">&rarr;</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Projects;
