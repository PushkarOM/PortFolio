import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME || 'PushkarOM';
    
    // Setup generic headers to avoid rate limits if token is present, else normal fetch
    const headers = process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};

    // Fetch user info for public repos count
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) throw new Error('Failed to fetch Github user');
    const userData = await userRes.json();
    
    // Fetch repos for stars calculation (up to 100)
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    if (!reposRes.ok) throw new Error('Failed to fetch Github repos');
    const reposData = await reposRes.json();
    const stars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    
    // Fetch total PRs
    const prRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`, { headers });
    let totalPrs = 76;
    if (prRes.ok) {
      const prData = await prRes.json();
      totalPrs = prData.total_count;
    }

    res.json({
      repos: userData.public_repos,
      stars: stars,
      streak: '28d',
      prs: totalPrs
    });
  } catch (err) {
    console.error('Github API error:', err);
    res.status(500).json({ message: 'Error fetching Github stats' });
  }
});

export default router;
