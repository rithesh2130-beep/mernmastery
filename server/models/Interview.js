import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  domain: { type: String, required: true }, // 'html', 'css', 'js', 'react', 'mongo', 'node', 'express'
  title: { type: String, required: true },
  difficulty: { type: String, required: true }, // 'Senior', 'Staff', etc.
  question: { type: String, required: true },
  answer: { type: String, required: true },
  code: { type: String, default: '' },
  teacherTip: { type: String, required: true }
});

export default mongoose.model('Interview', InterviewSchema);
