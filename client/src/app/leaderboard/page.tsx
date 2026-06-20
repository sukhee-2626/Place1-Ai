'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const mockLeaderboard = [
  { rank: 1, name: 'Arjun Sharma', college: 'IIT Madras', branch: 'CSE', xp: 8420, level: 12, streak: 45, badges: 14, accuracy: 94 },
  { rank: 2, name: 'Priya Nair', college: 'NIT Trichy', branch: 'IT', xp: 7850, level: 11, streak: 38, badges: 12, accuracy: 91 },
  { rank: 3, name: 'Rohit Verma', college: 'VIT Vellore', branch: 'CSE', xp: 7200, level: 10, streak: 30, badges: 11, accuracy: 88 },
  { rank: 4, name: 'Kavitha M.', college: 'Anna University', branch: 'CSE', xp: 6540, level: 9, streak: 22, badges: 10, accuracy: 86 },
  { rank: 5, name: 'Suresh D.', college: 'SRM University', branch: 'ECE', xp: 5980, level: 9, streak: 18, badges: 9, accuracy: 82 },
  { rank: 6, name: 'Deepa R.', college: 'PSG College', branch: 'CSE', xp: 5400, level: 8, streak: 15, badges: 8, accuracy: 80 },
  { rank: 7, name: 'Arun Kumar', college: 'Amrita Univ.', branch: 'IT', xp: 4920, level: 8, streak: 12, badges: 7, accuracy: 79 },
  { rank: 8, name: 'Meera S.', college: 'Sastra Univ.', branch: 'CSE', xp: 4500, level: 7, streak: 10, badges: 7, accuracy: 77 },
  { rank: 9, name: 'Vijay N.', college: 'SRM University', branch: 'MECH', xp: 4100, level: 7, streak: 8, badges: 6, accuracy: 75 },
  { rank: 10, name: 'Ananya K.', college: 'Madras Univ.', branch: 'CSE', xp: 3800, level: 6, streak: 7, badges: 6, accuracy: 73 },
];

const allBadges = [
  { id: 'firstLogin', name: 'First Steps', icon: '🚀', description: 'Joined Place1 AI', rarity: 'common' },
  { id: 'streak3', name: 'Hat Trick', icon: '🔥', description: '3-day login streak', rarity: 'common' },
  { id: 'streak7', name: 'Week Warrior', icon: '⚡', description: '7-day streak', rarity: 'rare' },
  { id: 'streak30', name: 'Streak Master', icon: '🏆', description: '30-day streak', rarity: 'legendary' },
  { id: 'quiz10', name: 'Quiz Starter', icon: '📝', description: 'Attempted 10 questions', rarity: 'common' },
  { id: 'quiz100', name: 'Quiz King', icon: '👑', description: '100+ questions attempted', rarity: 'rare' },
  { id: 'quiz500', name: 'Quiz Legend', icon: '🎖️', description: '500+ questions attempted', rarity: 'legendary' },
  { id: 'test1', name: 'Test Taker', icon: '📋', description: 'First mock test complete', rarity: 'common' },
  { id: 'test5', name: 'Mock Master', icon: '🎯', description: '5 mock tests completed', rarity: 'rare' },
  { id: 'dsa10', name: 'DSA Warrior', icon: '💻', description: '10 coding problems solved', rarity: 'rare' },
  { id: 'level5', name: 'Rising Star', icon: '⭐', description: 'Reached Level 5', rarity: 'common' },
  { id: 'level10', name: 'Elite Coder', icon: '💎', description: 'Reached Level 10', rarity: 'legendary' },
  { id: 'perfect', name: 'Perfectionist', icon: '💯', description: 'Scored 100% in a test', rarity: 'legendary' },
  { id: 'speed', name: 'Speed Demon', icon: '⚡', description: 'Completed test in half the time', rarity: 'rare' },
];

const rarityColors: Record<string, string> = {
  common: '#94a3b8',
  rare: '#06b6d4',
  legendary: '#f59e0b',
};

function PodiumCard({ user, pos }: { user: typeof mockLeaderboard[0]; pos: number }) {
  const heights = { 1: 120, 2: 90, 3: 75 };
  const colors = { 1: '#f59e0b', 2: '#94a3b8', 3: '#b45309' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${colors[pos as 1|2|3]}, ${colors[pos as 1|2|3]}88)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 6px', boxShadow: `0 0 20px ${colors[pos as 1|2|3]}44` }}>
          {pos === 1 ? '👑' : pos === 2 ? '🥈' : '🥉'}
        </div>
        <div style={{ fontSize: 14, fontWeight: 800 }}>{user.name.split(' ')[0]}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.college}</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: colors[pos as 1|2|3], marginTop: 4 }}>{user.xp.toLocaleString()} XP</div>
      </div>
      <div style={{ width: 100, height: heights[pos as 1|2|3], background: `linear-gradient(180deg, ${colors[pos as 1|2|3]}44, ${colors[pos as 1|2|3]}22)`, border: `1px solid ${colors[pos as 1|2|3]}44`, borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8, fontSize: 22, fontWeight: 900, color: colors[pos as 1|2|3] }}>
        {pos}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'xp' | 'streak' | 'accuracy' | 'badges'>('xp');
  const [showBadges, setShowBadges] = useState(false);

  const sorted = [...mockLeaderboard].sort((a, b) => {
    if (activeTab === 'xp') return b.xp - a.xp;
    if (activeTab === 'streak') return b.streak - a.streak;
    if (activeTab === 'accuracy') return b.accuracy - a.accuracy;
    return b.badges - a.badges;
  }).map((u, i) => ({ ...u, rank: i + 1 }));

  const top3 = [sorted[1], sorted[0], sorted[2]]; // silver, gold, bronze display order

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>🏆 Leaderboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Compete, earn XP, and climb the ranks</p>
        </div>
        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setShowBadges(!showBadges)}>
          {showBadges ? '🏆 Show Rankings' : '🏅 All Badges'}
        </button>
      </div>

      {showBadges ? (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🏅 Achievement Badges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {allBadges.map(badge => (
              <div key={badge.id} className="glass hover-lift" style={{ padding: '20px', borderRadius: 14, textAlign: 'center', border: `1px solid ${rarityColors[badge.rarity]}33`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 10, color: rarityColors[badge.rarity], fontWeight: 700, textTransform: 'uppercase' }}>{badge.rarity}</div>
                <div style={{ fontSize: 40, marginBottom: 8 }}>{badge.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{badge.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{badge.description}</div>
                <div style={{ marginTop: 8, height: 2, background: rarityColors[badge.rarity], borderRadius: 1, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Podium */}
          <div className="glass" style={{ padding: '32px', borderRadius: 16, marginBottom: 24, background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))' }}>
            <h3 style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>🏅 TOP 3 THIS WEEK</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 0 }}>
              {top3.map((u, i) => u && <PodiumCard key={u.name} user={u} pos={i === 0 ? 2 : i === 1 ? 1 : 3} />)}
            </div>
          </div>

          {/* Sort tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['xp', '⚡ By XP'], ['streak', '🔥 By Streak'], ['accuracy', '🎯 By Accuracy'], ['badges', '🏅 By Badges']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id as any)} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: activeTab === id ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent', borderColor: activeTab === id ? 'transparent' : 'var(--border)', color: activeTab === id ? 'white' : 'var(--text-muted)' }}>{label}</button>
            ))}
          </div>

          {/* Rankings table */}
          <div className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 140px 100px 80px 90px 80px', gap: 0, padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              {['Rank', 'Student', 'College', 'XP', 'Level', 'Streak', 'Accuracy'].map(h => <div key={h}>{h}</div>)}
            </div>
            {sorted.map((student, i) => {
              const isMe = student.name.includes(user?.name?.split(' ')[0] || '__');
              return (
                <div key={student.name} className="table-row" style={{ display: 'grid', gridTemplateColumns: '60px 1fr 140px 100px 80px 90px 80px', gap: 0, padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: isMe ? 'rgba(124,58,237,0.08)' : 'transparent' }}>
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: student.rank <= 3 ? ['#f59e0b','#94a3b8','#b45309'][student.rank-1] : 'var(--text-muted)' }}>
                      {student.rank <= 3 ? ['🥇','🥈','🥉'][student.rank-1] : `#${student.rank}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, hsl(${student.rank * 37}, 70%, 50%), hsl(${student.rank * 37 + 60}, 70%, 40%))`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{student.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{student.name} {isMe && <span style={{ fontSize: 11, color: 'var(--accent-violet-light)' }}>(You)</span>}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{student.branch}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.college}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-violet-light)' }}>⚡ {student.xp.toLocaleString()}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Lv.{student.level}</div>
                  <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>🔥 {student.streak}d</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{student.accuracy}%</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
