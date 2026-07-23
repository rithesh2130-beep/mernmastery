import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  domain: { type: String, required: true }, // 'html', 'css', 'js', 'react', 'mongo', 'node', 'express'
  level: { type: Number, required: true }, // 1-10
  question: { type: String, required: true },
  codeSnippet: { type: String, default: '' },
  options: [{ type: String, required: true }], // exactly 4 choices
  correctAnswer: { type: Number, required: true }, // 0-3
  masterInsight: { type: String, required: true },
  pitfall: { type: String, default: '' }
});

export default mongoose.model('Question', QuestionSchema);
