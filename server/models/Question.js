const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'coding', 'subjective'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  topic: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['aptitude', 'dsa', 'communication', 'hr', 'sql'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  // MCQ fields
  options: [String],
  correctAnswer: Number, // index of correct option
  explanation: String,

  // Coding fields
  starterCode: {
    cpp: String,
    java: String,
    python: String,
    javascript: String
  },
  solution: String,
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false }
  }],
  constraints: String,
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],

  // Metadata & Cheatsheet fields
  companies: [String],
  tags: [String],
  xpReward: { type: Number, default: 10 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  
  // GrindGram integration fields
  videoLink: String,
  articleLink: String,
  solutionCode: String,
  contentType: String,
  contentOrder: Number,
  rows: [[String]],
  headers: [String],
  caption: String,
  hint: String,
  subtopic: String,
  grindgramId: String
});

module.exports = mongoose.model('Question', questionSchema);
