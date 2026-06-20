'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Search, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Copy, 
  Download, 
  RefreshCw,
  PlusCircle,
  Cpu
} from 'lucide-react';

// Wrap the optimizer component in Suspense to resolve searchParams in Next.js App Router static pages
function ResumeOptimizerContent() {
  const searchParams = useSearchParams();

  const [targetTitle, setTargetTitle] = useState('');
  const [targetDesc, setTargetDesc] = useState('');
  const [resumeText, setResumeText] = useState('');
  
  // UI states
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // ATS metrics
  const [atsScore, setAtsScore] = useState(65);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  // Pre-fill from query params if coming from job discovery
  useEffect(() => {
    const title = searchParams.get('title');
    const desc = searchParams.get('desc');
    const skills = searchParams.get('skills');
    
    if (title) setTargetTitle(title);
    if (desc) setTargetDesc(desc);
    
    // Sample dummy resume text
    setResumeText(`Suresh Kumar\nBangalore, Karnataka\nsuresh.kumar@email.com\n\nObjective:\nAspiring Software Engineer with solid programming skills seeking a position to build web applications.\n\nEducation:\nB.E. in Computer Science - IIT Madras (GPA: 8.5/10)\n\nSkills:\nJava, Python, C++, HTML5, CSS3, SQL databases, Git version control, Windows.\n\nProjects:\n- Portfolio Website: Built a personal portfolio website with vanilla HTML and CSS.\n- Library Management: Developed a core Java console utility to track books.`);

    if (skills) {
      const skillsList = skills.split(',');
      // Pre-calculate dummy gaps
      setMatchedSkills(skillsList.slice(0, Math.ceil(skillsList.length / 2)));
      setMissingSkills(skillsList.slice(Math.ceil(skillsList.length / 2)));
    } else {
      setMatchedSkills(['Java', 'SQL', 'HTML5', 'CSS3', 'Git']);
      setMissingSkills(['React', 'Node.js', 'Next.js', 'REST APIs']);
    }
  }, [searchParams]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAnalyze = () => {
    if (!resumeText.trim()) {
      alert('Please enter your resume text first.');
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      // Calculate dynamic mock score based on text matches
      let score = 55;
      const textLower = resumeText.toLowerCase();
      
      const skillKeywords = ['react', 'node', 'javascript', 'next', 'typescript', 'aws', 'docker', 'rest api', 'sql', 'git'];
      const matched: string[] = [];
      const missing: string[] = [];

      skillKeywords.forEach(skill => {
        if (textLower.includes(skill)) {
          matched.push(skill.toUpperCase());
          score += 4;
        } else {
          missing.push(skill.toUpperCase());
        }
      });

      // Target description matches
      if (targetDesc) {
        const descWords = targetDesc.toLowerCase().split(/\s+/);
        let matchCount = 0;
        descWords.slice(0, 50).forEach(w => {
          if (w.length > 4 && textLower.includes(w)) matchCount++;
        });
        score += Math.min(matchCount * 0.5, 15);
      }

      setMatchedSkills(matched.length > 0 ? matched : ['SQL', 'GIT']);
      setMissingSkills(missing.length > 0 ? missing : ['REACT', 'NODE.JS', 'NEXT.JS', 'REST APIS']);
      setAtsScore(Math.min(Math.round(score), 100));
      
      setAnalyzing(false);
      setAnalyzed(true);
      triggerToast('ATS analysis completed successfully!');
    }, 1800);
  };

  const handleOneClickOptimize = () => {
    setPolishing(true);
    setTimeout(() => {
      // Tailor the resume by adding missing skills and optimization blocks
      const skillsLine = `Skills:\nJava, Python, C++, HTML5, CSS3, SQL databases, Git version control, Windows, ${missingSkills.join(', ').toLowerCase()}.`;
      const polishedText = `Suresh Kumar\nBangalore, Karnataka\nsuresh.kumar@email.com\n\nObjective:\nResult-oriented Front-End Software Developer seeking an opportunity to build scalable web applications at ${targetTitle ? 'Target Company' : 'your organization'}. Dedicated to creating clean component architectures, optimizing ATS scores, and implementing responsive modular views.\n\nEducation:\nB.E. in Computer Science - IIT Madras (GPA: 8.5/10)\n\n${skillsLine}\n\nKey Core Competencies:\n- Component Design (React.js, Next.js frameworks)\n- Server-side REST API development (Node.js/Express modules)\n- Version Control (Git repositories)\n- Relational Databases (SQL structured procedures)\n\nProfessional Experience & Projects:\n- Responsive Portfolio Web App: Integrated React state-management hooks and styled CSS frames to create a portfolio showcasing technical milestones.\n- Library Management Services: Built Java backend routes, integrated SQL database tables, and optimized query indices to improve search speeds.`;

      setOptimizedResume(polishedText);
      setAtsScore(96); // Boosted score
      setMatchedSkills([...matchedSkills, ...missingSkills]);
      setMissingSkills([]);
      
      setPolishing(false);
      triggerToast('Resume customized and optimized for ATS!');
    }, 2200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedResume);
    triggerToast('Optimized resume copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([optimizedResume], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${targetTitle.replace(/\s+/g, '_')}_tailored_resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Speedometer calculation
  const strokeDashoffset = 440 - (440 * (atsScore * 0.75)) / 100;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'flex-start' }}>
      
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1100,
          background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)',
          borderRadius: 8, padding: '12px 20px', fontSize: 13, color: '#fff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 8,
          backdropFilter: 'blur(8px)', animation: 'fadeInUp 0.15s ease'
        }}>
          <CheckCircle size={14} style={{ color: 'var(--accent-emerald-light)' }} />
          <span>{toast}</span>
        </div>
      )}

      {/* Left Column: Form Entry */}
      <div className="glass" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={18} style={{ color: 'var(--accent-violet-light)' }} />
          <span>ATS Resume Analyzer</span>
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Target Job Title */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>TARGET JOB TITLE</label>
            <input
              type="text"
              placeholder="e.g. Associate Software Engineer (React)"
              value={targetTitle}
              onChange={e => setTargetTitle(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Target Job Description */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>TARGET JOB DESCRIPTION (OR REQUIRED SKILLS)</label>
            <textarea
              placeholder="Paste the job description here to extract core keywords and calculate ATS matching scores..."
              value={targetDesc}
              onChange={e => setTargetDesc(e.target.value)}
              className="input-field"
              rows={4}
              style={{ resize: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* Current Resume Text */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>YOUR CURRENT RESUME TEXT</label>
            <textarea
              placeholder="Paste your raw resume text here to run keyword audits and alignment checks..."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              className="input-field"
              rows={9}
              style={{ resize: 'none', fontFamily: 'inherit', fontSize: 13 }}
            />
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: 13.5, gap: 8, marginTop: 4 }}
          >
            {analyzing ? <RefreshCw className="animate-spin-fast" size={15} /> : <Cpu size={15} />}
            <span>{analyzing ? 'Analyzing Resume Semantics...' : 'Scan & Run ATS Audit'}</span>
          </button>
        </div>
      </div>

      {/* Right Column: Results & Optimization */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* ATS Score Card */}
        {analyzed && (
          <div className="glass animate-fadeInUp" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border-bright)' }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              
              {/* Circular Gauge */}
              <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ transform: 'rotate(-135deg)', width: 120, height: 120 }}>
                  <circle cx="60" cy="60" r="50" stroke="var(--border)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="60" cy="60" r="50" 
                    stroke={atsScore >= 85 ? 'var(--accent-emerald)' : atsScore >= 70 ? 'var(--accent-amber)' : 'var(--accent-violet)'} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="314"
                    strokeDashoffset={314 - (314 * (atsScore * 0.75)) / 100}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{atsScore}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700 }}>ATS SCORE</div>
                </div>
              </div>

              {/* Status Info */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {atsScore >= 80 ? (
                    <>
                      <CheckCircle size={16} style={{ color: 'var(--accent-emerald-light)' }} />
                      <span>Ready to Apply!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} style={{ color: 'var(--accent-amber-light)' }} />
                      <span>Improvements Needed</span>
                    </>
                  )}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, marginTop: 4 }}>
                  {atsScore >= 80 
                    ? 'Excellent keywords matching. Your resume stands a high chance of passing automated ATS resume screeners.'
                    : 'Your resume lacks critical keywords matching the job description. passing chances might be low.'
                  }
                </p>
              </div>
            </div>

            {/* Keyword Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 18 }}>
              {/* Matched */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>MATCHED KEYWORDS ({matchedSkills.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {matchedSkills.map(s => (
                    <span key={s} style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)', color: 'var(--accent-emerald-light)', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>MISSING KEYWORDS ({missingSkills.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {missingSkills.length === 0 ? (
                    <span style={{ fontSize: 11, color: 'var(--accent-emerald-light)', fontWeight: 600 }}>None! 100% Match</span>
                  ) : (
                    missingSkills.map(s => (
                      <span key={s} style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', color: 'var(--accent-danger-light)', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{s}</span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* One-Click Polish Action */}
            {missingSkills.length > 0 && (
              <button
                onClick={handleOneClickOptimize}
                disabled={polishing}
                className="btn-primary animate-fadeInUp"
                style={{ width: '100%', marginTop: 20, padding: '10px', fontSize: 12.5, gap: 8, background: 'linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-pink) 100%)', borderColor: 'transparent', color: '#fff' }}
              >
                {polishing ? <RefreshCw className="animate-spin-fast" size={13} /> : <Sparkles size={13} />}
                <span>{polishing ? 'Injecting missing keywords and polishing...' : 'One-Click ATS Keywords Polish'}</span>
              </button>
            )}
          </div>
        )}

        {/* Tailored Output Display */}
        {optimizedResume && (
          <div className="glass animate-fadeInUp" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border-bright)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} style={{ color: 'var(--accent-pink-light)' }} />
                <h4 style={{ fontSize: 14, fontWeight: 700 }}>Tailored ATS-Optimized Resume</h4>
              </div>
              
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={handleCopy} className="btn-secondary" style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, gap: 4 }} title="Copy Resume">
                  <Copy size={12} />
                  <span>Copy</span>
                </button>
                <button onClick={handleDownload} className="btn-secondary" style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, gap: 4 }} title="Download Text File">
                  <Download size={12} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Document Metrics HUD */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>WORD COUNT</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                  {optimizedResume.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>KEYWORD DENSITY</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-emerald-light)', marginTop: 2 }}>Excellent (9.4%)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>ATS RANK FIT</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-violet-light)', marginTop: 2 }}>96% Score</div>
              </div>
            </div>

            {/* Simulated Paper A4 preview container */}
            <div style={{ 
              background: '#ffffff', 
              color: '#1e293b', 
              borderRadius: 8, 
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)', 
              border: '1px solid #e2e8f0', 
              borderTop: '6px solid var(--accent-violet)',
              padding: '24px', 
              fontFamily: 'Georgia, serif', 
              fontSize: '12px', 
              lineHeight: 1.5,
              maxHeight: 280,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              textAlign: 'left'
            }}>
              {optimizedResume}
            </div>
          </div>
        )}

        {/* Initial Instruction Card */}
        {!analyzed && (
          <div className="glass" style={{ borderRadius: 14, padding: '60px 24px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <Sparkles size={40} style={{ color: 'var(--text-muted)', marginBottom: 12, opacity: 0.4 }} />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Resume customizer</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4, maxWidth: 350, margin: '4px auto 0' }}>
              Paste your current resume details and target job description to verify key compatibility scores and generate optimized copies.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default function AIResumeOptimizerPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
        <Loader2 className="animate-spin-fast" size={32} style={{ color: 'var(--accent-violet-light)' }} />
      </div>
    }>
      <div style={{ maxWidth: 1200, margin: '0 auto' }} className="animate-fadeInUp">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={24} style={{ color: 'var(--accent-violet-light)' }} />
              <span>AI Resume Optimizer</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
              Optimize your resume for applicant tracking systems (ATS), calculate keywords match ratings, and fill skill gaps in one click.
            </p>
          </div>
        </div>

        <ResumeOptimizerContent />
      </div>
    </Suspense>
  );
}

// Simple loader helper inside file to avoid compilation reference issues
function Loader2({ className, size, style }: { className?: string; size?: number; style?: any }) {
  return (
    <div className={className} style={{ width: size, height: size, border: '2.5px solid var(--border)', borderTopColor: 'var(--accent-violet-light)', borderRadius: '50%', ...style }}>
      <style>{`.animate-spin-fast { animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
