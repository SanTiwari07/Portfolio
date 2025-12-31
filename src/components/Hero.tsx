
import React from 'react';

const Hero: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 0;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full relative">
      {/* Background ambient glow element */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-bold mono uppercase tracking-widest mb-10 border border-blue-500/20">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Currently Building
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8 md:mb-10 tracking-tighter">
        I’m Sanskar Tiwari <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
          building real systems
        </span> <br />
        <span className="text-gray-500 text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
          with code, AI, and curiosity.
        </span>
      </h1>

      <p className="text-lg md:text-2xl text-gray-400 max-w-4xl mb-10 md:mb-14 leading-relaxed font-light">
        Currently pursuing Electronics & Telecommunication Engineering. <br className="hidden md:block" />
        I focus on building systems that combine hardware, software, and intelligence to solve real-world problems through clean, thoughtful engineering.
      </p>

      <div className="flex flex-wrap gap-6 items-center">
        <a
          href="#projects"
          onClick={(e) => handleScroll(e, 'projects')}
          className="group relative px-12 py-6 bg-white text-black text-lg font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">View Projects</span>
          <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </a>

        <a
          href="#contact"
          onClick={(e) => handleScroll(e, 'contact')}
          className="px-12 py-6 bg-transparent text-white text-lg font-bold rounded-full border border-white/20 hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
        >
          Connect
        </a>
      </div>
    </div>
  );
};

export default Hero;
