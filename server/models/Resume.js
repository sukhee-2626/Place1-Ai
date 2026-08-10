const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetTitle: String,
  targetDescription: String,
  originalText: String,
  optimizedText: String,
  atsScore: Number,
  matchedSkills: [String],
  missingSkills: [String],
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
