'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

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
    const storedToken = localStorage.getItem('place1_token');
    const storedUser = localStorage.getItem('place1_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
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

  const logout = () => {
    localStorage.removeItem('place1_token');
    localStorage.removeItem('place1_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('place1_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
