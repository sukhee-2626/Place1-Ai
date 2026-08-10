const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  portal: { type: String, enum: ['LinkedIn', 'Indeed', 'Naukri', 'Foundit', 'Internshala'] },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'] },
  salary: String,
  posted: String,
  matchScore: Number,
  skillsMatched: [String],
  skillsMissing: [String],
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
