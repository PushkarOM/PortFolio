import mongoose from 'mongoose';

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pushkaros';
  console.log('Connecting to MongoDB at:', MONGODB_URI.replace(/:([^@:]+)@/, ':****@'));

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Successfully connected to MongoDB.');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
