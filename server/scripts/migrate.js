const mongoose = require('mongoose');
const { Client } = require('pg');

const MONGO_URI = 'mongodb://localhost:27017/place1ai';
const PG_HOST = 'db.wfrlscmeuaenaiezggtu.supabase.co';
const PG_PASSWORD = 'sukhee26262';

// Import Mongoose Models
const User = require('../models/User');
const Job = require('../models/Job');
const Question = require('../models/Question');

async function runMigration() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB.');

  console.log('Connecting to Supabase Postgres...');
  const pgClient = new Client({
    host: PG_HOST,
    port: 5432,
    user: 'postgres',
    password: PG_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });
  await pgClient.connect();
  console.log('Connected to Supabase Postgres.');

  try {
    // 1. MIGRATE USERS
    console.log('\nFetching users from MongoDB...');
    const mongoUsers = await User.find({}).lean();
    console.log(`Found ${mongoUsers.length} users in MongoDB.`);

    if (mongoUsers.length > 0) {
      console.log('Migrating users to Postgres...');
      for (const u of mongoUsers) {
        const query = {
          text: `INSERT INTO public.users (
            id, name, email, password, role, avatar, college, branch, year, phone,
            xp, level, streak, longest_streak, last_active_date, badges,
            total_questions_attempted, total_questions_correct, total_tests_attempted,
            completed_courses, completed_questions, watched_videos, bookmarked_videos,
            topic_progress, is_active, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
          ) ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name, email = EXCLUDED.email, password = EXCLUDED.password,
            role = EXCLUDED.role, avatar = EXCLUDED.avatar, college = EXCLUDED.college,
            branch = EXCLUDED.branch, year = EXCLUDED.year, phone = EXCLUDED.phone,
            xp = EXCLUDED.xp, level = EXCLUDED.level, streak = EXCLUDED.streak,
            longest_streak = EXCLUDED.longest_streak, last_active_date = EXCLUDED.last_active_date,
            badges = EXCLUDED.badges, total_questions_attempted = EXCLUDED.total_questions_attempted,
            total_questions_correct = EXCLUDED.total_questions_correct, total_tests_attempted = EXCLUDED.total_tests_attempted,
            completed_courses = EXCLUDED.completed_courses, completed_questions = EXCLUDED.completed_questions,
            watched_videos = EXCLUDED.watched_videos, bookmarked_videos = EXCLUDED.bookmarked_videos,
            topic_progress = EXCLUDED.topic_progress, is_active = EXCLUDED.is_active`,
          values: [
            u._id.toString(),
            u.name || null,
            u.email || null,
            u.password || null,
            u.role || 'student',
            u.avatar || '',
            u.college || null,
            u.branch || null,
            u.year || null,
            u.phone || null,
            u.xp || 0,
            u.level || 1,
            u.streak || 0,
            u.longestStreak || 0,
            u.lastActiveDate ? new Date(u.lastActiveDate) : new Date(),
            JSON.stringify(u.badges || []),
            u.totalQuestionsAttempted || 0,
            u.totalQuestionsCorrect || 0,
            u.totalTestsAttempted || 0,
            JSON.stringify(u.completedCourses ? u.completedCourses.map(id => id.toString()) : []),
            JSON.stringify(u.completedQuestions ? u.completedQuestions.map(id => id.toString()) : []),
            u.watchedVideos || [],
            u.bookmarkedVideos || [],
            JSON.stringify(u.topicProgress || {}),
            u.isActive !== undefined ? u.isActive : true,
            u.createdAt ? new Date(u.createdAt) : new Date()
          ]
        };
        await pgClient.query(query);
      }
      console.log('✅ Users migration completed.');
    }

    // 2. MIGRATE JOBS
    console.log('\nFetching jobs from MongoDB...');
    const mongoJobs = await Job.find({}).lean();
    console.log(`Found ${mongoJobs.length} jobs in MongoDB.`);

    if (mongoJobs.length > 0) {
      console.log('Migrating jobs to Postgres...');
      for (const j of mongoJobs) {
        const query = {
          text: `INSERT INTO public.jobs (
            id, title, company, location, portal, type, salary, posted,
            match_score, skills_matched, skills_missing, description, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          ) ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title, company = EXCLUDED.company, location = EXCLUDED.location,
            portal = EXCLUDED.portal, type = EXCLUDED.type, salary = EXCLUDED.salary,
            posted = EXCLUDED.posted, match_score = EXCLUDED.match_score,
            skills_matched = EXCLUDED.skills_matched, skills_missing = EXCLUDED.skills_missing,
            description = EXCLUDED.description`,
          values: [
            j._id.toString(),
            j.title || null,
            j.company || null,
            j.location || null,
            j.portal || null,
            j.type || null,
            j.salary || null,
            j.posted || null,
            j.matchScore || null,
            j.skillsMatched || [],
            j.skillsMissing || [],
            j.description || null,
            j.createdAt ? new Date(j.createdAt) : new Date()
          ]
        };
        await pgClient.query(query);
      }
      console.log('✅ Jobs migration completed.');
    }

    // 3. MIGRATE QUESTIONS
    console.log('\nFetching questions from MongoDB...');
    const mongoQuestions = await Question.find({}).lean();
    console.log(`Found ${mongoQuestions.length} questions in MongoDB.`);

    if (mongoQuestions.length > 0) {
      console.log('Migrating questions to Postgres...');
      for (const q of mongoQuestions) {
        const query = {
          text: `INSERT INTO public.questions (
            id, type, title, description, topic, category, difficulty, options, correct_answer,
            explanation, starter_code, solution, test_cases, constraints, examples, companies, tags,
            xp_reward, created_by, created_at, video_link, article_link, solution_code, content_type,
            content_order, rows, headers, caption, hint, subtopic, grindgram_id
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
          ) ON CONFLICT (id) DO UPDATE SET
            type = EXCLUDED.type, title = EXCLUDED.title, description = EXCLUDED.description,
            topic = EXCLUDED.topic, category = EXCLUDED.category, difficulty = EXCLUDED.difficulty,
            options = EXCLUDED.options, correct_answer = EXCLUDED.correct_answer, explanation = EXCLUDED.explanation,
            starter_code = EXCLUDED.starter_code, solution = EXCLUDED.solution, test_cases = EXCLUDED.test_cases,
            constraints = EXCLUDED.constraints, examples = EXCLUDED.examples, companies = EXCLUDED.companies,
            tags = EXCLUDED.tags, xp_reward = EXCLUDED.xp_reward, created_by = EXCLUDED.created_by,
            video_link = EXCLUDED.video_link, article_link = EXCLUDED.article_link, solution_code = EXCLUDED.solution_code,
            content_type = EXCLUDED.content_type, content_order = EXCLUDED.content_order, rows = EXCLUDED.rows,
            headers = EXCLUDED.headers, caption = EXCLUDED.caption, hint = EXCLUDED.hint, subtopic = EXCLUDED.subtopic,
            grindgram_id = EXCLUDED.grindgram_id`,
          values: [
            q._id.toString(),
            q.type || null,
            q.title || null,
            q.description || null,
            q.topic || null,
            q.category || null,
            q.difficulty || null,
            q.options || [],
            q.correctAnswer !== undefined ? q.correctAnswer : null,
            q.explanation || null,
            JSON.stringify(q.starterCode || {}),
            q.solution || null,
            JSON.stringify(q.testCases || []),
            q.constraints || null,
            JSON.stringify(q.examples || []),
            q.companies || [],
            q.tags || [],
            q.xpReward || 10,
            q.createdBy ? q.createdBy.toString() : null,
            q.createdAt ? new Date(q.createdAt) : new Date(),
            q.videoLink || null,
            q.articleLink || null,
            q.solutionCode || null,
            q.contentType || null,
            q.contentOrder || null,
            JSON.stringify(q.rows || []),
            q.headers || [],
            q.caption || null,
            q.hint || null,
            q.subtopic || null,
            q.grindgramId || null
          ]
        };
        await pgClient.query(query);
      }
      console.log('✅ Questions migration completed.');
    }

    console.log('\n🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    await pgClient.end();
  }
}

runMigration();
