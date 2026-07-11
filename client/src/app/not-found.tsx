'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Terminal, 
  Search, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  AlertTriangle,
  HelpCircle,
  Video,
  FileCheck
} from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname();
  let authContext = null;
  try {
    authContext = useAuth();
  } catch (e) {
    // Graceful fallback if context is not available
  }
  const user = authContext?.user;
  const isLoggedIn = !!user;

  const [requestId, setRequestId] = useState('bom1::clxr4-1783784417043-0890b34e5a76');
  const [terminalLineIndex, setTerminalLineIndex] = useState(0);
  const [typingCommand, setTypingCommand] = useState('');

  // Simulated request ID matching the user's error trace format
  useEffect(() => {
    const randomHex = Math.random().toString(16).substring(2, 14);
    setRequestId(`bom1::clxr4-${Date.now().toString().substring(5)}-${randomHex}`);
  }, []);

  // Simple typing effect for terminal
  useEffect(() => {
    const fullCommand = `neopat-copilot check-route --path="${pathname || '/unknown'}"`;
    let curIndex = 0;
    const interval = setInterval(() => {
      if (curIndex < fullCommand.length) {
        setTypingCommand(fullCommand.slice(0, curIndex + 1));
        curIndex++;
      } else {
        clearInterval(interval);
        // Delay before showing the response
        setTimeout(() => {
          setTerminalLineIndex(1);
        }, 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [pathname]);

  const quickLinks = [
    {
      title: 'Dashboard',
      desc: 'Access your home metrics, application logs, and daily tasks.',
      href: isLoggedIn ? '/dashboard' : '/login',
      icon: Home,
      accent: 'var(--accent-violet-light)',
    },
    {
      title: 'AI Interview Prep',
      desc: 'Practice with a real-time voice & video mock interviewer.',
      href: '/copilot/interview',
      icon: Video,
      accent: 'var(--accent-cyan-light)',
    },
    {
      title: 'DSA Practice',
      desc: 'Solve coding problems across arrays, trees, dynamic programming, etc.',
      href: '/practice/dsa',
      icon: BookOpen,
      accent: 'var(--accent-emerald-light)',
    },
    {
      title: 'Mock Tests',
      desc: 'Take standardized practice tests to gauge placement readiness.',
      href: '/tests',
      icon: FileCheck,
      accent: 'var(--accent-pink-light)',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      position: 'relative',
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      color: 'var(--text-primary)',
      padding: '0 24px',
      overflowX: 'hidden',
    }}>
      {/* Decorative gradient glowing spheres */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '35vw',
        height: '35vw',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '30vw',
        height: '30vw',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.07) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
        position: 'relative',
        zIndex: 10,
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 28, height: 28, 
            background: 'linear-gradient(135deg, var(--accent-violet-light) 0%, var(--accent-cyan-light) 100%)', 
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', fontWeight: 900, fontSize: 13
          }}>
            NP
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            NeoPAT AI
          </span>
        </Link>

        <div style={{ display: 'flex', gap: 16 }}>
          <Link 
            href="https://docs.neopat.ai" 
            target="_blank"
            className="btn-secondary" 
            style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 13 }}
          >
            Documentation
          </Link>
          <Link 
            href={isLoggedIn ? '/dashboard' : '/login'} 
            className="btn-glow" 
            style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 13 }}
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Sign In'}
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        maxWidth: 1000,
        width: '100%',
        margin: '60px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Error Flag Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 9999,
          color: 'var(--accent-danger-light)',
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 24,
        }}>
          <AlertTriangle size={14} />
          <span>ERROR CODE: 404_NOT_FOUND</span>
        </div>

        {/* 404 Big typography */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: 20 }}>
          <h1 className="gradient-text-violet" style={{
            fontSize: 'min(14vw, 140px)',
            fontWeight: 850,
            lineHeight: 1.0,
            letterSpacing: '-0.05em',
            margin: 0,
            filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.2))',
          }}>
            404
          </h1>
          <p style={{
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginTop: 8,
            letterSpacing: '-0.01em',
          }}>
            This route is off the roadmap.
          </p>
          <p style={{
            fontSize: 14.5,
            color: 'var(--text-secondary)',
            marginTop: 8,
            maxWidth: 500,
            lineHeight: 1.6,
          }}>
            The resource you are looking for has been relocated or optimized. Let's get you back on track to your dream career.
          </p>
        </div>

        {/* Interactive Shell / Trace Log */}
        <div className="glass" style={{
          width: '100%',
          maxWidth: 680,
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 48,
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          {/* Top terminal bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
              <Terminal size={12} />
              <span>neopat_system_shell.sh</span>
            </div>
            <div style={{ width: 30 }} />
          </div>

          {/* Terminal content */}
          <div style={{
            padding: 20,
            background: 'rgba(5, 5, 7, 0.85)',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: 12.5,
            lineHeight: 1.7,
            color: '#a78bfa', // Light violet terminal output
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f8fafc' }}>
              <span>$</span>
              <span>{typingCommand}</span>
              <span style={{
                width: 7,
                height: 14,
                background: '#f8fafc',
                display: 'inline-block',
                animation: 'pulse 1s infinite',
              }} />
            </div>

            {terminalLineIndex >= 1 && (
              <div className="animate-fadeInUp" style={{ marginTop: 10 }}>
                <div style={{ color: 'var(--accent-danger-light)', fontWeight: 600 }}>
                  [ERROR] HTTP 404: NOT_FOUND
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                  SYSTEM_TRACE_LOGS:
                </div>
                <pre style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  padding: 12,
                  borderRadius: 6,
                  color: 'var(--text-secondary)',
                  marginTop: 6,
                  overflowX: 'auto',
                  fontSize: 11.5,
                }}>
{`{
  "status": "404",
  "code": "NOT_FOUND",
  "target_path": "${pathname || '/unknown'}",
  "request_id": "${requestId}",
  "message": "Read our documentation to learn"
}`}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Quick Nav Grid header */}
        <h2 style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: 20,
        }}>
          Explore Alternative Paths
        </h2>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          width: '100%',
          marginBottom: 40,
        }}>
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.title}
                href={link.href}
                className="glass hover-lift"
                style={{
                  textDecoration: 'none',
                  padding: 20,
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: `rgba(255, 255, 255, 0.02)`,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  color: link.accent,
                }}>
                  <Icon size={18} />
                </div>
                <h3 style={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  {link.title}
                </h3>
                <p style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  flexGrow: 1,
                }}>
                  {link.desc}
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: link.accent,
                  marginTop: 14,
                }}>
                  <span>Navigate</span>
                  <ArrowRight size={12} className="arrow" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.02)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        fontSize: 13,
        color: 'var(--text-muted)',
        position: 'relative',
        zIndex: 10,
      }}>
        <span>&copy; {new Date().getFullYear()} NeoPAT AI. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="https://docs.neopat.ai" target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>
            Documentation
          </Link>
          <a href="mailto:support@neopat.ai" style={{ color: 'inherit', textDecoration: 'none' }}>
            Support
          </a>
          <a href="/status" style={{ color: 'inherit', textDecoration: 'none' }}>
            System Status
          </a>
        </div>
      </footer>

      {/* Inline styles for pulse keyframe animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .arrow {
          transition: transform 0.2s ease;
        }
        a:hover .arrow {
          transform: translateX(3px);
        }
      `}</style>
    </div>
  );
}
