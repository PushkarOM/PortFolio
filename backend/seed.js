import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';
import User from './src/modules/auth/auth.model.js';
import Project from './src/modules/portfolio/project.model.js';
import Experience from './src/modules/portfolio/experience.model.js';
import Skill from './src/modules/portfolio/skill.model.js';
import Settings from './src/modules/settings/settings.model.js';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

const DEFAULT_PROJECTS = [
  {
    id: 'reposage',
    name: 'RepoSage',
    description: 'Agentic Retrieval-Augmented Generation (RAG) platform that indexes GitHub repositories for semantic code search and repository understanding. Uses LangChain agents with callable tools.',
    stack: ['Python', 'FastAPI', 'LangChain', 'Chroma', 'Docker', 'AWS'],
    status: 'Active',
    stars: 48,
    color: '#3B82F6',
    emoji: '🤖',
    highlights: ['Agentic RAG architecture', 'Conversational memory', 'PyTest & GitHub Actions CI/CD'],
    githubUrl: 'https://github.com/pushkar/reposage',
  },
  {
    id: 'skillswap',
    name: 'SkillSwap',
    description: 'Full-stack MERN community learning platform enabling collaborative learning through shared study sessions and community interactions.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    status: 'Active',
    stars: 35,
    color: '#F59E0B',
    emoji: '🤝',
    highlights: ['JWT access/refresh auth', 'Email verification', 'Docker CI/CD deployment'],
    githubUrl: 'https://github.com/pushkar/skillswap',
  },
  {
    id: 'emotionsense',
    name: 'EmotionSense',
    description: 'Full-stack multimodal AI assistant integrating custom text and speech emotion recognition models with an LLM-powered conversational interface.',
    stack: ['FastAPI', 'React', 'PyTorch', 'Hugging Face', 'OpenAI API'],
    status: 'Active',
    stars: 64,
    color: '#8B5CF6',
    emoji: '😊',
    highlights: ['Speech & Text Emotion models', 'Real-time inference API', 'LLM conversational layer'],
    githubUrl: 'https://github.com/pushkar/emotionsense',
  },
  {
    id: 'offline-hindi-assistant',
    name: 'Offline Hindi Voice Assistant',
    description: 'Offline speech AI pipeline (ASR + NLP + TTS) for Hindi interaction with optimized low-latency inference on ARM devices.',
    stack: ['Python', 'Vosk', 'Coqui TTS', 'Raspberry Pi'],
    status: 'Complete',
    stars: 42,
    color: '#22D3EE',
    emoji: '🎙️',
    highlights: ['Top 6 Bharat AI-SOC hackathon', 'ASR+NLP+TTS pipeline', 'Low-latency ARM inference'],
    githubUrl: 'https://github.com/pushkar/offline-hindi-assistant',
  },
];

const DEFAULT_EXPERIENCES = [
  {
    id: 'exp1',
    role: 'Data & Backend Engineering Intern',
    company: 'Inventlix (Remote)',
    period: 'May 2025 – Jul 2025',
    color: '#3B82F6',
    achievements: [
      'Engineered RESTful APIs for inventory management using Django REST Framework',
      'Designed and implemented JWT auth, Google OAuth, and RBAC embedded directly in tokens',
      'Integrated PostgreSQL, Google Cloud Storage, and SendGrid for automated workflows',
    ],
    stack: ['Django REST Framework', 'React', 'PostgreSQL', 'JWT', 'GCP'],
  },
];

const DEFAULT_SKILLS = [
  {
    name: 'Languages',
    color: '#3B82F6',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'JavaScript', level: 90 },
      { name: 'C++', level: 85 },
      { name: 'Java', level: 80 },
      { name: 'SQL', level: 90 },
    ],
  },
  {
    name: 'Agentic AI / LLM',
    color: '#8B5CF6',
    skills: [
      { name: 'LangChain', level: 90 },
      { name: 'RAG', level: 92 },
      { name: 'Chroma / FAISS', level: 85 },
      { name: 'OpenAI API', level: 95 },
      { name: 'Prompt Eng', level: 92 },
    ],
  },
  {
    name: 'AI / ML',
    color: '#EF4444',
    skills: [
      { name: 'PyTorch', level: 88 },
      { name: 'Hugging Face', level: 85 },
      { name: 'Scikit-Learn', level: 85 },
      { name: 'NLP & CV', level: 80 },
    ],
  },
  {
    name: 'Backend & Cloud',
    color: '#F59E0B',
    skills: [
      { name: 'FastAPI', level: 90 },
      { name: 'Django / Flask', level: 85 },
      { name: 'Node.js / Express', level: 85 },
      { name: 'Docker / AWS', level: 82 },
      { name: 'PostgreSQL / Mongo', level: 88 },
    ],
  },
  {
    name: 'Frontend',
    color: '#22D3EE',
    skills: [
      { name: 'React.js', level: 90 },
      { name: 'Tailwind CSS', level: 88 },
    ],
  },
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pushkaros';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding.');

    // Seed User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
      if (!initialPassword) {
        console.error('✗ ADMIN_INITIAL_PASSWORD environment variable is required to seed the admin user.');
        process.exit(1);
      }
      const hashedPassword = await bcrypt.hash(initialPassword, 10);
      const user = new User({ username: 'admin', password: hashedPassword });
      await user.save();
      console.log('✓ Default admin user seeded.');
    } else {
      console.log('Admin user already exists. Skipping user seed.');
    }

    // Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(DEFAULT_PROJECTS);
      console.log(`✓ Seeded ${DEFAULT_PROJECTS.length} default projects.`);
    } else {
      console.log('Projects already exist. Skipping projects seed.');
    }

    // Seed Experiences
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany(DEFAULT_EXPERIENCES);
      console.log(`✓ Seeded ${DEFAULT_EXPERIENCES.length} default experiences.`);
    } else {
      console.log('Experiences already exist. Skipping experiences seed.');
    }

    // Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(DEFAULT_SKILLS);
      console.log(`✓ Seeded ${DEFAULT_SKILLS.length} default skills categories.`);
    } else {
      console.log('Skills already exist. Skipping skills seed.');
    }

    // Seed Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({ key: 'statusText', value: 'Building RepoSage v2.0' });
      await Settings.create({ key: 'coffeeCount', value: 3 });
      console.log('✓ Seeded default system settings.');
    } else {
      console.log('Settings already exist. Skipping settings seed.');
    }

    console.log('✓ Seeding complete successfully!');
  } catch (err) {
    console.error('✗ Seeding error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
