
import React from 'react';

const BuildInPublic: React.FC = () => {
  const socialCards = [
    {
      platform: 'Instagram',
      handle: '@sanskarmakesstuff',
      purpose: 'Sharing projects, building journey, and short tech explainers.',
      url: 'https://www.instagram.com/sanskarmakesstuff/',
      color: 'from-purple-500 to-pink-500',
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      platform: 'YouTube',
      handle: 'Sanskar Makes Stuff',
      purpose: 'Project breakdowns, tech explanations, and documenting the build process.',
      url: 'https://www.youtube.com/@sanskarmakesstuff',
      color: 'from-red-600 to-red-500',
      icon: (
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    }
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-x-6 -inset-y-12 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent rounded-[3rem] -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4">
        <div>
          <h2 className="text-sm md:text-base font-bold mono text-blue-500 uppercase tracking-widest mb-4">04. Build in Public</h2>
          <h3 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight">I share everything I make.</h3>
        </div>
        <p className="text-gray-500 mono text-sm md:text-base max-w-sm md:text-right">
          Building tools, scaling ideas, and documenting the chaos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {socialCards.map((card) => (
          <a
            key={card.platform}
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block p-1 rounded-3xl bg-neutral-800/50 border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10"
          >
            <div className={`absolute -inset-px bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`}></div>

            <div className="relative h-full bg-neutral-900 rounded-[22px] p-10 flex flex-col items-start gap-10">
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg shadow-black/20 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {card.icon}
              </div>

              <div>
                <div className="flex flex-col items-start gap-2 mb-4">
                  <h4 className="text-3xl font-bold text-white">{card.platform}</h4>
                  <span className="text-sm px-3 py-1 rounded-full bg-white/5 text-gray-400 mono">{card.handle}</span>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed italic">
                  {card.purpose}
                </p>
              </div>

              <div className="mt-auto w-full flex items-center justify-between">
                <span className="text-base font-bold text-white/50 group-hover:text-white transition-colors">Follow the build</span>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BuildInPublic;
