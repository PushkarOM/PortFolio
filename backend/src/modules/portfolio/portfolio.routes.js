import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import Project from './project.model.js';
import Experience from './experience.model.js';
import Skill from './skill.model.js';

const router = express.Router();

// -- PROJECTS ROUTES --
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

router.post('/projects', authMiddleware, async (req, res) => {
  const { id, name, description, stack, status, stars, color, emoji, highlights, githubUrl, liveUrl } = req.body;
  try {
    let project = await Project.findOne({ id });
    if (project) {
      project.name = name || project.name;
      project.description = description || project.description;
      project.stack = stack || project.stack;
      project.status = status || project.status;
      project.stars = stars !== undefined ? stars : project.stars;
      project.color = color || project.color;
      project.emoji = emoji || project.emoji;
      project.highlights = highlights || project.highlights;
      project.githubUrl = githubUrl;
      project.liveUrl = liveUrl;
      await project.save();
      res.json(project);
    } else {
      project = new Project({
        id: id || `proj_${Date.now()}`,
        name, description, stack, status, stars, color, emoji, highlights, githubUrl, liveUrl
      });
      await project.save();
      res.status(201).json(project);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error saving project' });
  }
});

router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Project.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

// -- EXPERIENCE ROUTES --
router.get('/experience', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: 1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching experience' });
  }
});

router.post('/experience', authMiddleware, async (req, res) => {
  const { id, role, company, period, color, achievements, stack } = req.body;
  try {
    let exp = await Experience.findOne({ id });
    if (exp) {
      exp.role = role || exp.role;
      exp.company = company || exp.company;
      exp.period = period || exp.period;
      exp.color = color || exp.color;
      exp.achievements = achievements || exp.achievements;
      exp.stack = stack || exp.stack;
      await exp.save();
      res.json(exp);
    } else {
      exp = new Experience({
        id: id || `exp_${Date.now()}`,
        role, company, period, color, achievements, stack
      });
      await exp.save();
      res.status(201).json(exp);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error saving experience' });
  }
});

router.delete('/experience/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Experience.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ message: 'Experience not found' });
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting experience' });
  }
});

// -- SKILLS ROUTES --
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching skills' });
  }
});

router.post('/skills', authMiddleware, async (req, res) => {
  const skillsList = req.body;
  if (!Array.isArray(skillsList)) {
    return res.status(400).json({ message: 'Expected array of skill categories' });
  }
  try {
    await Skill.deleteMany({});
    const saved = await Skill.insertMany(skillsList);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving skills' });
  }
});

export default router;
