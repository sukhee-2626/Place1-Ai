const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const badgeSchema = new mongoose.Schema({
  id: String,
  name: String,
  icon: String,
  description: String,
  earnedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: ''
  },
  college: String,
  branch: String,
  year: String,
  phone: String,

  // Gamification
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  badges: [badgeSchema],
  totalQuestionsAttempted: { type: Number, default: 0 },
  totalQuestionsCorrect: { type: Number, default: 0 },
  totalTestsAttempted: { type: Number, default: 0 },
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  completedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  watchedVideos: [String],
  bookmarkedVideos: [String],

  // Progress tracking per topic
  topicProgress: {
    type: Map,
    of: Number,
    default: {}
  },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate level from XP
userSchema.methods.calculateLevel = function() {
  const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (this.xp >= levels[i]) return i + 1;
  }
  return 1;
};

module.exports = mongoose.model('User', userSchema);
