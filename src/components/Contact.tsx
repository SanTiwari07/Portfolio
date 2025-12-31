
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto py-16">
      <h2 className="text-base font-bold mono text-blue-500 uppercase tracking-widest mb-10">07. What's Next?</h2>
      <h3 className="text-6xl md:text-7xl font-bold text-white mb-10 tracking-tight">Let’s connect.</h3>
      <p className="text-xl text-gray-400 mb-14 leading-relaxed max-w-3xl">
        I’m always open to discussing new projects, creative ideas, or opportunities 
        to be part of your visions. If you want to collaborate, learn together, or talk tech — my inbox is open.
      </p>
      
      <div className="flex flex-col items-center gap-12">
        <a 
          href="mailto:sanskarmakesstuff@gmail.com" 
          className="text-2xl md:text-4xl font-bold text-white hover:text-blue-500 transition-all duration-300 mono underline decoration-blue-500/30 underline-offset-8 hover:decoration-blue-500"
        >
          sanskarmakesstuff@gmail.com
        </a>

        <a 
          href="https://www.linkedin.com/in/santiwari07/overlay/1766300791858/single-media-viewer/?profileId=ACoAAE_wyUwBS9SQzrl9AGYh1brk2L4IQ2H-xbY" 
          target="_blank"
          rel="noopener noreferrer"
          className="px-10 py-5 bg-neutral-900 text-white text-xl font-bold rounded-xl border border-white/10 hover:border-blue-500 transition-all duration-300"
        >
          View Resume
        </a>
      </div>
    </div>
  );
};

export default Contact;
