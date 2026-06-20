const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['aptitude', 'dsa', 'communication', 'hr', 'company-prep', 'resume', 'general'],
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'notes', 'playlist'],
    required: true
  },
  ytLink: String,
  ytPlaylistId: String,
  pdfUrl: String,
  notesContent: String,
  thumbnail: String,
  duration: String, // e.g. "2h 30m"
  instructor: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [String],
  company: String, // for company-specific content
  modules: [{
    title: String,
    videos: [{
      title: String,
      ytId: String,
      duration: String
    }]
  }],
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
