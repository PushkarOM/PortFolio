import type { Project, Experience, SkillCategory, NowBuildingItem, LearningItem } from '../types/index';

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'emotionsense',
    name: 'EmotionSense',
    description: 'Real-time facial emotion recognition system using deep CNNs with 94.2% accuracy on FER-2013 dataset. Deployed as a REST API with WebSocket streaming.',
    stack: ['Python', 'PyTorch', 'OpenCV', 'FastAPI', 'WebSocket'],
    status: 'Production',
    stars: 64,
    color: '#8B5CF6',
    emoji: 'dY~S',
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
    emoji: 'dY -',
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
    emoji: '?,,?',
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
    emoji: 'dY"^',
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
    emoji: 'dYs-',
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
    emoji: 'dY ',
    highlights: ['IRT adaptive', 'PDF ingestion', 'Multi-modal'],
    githubUrl: 'https://github.com/pushkar/smartquiz',
  },
];

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'exp1',
    role: 'ML Engineer Intern',
    company: 'TechCorp AI Labs',
    period: 'Jun 2024 ?" Aug 2024',
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
    period: 'Dec 2023 ?" Feb 2024',
    color: '#8B5CF6',
    achievements: [
      'Developed 12 REST API endpoints serving 5K+ daily users',
      'Reduced page load time by 35% through Next.js optimizations',
      'Implemented real-time features using WebSockets',
    ],
    stack: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
  },
];

export const DEFAULT_SKILLS: SkillCategory[] = [
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
];

export const DEFAULT_NOW_BUILDING: NowBuildingItem[] = [
  { id: '1', title: 'SmartCity AI - Traffic Flow optimization', color: '#10B981' },
  { id: '2', title: 'React Native mobile app for RepoSage', color: '#3B82F6' },
  { id: '3', title: 'WebRTC video streaming server in Rust', color: '#8B5CF6' }
];

export const DEFAULT_LEARNING: LearningItem[] = [
  { id: '1', title: 'CUDA C++ Memory Architecture', progress: 65, color: '#F59E0B' },
  { id: '2', title: 'Kubernetes Operator Pattern', progress: 30, color: '#3B82F6' },
  { id: '3', title: 'Advanced GraphQL Caching', progress: 85, color: '#EC4899' }
];
