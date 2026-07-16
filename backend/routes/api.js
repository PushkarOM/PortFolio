import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Skill from '../models/Skill.js';
import Settings from '../models/Settings.js';
import Message from '../models/Message.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// ── AUTH ROUTES ──

// Login
router.post('/auth/login', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Find admin user (there should only be one)
    let user = await User.findOne({ username: 'admin' });
    
    // If no admin user exists, let them log in with default password and create the admin
    if (!user) {
      if (password === 'pushkar123') {
        const hashedPassword = await bcrypt.hash('pushkar123', 10);
        user = new User({ username: 'admin', password: hashedPassword });
        await user.save();
      } else {
        return res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Change Password
router.post('/auth/change-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required' });
  }

  try {
    const user = await User.findOne({ username: 'admin' });
    if (!user) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error updating password' });
  }
});


// ── PROJECTS ROUTES ──

// Get all
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Create/Update project
router.post('/projects', authMiddleware, async (req, res) => {
  const { id, name, description, stack, status, stars, color, emoji, highlights, githubUrl, liveUrl } = req.body;

  try {
    let project = await Project.findOne({ id });
    if (project) {
      // Update
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
      // Create
      project = new Project({
        id: id || `proj_${Date.now()}`,
        name,
        description,
        stack,
        status,
        stars,
        color,
        emoji,
        highlights,
        githubUrl,
        liveUrl
      });
      await project.save();
      res.status(201).json(project);
    }
  } catch (err) {
    console.error('Save project error:', err);
    res.status(500).json({ message: 'Error saving project' });
  }
});

// Delete project
router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Project.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});


// ── EXPERIENCE ROUTES ──

// Get all
router.get('/experience', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: 1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching experience' });
  }
});

// Create/Update experience
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
        role,
        company,
        period,
        color,
        achievements,
        stack
      });
      await exp.save();
      res.status(201).json(exp);
    }
  } catch (err) {
    console.error('Save experience error:', err);
    res.status(500).json({ message: 'Error saving experience' });
  }
});

// Delete experience
router.delete('/experience/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Experience.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting experience' });
  }
});


// ── SKILLS ROUTES ──

// Get all
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching skills' });
  }
});

// Update all skills categories bulk
router.post('/skills', authMiddleware, async (req, res) => {
  const skillsList = req.body; // Expecting array of SkillCategory
  if (!Array.isArray(skillsList)) {
    return res.status(400).json({ message: 'Expected array of skill categories' });
  }

  try {
    // We clear current and insert fresh ones to maintain order and structure
    await Skill.deleteMany({});
    const saved = await Skill.insertMany(skillsList);
    res.json(saved);
  } catch (err) {
    console.error('Save skills error:', err);
    res.status(500).json({ message: 'Error saving skills' });
  }
});


// ── SETTINGS ROUTES ──

// Get settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.find();
    const result = {};
    settings.forEach(s => {
      result[s.key] = s.value;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update setting keys
router.post('/settings', authMiddleware, async (req, res) => {
  const settingsObj = req.body; // key-value object

  try {
    for (const [key, value] of Object.entries(settingsObj)) {
      await Settings.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      );
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ message: 'Error saving settings' });
  }
});


// ── CONTACT ROUTE (MAILER) ──

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }

  try {
    // 1. Save to MongoDB
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // 2. Dispatch email via nodemailer (if credentials exist)
    const { EMAIL_USER, EMAIL_PASS } = process.env;
    if (EMAIL_USER && EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: EMAIL_USER,
        subject: `PushkarOS Portfolio: New Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email
      };

      await transporter.sendMail(mailOptions);
      res.status(201).json({ message: 'Message stored and email sent successfully!' });
    } else {
      console.warn('SMTP credentials missing. Stored message in database but did not email.');
      res.status(201).json({ message: 'Message received and saved in database.' });
    }
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ message: 'Failed to process message' });
  }
});

export default router;
