const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/users - Admin: get all users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' }, role: 'student' } : { role: 'student' };
    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/leaderboard
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const users = await User.find({ role: 'student', isActive: true })
      .select('name xp level streak badges college branch')
      .sort({ xp: -1 })
      .limit(50);
    res.json({ success: true, leaderboard: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id - Get user profile
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/:id - Update profile
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const { name, college, branch, year, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, college, branch, year, phone },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/:id/block - Admin: block/unblock
router.put('/:id/block', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'unblocked' : 'blocked'}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users/complete-question - Toggle question completion
router.post('/complete-question', protect, async (req, res) => {
  try {
    const { questionId } = req.body;
    const Question = require('../models/Question');
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    const user = await User.findById(req.user._id);
    const isCompleted = user.completedQuestions.includes(questionId);

    const xpReward = question.xpReward || 10;

    if (isCompleted) {
      user.completedQuestions = user.completedQuestions.filter(id => id.toString() !== questionId);
      user.xp = Math.max(0, user.xp - xpReward);
    } else {
      user.completedQuestions.push(questionId);
      user.xp += xpReward;
    }

    user.level = user.calculateLevel();
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ success: true, isCompleted: !isCompleted, user: updatedUser, xpEarned: isCompleted ? -xpReward : xpReward });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
