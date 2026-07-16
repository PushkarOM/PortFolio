import dotenv from 'dotenv';
import dns from 'dns';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config(); // dotenv looks in current dir (backend/.env)
dns.setServers(['8.8.8.8', '8.8.4.4']);

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('✗ ERROR: JWT_SECRET environment variable is missing or too short (must be >= 32 chars).');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Express server running on port ${PORT}`);
  });
});
