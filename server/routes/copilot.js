const express = require('express');
const { protect } = require('../middleware/auth');
const Job = require('../models/Job');
const TrackedJob = require('../models/TrackedJob');
const Resume = require('../models/Resume');
const InterviewReport = require('../models/InterviewReport');

const router = express.Router();

// GET /api/copilot/jobs
router.get('/jobs', protect, async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ matchScore: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/copilot/tracker
router.get('/tracker', protect, async (req, res) => {
  try {
    const trackerJobs = await TrackedJob.find({ userId: req.user._id }).sort({ dateAdded: -1 });
    res.json({ success: true, trackerJobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/copilot/tracker
router.post('/tracker', protect, async (req, res) => {
  try {
    const { jobId, title, company, location, salary, portal, status, notes, interviewDate } = req.body;
    
    // Check if user already tracking this job
    const existing = await TrackedJob.findOne({
      userId: req.user._id,
      title,
      company
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Already tracking this application!' });
    }

    const trackedJob = new TrackedJob({
      userId: req.user._id,
      jobId,
      title,
      company,
      location,
      salary,
      portal,
      status: status || 'applied',
      notes,
      interviewDate
    });

    await trackedJob.save();
    res.status(201).json({ success: true, trackedJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/copilot/tracker/:id
router.put('/tracker/:id', protect, async (req, res) => {
  try {
    const { status, notes, interviewDate } = req.body;
    let trackedJob = await TrackedJob.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trackedJob) {
      return res.status(404).json({ success: false, message: 'Tracked application not found' });
    }

    if (status !== undefined) trackedJob.status = status;
    if (notes !== undefined) trackedJob.notes = notes;
    if (interviewDate !== undefined) trackedJob.interviewDate = interviewDate;

    await trackedJob.save();
    res.json({ success: true, trackedJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/copilot/tracker/:id
router.delete('/tracker/:id', protect, async (req, res) => {
  try {
    const result = await TrackedJob.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Tracked application not found' });
    }
    res.json({ success: true, message: 'Tracked application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/copilot/resume
router.post('/resume', protect, async (req, res) => {
  try {
    const { targetTitle, targetDescription, originalText, optimizedText, atsScore, matchedSkills, missingSkills } = req.body;
    
    const resume = new Resume({
      userId: req.user._id,
      targetTitle,
      targetDescription,
      originalText,
      optimizedText,
      atsScore,
      matchedSkills,
      missingSkills
    });

    await resume.save();
    res.status(201).json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/copilot/resumes
router.get('/resumes', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ dateCreated: -1 });
    res.json({ success: true, resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/copilot/interview
router.post('/interview', protect, async (req, res) => {
  try {
    const { type, techScore, commScore, softScore, answers, feedback } = req.body;
    
    const report = new InterviewReport({
      userId: req.user._id,
      type,
      techScore,
      commScore,
      softScore,
      answers,
      feedback
    });

    await report.save();
    res.status(201).json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/copilot/interviews
router.get('/interviews', protect, async (req, res) => {
  try {
    const reports = await InterviewReport.find({ userId: req.user._id }).sort({ dateTaken: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
