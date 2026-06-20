'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ArrowRight, UserPlus, ShieldAlert } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', college: '', branch: '', year: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await register({ name: form.name, email: form.email, password: form.password, college: form.college, branch: form.branch, year: form.year });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative background grid blur */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(109, 40, 217, 0.02) 0%, transparent 80%)', 
        zIndex: 0 
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }} className="animate-fadeInUp">
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 }}>
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
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>Create account</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 13 }}>Register your engineering workstation credentials</p>
        </div>

        {/* Step Indicator dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ 
                width: 24, height: 24, borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: 11, fontWeight: 700, 
                background: step >= s ? 'var(--text-primary)' : 'var(--border)', 
                color: step >= s ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }}>
                {s}
              </div>
              {s < 2 && <div style={{ width: 40, height: 1, background: step > 1 ? 'var(--text-primary)' : 'var(--border)' }} />}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="glass" style={{ padding: '24px', borderRadius: 8 }}>
          {error && (
            <div style={{ 
              background: 'rgba(220,38,38,0.03)', border: '1px solid rgba(220,38,38,0.15)', 
              borderRadius: 6, padding: '10px 14px', marginBottom: 16, color: 'var(--accent-danger-light)', 
              fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 6 
            }}>
              <ShieldAlert size={14} /> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name *</label>
                  <input id="reg-name" type="text" className="input-field" placeholder="Arjun Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address *</label>
                  <input id="reg-email" type="email" className="input-field" placeholder="you@college.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Password *</label>
                  <input id="reg-password" type="password" className="input-field" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Confirm Password *</label>
                  <input id="reg-confirm-password" type="password" className="input-field" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required />
                </div>
                <button 
                  id="reg-next" 
                  type="button" 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '10px', fontSize: 13.5, marginTop: 4, height: 38 }} 
                  onClick={() => {
                    if (!form.name || !form.email || !form.password || !form.confirmPassword) { setError('Please fill all required fields'); return; }
                    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
                    setError(''); setStep(2);
                  }}
                >
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            )}
            
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>College / University</label>
                  <input id="reg-college" type="text" className="input-field" placeholder="Anna University" value={form.college} onChange={e => setForm({...form, college: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Branch / Department</label>
                  <input id="reg-branch" type="text" className="input-field" placeholder="Computer Science Engineering" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Year of Study</label>
                  <select id="reg-year" className="input-field" value={form.year} onChange={e => setForm({...form, year: e.target.value})} style={{ cursor: 'pointer' }}>
                    <option value="">Select academic year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year (Final)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '10px', height: 38 }} 
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button 
                    id="reg-submit" 
                    type="submit" 
                    className="btn-primary" 
                    style={{ flex: 1.8, padding: '10px', fontSize: 13.5, height: 38 }} 
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Register'} <UserPlus size={14} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: 13.5 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent-violet-light)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
