import type { Project, Experience, SkillCategory, NowBuildingItem, LearningItem } from '../types/index';

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'reposage',
    name: 'RepoSage',
    description: 'Agentic RAG pipeline that ingests GitHub repositories, chunking and embedding code/docs into a vector database for context-grounded Q&A with LangChain agent tools and conversation memory.',
    stack: ['Python', 'LangChain', 'FastAPI', 'Chroma', 'Celery', 'Docker'],
    status: 'Active',
    stars: 48,
    color: '#3B82F6',
    emoji: '🤖',
    highlights: ['RAG + LangChain agent', 'Async ingestion via Celery/Redis', 'GitHub Actions CI'],
    githubUrl: 'https://github.com/PushkarOM/RepoSage',
  },
  {
    id: 'skillswap',
    name: 'SkillSwap',
    description: 'Full-stack MERN community learning platform enabling collaborative learning through shared study sessions with JWT access/refresh auth, email verification, and rate limiting.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    status: 'Active',
    stars: 31,
    color: '#8B5CF6',
    emoji: '🔄',
    highlights: ['JWT access/refresh auth', 'Email verification flow', 'Docker-based CI/CD'],
    githubUrl: 'https://github.com/PushkarOM/SkillSwap',
  },
  {
    id: 'emotionsense',
    name: 'EmotionSense',
    description: 'Multimodal emotion-aware AI assistant integrating custom text/speech emotion recognition (PyTorch, Hugging Face) with an LLM-powered conversational interface via FastAPI.',
    stack: ['React.js', 'FastAPI', 'PyTorch', 'Hugging Face', 'Soundfile', 'OpenAI API'],
    status: 'Active',
    stars: 64,
    color: '#EC4899',
    emoji: '🎭',
    highlights: ['Multimodal ASR + text emotion', 'Custom PyTorch models', 'FastAPI modular backend'],
    githubUrl: 'https://github.com/PushkarOM/EmotionSense',
  },
  {
    id: 'offline-hindi-assistant',
    name: 'Offline Hindi Voice Assistant',
    description: 'Offline speech AI pipeline (ASR + NLP + TTS) for Hindi interaction with optimized low-latency inference on ARM devices. Recognized in top 6 teams at Bharat AI-SOC hackathon.',
    stack: ['Python', 'Vosk', 'Coqui TTS', 'Raspberry Pi'],
    status: 'Complete',
    stars: 27,
    color: '#F59E0B',
    emoji: '🗣️',
    highlights: ['Fully offline on Raspberry Pi', 'Top 6 at Bharat AI-SOC', 'Low-latency ARM inference'],
    githubUrl: 'https://github.com/PushkarOM/hindi-voice-assistant',
  },
];

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'inventlix',
    role: 'Data & Backend Engineering Intern',
    company: 'Inventlix (Remote)',
    period: 'May 2025 – Jul 2025',
    color: '#3B82F6',
    achievements: [
      'Built RESTful CRUD APIs with pagination, filtering, and sorting for a full-stack inventory management system using Django and React',
      'Implemented secure JWT and Google OAuth authentication with RBAC, embedding user roles in token payloads to eliminate repeated DB authorization lookups',
      'Integrated Google Cloud Storage for image uploads and SendGrid for transactional emails with scheduled cron jobs for expiration notifications',
    ],
    stack: ['Django', 'React', 'JWT', 'OAuth', 'Google Cloud Storage', 'SendGrid', 'PostgreSQL'],
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
      { name: 'Django', level: 82 },
      { name: 'Node.js', level: 78 },
      { name: 'PostgreSQL', level: 80 },
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

// NowBuildingItem runtime shape: { id, text, dot } — matches SideWidgets.tsx and StudioCMS.tsx
export const DEFAULT_NOW_BUILDING: NowBuildingItem[] = [
  { id: '1', text: 'RepoSage — Agentic RAG for codebases', dot: '#3B82F6' },
  { id: '2', text: 'SkillSwap — MERN community learning platform', dot: '#8B5CF6' },
  { id: '3', text: 'EmotionSense — Multimodal emotion AI', dot: '#EC4899' },
];

// LearningItem runtime shape: { id, name, pct, color } — matches SideWidgets.tsx and StudioCMS.tsx
export const DEFAULT_LEARNING: LearningItem[] = [
  { id: '1', name: 'LangChain Agents & Tools', pct: 75, color: '#F59E0B' },
  { id: '2', name: 'Kubernetes Operator Pattern', pct: 30, color: '#3B82F6' },
  { id: '3', name: 'CUDA C++ Memory Architecture', pct: 65, color: '#EC4899' },
];
