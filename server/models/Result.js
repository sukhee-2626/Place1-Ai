const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeTaken: Number // seconds
  }],
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: Number,
  rank: Number,
  timeTaken: Number, // total seconds
  xpEarned: { type: Number, default: 0 },
  sectionWiseScore: [{
    section: String,
    score: Number,
    total: Number
  }],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
