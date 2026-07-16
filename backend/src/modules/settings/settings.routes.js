import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import Settings from './settings.model.js';

const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
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
router.post('/', authMiddleware, async (req, res) => {
  const settingsObj = req.body;

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

export default router;
