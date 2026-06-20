const express = require('express');
const Question = require('../models/Question');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/questions - Get questions with filters
router.get('/', protect, async (req, res) => {
  try {
    const { category, topic, difficulty, type, company, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (company) query.companies = { $in: [company] };
    const questions = await Question.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const total = await Question.countDocuments(query);
    res.json({ success: true, questions, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/questions/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, question });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/questions - Admin: create question
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, question });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/questions/:id - Admin: update question
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, question });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/questions/:id - Admin: delete question
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
