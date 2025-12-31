
import React from 'react';

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Build', id: 'build' },
    { label: 'Presence', id: 'platforms' },
    { label: 'Journey', id: 'journey' },
    { label: 'Contact', id: 'contact' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Use larger offset for Main/Hero to account for top spacing/navbar, smaller for others
      const offset = id === 'hero' ? 100 : id === 'build' ? 35 : 0;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without jumping
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 px-4 sm:px-6 pointer-events-none">
      <div className="glass px-4 sm:px-6 py-3 rounded-full flex items-center gap-4 sm:gap-6 pointer-events-auto shadow-2xl border border-white/10 overflow-x-auto no-scrollbar max-w-[calc(100vw-2rem)] sm:max-w-[95vw]">
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, 'hero')}
          className="text-white font-bold mono tracking-tighter hover:text-blue-500 transition-colors shrink-0"
        >
          Main
        </a>
        <div className="h-4 w-[1px] bg-white/10 shrink-0"></div>
        <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs md:text-sm font-medium shrink-0">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className={`transition-colors duration-300 hover:text-white uppercase tracking-wider sm:normal-case sm:tracking-normal shrink-0 ${activeSection === item.id ? 'text-white underline underline-offset-4 decoration-blue-500' : 'text-gray-500'
                }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
