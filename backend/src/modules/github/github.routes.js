import express from 'express';

const router = express.Router();

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — streak/stars change at most once per day
const FETCH_TIMEOUT_MS = 6000;
let cache = { data: null, expiresAt: 0 };

// fetch() with a hard timeout so a slow/hanging GitHub API can't hang this route.
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Compute contribution streak from GitHub's public contribution calendar page.
 * Parses the HTML for <rect data-date="YYYY-MM-DD" data-count="N"> elements.
 * Returns a formatted string like "14d" or null on failure.
 */
async function computeStreak(username) {
  try {
    const res = await fetchWithTimeout(
      `https://github.com/users/${username}/contributions`,
      { headers: { 'User-Agent': 'Mozilla/5.0 PushkarOS-Portfolio/1.0' } }
    );
    if (!res.ok) return null;

    const html = await res.text();

    // Extract all data-date / data-count pairs from <rect ... /> elements
    const rectRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-count="(\d+)"/g;
    const days = [];
    let m;
    while ((m = rectRegex.exec(html)) !== null) {
      days.push({ date: m[1], count: parseInt(m[2], 10) });
    }

    if (days.length === 0) return null;

    // Sort ascending so we can walk backwards from today
    days.sort((a, b) => (a.date < b.date ? -1 : 1));

    // Build a Set for O(1) lookup of active days
    const activeDates = new Set(days.filter(d => d.count > 0).map(d => d.date));

    // Walk backward from today; allow a 1-day grace period if today has no commits yet
    const toISO = (d) => d.toISOString().slice(0, 10);
    const today = new Date();
    const todayStr = toISO(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = toISO(yesterday);

    // Start counting from whichever of today/yesterday has activity
    let cursor = activeDates.has(todayStr)
      ? today
      : activeDates.has(yesterdayStr)
        ? yesterday
        : null;

    if (!cursor) return '0d';

    let streak = 0;
    while (true) {
      const dateStr = toISO(cursor);
      if (!activeDates.has(dateStr)) break;
      streak++;
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() - 1);
    }

    return `${streak}d`;
  } catch (err) {
    console.warn('Streak computation failed:', err.message);
    return null;
  }
}

router.get('/', async (req, res) => {
  if (cache.data && Date.now() < cache.expiresAt) {
    return res.json(cache.data);
  }

  try {
    const username = process.env.GITHUB_USERNAME || 'PushkarOM';
    const headers = process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {};

    // Run all three independent fetches in parallel for speed
    const [userRes, reposRes, streakStr] = await Promise.all([
      fetchWithTimeout(`https://api.github.com/users/${username}`, { headers }),
      fetchWithTimeout(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
      computeStreak(username),
    ]);

    if (!userRes.ok) throw new Error('Failed to fetch Github user');
    if (!reposRes.ok) throw new Error('Failed to fetch Github repos');

    const userData = await userRes.json();
    const reposData = await reposRes.json();
    const stars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    // PR count is best-effort — a failure here shouldn't fail the whole route.
    let totalPrs = null;
    try {
      const prRes = await fetchWithTimeout(
        `https://api.github.com/search/issues?q=author:${username}+type:pr`,
        { headers }
      );
      if (prRes.ok) {
        const prData = await prRes.json();
        totalPrs = prData.total_count;
      }
    } catch (prErr) {
      console.warn('Github PR count fetch failed, omitting:', prErr.message);
    }

    const result = {
      repos: userData.public_repos,
      stars,
      // streakStr is null on parse failure; frontend will display '—'
      streak: streakStr,
      prs: totalPrs,
    };

    cache = { data: result, expiresAt: Date.now() + CACHE_TTL_MS };
    res.json(result);
  } catch (err) {
    console.error('Github API error:', err);
    // Serve stale cache rather than a hard error — non-critical widget.
    if (cache.data) return res.json(cache.data);
    res.status(500).json({ message: 'Error fetching Github stats' });
  }
});

export default router;
