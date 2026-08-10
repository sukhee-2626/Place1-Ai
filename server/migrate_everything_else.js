const { Client } = require('pg');

const SUPABASE_URL = 'postgresql://postgres:sukhee26262@db.wfrlscmeuaenaiezggtu.supabase.co:5432/postgres';

async function migrateEverythingElse() {
  console.log('Connecting to PostgreSQL (Supabase)...');
  const pgClient = new Client({
    connectionString: SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await pgClient.connect();

  console.log('Creating remaining tables in Supabase...');
  await pgClient.query(`
    -- Tracked Jobs
    CREATE TABLE IF NOT EXISTS tracked_jobs (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      job_id TEXT,
      title TEXT,
      company TEXT,
      location TEXT,
      salary TEXT,
      portal TEXT,
      status TEXT,
      notes TEXT,
      interview_date TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Resumes
    CREATE TABLE IF NOT EXISTS resumes (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      target_title TEXT,
      target_description TEXT,
      original_text TEXT,
      optimized_text TEXT,
      ats_score INTEGER,
      matched_skills TEXT[],
      missing_skills TEXT[],
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Interview Reports
    CREATE TABLE IF NOT EXISTS interview_reports (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      type TEXT,
      tech_score INTEGER,
      comm_score INTEGER,
      soft_score INTEGER,
      answers TEXT[],
      feedback TEXT[],
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Users (if mapping external profiles)
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY,
      email TEXT,
      role TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('Successfully created all tables in Supabase for everything else!');

  await pgClient.end();
  console.log('Migration complete!');
}

migrateEverythingElse().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
