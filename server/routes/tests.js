const express = require('express');
const Test = require('../models/Test');
const Result = require('../models/Result');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/tests
router.get('/', protect, async (req, res) => {
  try {
    const { category, company } = req.query;
    const query = {};
    if (req.user.role !== 'admin') {
      query.isPublished = true;
    }
    if (category) query.category = category;
    if (company) query.company = company;
    const tests = await Test.find(query).sort({ scheduledAt: -1 });
    res.json({ success: true, tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tests/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('sections.questions');
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tests - Admin: create test
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const test = await Test.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, test });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/tests/:id - Admin: update
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, test });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/tests/:id - Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
