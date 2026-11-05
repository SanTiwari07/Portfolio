import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';

const contactLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/sanskarmakesstuff/',
    display: 'instagram.com/sanskarmakesstuff',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/santiwari07/',
    display: 'linkedin.com/in/santiwari07',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/SanTiwari07',
    display: 'github.com/SanTiwari07',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
];

const Contact: React.FC = () => {
  return (
    <section id="contact" className="relative w-full bg-background" aria-label="Contact">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-12 border-t border-border-light">
        <SectionHeader
          index="07"
          label="Contact"
          title="Let's build something."
          intro="Open to internships, hackathon teams and interesting problems. The fastest way to reach me is LinkedIn."
        />

        <ul className="border-t border-border-light">
          {contactLinks.map((link, i) => (
            <motion.li
              key={link.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group grid grid-cols-12 items-center gap-4 py-5 border-b border-border-light"
              >
                <span className="col-span-1 text-text-secondary group-hover:text-primary transition-colors">{link.icon}</span>
                <span className="col-span-4 md:col-span-3 text-lg text-text-primary">{link.label}</span>
                <span className="col-span-6 md:col-span-7 font-mono text-xs md:text-sm text-text-secondary truncate">{link.display}</span>
                <span className="col-span-1 text-right text-text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true">↗</span>
              </a>
            </motion.li>
          ))}
        </ul>

        <footer className="mt-24 flex flex-col md:flex-row gap-2 justify-between font-mono text-xs text-text-secondary">
          <p>© 2026 Sanskar Tiwari</p>
          <p className="md:text-right">
            911 Turbo S model by{' '}
            <a className="underline underline-offset-2 hover:text-text-primary" href="https://sketchfab.com/3d-models/porsche-911-turbo-s-68d8ef218d7e42adbd4425dc43629705" target="_blank" rel="noopener noreferrer">SeKali</a>
            {' '}(CC BY 4.0) · Engine sound: 1967 Porsche 911R by{' '}
            <a className="underline underline-offset-2 hover:text-text-primary" href="https://commons.wikimedia.org/wiki/File:Porsche_911R_(1967).ogg" target="_blank" rel="noopener noreferrer">Edvvc</a>
            {' '}(CC BY-SA 3.0, edited)
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
