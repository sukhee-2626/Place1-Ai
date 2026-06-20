'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const stats = [
  { label: 'Total Students', value: '1,284', change: '+48 this week', icon: '👥', color: '#7c3aed' },
  { label: 'Active Today', value: '342', change: '26% of total', icon: '🟢', color: '#10b981' },
  { label: 'Tests Taken', value: '8,920', change: '+312 today', icon: '📝', color: '#06b6d4' },
  { label: 'Questions', value: '5,240', change: '48 categories', icon: '❓', color: '#f59e0b' },
  { label: 'Courses', value: '64', change: '15 new this month', icon: '🎓', color: '#ec4899' },
  { label: 'Avg. Score', value: '68.4%', change: '+2.1% vs last week', icon: '📈', color: '#8b5cf6' },
];

const recentActivity = [
  { user: 'Priya N.', action: 'Completed TCS Mock Test', score: '84%', time: '2 min ago', icon: '📝' },
  { user: 'Arjun S.', action: 'Solved 5 DSA problems', score: '+50 XP', time: '8 min ago', icon: '💻' },
  { user: 'Kavitha M.', action: 'Enrolled in Trees Course', score: null, time: '15 min ago', icon: '🎓' },
  { user: 'Rohit V.', action: 'Reached Level 8', score: '🏆 Badge', time: '22 min ago', icon: '⭐' },
  { user: 'Deepa R.', action: 'Completed Aptitude Quiz', score: '72%', time: '31 min ago', icon: '🔢' },
];

const weakTopics = [
  { topic: 'Dynamic Programming', failRate: 62, count: 1240 },
  { topic: 'Graph Algorithms', failRate: 58, count: 980 },
  { topic: 'Data Interpretation', failRate: 54, count: 1560 },
  { topic: 'Time & Speed', failRate: 48, count: 2100 },
  { topic: 'Reading Comprehension', failRate: 44, count: 1800 },
];

const topStudents = [
  { name: 'Arjun Sharma', xp: 8420, accuracy: 94, tests: 22 },
  { name: 'Priya Nair', xp: 7850, accuracy: 91, tests: 19 },
  { name: 'Rohit Verma', xp: 7200, accuracy: 88, tests: 17 },
];

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 3 }} />
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 2 }}>Platform overview and student analytics</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['week', 'month'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: period === p ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent', borderColor: period === p ? 'transparent' : 'var(--border)', color: period === p ? 'white' : 'var(--text-muted)' }}>This {p.charAt(0).toUpperCase() + p.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map(stat => (
          <div key={stat.label} className="glass hover-lift" style={{ padding: '20px', borderRadius: 14, borderLeft: `3px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{stat.label}</p>
                <p style={{ fontSize: 26, fontWeight: 900, color: stat.color }}>{stat.value}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{stat.change}</p>
              </div>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Weak Topics */}
        <div className="glass" style={{ padding: '24px', borderRadius: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            ⚠️ High Failure Rate Topics
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>Needs attention</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {weakTopics.map(item => (
              <div key={item.topic}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{item.topic}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.failRate > 55 ? '#ef4444' : '#f59e0b' }}>{item.failRate}% fail</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <MiniBar value={item.failRate} max={100} color={item.failRate > 55 ? '#ef4444' : '#f59e0b'} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{item.count} attempts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Students */}
        <div className="glass" style={{ padding: '24px', borderRadius: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            ⭐ Top Performers
            <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={() => router.push('/admin/students')}>View All</button>
          </h3>
          {topStudents.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topStudents.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 32, height: 32, background: ['linear-gradient(135deg,#f59e0b,#d97706)', 'linear-gradient(135deg,#94a3b8,#64748b)', 'linear-gradient(135deg,#b45309,#92400e)'][i], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {['🥇','🥈','🥉'][i]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.tests} tests • {s.accuracy}% accuracy</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-violet-light)' }}>⚡{s.xp.toLocaleString()}</div>
            </div>
          ))}
          {/* Category completion chart (simplified) */}
          <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-secondary)' }}>Course Completion</div>
            {[['DSA', 68], ['Aptitude', 82], ['Communication', 55], ['Company Prep', 44]].map(([name, val]) => (
              <div key={String(name)} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, width: 100, color: 'var(--text-muted)' }}>{name}</span>
                <MiniBar value={Number(val)} max={100} color="#7c3aed" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-violet-light)', width: 32 }}>{val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass" style={{ padding: '24px', borderRadius: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🕒 Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {recentActivity.map((act, i) => (
            <div key={i} className="table-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 8px', borderRadius: 8, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 36, height: 36, background: 'var(--bg-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{act.icon}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{act.user}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}> {act.action}</span>
              </div>
              {act.score && <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{act.score}</span>}
              <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
