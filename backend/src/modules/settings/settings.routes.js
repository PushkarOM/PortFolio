import express from 'express';
import rateLimit from 'express-rate-limit';
import authMiddleware from '../../middleware/auth.middleware.js';
import Settings from './settings.model.js';

const router = express.Router();

// Only these keys may be written via the generic admin settings endpoint.
// Prevents an authenticated-but-compromised session from upserting arbitrary keys (Issue 25).
const ALLOWED_SETTING_KEYS = new Set([
  'statusText',
  'nowBuilding',
  'learningLog',
  'coffeeDate', // legacy key, kept for backward compatibility; coffeeCount now lives in its own route
]);

const coffeeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // generous, this is a low-stakes public counter
  message: { message: 'Too many requests, slow down.' },
});

// Get settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find().lean();

    const result = Object.fromEntries(
      settings.map(({ key, value }) => [key, value])
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update setting keys — admin only, allowlisted keys only.
router.post('/', authMiddleware, async (req, res) => {
  const settingsObj = req.body;
  const keys = Object.keys(settingsObj);
  const disallowed = keys.filter(k => !ALLOWED_SETTING_KEYS.has(k));
  if (disallowed.length > 0) {
    return res.status(400).json({ message: `Unknown setting key(s): ${disallowed.join(', ')}` });
  }

  try {
    await Promise.all(
      Object.entries(settingsObj).map(([key, value]) =>
        Settings.findOneAndUpdate(
          { key },
          { value },
          { upsert: true, new: true }
        )
      )
    );
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ message: 'Error saving settings' });
  }
});

// Public, rate-limited "cups today" counter. Keyed per calendar day so it
// resets automatically and increments atomically (no read-then-write race).
router.get('/coffee-count', async (req, res) => {
  try {
    const today = new Date().toDateString();
    const doc = await Settings.findOne({ key: `coffeeCount:${today}` });
    res.json({ count: doc?.value ?? 0 });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching coffee count' });
  }
});

router.post('/coffee-count', coffeeLimiter, async (req, res) => {
  try {
    const today = new Date().toDateString();
    const doc = await Settings.findOneAndUpdate(
      { key: `coffeeCount:${today}` },
      { $inc: { value: 1 } },
      { upsert: true, new: true }
    );
    res.json({ count: doc.value });
  } catch (err) {
    res.status(500).json({ message: 'Error updating coffee count' });
  }
});

export default router;
