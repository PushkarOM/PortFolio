import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import apiRoutes from './routes/api.js';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pushkaros';
console.log('Connecting to MongoDB at:', MONGODB_URI.replace(/:([^@:]+)@/, ':****@'));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`✓ Express server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });
