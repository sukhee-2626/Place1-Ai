-- Drop existing simplified tables to allow creating the rich versions
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'student',
  avatar TEXT DEFAULT '',
  college TEXT,
  branch TEXT,
  year TEXT,
  phone TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  badges JSONB DEFAULT '[]'::jsonb,
  total_questions_attempted INTEGER DEFAULT 0,
  total_questions_correct INTEGER DEFAULT 0,
  total_tests_attempted INTEGER DEFAULT 0,
  completed_courses JSONB DEFAULT '[]'::jsonb,
  completed_questions JSONB DEFAULT '[]'::jsonb,
  watched_videos TEXT[] DEFAULT '{}'::text[],
  bookmarked_videos TEXT[] DEFAULT '{}'::text[],
  topic_progress JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  portal TEXT,
  type TEXT,
  salary TEXT,
  posted TEXT,
  match_score INTEGER,
  skills_matched TEXT[] DEFAULT '{}'::text[],
  skills_missing TEXT[] DEFAULT '{}'::text[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  topic TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  options TEXT[] DEFAULT '{}'::text[],
  correct_answer INTEGER,
  explanation TEXT,
  starter_code JSONB DEFAULT '{}'::jsonb,
  solution TEXT,
  test_cases JSONB DEFAULT '[]'::jsonb,
  constraints TEXT,
  examples JSONB DEFAULT '[]'::jsonb,
  companies TEXT[] DEFAULT '{}'::text[],
  tags TEXT[] DEFAULT '{}'::text[],
  xp_reward INTEGER DEFAULT 10,
  created_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  video_link TEXT,
  article_link TEXT,
  solution_code TEXT,
  content_type TEXT,
  content_order INTEGER,
  rows JSONB DEFAULT '[]'::jsonb,
  headers TEXT[] DEFAULT '{}'::text[],
  caption TEXT,
  hint TEXT,
  subtopic TEXT,
  grindgram_id TEXT
);
