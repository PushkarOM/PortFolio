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

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'emotionsense',
    name: 'EmotionSense',
    description: 'Real-time facial emotion recognition system using deep CNNs with 94.2% accuracy on FER-2013 dataset. Deployed as a REST API with WebSocket streaming.',
    stack: ['Python', 'PyTorch', 'OpenCV', 'FastAPI', 'WebSocket'],
    status: 'Production',
    stars: 64,
    color: '#8B5CF6',
    emoji: '😊',
    highlights: ['94.2% accuracy', 'Real-time streaming', 'REST API deployed'],
    githubUrl: 'https://github.com/pushkar/emotionsense',
    liveUrl: 'https://emotionsense.pushkar.dev',
  },
  {
    id: 'reposage',
    name: 'RepoSage',
    description: 'AI-powered code review assistant using GPT-4 and RAG. Understands codebase context, suggests improvements, detects security issues.',
    stack: ['TypeScript', 'OpenAI', 'LangChain', 'Next.js', 'PostgreSQL'],
    status: 'Active',
    stars: 48,
    color: '#3B82F6',
    emoji: '🤖',
    highlights: ['GPT-4 powered', 'RAG architecture', 'Security scanning'],
    githubUrl: 'https://github.com/pushkar/reposage',
    liveUrl: 'https://reposage.pushkar.dev',
  },
  {
    id: 'frostdetect',
    name: 'Frost Detection System',
    description: 'Transfer learning based frost/ice detection on agricultural imagery. Achieves 97% F1-score. Used in precision farming applications.',
    stack: ['Python', 'TensorFlow', 'ResNet50', 'AWS S3', 'Lambda'],
    status: 'Complete',
    stars: 32,
    color: '#22D3EE',
    emoji: '❄️',
    highlights: ['97% F1-score', 'Transfer learning', 'AWS deployed'],
    githubUrl: 'https://github.com/pushkar/frostdetect',
  },
  {
    id: 'rlportfolio',
    name: 'RL Portfolio Optimizer',
    description: 'Reinforcement learning agent (PPO) for portfolio optimization. Outperforms S&P 500 by 18% over 5-year backtesting window.',
    stack: ['Python', 'Stable-Baselines3', 'Pandas', 'Plotly', 'Streamlit'],
    status: 'Research',
    stars: 41,
    color: '#34D399',
    emoji: '📈',
    highlights: ['+18% vs S&P500', 'PPO algorithm', '5yr backtesting'],
    githubUrl: 'https://github.com/pushkar/rlportfolio',
  },
  {
    id: 'traffic',
    name: 'Traffic Prediction',
    description: 'LSTM-based traffic flow prediction for smart city systems. Achieves 92% accuracy on real-world METR-LA dataset.',
    stack: ['Python', 'PyTorch', 'LSTM', 'GCN', 'Redis'],
    status: 'Complete',
    stars: 27,
    color: '#F59E0B',
    emoji: '🚗',
    highlights: ['92% accuracy', 'Graph convolution', 'METR-LA dataset'],
    githubUrl: 'https://github.com/pushkar/traffic-predict',
  },
  {
    id: 'smartquiz',
    name: 'SmartQuiz',
    description: 'Adaptive quiz engine powered by item response theory and GPT-4. Auto-generates questions from any uploaded PDF or webpage.',
    stack: ['React', 'Node.js', 'OpenAI', 'MongoDB', 'Docker'],
    status: 'Active',
    stars: 55,
    color: '#EF4444',
    emoji: '🧠',
    highlights: ['IRT adaptive', 'PDF ingestion', 'Multi-modal'],
    githubUrl: 'https://github.com/pushkar/smartquiz',
  },
]

const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'exp1',
    role: 'ML Engineer Intern',
    company: 'TechCorp AI Labs',
    period: 'Jun 2024 – Aug 2024',
    color: '#3B82F6',
    achievements: [
      'Built a RAG pipeline reducing response latency by 40%',
      'Deployed 3 ML models to production via FastAPI + Docker',
      'Improved model accuracy from 87% to 94% with fine-tuning',
    ],
    stack: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'AWS'],
  },
  {
    id: 'exp2',
    role: 'Full Stack Developer Intern',
    company: 'StartupXYZ',
    period: 'Dec 2023 – Feb 2024',
    color: '#8B5CF6',
    achievements: [
      'Developed 12 REST API endpoints serving 5K+ daily users',
      'Reduced page load time by 35% through Next.js optimizations',
      'Implemented real-time features using WebSockets',
    ],
    stack: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
  },
]

const DEFAULT_SKILLS: SkillCategory[] = [
  {
    name: 'Languages',
    color: '#3B82F6',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'TypeScript', level: 82 },
      { name: 'C++', level: 70 },
      { name: 'Rust', level: 30 },
    ],
  },
  {
    name: 'ML / DL',
    color: '#8B5CF6',
    skills: [
      { name: 'PyTorch', level: 90 },
      { name: 'TensorFlow', level: 78 },
      { name: 'Scikit-Learn', level: 88 },
      { name: 'HuggingFace', level: 75 },
    ],
  },
  {
    name: 'Frontend',
    color: '#22D3EE',
    skills: [
      { name: 'React', level: 85 },
      { name: 'Next.js', level: 78 },
      { name: 'Tailwind', level: 88 },
    ],
  },
  {
    name: 'Backend',
    color: '#34D399',
    skills: [
      { name: 'FastAPI', level: 88 },
      { name: 'Node.js', level: 78 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'Redis', level: 72 },
    ],
  },
  {
    name: 'DevOps / Cloud',
    color: '#F59E0B',
    skills: [
      { name: 'Docker', level: 84 },
      { name: 'AWS', level: 72 },
      { name: 'Git', level: 92 },
      { name: 'Linux', level: 85 },
    ],
  },
]

// LocalStorage helpers
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    return defaultValue
  }
}

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    // Trigger standard custom event for real-time reactivity
    window.dispatchEvent(new Event('pushkaros-data-change'))
  } catch (e) {
    console.error('LocalStorage write failed:', e)
  }
}

export const portfolioApi = {
  getProjects: (): Project[] => getStorageItem('pushkaros_projects', DEFAULT_PROJECTS),
  saveProject: (project: Project): void => {
    const current = portfolioApi.getProjects()
    const index = current.findIndex(p => p.id === project.id)
    if (index >= 0) {
      current[index] = project
    } else {
      current.push(project)
    }
    setStorageItem('pushkaros_projects', current)
  },
  deleteProject: (id: string): void => {
    const current = portfolioApi.getProjects()
    const filtered = current.filter(p => p.id !== id)
    setStorageItem('pushkaros_projects', filtered)
  },

  getExperiences: (): Experience[] => getStorageItem('pushkaros_experiences', DEFAULT_EXPERIENCES),
  saveExperience: (experience: Experience): void => {
    const current = portfolioApi.getExperiences()
    const index = current.findIndex(e => e.id === experience.id)
    if (index >= 0) {
      current[index] = experience
    } else {
      current.push(experience)
    }
    setStorageItem('pushkaros_experiences', current)
  },
  deleteExperience: (id: string): void => {
    const current = portfolioApi.getExperiences()
    const filtered = current.filter(e => e.id !== id)
    setStorageItem('pushkaros_experiences', filtered)
  },

  getSkills: (): SkillCategory[] => getStorageItem('pushkaros_skills', DEFAULT_SKILLS),
  saveSkills: (skills: SkillCategory[]): void => {
    setStorageItem('pushkaros_skills', skills)
  },

  getStatusText: (): string => getStorageItem('pushkaros_status_text', 'Building RepoSage v2.0'),
  saveStatusText: (text: string): void => {
    setStorageItem('pushkaros_status_text', text)
  },

  getCoffeeCount: (): number => getStorageItem('pushkaros_coffee_count', 3),
  saveCoffeeCount: (count: number): void => {
    setStorageItem('pushkaros_coffee_count', count)
  },
}
