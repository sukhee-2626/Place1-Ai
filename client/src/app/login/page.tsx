'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Key, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { role } = await login(form.email, form.password);
      if (role === 'admin') router.push('/admin/dashboard');
      else router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative subtle background gradient grid */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(109, 40, 217, 0.03) 0%, transparent 80%)', 
        zIndex: 0 
      }} />

      {/* Left panel - Branding (only shown on desktop) */}
      <div style={{ 
        flex: 1.2, 
        display: 'flex', 
        background: 'rgba(12, 12, 14, 0.6)', 
        padding: '60px', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        borderRight: '1px solid var(--border)', 
        position: 'relative',
        zIndex: 1
      }} className="left-panel">
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ 
              width: 32, height: 32, 
              background: 'linear-gradient(135deg, var(--accent-violet-light) 0%, var(--accent-cyan-light) 100%)', 
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#000', fontWeight: 900, fontSize: 14 
            }}>
              P1
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Place1 AI</span>
          </div>
          
          <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Accredited engineering placement <span className="gradient-text-violet">readiness telemetry</span>
          </h2>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 40 }}>
            Accelerate your technical preparation. Standardized code sandboxes, aptitude tracking structures, and interactive query builders integrated with MongoDB analytics.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'DSA PROBLEMS', value: '413 Handpicked' },
              { label: 'SQL CHEATSHEET', value: '136 Core Queries' },
              { label: 'APTITUDE MCQS', value: '252 Dynamic' },
              { label: 'PORTAL SECURITY', value: 'JWT Accredited' },
            ].map((stat, idx) => (
              <div key={idx} style={{ padding: '14px', borderRadius: 6, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em' }}>{stat.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Auth Forms */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          
          {/* Logo / Title */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Welcome back</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 13 }}>Access your place1.ai workspace</p>
          </div>

          {/* Credentials Info panel */}
          <div style={{ 
            background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', 
            borderRadius: 6, padding: '12px 14px', marginBottom: 20, fontSize: 12 
          }}>
            <div style={{ color: 'var(--accent-violet-light)', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Key size={12} /> Sandbox Credentials
            </div>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 3, fontFamily: 'JetBrains Mono, monospace' }}>
              <div>Student: student@demo.com / password123</div>
              <div>Admin: admin@demo.com / admin123</div>
            </div>
          </div>

          {error && (
            <div style={{ 
              background: 'rgba(220,38,38,0.03)', border: '1px solid rgba(220,38,38,0.15)', 
              borderRadius: 6, padding: '10px 14px', marginBottom: 16, color: 'var(--accent-danger-light)', 
              fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 6 
            }}>
              <ShieldCheck size={14} /> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="you@college.edu"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: 'var(--accent-violet-light)', textDecoration: 'none' }}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: 40 }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)} 
                  style={{ 
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', 
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center'
                  }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              id="login-submit" 
              type="submit" 
              className="btn-primary" 
              disabled={loading} 
              style={{ width: '100%', padding: '10px', fontSize: 13.5, marginTop: 4, height: 38 }}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={14} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: 13.5 }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent-violet-light)', textDecoration: 'none', fontWeight: 600 }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .left-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
