import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  stack: [{ type: String }],
  status: { type: String, enum: ['Production', 'Active', 'Research', 'Complete'], default: 'Active' },
  stars: { type: Number, default: 0 },
  color: { type: String, default: '#3B82F6' },
  emoji: { type: String, default: '🚀' },
  highlights: [{ type: String }],
  githubUrl: { type: String },
  liveUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
