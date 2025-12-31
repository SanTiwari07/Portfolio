
import React from 'react';
import { SKILL_CATEGORIES } from '../constants.tsx';

const Skills: React.FC = () => {
  return (
    <div>
      <h2 className="text-base font-bold mono text-blue-500 uppercase tracking-widest mb-12">02. Toolkit</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {SKILL_CATEGORIES.map((category, idx) => (
          <div key={idx} className="group">
            <h3 className="text-white text-xl font-bold mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {category.title}
            </h3>
            <ul className="space-y-4">
              {category.skills.map((skill, sIdx) => (
                <li key={sIdx} className="flex items-center gap-4 text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                   <div className="h-[1px] w-6 bg-white/10"></div>
                   <span className="mono text-base">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
