'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sparkles, Bot, Video, Send, CheckCircle2, ArrowRight, Layout, User, 
  Users, Globe, Play, FileText, ChevronRight, Zap, Target, Award, 
  ArrowUpRight, Star, Shield, Code, Database, Sparkle
} from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [activeFeature, setActiveFeature] = useState<'interview' | 'resume' | 'outreach' | 'tracker'>('interview');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const featureDetails = {
    interview: {
      title: "Real-time AI Interview Prep",
      description: "Simulate intense technical and HR interview rounds. Get instant, granular feedback on your communication skills, technical depth, and body language.",
      bulletPoints: [
        "Interactive real-time audio/text evaluation",
        "Adaptive AI questions based on your responses",
        "Comprehensive HR & technical question bank",
        "Detailed performance report and score metrics"
      ],
      link: "/copilot/interview",
      icon: Video,
      color: "var(--accent-violet-light)"
    },
    resume: {
      title: "One-Click ATS Resume Polish",
      description: "Paste your target job description and let the AI analyze and optimize your resume to bypass ATS filters with ease.",
      bulletPoints: [
        "Accurate ATS score simulation out of 100",
        "Identifies missing high-yield keywords and skills",
        "Generates tailored summary and experience sections",
        "Preserves your formatting structure automatically"
      ],
      link: "/copilot/resume",
      icon: FileText,
      color: "var(--accent-pink-light)"
    },
    outreach: {
      title: "AI Recruiter Outreach Generator",
      description: "Instantly draft personalized Cold Emails and LinkedIn messages targeting recruiters and software engineers.",
      bulletPoints: [
        "Hyper-customized based on target company & job ID",
        "Proven templates designed to double reply rates",
        "Custom tone control (professional, enthusiastic, creative)",
        "Instant one-click copy and send integration"
      ],
      link: "/copilot/generator",
      icon: Send,
      color: "var(--accent-cyan-light)"
    },
    tracker: {
      title: "Dynamic Workflow & Scheduler",
      description: "Organize your job search with a drag-and-drop Kanban board, a integrated scheduler, and your daily To-Do lists.",
      bulletPoints: [
        "Interactive HTML5 Drag and Drop board",
        "Calendar view to track deadlines and interviews",
        "Personal task tracker with progress visualizations",
        "Seeded with over 460+ DSA & 14+ SQL practice tracks"
      ],
      link: "/dashboard/schedule",
      icon: Layout,
      color: "var(--accent-amber-light)"
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Banner Grid background overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 600,
        backgroundImage: 'radial-gradient(circle at top, rgba(124, 58, 237, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Navigation */}
      <header className="glass" style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20
          }}>🎯</div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Place1 AI
          </span>
        </div>

        <nav style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500 }} className="hidden md:flex">
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Features</a>
          <a href="#plan" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>My Plan</a>
          <a href="#dsa-sql" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Practice Paths</a>
          <a href="#commercial" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Commercial</a>
        </nav>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {loading ? (
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-violet)', animation: 'spin 1s linear infinite' }} />
          ) : user ? (
            <Link href="/dashboard" className="btn-glow" style={{ padding: '8px 18px', fontSize: 13, textDecoration: 'none' }}>
              Go to Dashboard <ArrowUpRight size={14} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: 13, textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link href="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 13, textDecoration: 'none' }}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: 1200, margin: '80px auto 40px', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }} className="animate-fadeInUp">
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)',
          padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
          color: 'var(--accent-violet-light)', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          <Sparkles size={13} /> The Ultimate AI Career Acceleration Ecosystem
        </div>

        <h1 className="gradient-text" style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', maxWidth: 900, margin: '0 auto 24px' }}>
          Unlock Your Future Placement with <span style={{ background: 'linear-gradient(135deg, var(--accent-violet-light) 0%, var(--accent-cyan-light) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Place1 AI</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.6, maxWidth: 750, margin: '0 auto 36px', fontWeight: 500 }}>
          Supercharge your interview prep, master 460+ curious freaks DSA roadmap, optimize resumes for target ATS profiles, schedule mock interviews, and automate personalized cold recruiter outreach.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Link href="/register" className="btn-glow" style={{ padding: '12px 28px', fontSize: 15, textDecoration: 'none' }}>
            Accelerate Now <ArrowRight size={16} />
          </Link>
          <a href="#features" className="btn-secondary" style={{ padding: '12px 28px', fontSize: 15, textDecoration: 'none' }}>
            Explore Sandbox
          </a>
        </div>

        {/* Floating statistics cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 70 }}>
          {[
            { metric: "464+", label: "Structured DSA Practice Paths", icon: Code, color: "var(--accent-violet-light)" },
            { metric: "14+", label: "Advanced SQL Interview Sets", icon: Database, color: "var(--accent-cyan-light)" },
            { metric: "10,000+", label: "AI Mock Interviews Simulated", icon: Video, color: "var(--accent-pink-light)" },
            { metric: "99.2%", label: "Real-world Placement Rate", icon: Target, color: "var(--accent-emerald-light)" },
          ].map((stat, i) => (
            <div key={i} className="glass hover-lift" style={{ borderRadius: 14, padding: 24, textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle, ${stat.color}10 0%, transparent 70%)` }} />
              <stat.icon size={20} style={{ color: stat.color, marginBottom: 12 }} />
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{stat.metric}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" style={{ maxWidth: 1200, margin: '100px auto 40px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Futuristic Career Utilities
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
            Everything you need to go from learning basics to cracking elite technical interviews, all connected in one place.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32, alignItems: 'center' }}>
          {/* Feature switcher tabs */}
          <div style={{ gridColumn: 'span 12', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }} className="lg:col-span-4 lg:flex-col lg:justify-start lg:align-stretch">
            {Object.entries(featureDetails).map(([key, value]) => {
              const Icon = value.icon;
              const active = activeFeature === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFeature(key as any)}
                  className="glass hover-lift"
                  style={{
                    padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)',
                    background: active ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 700,
                    color: active ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left',
                    boxShadow: active ? 'inset 0 0 10px rgba(124, 58, 237, 0.1)' : 'none'
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: active ? `${value.color}20` : 'rgba(255,255,255,0.02)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={16} style={{ color: active ? value.color : 'inherit' }} />
                  </div>
                  <div>
                    <div style={{ color: active ? '#fff' : 'inherit' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }} className="hidden sm:inline">Professional Assist</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feature Display Area */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-8">
            <div className="glass-bright" style={{ borderRadius: 20, padding: '40px 32px', position: 'relative', overflow: 'hidden', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 250, height: 250, background: `radial-gradient(circle, ${featureDetails[activeFeature].color}10 0%, transparent 70%)` }} />
              
              <div>
                <div style={{ display: 'inline-flex', padding: '6px 12px', background: `${featureDetails[activeFeature].color}12`, borderRadius: 8, fontSize: 12, fontWeight: 700, color: featureDetails[activeFeature].color, marginBottom: 18 }}>
                  Premium Career Tool
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)' }}>
                  {featureDetails[activeFeature].title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                  {featureDetails[activeFeature].description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 32 }}>
                  {featureDetails[activeFeature].bulletPoints.map((bp, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 500 }}>
                      <CheckCircle2 size={16} style={{ color: featureDetails[activeFeature].color }} />
                      {bp}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link href={featureDetails[activeFeature].link} className="btn-glow" style={{ 
                  background: `linear-gradient(135deg, var(--accent-violet) 0%, ${featureDetails[activeFeature].color} 100%)`,
                  padding: '10px 22px', fontSize: 14, textDecoration: 'none'
                }}>
                  Launch Sandbox <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Section ("My Plan" section - futuristic, commercial billing plans) */}
      <section id="plan" style={{ maxWidth: 1200, margin: '100px auto 40px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Futuristic Career Subscriptions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
            Choose a premium tier to scale your application telemetry, get advanced coaching, or custom administrative recruitment tools.
          </p>

          <div style={{ display: 'inline-flex', gap: 4, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: 4, borderRadius: 10, marginTop: 24 }}>
            <button onClick={() => setSelectedPlan('monthly')} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: selectedPlan === 'monthly' ? 'rgba(255,255,255,0.1)' : 'transparent', color: selectedPlan === 'monthly' ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              Monthly
            </button>
            <button onClick={() => setSelectedPlan('yearly')} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: selectedPlan === 'yearly' ? 'rgba(255,255,255,0.1)' : 'transparent', color: selectedPlan === 'yearly' ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              Yearly <span style={{ color: 'var(--accent-emerald-light)', fontSize: 10, marginLeft: 2 }}>(Save 20%)</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Free Plan */}
          <div className="glass" style={{ borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard Practice</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Free Sandbox</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Essential tools to kick off your placement preparation journey.</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 800 }}>$0</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>/ month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-violet-light)' }} />
                  Full access to 460+ DSA track problems
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-violet-light)' }} />
                  Basic HTML5 Kanban Board
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-violet-light)' }} />
                  5 AI Assist tokens per month
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-violet-light)' }} />
                  Access to public SQL challenge list
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <Link href="/register" className="btn-secondary" style={{ width: '100%', textDecoration: 'none' }}>
                Join Sandbox Free
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="glass-bright glow-violet" style={{ borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(124, 58, 237, 0.25)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, right: 24, background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-pink))', padding: '4px 12px', borderRadius: 9999, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Highly Recommended
            </div>
            
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-violet-light)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Career Pro</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Personal Career Coach</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Everything you need to land elite 6-figure dev roles.</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 800 }}>{selectedPlan === 'monthly' ? '$15' : '$12'}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>/ month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-violet-light)' }} />
                  <strong>Unlimited</strong> AI Mock Interviews (HR & Tech)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-violet-light)' }} />
                  <strong>Unlimited</strong> Resume ATS keyword optimizations
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-violet-light)' }} />
                  Advanced calendar and workflow features
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-violet-light)' }} />
                  Personalized Roadmap Gen & telemetry dashboards
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <Link href="/register" className="btn-glow" style={{ width: '100%', textDecoration: 'none' }}>
                Upgrade to Pro <Zap size={14} />
              </Link>
            </div>
          </div>

          {/* Commercial / Enterprise Plan */}
          <div className="glass" style={{ borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-pink-light)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise & Partners</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Placement Portal</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Commercial administration dashboard for universities and recruiters.</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 800 }}>Custom</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-pink-light)' }} />
                  Complete Cohort Telemetry & performance metrics
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-pink-light)' }} />
                  Custom coding assessment and automated tests builder
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-pink-light)' }} />
                  Administrative dashboard for course creation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--accent-pink-light)' }} />
                  Direct database syncing with custom integrations
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <Link href="mailto:admin@place1.ai" className="btn-secondary" style={{ width: '100%', textDecoration: 'none' }}>
                Contact Commercial Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        padding: '40px 24px', background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15
            }}>🎯</div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Place1 AI</span>
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Place1 AI. All rights reserved. Built for professional placement success.
          </div>
        </div>
      </footer>

    </div>
  );
}
