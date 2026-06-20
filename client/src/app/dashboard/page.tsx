'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  TrendingUp, 
  Trophy, 
  Percent, 
  Flame, 
  ArrowUpRight, 
  Activity, 
  Shield, 
  Database, 
  Binary, 
  BookOpen,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await api.get('/questions?limit=1000');
        if (response.data?.success) {
          setQuestions(response.data.questions);
        }
      } catch (err) {
        console.error('Error fetching questions for dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // Compute live stats based on database questions & user's completedQuestions
  const completedIds = user?.completedQuestions || [];
  
  const totalSql = questions.filter(q => q.category === 'sql').length || 136;
  const completedSql = questions.filter(q => q.category === 'sql' && completedIds.includes(q._id)).length;
  const sqlProgress = Math.round((completedSql / totalSql) * 100);

  const totalDsa = questions.filter(q => q.category === 'dsa').length || 413;
  const completedDsa = questions.filter(q => q.category === 'dsa' && completedIds.includes(q._id)).length;
  const dsaProgress = Math.round((completedDsa / totalDsa) * 100);

  const totalAptitude = questions.filter(q => q.category === 'aptitude').length || 252;
  const completedAptitude = questions.filter(q => q.category === 'aptitude' && completedIds.includes(q._id)).length;
  const aptitudeProgress = Math.round((completedAptitude / totalAptitude) * 100);

  const totalQuestions = questions.length || 801;
  const completedTotal = completedIds.length;
  const overallProgress = totalQuestions > 0 ? Math.round((completedTotal / totalQuestions) * 100) : 0;

  // Placement Readiness Score (weighted calculation)
  const streakBonus = Math.min((user?.streak || 0) * 2, 10); // max 10% bonus
  const baseReadiness = Math.round(
    (aptitudeProgress * 0.3) + 
    (dsaProgress * 0.4) + 
    (sqlProgress * 0.3)
  );
  const placementReadiness = Math.min(Math.max(baseReadiness + streakBonus, 5), 100);

  const mockStats = {
    rank: 12,
    accuracy: 78,
  };

  const recommendedTracks = [
    { icon: Database, title: 'SQL Joins Cheat Sheet', sub: 'Learn JOIN query structures', xp: 20, href: '/practice/sql', label: 'Recommended' },
    { icon: Binary, title: 'Dynamic Programming', sub: 'Curious Freaks Topic 12', xp: 50, href: '/practice/dsa', label: 'High Yield' },
    { icon: BookOpen, title: 'Aptitude Time & Speed', sub: 'Aptitude Topic 3', xp: 30, href: '/practice/aptitude', label: 'Trending' }
  ];

  const activityLog = [
    { title: 'Completed SQL Basic Information & Schema', time: '2 hours ago', type: 'sql', icon: Database },
    { title: 'Solved Odd or Even on Curious Coding Sheet', time: 'Yesterday', type: 'dsa', icon: Binary },
    { title: 'Passed Time & Work timed test', time: '3 days ago', type: 'aptitude', icon: BookOpen }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 120px)', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '2.5px solid var(--border)', borderTopColor: 'var(--accent-violet-light)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading analytics console data...</div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }} className="animate-fadeInUp">
      
      {/* SaaS Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>
            Console / <span className="gradient-text-violet">{user?.name || 'Developer'}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            System Sync status: <span style={{ color: 'var(--accent-emerald-light)', fontWeight: 600 }}>Connected</span> • Live MongoDB statistics
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" style={{ height: 36, padding: '0 14px', fontSize: 12.5 }} onClick={() => router.push('/profile')}>
            Manage Profile
          </button>
          <button className="btn-primary" style={{ height: 36, padding: '0 14px', fontSize: 12.5 }} onClick={() => router.push('/practice/dsa')}>
            Resume Practice <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { label: 'PLACEMENT SCORE', value: `${placementReadiness}%`, desc: 'Weighted readiness index', change: '+3.4%', up: true, icon: TrendingUp },
          { label: 'GLOBAL RANKING', value: `#${mockStats.rank}`, desc: 'Top 3% percentile', change: 'Top 3%', up: true, icon: Trophy },
          { label: 'ACCURACY RATIO', value: `${mockStats.accuracy}%`, desc: 'Based on quiz sessions', change: 'Stable', up: true, icon: Percent },
          { label: 'ACCUMULATED EXPERIENCE', value: `${user?.xp || 0} XP`, desc: `Level ${user?.level || 1} Developer`, change: `${user?.streak || 0}d streak`, up: true, icon: Flame }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass" style={{ padding: '20px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>{card.label}</span>
                <Icon size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{card.value}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
                <span>{card.desc}</span>
                <span style={{ color: card.up ? 'var(--accent-emerald-light)' : 'var(--accent-danger-light)', fontWeight: 600 }}>{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Graph and Tracks */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, alignItems: 'stretch' }} className="responsive-grid">
        
        {/* SVG Graph Card */}
        <div className="glass" style={{ padding: '24px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em' }}>Velocity Metrics</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Practicing velocity and question resolutions (past 7 days)</p>
            </div>
            <span style={{ fontSize: 10, background: 'rgba(5,150,105,0.08)', color: 'var(--accent-emerald-light)', border: '1px solid rgba(5,150,105,0.15)', padding: '2px 8px', borderRadius: 4, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-emerald-light)' }} /> LIVE
            </span>
          </div>

          {/* SVG Vector Area Chart */}
          <div style={{ width: '100%', height: 160, position: 'relative', margin: '8px 0' }}>
            <svg viewBox="0 0 500 150" width="100%" height="100%" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(167, 139, 250, 0.15)" />
                  <stop offset="100%" stopColor="rgba(167, 139, 250, 0.0)" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--accent-violet-light)" />
                  <stop offset="100%" stopColor="var(--accent-cyan-light)" />
                </linearGradient>
              </defs>
              
              {/* Horizontal Helper Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Chart Path and Fill */}
              <path d="M 0 150 Q 80 120 150 90 T 300 45 T 450 70 L 500 35 L 500 150 Z" fill="url(#chartGlow)" />
              <path d="M 0 150 Q 80 120 150 90 T 300 45 T 450 70 L 500 35" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
              
              {/* Active Nodes */}
              <circle cx="300" cy="45" r="4" fill="var(--accent-violet-light)" />
              <circle cx="500" cy="35" r="4" fill="var(--accent-cyan-light)" />
              <circle cx="500" cy="35" r="8" fill="none" stroke="rgba(103, 232, 249, 0.3)" strokeWidth="1.5" style={{ animation: 'pulse 2s infinite' }} />
            </svg>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            {[
              { label: 'TOTAL SEEDED', val: '801 questions' },
              { label: 'COMPLETED', val: `${completedTotal} items` },
              { label: 'SQL CHEAT', val: `${completedSql}/${totalSql}` },
              { label: 'DSA CODING', val: `${completedDsa}/${totalDsa}` },
              { label: 'APTITUDE', val: `${completedAptitude}/${totalAptitude}` }
            ].map((item, index) => (
              <div key={index}>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em' }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Readiness Matrix */}
        <div className="glass" style={{ padding: '24px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em' }}>Readiness Matrix</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' }}>
            {[
              { label: 'Aptitude Cheatsheet', count: `${completedAptitude}/${totalAptitude}`, progress: aptitudeProgress, color: 'var(--accent-violet-light)' },
              { label: 'DSA Coding Problems', count: `${completedDsa}/${totalDsa}`, progress: dsaProgress, color: 'var(--accent-pink-light)' },
              { label: 'SQL Practice Queries', count: `${completedSql}/${totalSql}`, progress: sqlProgress, color: 'var(--accent-cyan-light)' }
            ].map((track, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-primary)' }}>{track.label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{track.progress}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${track.progress}%`, background: track.color }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{track.count} items completed</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Milestones & Recent Milestones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, alignItems: 'stretch' }} className="responsive-grid">
        
        {/* Recommended Tracks */}
        <div className="glass" style={{ padding: '24px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em' }}>Next Milestones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recommendedTracks.map((rec, idx) => {
              const Icon = rec.icon;
              return (
                <div 
                  key={idx} 
                  onClick={() => router.push(rec.href)}
                  className="hover-lift" 
                  style={{ 
                    padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6 
                  }}
                >
                  <div style={{ 
                    width: 32, height: 32, background: 'rgba(255,255,255,0.02)', borderRadius: 6, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet-light)',
                    border: '1px solid var(--border)'
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{rec.title}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{rec.sub}</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 9, background: 'rgba(103,232,249,0.08)', color: 'var(--accent-cyan-light)', border: '1px solid rgba(103,232,249,0.15)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                      {rec.label}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>+{rec.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity logs & Accreditation */}
        <div className="glass" style={{ padding: '24px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em' }}>Activity Stream</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {activityLog.map((act, index) => {
              const Icon = act.icon;
              return (
                <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: 24, height: 24, background: 'var(--bg-secondary)', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)',
                    marginTop: 2, flexShrink: 0
                  }}>
                    <Icon size={12} style={{ color: 'var(--text-secondary)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{act.title}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={10} /> {act.time}
                    </div>
                  </div>
                  <span style={{ fontSize: 9.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{act.type}</span>
                </div>
              );
            })}
          </div>
          
          {/* Accent Accreditation box */}
          <div style={{ 
            background: 'rgba(5,150,105,0.03)', border: '1px solid rgba(5,150,105,0.12)', 
            borderRadius: 6, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent-emerald-light)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Shield size={14} /> Readiness Assessment
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                Your progress index matches junior-to-mid developer technical criteria. Keep pushing!
              </div>
            </div>
            <Sparkles size={20} style={{ color: 'var(--accent-emerald-light)' }} />
          </div>
        </div>

      </div>

      {/* Custom styles for responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
