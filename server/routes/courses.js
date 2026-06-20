const express = require('express');
const Course = require('../models/Course');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/courses
router.get('/', protect, async (req, res) => {
  try {
    const { category, type, company, level } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (type) query.type = type;
    if (company) query.company = company;
    if (level) query.level = level;
    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/courses/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/courses - Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/courses/:id - Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/courses/:id - Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
