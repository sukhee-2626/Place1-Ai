const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['aptitude', 'dsa', 'communication', 'full-mock', 'company-specific'],
    required: true
  },
  company: String,
  duration: { type: Number, required: true }, // in minutes
  totalMarks: { type: Number, required: true },
  negativeMarking: { type: Boolean, default: false },
  negativeMarkValue: { type: Number, default: 0.25 },
  sections: [{
    name: String,
    duration: Number, // optional section timer
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  scheduledAt: Date,
  isPublished: { type: Boolean, default: false },
  maxAttempts: { type: Number, default: 1 },
  xpReward: { type: Number, default: 50 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
