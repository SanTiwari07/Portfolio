
import React from 'react';
import { Project, SkillCategory, Platform, LearningItem } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'KrishiSetu',
    problem: 'An AI-powered agriculture platform designed to support farmers with decision-making, sustainability insights, and intelligent system workflows.',
    stack: ['AI', 'System Architecture', 'Impact'],
    githubUrl: 'https://github.com/SanTiwari07/KrishiSetu'
  },
  {
    id: '2',
    name: 'KrishiSaarthi',
    problem: 'A smart agricultural assistant that combines machine learning and system logic to help farmers with crop-related insights and guidance.',
    stack: ['ML', 'Applied Intelligence', 'Social Impact'],
    githubUrl: 'https://github.com/SanTiwari07/KrishiSaarthi'
  },
  {
    id: '3',
    name: 'Smart Traffic Flow Analyzer',
    problem: 'A system that analyzes traffic patterns to optimize signal timing and improve urban mobility using data-driven logic.',
    stack: ['Computer Vision', 'ML', 'Systems Thinking'],
    githubUrl: 'https://github.com/SanTiwari07/Smart-Traffic-Flow-Analyzer'
  },
  {
    id: '4',
    name: 'UniFit Health',
    problem: 'An AI-powered student wellness platform that integrates fitness, hydration, nutrition, and recovery into a single intelligent system.',
    stack: ['AI Systems', 'Product Thinking'],
    githubUrl: 'https://github.com/SanTiwari07/UniFit-Health'
  },
  {
    id: '5',
    name: 'OOP Mini Project',
    problem: 'A foundational object-oriented programming project demonstrating core OOP principles through practical problem-solving.',
    stack: ['OOP', 'Software Fundamentals'],
    githubUrl: 'https://github.com/SanTiwari07/OOP-mini-project'
  },
  {
    id: '6',
    name: 'IIDTL Project',
    problem: 'A hardware–software integrated project developed for IIDTL, focusing on applied electronics, sensors, and system-level implementation.',
    stack: ['Electronics', 'Embedded Systems'],
    githubUrl: 'https://github.com/SanTiwari07/IIDTL-Project'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Programming',
    skills: ['Python', 'C', 'C++']
  },
  {
    title: 'Web Development',
    skills: ['HTML', 'CSS', 'React', 'Node.js']
  },
  {
    title: 'Machine Learning / AI',
    skills: ['PyTorch', 'Scikit-Learn', 'Computer Vision', 'LLM']
  },
  {
    title: 'Tools & Platforms',
    skills: ['AWS', 'GitHub', 'Git', 'Linux']
  }
];

export const PLATFORMS: Platform[] = [
  {
    name: 'GitHub',
    description: 'Where I build and ship technical projects.',
    url: 'https://github.com/SanTiwari07',
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
  },
  {
    name: 'LinkedIn',
    description: 'Professional profile, achievements, and updates.',
    url: 'https://www.linkedin.com/in/sanskar-tiwari-b781a9315/',
    icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
  },
  {
    name: 'LeetCode',
    description: 'Algorithmic problem solving and technical preparation.',
    url: 'https://leetcode.com/u/cmy7RSNHvA/',
    icon: 'M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.303c.467-.467 1.125-.662 1.837-.662s1.357.195 1.824.662l2.697 2.606c.514.515 1.335.515 1.849 0 .515-.515.515-1.335 0-1.849l-2.697-2.606c-1.081-1.081-2.608-1.538-4.247-1.538-1.64 0-3.166.457-4.247 1.538L3.93 11.23c-1.081 1.081-1.538 2.607-1.538 4.247s.457 3.166 1.538 4.247l4.331 4.363c1.081 1.081 2.608 1.538 4.247 1.538s3.166-.457 4.247-1.538l2.697-2.607c.515-.515.515-1.334 0-1.848a1.309 1.309 0 00-1.848 0z'
  },
  {
    name: 'Kaggle',
    description: 'Machine learning datasets and competitions.',
    url: 'https://www.kaggle.com/santiwari07',
    icon: 'M18.825 23.859c-.022.028-.117.141-.285.141h-4.83c-.33 0-.615-.128-.854-.383l-5.907-7.465-1.839 1.887v5.578c0 .35-.143.662-.428.93-.285.268-.597.403-.934.403H1.011c-.348 0-.663-.134-.944-.403a1.24 1.24 0 0 1-.42-.93V1.07c0-.348.14-.664.42-.944.281-.281.596-.421.944-.421h2.737c.337 0 .649.14.934.421.285.28.428.596.428.944v11.753l7.05-7.411c.218-.236.48-.354.786-.354h5.235c.18 0 .285.105.315.315.012.158-.04.285-.157.383l-7.394 7.507 7.822 9.802c.11.146.162.274.157.383a.434.434 0 0 1-.314.314z'
  }
];

export const JOURNEY_ITEMS: LearningItem[] = [
  {
    title: 'Embedded Systems & Hardware–Software Integration',
    status: 'Learning',
    description: 'Building real-world systems by connecting sensors, microcontrollers, and software logic into reliable solutions.'
  },
  {
    title: 'Computer Vision & Applied Machine Learning',
    status: 'Exploring',
    description: 'Working with image-based models and data pipelines to analyze scenarios like traffic, agriculture, and human activity.'
  },
  {
    title: 'AI Systems & LLM-Based Applications',
    status: 'Growth Goal',
    description: 'Aiming to design practical applications using large language models for automation, insights, and decision support.'
  }
];
