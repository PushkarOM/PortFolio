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

export interface NowBuildingItem {
  text: string
  dot: string
}

export interface LearningItem {
  name: string
  pct: number
  color: string
}

export const DEFAULT_NOW_BUILDING: NowBuildingItem[] = [
  { text: 'RepoSage v2.0', dot: '#3B82F6' },
  { text: 'Personal AI assistant', dot: '#8B5CF6' },
  { text: 'PushkarOS portfolio', dot: '#34D399' },
  { text: 'Making impact 🌍', dot: '#F59E0B' },
]

export const DEFAULT_LEARNING_LOG: LearningItem[] = [
  { name: 'LLM Fine-tuning', pct: 70, color: '#8B5CF6' },
  { name: 'RAG Systems', pct: 55, color: '#3B82F6' },
  { name: 'Rust', pct: 25, color: '#F59E0B' },
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
    window.dispatchEvent(new Event('pushkaros-data-change'))
  } catch (e) {
    console.error('LocalStorage write failed:', e)
  }
}

// Check if we are running in backend-connected mode
let isBackendOnline = false;

// HTTP Request helper
const request = async (url: string, options: RequestInit = {}) => {
  const token = sessionStorage.getItem('pushkaros_jwt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        sessionStorage.removeItem('pushkaros_jwt_token');
        window.dispatchEvent(new Event('pushkaros-auth-logout'));
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `HTTP error ${res.status}`);
    }
    isBackendOnline = true;
    return await res.json();
  } catch (err) {
    console.warn(`Backend request failed for ${url}:`, err);
    // If connection was refused or offline, assume backend is offline
    if (err instanceof TypeError && err.message.includes('fetch')) {
      isBackendOnline = false;
    }
    throw err;
  }
};

export const portfolioApi = {
  // Check auth state
  isAuthenticated: (): boolean => {
    return sessionStorage.getItem('pushkaros_cms_authenticated') === 'true' || 
           !!sessionStorage.getItem('pushkaros_jwt_token');
  },

  // Log in
  login: async (password: string): Promise<boolean> => {
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password })
      });
      if (data.token) {
        sessionStorage.setItem('pushkaros_jwt_token', data.token);
        sessionStorage.setItem('pushkaros_cms_authenticated', 'true');
        window.dispatchEvent(new Event('pushkaros-data-change'));
        return true;
      }
      return false;
    } catch (err) {
      // Local fallback auth
      const localPassword = getStorageItem('pushkaros_cms_password', 'pushkar123');
      if (password === localPassword) {
        sessionStorage.setItem('pushkaros_cms_authenticated', 'true');
        window.dispatchEvent(new Event('pushkaros-data-change'));
        return true;
      }
      throw err;
    }
  },

  // Log out
  logout: () => {
    sessionStorage.removeItem('pushkaros_jwt_token');
    sessionStorage.removeItem('pushkaros_cms_authenticated');
    window.dispatchEvent(new Event('pushkaros-data-change'));
    window.dispatchEvent(new Event('pushkaros-auth-logout'));
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await request('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      return true;
    } catch (err) {
      // Local fallback
      const localPassword = getStorageItem('pushkaros_cms_password', 'pushkar123');
      if (oldPassword === localPassword) {
        setStorageItem('pushkaros_cms_password', newPassword);
        return true;
      }
      throw err;
    }
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    try {
      const data = await request('/api/projects');
      isBackendOnline = true;
      return data;
    } catch (err) {
      return getStorageItem('pushkaros_projects', DEFAULT_PROJECTS);
    }
  },

  saveProject: async (project: Project): Promise<void> => {
    try {
      await request('/api/projects', {
        method: 'POST',
        body: JSON.stringify(project)
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      const current = getStorageItem<Project[]>('pushkaros_projects', DEFAULT_PROJECTS);
      const index = current.findIndex(p => p.id === project.id);
      if (index >= 0) {
        current[index] = project;
      } else {
        current.push(project);
      }
      setStorageItem('pushkaros_projects', current);
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      await request(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      const current = getStorageItem<Project[]>('pushkaros_projects', DEFAULT_PROJECTS);
      const filtered = current.filter(p => p.id !== id);
      setStorageItem('pushkaros_projects', filtered);
    }
  },

  // Experiences
  getExperiences: async (): Promise<Experience[]> => {
    try {
      const data = await request('/api/experience');
      isBackendOnline = true;
      return data;
    } catch (err) {
      return getStorageItem('pushkaros_experiences', DEFAULT_EXPERIENCES);
    }
  },

  saveExperience: async (experience: Experience): Promise<void> => {
    try {
      await request('/api/experience', {
        method: 'POST',
        body: JSON.stringify(experience)
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      const current = getStorageItem<Experience[]>('pushkaros_experiences', DEFAULT_EXPERIENCES);
      const index = current.findIndex(e => e.id === experience.id);
      if (index >= 0) {
        current[index] = experience;
      } else {
        current.push(experience);
      }
      setStorageItem('pushkaros_experiences', current);
    }
  },

  deleteExperience: async (id: string): Promise<void> => {
    try {
      await request(`/api/experience/${id}`, {
        method: 'DELETE'
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      const current = getStorageItem<Experience[]>('pushkaros_experiences', DEFAULT_EXPERIENCES);
      const filtered = current.filter(e => e.id !== id);
      setStorageItem('pushkaros_experiences', filtered);
    }
  },

  // Skills
  getSkills: async (): Promise<SkillCategory[]> => {
    try {
      const data = await request('/api/skills');
      isBackendOnline = true;
      return data;
    } catch (err) {
      return getStorageItem('pushkaros_skills', DEFAULT_SKILLS);
    }
  },

  saveSkills: async (skills: SkillCategory[]): Promise<void> => {
    try {
      await request('/api/skills', {
        method: 'POST',
        body: JSON.stringify(skills)
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      setStorageItem('pushkaros_skills', skills);
    }
  },

  // Settings
  getStatusText: async (): Promise<string> => {
    try {
      const data = await request('/api/settings');
      isBackendOnline = true;
      return data.statusText || 'Building RepoSage v2.0';
    } catch (err) {
      return getStorageItem('pushkaros_status_text', 'Building RepoSage v2.0');
    }
  },

  saveStatusText: async (text: string): Promise<void> => {
    try {
      await request('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ statusText: text })
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      setStorageItem('pushkaros_status_text', text);
    }
  },

  getCoffeeCount: async (): Promise<number> => {
    try {
      const data = await request('/api/settings');
      isBackendOnline = true;
      const today = new Date().toDateString();
      if (data.coffeeDate !== today) {
        return 0;
      }
      return data.coffeeCount !== undefined ? data.coffeeCount : 0;
    } catch (err) {
      const today = new Date().toDateString();
      if (getStorageItem('pushkaros_coffee_date', '') !== today) {
        return 0;
      }
      return getStorageItem('pushkaros_coffee_count', 0);
    }
  },

  saveCoffeeCount: async (count: number): Promise<void> => {
    try {
      const today = new Date().toDateString();
      await request('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ coffeeCount: count, coffeeDate: today })
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      const today = new Date().toDateString();
      setStorageItem('pushkaros_coffee_count', count);
      setStorageItem('pushkaros_coffee_date', today);
    }
  },

  getGithubStats: async (): Promise<{ repos: number, stars: number, streak: string, prs: number }> => {
    try {
      const data = await request('/api/github');
      return data;
    } catch (err) {
      return { repos: 42, stars: 180, streak: '28d', prs: 76 };
    }
  },

  getNowBuilding: async (): Promise<NowBuildingItem[]> => {
    try {
      const data = await request('/api/settings');
      if (data.nowBuilding) {
        return JSON.parse(data.nowBuilding);
      }
      return getStorageItem('pushkaros_now_building', DEFAULT_NOW_BUILDING);
    } catch (err) {
      return getStorageItem('pushkaros_now_building', DEFAULT_NOW_BUILDING);
    }
  },

  saveNowBuilding: async (items: NowBuildingItem[]): Promise<void> => {
    try {
      await request('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ nowBuilding: JSON.stringify(items) })
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      setStorageItem('pushkaros_now_building', items);
    }
  },

  getLearningLog: async (): Promise<LearningItem[]> => {
    try {
      const data = await request('/api/settings');
      if (data.learningLog) {
        return JSON.parse(data.learningLog);
      }
      return getStorageItem('pushkaros_learning_log', DEFAULT_LEARNING_LOG);
    } catch (err) {
      return getStorageItem('pushkaros_learning_log', DEFAULT_LEARNING_LOG);
    }
  },

  saveLearningLog: async (items: LearningItem[]): Promise<void> => {
    try {
      await request('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ learningLog: JSON.stringify(items) })
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      setStorageItem('pushkaros_learning_log', items);
    }
  },

  // Send message
  sendMessage: async (name: string, email: string, message: string): Promise<void> => {
    await request('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message })
    });
  }
}
