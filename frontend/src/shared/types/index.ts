// Shared type definitions — no imports from other project files to avoid circular deps

export interface Project {
  id: string
  name: string
  description: string
  stack: string[]
  status: 'Production' | 'Active' | 'Research' | 'Complete'
  stars: number
  color: string
  emoji: string
  highlights: string[]
  githubUrl?: string
  liveUrl?: string
}

export interface Experience {
  id: string
  role: string
  company: string
  period: string
  color: string
  achievements: string[]
  stack: string[]
}

export interface SkillCategory {
  name: string
  color: string
  skills: { name: string; level: number }[]
}

export interface NowBuildingItem {
  id: string
  title: string
  color: string
}

export interface LearningItem {
  id: string
  title: string
  progress: number
  color: string
}
