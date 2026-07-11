'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  badges: Badge[];
  college?: string;
  branch?: string;
  completedQuestions?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ role: string }>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  signInWithGoogle: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  college?: string;
  branch?: string;
  year?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial local load for instant UI response (standard email/pass logins)
    const storedToken = localStorage.getItem('place1_token');
    const storedUser = localStorage.getItem('place1_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // 2. Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setToken(session.access_token);
        localStorage.setItem('place1_token', session.access_token);

        try {
          // Sync profile in public.users
          let { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!profile && session.user.email) {
            // Check by email (migrated user first login)
            const { data: emailProfile } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();

            if (emailProfile) {
              const { data: updatedProfile } = await supabase
                .from('users')
                .update({ id: session.user.id })
                .eq('email', session.user.email)
                .select()
                .single();
              profile = updatedProfile;
            }
          }

          if (!profile) {
            // Create profile
            const { data: newProfile } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: 'student',
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
              })
              .select()
              .single();
            profile = newProfile;
          }

          if (profile) {
            const mappedUser: User = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              xp: profile.xp,
              level: profile.level,
              streak: profile.streak,
              longestStreak: profile.longest_streak,
              badges: profile.badges || [],
              college: profile.college,
              branch: profile.branch,
              completedQuestions: profile.completed_questions || []
            };
            setUser(mappedUser);
            localStorage.setItem('place1_user', JSON.stringify(mappedUser));
          }
        } catch (err) {
          console.error('Error syncing profile:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear tokens on explicit sign-out
        setToken(null);
        setUser(null);
        localStorage.removeItem('place1_token');
        localStorage.removeItem('place1_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('place1_token', newToken);
    localStorage.setItem('place1_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return { role: newUser.role };
  };

  const register = async (data: RegisterData) => {
    const res = await api.post('/auth/register', data);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('place1_token', newToken);
    localStorage.setItem('place1_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('place1_token');
    localStorage.removeItem('place1_user');
    setToken(null);
    setUser(null);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('place1_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, signInWithGoogle, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

