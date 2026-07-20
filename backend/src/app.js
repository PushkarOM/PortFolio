import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import portfolioRoutes from './modules/portfolio/portfolio.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import githubRoutes from './modules/github/github.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';

const app = express();

// Middleware
app.set('trust proxy', 1); // For Vercel Edge proxies
// Restrict to FRONTEND_URL when set; falls back to open (matches prior behavior)
// since frontend/backend are served from the same Vercel domain today.
app.use(cors(process.env.FRONTEND_URL ? { origin: process.env.FRONTEND_URL } : {}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', portfolioRoutes); // Projects, Experience, Skills are under /api/projects etc
app.use('/api/settings', settingsRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

export default app;
