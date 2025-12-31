
export interface Project {
  id: string;
  name: string;
  problem: string;
  stack: string[];
  githubUrl: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Platform {
  name: string;
  description: string;
  url: string;
  icon: string;
}

export interface LearningItem {
  title: string;
  status: 'Learning' | 'Exploring' | 'Growth Goal';
  description: string;
}
