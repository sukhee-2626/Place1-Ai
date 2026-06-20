const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Question = require('../models/Question');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/place1ai';

async function importData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    console.log('🧹 Clearing existing database questions...');
    const delRes = await Question.deleteMany({});
    console.log(`🧹 Deleted ${delRes.deletedCount} old questions.`);

    const files = {
      sql: { filename: 'api_sql-interview-sheet.json', category: 'sql' },
      dsa: { filename: 'api_curious-coding-sheet.json', category: 'dsa' },
      aptitude: { filename: 'api_aptitude-cheatsheet.json', category: 'aptitude' }
    };

    let totalInserted = 0;

    for (const [key, config] of Object.entries(files)) {
      const filepath = `C:\\Users\\HP\\.gemini\\antigravity\\scratch\\${config.filename}`;
      if (!fs.existsSync(filepath)) {
        console.error(`❌ File not found: ${filepath}`);
        continue;
      }

      console.log(`\n📦 Importing category: ${config.category} from ${config.filename}...`);
      const root = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      const track = root.track || {};
      
      const insertList = [];

      if (track.topics) {
        track.topics.forEach((topic, tIdx) => {
          const topicTitle = topic.title || `Topic ${tIdx + 1}`;
          
          if (topic.subtopics) {
            topic.subtopics.forEach((sub, sIdx) => {
              const subtopicTitle = sub.title || `Subtopic ${sIdx + 1}`;
              
              if (sub.content) {
                sub.content.forEach(item => {
                  let parsedInfo = {};
                  if (item.content_info) {
                    try {
                      parsedInfo = JSON.parse(item.content_info);
                    } catch (e) {
                      // Fallback if not valid JSON
                      parsedInfo = {};
                    }
                  }

                  let type = 'subjective';
                  if (item.content_type === 'quiz') {
                    type = 'mcq';
                  } else if (item.content_type === 'code' || item.content_type === 'article') {
                    type = 'coding';
                  }

                  let title = item.title || subtopicTitle;
                  let description = item.description || '';
                  let options = [];
                  let correctAnswer = 0;
                  let explanation = item.hint || '';
                  let solutionCode = '';
                  let rows = [];
                  let headers = [];
                  let caption = '';

                  // Parse properties based on type
                  if (type === 'mcq') {
                    description = parsedInfo.question || item.description || title;
                    if (parsedInfo.options) {
                      options = parsedInfo.options.map(opt => opt.text || '');
                    }
                    correctAnswer = parsedInfo.correctAnswer !== undefined ? parsedInfo.correctAnswer : 0;
                    explanation = parsedInfo.explanation || '';
                  } else if (item.content_type === 'code') {
                    if (parsedInfo.code_snippets && parsedInfo.code_snippets.length > 0) {
                      solutionCode = parsedInfo.code_snippets[0].content || '';
                    }
                  } else if (item.content_type === 'table') {
                    rows = parsedInfo.rows || [];
                    headers = parsedInfo.headers || [];
                    caption = parsedInfo.caption || '';
                  } else if (item.content_type === 'paragraph') {
                    description = parsedInfo.content || item.description || '';
                  }

                  // Default values for required fields
                  if (!title) title = 'Untitled Item';
                  if (!description) description = title;

                  insertList.push({
                    type,
                    title,
                    description,
                    topic: topicTitle,
                    subtopic: subtopicTitle,
                    category: config.category,
                    difficulty: item.difficulty || 'medium',
                    options,
                    correctAnswer,
                    explanation,
                    solutionCode,
                    rows,
                    headers,
                    caption,
                    videoLink: item.resource_link || item.video_link || '',
                    articleLink: item.article_link || '',
                    hint: item.hint || '',
                    contentType: item.content_type || 'article',
                    contentOrder: item.content_order || 0,
                    grindgramId: item.id || '',
                    xpReward: item.xp_reward || 10
                  });
                });
              }
            });
          }
        });
      }

      if (insertList.length > 0) {
        console.log(`🚀 Inserting ${insertList.length} items for ${config.category}...`);
        const inserted = await Question.insertMany(insertList);
        console.log(`✅ Inserted ${inserted.length} questions.`);
        totalInserted += inserted.length;
      }
    }

    // Seed demo users if they don't exist, to keep login working
    console.log('\n👥 Verifying user accounts...');
    const User = require('../models/User');
    const adminExists = await User.findOne({ email: 'admin@demo.com' });
    if (!adminExists) {
      await User.create({
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'admin123',
        role: 'admin',
        college: 'Placement Cell',
        branch: 'Administration',
        year: 'Staff'
      });
      console.log('👤 Created admin account: admin@demo.com / admin123');
    }
    
    const studentExists = await User.findOne({ email: 'student@demo.com' });
    if (!studentExists) {
      await User.create({
        name: 'Demo Student',
        email: 'student@demo.com',
        password: 'password123',
        role: 'student',
        college: 'IIT Madras',
        branch: 'Computer Science',
        year: 'Final Year',
        xp: 150,
        level: 2,
        streak: 3
      });
      console.log('👤 Created student account: student@demo.com / password123');
    }

    console.log(`\n🎉 Seeding complete! Seeded ${totalInserted} total questions.`);
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

importData();
