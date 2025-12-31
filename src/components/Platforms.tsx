
import React from 'react';
import { PLATFORMS } from '../constants.tsx';

const Platforms: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-base font-bold mono text-blue-500 uppercase tracking-widest mb-12">05. Presence</h2>
      <div className="grid md:grid-cols-2 gap-10">
        {PLATFORMS.map((platform) => (
          <a 
            key={platform.name} 
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex gap-8 p-10 rounded-2xl bg-neutral-900 border border-white/5 hover:border-blue-500/30 hover:bg-neutral-800/80 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500"></div>
            
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-all duration-300">
              <svg className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d={platform.icon} />
              </svg>
            </div>
            
            <div className="relative z-10 flex-grow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {platform.name}
                </h4>
                <svg 
                  className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <p className="text-gray-500 leading-relaxed text-base group-hover:text-gray-400 transition-colors">
                {platform.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Platforms;
