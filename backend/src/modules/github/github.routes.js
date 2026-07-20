import express from 'express';

const router = express.Router();

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const FETCH_TIMEOUT_MS = 5000;
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

router.get('/', async (req, res) => {
  if (cache.data && Date.now() < cache.expiresAt) {
    return res.json(cache.data);
  }

  try {
    const username = process.env.GITHUB_USERNAME || 'PushkarOM';
    const headers = process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};

    const userRes = await fetchWithTimeout(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) throw new Error('Failed to fetch Github user');
    const userData = await userRes.json();

    const reposRes = await fetchWithTimeout(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    if (!reposRes.ok) throw new Error('Failed to fetch Github repos');
    const reposData = await reposRes.json();
    const stars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    // PR count is best-effort — a failure here shouldn't fail the whole route,
    // and we no longer fake a plausible-looking number on failure (was a hardcoded 76).
    let totalPrs = null;
    try {
      const prRes = await fetchWithTimeout(`https://api.github.com/search/issues?q=author:${username}+type:pr`, { headers });
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
      streak: '28d',
      prs: totalPrs,
    };

    cache = { data: result, expiresAt: Date.now() + CACHE_TTL_MS };
    res.json(result);
  } catch (err) {
    console.error('Github API error:', err);
    // Serve stale cache rather than a hard error if we have one, since this is a non-critical widget.
    if (cache.data) return res.json(cache.data);
    res.status(500).json({ message: 'Error fetching Github stats' });
  }
});

export default router;
