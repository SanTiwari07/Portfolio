import React from 'react';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
}

/** One consistent header for every portfolio section. */
export function SectionHeader({ index, label, title, intro, className = '' }: SectionHeaderProps) {
  return (
    <header className={`mb-14 md:mb-20 ${className}`}>
      <p className="font-mono text-xs text-text-secondary mb-5">
        <span className="text-primary">{index}</span>
        <span className="mx-2 text-border-light">/</span>
        {label}
      </p>
      <h2 className="font-display text-[clamp(32px,4.2vw,56px)] leading-[1.05] tracking-[-0.03em] text-text-primary max-w-3xl">
        {title}
      </h2>
      {intro && <p className="mt-5 text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed">{intro}</p>}
    </header>
  );
}
