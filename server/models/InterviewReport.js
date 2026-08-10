const mongoose = require('mongoose');

const interviewReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['hr', 'tech'], required: true },
  techScore: Number,
  commScore: Number,
  softScore: Number,
  answers: [String],
  feedback: [String],
  dateTaken: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewReport', interviewReportSchema);
