const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SECRET_KEY must be set in server/.env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const sampleUsers = [
  {
    email: 'student@demo.com',
    password: 'password123',
    name: 'Demo Student',
    role: 'student'
  },
  {
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'Demo Admin',
    role: 'admin'
  }
];

async function seed() {
  console.log('Seeding Supabase auth and public users...');
  
  for (const user of sampleUsers) {
    let authUser = null;

    // 1. Try to create the user
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { full_name: user.name }
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists') || error.status === 422) {
          console.log(`User ${user.email} already exists in Auth. Fetching existing user...`);
          // Fetch existing user to get ID
          const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
          if (listError) throw listError;
          const found = listData.users.find(u => u.email === user.email);
          if (found) {
            authUser = found;
            // Update password just in case
            await supabase.auth.admin.updateUserById(found.id, {
              password: user.password,
              email_confirm: true
            });
            console.log(`Updated password for ${user.email}.`);
          } else {
            throw new Error(`Could not find existing user ${user.email} in list`);
          }
        } else {
          throw error;
        }
      } else {
        authUser = data.user;
        console.log(`Successfully created Auth user: ${user.email}`);
      }
    } catch (err) {
      console.error(`Error handling Auth user ${user.email}:`, err.message);
      continue;
    }

    if (!authUser) continue;

    // 2. Sync / insert into public.users table
    try {
      const { data: existingProfile, error: getError } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();

      if (getError) throw getError;

      if (!existingProfile) {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            name: user.name,
            email: user.email,
            role: user.role,
            xp: 0,
            level: 1,
            streak: 0,
            longest_streak: 0,
            badges: [],
            completed_courses: [],
            completed_questions: [],
            watched_videos: [],
            bookmarked_videos: [],
            topic_progress: {},
            is_active: true
          });

        if (insertError) throw insertError;
        console.log(`Created profile in public.users for ${user.email} with role ${user.role}.`);
      } else {
        // Update existing profile role to ensure it is correct
        const { error: updateError } = await supabase
          .from('users')
          .update({
            role: user.role,
            name: user.name
          })
          .eq('id', authUser.id);

        if (updateError) throw updateError;
        console.log(`Updated profile role in public.users for ${user.email} to ${user.role}.`);
      }
    } catch (err) {
      console.error(`Error syncing public profile for ${user.email}:`, err.message);
    }
  }

  console.log('Seeding complete!');
}

seed();
