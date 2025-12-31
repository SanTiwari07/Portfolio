
import React from 'react';
import { JOURNEY_ITEMS } from '../constants.tsx';

const Journey: React.FC = () => {
  return (
    <div>
      <h2 className="text-sm md:text-base font-bold mono text-blue-500 uppercase tracking-widest mb-8 md:mb-12">06. Continuous Growth</h2>
      <div className="max-w-4xl space-y-12 md:space-y-16">
        {JOURNEY_ITEMS.map((item, idx) => (
          <div key={idx} className="relative pl-6 md:pl-10 group">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10 group-last:bg-transparent"></div>
            <div className="absolute left-[-4px] md:left-[-5px] top-2.5 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-blue-500 neon-glow"></div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <h4 className="text-2xl font-bold text-white">{item.title}</h4>
              <span className={`px-3 py-1 rounded text-xs mono uppercase font-bold ${item.status === 'Learning' ? 'bg-blue-500/20 text-blue-400' :
                  item.status === 'Exploring' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-orange-500/20 text-orange-400'
                }`}>
                {item.status}
              </span>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed italic max-w-2xl">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journey;
