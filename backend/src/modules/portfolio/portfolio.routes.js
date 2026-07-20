import express from 'express';
import mongoose from 'mongoose';
import authMiddleware from '../../middleware/auth.middleware.js';
import Project from './project.model.js';
import Experience from './experience.model.js';
import Skill from './skill.model.js';

const router = express.Router();

// Shared error handler: distinguishes client validation errors (400) from server errors (500)
function handleError(res, err, fallbackMessage) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  console.error(fallbackMessage, err);
  res.status(500).json({ message: fallbackMessage });
}

// -- PROJECTS ROUTES --
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: 1 });
    res.json(projects);
  } catch (err) {
    handleError(res, err, 'Error fetching projects');
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
    handleError(res, err, 'Error saving project');
  }
});

router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Project.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    handleError(res, err, 'Error deleting project');
  }
});

// -- EXPERIENCE ROUTES --
router.get('/experience', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: 1 });
    res.json(experiences);
  } catch (err) {
    handleError(res, err, 'Error fetching experience');
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
    handleError(res, err, 'Error saving experience');
  }
});

router.delete('/experience/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Experience.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ message: 'Experience not found' });
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    handleError(res, err, 'Error deleting experience');
  }
});

// -- SKILLS ROUTES --
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    res.json(skills);
  } catch (err) {
    handleError(res, err, 'Error fetching skills');
  }
});

// Replace-all save, wrapped in a transaction so a failed insertMany can't
// leave the collection wiped (see audit Issue 6).
router.post('/skills', authMiddleware, async (req, res) => {
  const skillsList = req.body;
  if (!Array.isArray(skillsList)) {
    return res.status(400).json({ message: 'Expected array of skill categories' });
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Skill.deleteMany({}, { session });
    const saved = await Skill.insertMany(skillsList, { session });
    await session.commitTransaction();
    res.json(saved);
  } catch (err) {
    await session.abortTransaction();
    handleError(res, err, 'Error saving skills');
  } finally {
    session.endSession();
  }
});

export default router;
