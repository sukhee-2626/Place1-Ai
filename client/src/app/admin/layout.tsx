'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  HelpCircle, 
  GraduationCap, 
  FileText, 
  Users, 
  BarChart3, 
  Eye, 
  LogOut, 
  Lock,
  Settings
} from 'lucide-react';

const adminNav = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: HelpCircle, label: 'Questions', href: '/admin/questions' },
  { icon: GraduationCap, label: 'Courses', href: '/admin/courses' },
  { icon: FileText, label: 'Tests', href: '/admin/tests' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  const handleLogout = () => { logout(); router.push('/login'); };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '4px solid rgba(124,58,237,0.1)', borderTop: '4px solid var(--accent-violet-light)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-secondary)' }}>Verifying admin session...</div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Admin Sidebar */}
      <aside style={{ width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #7c3aed, #ec4899)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Settings size={18} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Place1 AI</div>
              <div style={{ fontSize: 11, color: '#ec4899', fontWeight: 600 }}>ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* Admin info */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ec4899, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Super Admin</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {adminNav.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} style={{ opacity: isActive ? 1 : 0.7 }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Links to student view */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/dashboard" className="sidebar-link" style={{ fontSize: 13 }}>
            <Eye size={16} strokeWidth={2} />
            <span>Preview as Student</span>
          </Link>
          <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13 }}>
            <LogOut size={16} strokeWidth={2} style={{ color: '#ef4444' }} />
            <span style={{ color: '#ef4444' }}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            {(() => {
              const matched = adminNav.find(n => n.href === pathname);
              if (matched) {
                const Icon = matched.icon;
                return <Icon size={18} strokeWidth={2} style={{ color: 'var(--accent-violet-light)' }} />;
              }
              return <Settings size={18} strokeWidth={2} style={{ color: 'var(--accent-violet-light)' }} />;
            })()}
            {adminNav.find(n => n.href === pathname)?.label || 'Admin Panel'}
          </h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#ec4899', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={13} strokeWidth={2.5} />
              <span>Admin Mode</span>
            </div>
          </div>
        </header>
        <div style={{ padding: '28px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
