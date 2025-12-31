
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="grid md:grid-cols-12 gap-12 items-start">
      <div className="md:col-span-5">
        <h2 className="text-base font-bold mono text-blue-500 uppercase tracking-widest mb-6">01. About Me</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-white mb-10 leading-snug">
          Driven by curiosity, <br />
          guided by data.
        </h3>
        <div className="relative group max-w-sm mx-auto md:mx-0">
          {/* Background Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>

          <div
            className="relative overflow-hidden rounded-xl border border-white/10 aspect-square shadow-2xl bg-neutral-900 min-h-[300px] flex items-center justify-center transition-all duration-300 group-hover:grayscale"
          >
            {/* Subtle background pattern for while image loads */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

            {/* Base Image */}
            <img
              src="/sanskar.jpg"
              alt="Sanskar Tiwari"
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=Sanskar+Tiwari&background=3b82f6&color=fff&size=512";
              }}
              loading="eager"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none z-20"></div>
          </div>

          {/* Corner Accent */}
          <div className="absolute -bottom-3 -right-3 w-20 h-20 border-r-2 border-b-2 border-blue-500/40 rounded-br-xl -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500"></div>
        </div>
      </div>
      <div className="md:col-span-7 flex flex-col gap-8 text-gray-400 text-xl leading-relaxed pt-4">
        <p>
          I’m an Electronics & Telecommunication engineering student exploring how hardware, software, and intelligence come together to form real-world systems. My journey is driven by a deep curiosity about how low-level components, communication, and code scale into reliable, impactful solutions.
        </p>

        <p>
          I build and improve systems by connecting hardware, software, and machine learning into practical projects. Along the way, I document what I learn and share my process openly, believing that building in public, learning from feedback, and contributing to the community are essential to growing as an engineer.
        </p>

        <div className="grid grid-cols-2 gap-6 mt-2">
          <div className="p-8 rounded-xl border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/50 hover:border-blue-500/30 transition-all duration-500 group">
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">9.38</div>
            <div className="text-sm mono uppercase text-blue-500 font-bold tracking-widest">CGPA</div>
          </div>
          <div className="p-8 rounded-xl border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/50 hover:border-emerald-500/30 transition-all duration-500 group">
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">12+</div>
            <div className="text-sm mono uppercase text-blue-500 font-bold tracking-widest">Active Projects</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
