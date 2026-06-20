'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'admin') router.push('/admin/dashboard');
      else router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: 60, height: 60, margin: '0 auto 16px',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28
        }}>🎯</div>
        <h1 className="gradient-text" style={{ fontSize: 24, fontWeight: 700 }}>Place1 AI</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 14 }}>Loading your dashboard...</p>
        <div style={{ marginTop: 20 }}>
          <div style={{ width: 200, height: 3, background: 'var(--border)', borderRadius: 2, margin: '0 auto', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', animation: 'slideRight 1.5s ease-in-out infinite', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
