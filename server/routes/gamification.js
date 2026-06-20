const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

const BADGES = {
  firstLogin: { id: 'firstLogin', name: 'First Steps', icon: '🚀', description: 'Logged in for the first time' },
  streak3: { id: 'streak3', name: 'Hat Trick', icon: '🔥', description: '3-day streak' },
  streak7: { id: 'streak7', name: 'Week Warrior', icon: '⚡', description: '7-day streak' },
  streak30: { id: 'streak30', name: 'Streak Master', icon: '🏆', description: '30-day streak' },
  quiz10: { id: 'quiz10', name: 'Quiz Starter', icon: '📝', description: 'Attempted 10 questions' },
  quiz100: { id: 'quiz100', name: 'Quiz King', icon: '👑', description: 'Attempted 100 questions' },
  test1: { id: 'test1', name: 'Test Taker', icon: '📋', description: 'Completed first mock test' },
  test5: { id: 'test5', name: 'Mock Master', icon: '🎯', description: 'Completed 5 mock tests' },
  dsa10: { id: 'dsa10', name: 'DSA Warrior', icon: '💻', description: 'Solved 10 coding problems' },
  level5: { id: 'level5', name: 'Rising Star', icon: '⭐', description: 'Reached Level 5' },
  level10: { id: 'level10', name: 'Elite Coder', icon: '💎', description: 'Reached Level 10' },
  perfect: { id: 'perfect', name: 'Perfectionist', icon: '💯', description: 'Scored 100% in a test' }
};

// POST /api/gamification/award-xp
router.post('/award-xp', protect, async (req, res) => {
  try {
    const { xp, reason } = req.body;
    const user = await User.findById(req.user._id);
    user.xp += xp;
    user.level = user.calculateLevel();

    // Check for new badges
    const newBadges = [];
    const existingBadgeIds = user.badges.map(b => b.id);

    const checks = [
      { condition: user.streak >= 3, badge: 'streak3' },
      { condition: user.streak >= 7, badge: 'streak7' },
      { condition: user.streak >= 30, badge: 'streak30' },
      { condition: user.totalQuestionsAttempted >= 10, badge: 'quiz10' },
      { condition: user.totalQuestionsAttempted >= 100, badge: 'quiz100' },
      { condition: user.totalTestsAttempted >= 1, badge: 'test1' },
      { condition: user.totalTestsAttempted >= 5, badge: 'test5' },
      { condition: user.level >= 5, badge: 'level5' },
      { condition: user.level >= 10, badge: 'level10' },
    ];

    for (const check of checks) {
      if (check.condition && !existingBadgeIds.includes(check.badge)) {
        const badge = BADGES[check.badge];
        user.badges.push(badge);
        newBadges.push(badge);
      }
    }

    await user.save();
    res.json({ success: true, xp: user.xp, level: user.level, newBadges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gamification/badges
router.get('/badges', (req, res) => {
  res.json({ success: true, badges: Object.values(BADGES) });
});

module.exports = router;
