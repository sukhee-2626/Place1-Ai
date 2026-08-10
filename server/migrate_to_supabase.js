const { Client } = require('pg');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'postgresql://postgres:sukhee26262@db.wfrlscmeuaenaiezggtu.supabase.co:5432/postgres';
const MONGO_URL = 'mongodb://127.0.0.1:27017/placement';

async function migrate() {
  console.log('Connecting to PostgreSQL (Supabase)...');
  const pgClient = new Client({
    connectionString: SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await pgClient.connect();

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URL);
  
  // 1. Create Tables in Supabase
  console.log('Creating tables in Supabase...');
  await pgClient.query(`
    DROP TABLE IF EXISTS jobs;
    DROP TABLE IF EXISTS questions;

    CREATE TABLE jobs (
      id SERIAL PRIMARY KEY,
      mongo_id TEXT,
      title TEXT,
      company TEXT,
      location TEXT,
      portal TEXT,
      type TEXT,
      salary TEXT,
      posted TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE questions (
      id SERIAL PRIMARY KEY,
      title TEXT,
      description TEXT,
      topic TEXT,
      subtopic TEXT,
      category TEXT,
      difficulty TEXT,
      link TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // 2. Migrate Jobs from MongoDB
  console.log('Migrating Jobs from MongoDB...');
  const db = mongoose.connection.db;
  const jobs = await db.collection('jobs').find({}).toArray();
  
  let jobsInserted = 0;
  for (const job of jobs) {
    // Insert if not exists
    const res = await pgClient.query('SELECT id FROM jobs WHERE mongo_id = $1', [job._id.toString()]);
    if (res.rows.length === 0) {
      await pgClient.query(
        'INSERT INTO jobs (mongo_id, title, company, location, portal, type, salary, posted, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [job._id.toString(), job.title, job.company, job.location, job.portal, job.type, job.salary, job.posted, job.description]
      );
      jobsInserted++;
    }
  }
  console.log(`Successfully migrated ${jobsInserted} jobs from MongoDB to Supabase.`);

  // 3. Migrate DSA questions from JSON
  console.log('Migrating DSA Questions from JSON...');
  const dsaPath = path.join(__dirname, 'scripts', 'dsa_full.json');
  if (fs.existsSync(dsaPath)) {
    const dsaData = JSON.parse(fs.readFileSync(dsaPath, 'utf8'));
    let questionsInserted = 0;
    
    for (const topicObj of dsaData) {
      const topic = topicObj.name;
      for (const subtopicObj of topicObj.subtopics) {
        const subtopic = subtopicObj.name;
        for (const prob of subtopicObj.problems) {
          const res = await pgClient.query('SELECT id FROM questions WHERE link = $1 AND title = $2', [prob.link, prob.title]);
          if (res.rows.length === 0) {
            await pgClient.query(
              'INSERT INTO questions (title, description, topic, subtopic, category, difficulty, link) VALUES ($1, $2, $3, $4, $5, $6, $7)',
              [prob.title, '', topic, subtopic, 'dsa', prob.difficulty || 'medium', prob.link]
            );
            questionsInserted++;
          }
        }
      }
    }
    console.log(`Successfully migrated ${questionsInserted} DSA questions to Supabase.`);
  }

  await pgClient.end();
  await mongoose.disconnect();
  console.log('Migration complete!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
