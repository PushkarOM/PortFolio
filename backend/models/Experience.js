import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, required: true },
  color: { type: String, default: '#8B5CF6' },
  achievements: [{ type: String }],
  stack: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Experience', experienceSchema);
