'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  BookOpen, 
  Binary, 
  Database, 
  MessageSquareCode, 
  FileCheck, 
  GraduationCap, 
  Building2, 
  FileText, 
  Trophy, 
  User, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  Flame,
  Zap,
  Search,
  Bell,
  SidebarOpen,
  SidebarClose,
  Briefcase,
  Sparkles,
  Layers,
  Bot,
  Video,
  Send
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Briefcase, label: 'AI Job Discovery', href: '/copilot/jobs' },
  { icon: Sparkles, label: 'AI Resume Optimizer', href: '/copilot/resume' },
  { icon: Layers, label: 'Smart Tracker', href: '/copilot/tracker' },
  { icon: Bot, label: 'AI Career Assistant', href: '/copilot/assistant' },
  { icon: Video, label: 'AI Interview Prep', href: '/copilot/interview' },
  { icon: Send, label: 'AI Outreach Gen', href: '/copilot/generator' },
  { 
    icon: BookOpen, 
    label: 'Practice Tracks', 
    href: '/practice/aptitude', 
    children: [
      { icon: Zap, label: 'Aptitude', href: '/practice/aptitude' },
      { icon: Binary, label: 'DSA & Coding', href: '/practice/dsa' },
      { icon: Database, label: 'SQL Cheatsheet', href: '/practice/sql' },
      { icon: MessageSquareCode, label: 'Communication', href: '/practice/communication' },
    ]
  },
  { icon: FileCheck, label: 'Mock Tests', href: '/tests' },
  { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
  { icon: User, label: 'Profile', href: '/profile' },
];

function XPBar({ xp, level }: { xp: number; level: number }) {
  const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  const currentLevelXP = levelThresholds[Math.min(level - 1, levelThresholds.length - 1)] || 0;
  const nextLevelXP = levelThresholds[Math.min(level, levelThresholds.length - 1)] || currentLevelXP + 500;
  const progress = Math.min(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100, 100);

  return (
    <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, margin: '12px 0', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Zap size={13} style={{ color: 'var(--accent-violet-light)' }} /> Level {level}
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{xp} XP</span>
      </div>
      <div className="xp-bar" style={{ height: 4 }}>
        <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{Math.round(progress)}% to Level {level + 1}</div>
    </div>
  );
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroup, setOpenGroup] = useState<string | null>('Practice');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = () => { logout(); router.push('/login'); };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '2.5px solid var(--border)', borderTopColor: 'var(--accent-violet-light)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, letterSpacing: '-0.01em' }}>Authenticating user session...</div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 250 : 68,
        background: 'rgba(9, 9, 11, 0.65)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100
      }}>
        {/* Logo / Header */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{ 
              width: 28, height: 28, 
              background: 'linear-gradient(135deg, var(--accent-violet-light) 0%, var(--accent-cyan-light) 100%)', 
              borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#000', fontWeight: 900, fontSize: 13, flexShrink: 0 
            }}>
              NP
            </div>
            {sidebarOpen && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '-0.03em' }}>NeoPAT AI</span>
                <span style={{ display: 'flex', height: 6, width: 6, position: 'relative' }}>
                  <span style={{ animation: 'logo-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'var(--accent-cyan-light)', opacity: 0.75 }}></span>
                  <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: 6, width: 6, backgroundColor: 'var(--accent-cyan)' }}></span>
                </span>
                <style>{`
                  @keyframes logo-ping {
                    75%, 100% { transform: scale(2.5); opacity: 0; }
                  }
                `}</style>
              </div>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {sidebarOpen ? <SidebarClose size={16} /> : <SidebarOpen size={16} />}
          </button>
        </div>

        {/* User Card */}
        {sidebarOpen && (
          <div style={{ padding: '14px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ 
                width: 32, height: 32, 
                background: 'linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-pink) 100%)', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: 13, fontWeight: 600, flexShrink: 0, color: 'white' 
              }}>
                {user.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-amber-light)' }}>
                  <Flame size={12} fill="currentColor" />
                  <span style={{ fontSize: 10.5, fontWeight: 700 }}>{user.streak} day streak</span>
                </div>
              </div>
            </div>
            <XPBar xp={user.xp || 0} level={user.level || 1} />
          </div>
        )}

        {/* Navigation Items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.children && item.children.some(c => pathname === c.href));
            const isGroupOpen = openGroup === item.label;
            
            return (
              <div key={item.href}>
                {item.children ? (
                  <button
                    onClick={() => setOpenGroup(isGroupOpen ? null : item.label)}
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'block' }}
                  >
                    <div className={`sidebar-link ${isActive ? 'active' : ''}`} style={{ justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Icon size={16} strokeWidth={2} />
                        {sidebarOpen && <span>{item.label}</span>}
                      </div>
                      {sidebarOpen && (
                        <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                          {isGroupOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                      )}
                    </div>
                  </button>
                ) : (
                  <Link href={item.href} className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}>
                    <Icon size={16} strokeWidth={2} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                )}
                
                {/* Nested Child Items */}
                {item.children && isGroupOpen && sidebarOpen && (
                  <div style={{ paddingLeft: 12, borderLeft: '1px solid var(--border)', marginLeft: 16, marginTop: 4, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {item.children.map(child => {
                      const ChildIcon = child.icon;
                      return (
                        <Link 
                          key={child.href} 
                          href={child.href} 
                          className={`sidebar-link ${pathname === child.href ? 'active' : ''}`} 
                          style={{ fontSize: 12.5, padding: '6px 10px' }}
                        >
                          <ChildIcon size={14} strokeWidth={2} />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions - Logout */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={handleLogout} 
            className="sidebar-link" 
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-danger-light)', fontSize: 13 }}
          >
            <LogOut size={16} strokeWidth={2} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? 250 : 68, 
        transition: 'margin-left 0.25s cubic-bezier(0.16, 1, 0.3, 1)', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Navigation */}
        <header style={{ 
          background: 'rgba(5, 5, 7, 0.4)', 
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.02)', 
          padding: '14px 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          position: 'sticky', 
          top: 0, 
          zIndex: 50 
        }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-violet-light) 0%, var(--accent-cyan-light) 100%)' }} />
              {navItems.find(n => n.href === pathname)?.label || 
               navItems.flatMap(n => n.children || []).find(c => c.href === pathname)?.label || 
               'Console'}
            </h2>
          </div>
          
          {/* Header Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Streak */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 6, 
              background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', 
              borderRadius: '9999px', padding: '5px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <Flame size={13} style={{ color: 'var(--accent-amber-light)' }} fill="var(--accent-amber)" />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent-amber-light)', letterSpacing: '0.02em' }}>{user.streak}d</span>
            </div>
            {/* XP */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 6, 
              background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', 
              borderRadius: '9999px', padding: '5px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <Zap size={13} style={{ color: 'var(--accent-violet-light)' }} fill="var(--accent-violet)" />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent-violet-light)', letterSpacing: '0.02em' }}>{user.xp} XP</span>
            </div>
            {/* Profile Avatar icon */}
            <div 
              style={{ 
                width: 28, height: 28, 
                background: 'linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-pink) 100%)', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'white',
                boxShadow: '0 0 12px rgba(124, 58, 237, 0.3)',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => router.push('/profile')}
            >
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        {/* Page Content Panel */}
        <div style={{ padding: '24px', flex: 1, position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
