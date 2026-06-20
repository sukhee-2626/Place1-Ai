const express = require('express');
const Result = require('../models/Result');
const Test = require('../models/Test');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// POST /api/results/submit - Submit a test
router.post('/submit', protect, async (req, res) => {
  try {
    const { testId, answers, timeTaken } = req.body;
    const test = await Test.findById(testId).populate('sections.questions');
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    let score = 0;
    const processedAnswers = [];
    for (const section of test.sections) {
      for (const question of section.questions) {
        const userAnswer = answers.find(a => a.questionId === question._id.toString());
        if (!userAnswer) continue;
        const isCorrect = question.correctAnswer === userAnswer.selectedAnswer;
        if (isCorrect) {
          score += (test.totalMarks / test.sections.reduce((acc, s) => acc + s.questions.length, 0));
        } else if (test.negativeMarking && userAnswer.selectedAnswer !== null) {
          score -= test.negativeMarkValue;
        }
        processedAnswers.push({
          question: question._id,
          selectedAnswer: userAnswer.selectedAnswer,
          isCorrect,
          timeTaken: userAnswer.timeTaken || 0
        });
      }
    }
    score = Math.max(0, Math.round(score * 100) / 100);
    const percentage = (score / test.totalMarks) * 100;

    // XP reward based on performance
    let xpEarned = test.xpReward;
    if (percentage >= 90) xpEarned = test.xpReward * 2;
    else if (percentage >= 75) xpEarned = Math.round(test.xpReward * 1.5);

    const result = await Result.create({
      user: req.user._id, test: testId,
      answers: processedAnswers, score,
      totalMarks: test.totalMarks, percentage,
      timeTaken, xpEarned
    });

    // Update user XP and stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: xpEarned, totalTestsAttempted: 1 }
    });

    res.status(201).json({ success: true, result, xpEarned });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/results/my - Student: get my results
router.get('/my', protect, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('test', 'title category')
      .sort({ submittedAt: -1 });
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/results/test/:testId - Admin: results for a test
router.get('/test/:testId', protect, adminOnly, async (req, res) => {
  try {
    const results = await Result.find({ test: req.params.testId })
      .populate('user', 'name email college')
      .sort({ score: -1 });
    // Add rank
    results.forEach((r, i) => r._doc ? r._doc.rank = i + 1 : r.rank = i + 1);
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
