import mongoose from 'mongoose';

const skillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
});

const skillCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, default: '#3B82F6' },
  skills: [skillItemSchema],
}, { timestamps: true });

export default mongoose.model('Skill', skillCategorySchema);
