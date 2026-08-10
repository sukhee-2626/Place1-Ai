const mongoose = require('mongoose');

const trackedJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: String,
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  salary: String,
  portal: String,
  status: { type: String, enum: ['applied', 'shortlisted', 'interview', 'offer'], default: 'applied' },
  notes: String,
  interviewDate: String,
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.models.TrackedJob || mongoose.model('TrackedJob', trackedJobSchema);
