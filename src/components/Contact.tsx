
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto py-16">
      <h2 className="text-base font-bold mono text-blue-500 uppercase tracking-widest mb-10">07. What's Next?</h2>
      <h3 className="text-6xl md:text-7xl font-bold text-white mb-10 tracking-tight">Let’s connect.</h3>
      <p className="text-xl text-gray-400 mb-14 leading-relaxed max-w-3xl">
        I’m always open to discussing new projects, creative ideas, or opportunities
        to be part of your visions. If you want to collaborate, learn together, or talk tech- my inbox is open.
      </p>

      <div className="flex flex-col items-center gap-12">


        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=sanskarmakesstuff@gmail.com&su=Project%20Inquiry"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-2xl md:text-4xl font-bold text-white 
             hover:text-blue-500 transition-all duration-300 mono 
             underline decoration-blue-500/30 underline-offset-8 
             hover:decoration-blue-500"
        >
          Email Me
        </a>
      </div>
    </div>
  );
};

export default Contact;
