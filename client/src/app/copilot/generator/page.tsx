'use client';

import { useState } from 'react';
import { 
  Send, 
  Copy, 
  Sparkles, 
  FileText, 
  Mail, 
  RefreshCw,
  CheckCircle,
  HelpCircle,
  FileSignature
} from 'lucide-react';

export default function AIOutreachGeneratorPage() {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [achievements, setAchievements] = useState('');
  const [tone, setTone] = useState('professional');
  
  // UI states
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState<'cover' | 'linkedin' | 'recruiter'>('cover');
  const [toast, setToast] = useState<string | null>(null);

  // Generated texts states
  const [coverLetter, setCoverLetter] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [recruiterMessage, setRecruiterMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) {
      alert('Please fill in both the Target Role and Target Company.');
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      // Mock generated cover letter
      const coverLetterTemplate = `Dear Hiring Manager at ${company},

I am writing to express my enthusiastic interest in the ${role} position at your esteemed organization. With a solid educational foundation in Computer Science from IIT Madras and hands-on experience developing modular frontend interfaces and relational database queries, I am confident in my ability to add immediate value to your development team.

${achievements ? `In my previous projects, I successfully ${achievements}. ` : ''}Furthermore, I have spent significant hours honing my problem-solving logic through advanced DSA challenges, practicing SQL queries, and optimizing web application responsive views to ensure seamless user interfaces.

I am highly drawn to ${company}'s culture of innovation and engineering excellence. I welcome the opportunity to discuss how my skills and proactive learning mindset align with your goals. Thank you for your time and consideration.

Sincerely,
Suresh Kumar`;

      // Mock generated LinkedIn optimize block
      const linkedinTemplate = `👉 **Optimized Headline Recommendation:**\nAssociate Software Engineer @ ${company} | React.js & Next.js Frameworks | SQL Databases | B.E. Computer Science Graduate (IIT Madras)\n\n👉 **Professional Profile Summary:**\nPassionate Software Developer specializing in building clean, responsive web user interfaces and robust database queries. Experienced in ES6 Javascript, React functional components, hooks, SQL query optimization, and Git version control. Proactive problem solver with 400+ coding challenges solved on Curious Freaks DSA Track.\n\n👉 **Core Skills to Add:**\nReact.js, Next.js, Node.js, JavaScript (ES6), SQL databases, Git version control, Data Structures & Algorithms.`;

      // Mock generated recruiter outreach message
      const recruiterTemplate = `Subject: Inquiry: ${role} Opportunities at ${company} - Suresh Kumar

Dear Hiring Team / Recruiter,

I hope you are doing well.

I recently noticed the opening for the ${role} position at ${company} and felt compelled to reach out. I am a Computer Science graduate from IIT Madras with expertise in building responsive front-end user interfaces using React/Next.js and optimizing SQL queries.

${achievements ? `My background includes successfully ${achievements.toLowerCase().replace(/\.$/, '')}. ` : ''}Given my strong foundation in Data Structures, Algorithms, and clean component architecture, I am keen to contribute to ${company}'s engineering initiatives.

I have attached my optimized resume for your review. Would you be open to a brief chat next week to discuss how my skill set matches your team's current development needs?

Best regards,
Suresh Kumar
suresh.kumar@email.com | +91 98765 43210`;

      setCoverLetter(coverLetterTemplate);
      setLinkedinProfile(linkedinTemplate);
      setRecruiterMessage(recruiterTemplate);
      
      setGenerating(false);
      setGenerated(true);
      triggerToast('AI Outreach assets generated successfully!');
    }, 1800);
  };

  const getActiveText = () => {
    if (activeTab === 'cover') return coverLetter;
    if (activeTab === 'linkedin') return linkedinProfile;
    return recruiterMessage;
  };

  const handleCopy = () => {
    const text = getActiveText();
    navigator.clipboard.writeText(text);
    triggerToast('Copied to clipboard!');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }} className="animate-fadeInUp">
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

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileSignature size={24} style={{ color: 'var(--accent-violet-light)' }} />
            <span>AI Outreach & Generator</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Tailor Cover Letters, optimize LinkedIn headlines/summaries, and generate outreach messages to recruiters.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20, alignItems: 'flex-start' }}>
        
        {/* Left Side: Generator Form */}
        <div className="glass" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} style={{ color: 'var(--accent-violet-light)' }} />
            <span>Generate Career Copy</span>
          </h3>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Target Role */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>TARGET ROLE *</label>
              <input
                type="text"
                placeholder="e.g. Associate Software Engineer (React)"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {/* Target Company */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>TARGET COMPANY *</label>
              <input
                type="text"
                placeholder="e.g. Accenture / Zoho"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {/* Core Accomplishments */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>KEY ACCOMPLISHMENTS / HIGHLIGHTS</label>
              <textarea
                placeholder="e.g. Developed a database system matching user keys and optimized index query searches."
                value={achievements}
                onChange={e => setAchievements(e.target.value)}
                className="input-field"
                rows={3}
                style={{ resize: 'none', fontFamily: 'inherit' }}
              />
            </div>

            {/* Tone Selector */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>COPY TONE</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="input-field"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <option value="professional">Professional & Structured</option>
                <option value="enthusiastic">Enthusiastic & Driven</option>
                <option value="casual">Casual & Direct</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={generating}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: 13, gap: 8, marginTop: 6 }}
            >
              {generating ? <RefreshCw className="animate-spin-fast" size={14} /> : <Sparkles size={14} />}
              <span>{generating ? 'Generating copy...' : 'Generate Career Outreach'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Generated Outputs */}
        <div>
          {generated ? (
            <div className="glass animate-fadeInUp" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border-bright)' }}>
              
              {/* Tab selector */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 16, gap: 8 }}>
                <button
                  onClick={() => setActiveTab('cover')}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                    background: activeTab === 'cover' ? 'var(--border-bright)' : 'transparent',
                    color: activeTab === 'cover' ? '#fff' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <FileText size={13} />
                  <span>Cover Letter</span>
                </button>

                <button
                  onClick={() => setActiveTab('linkedin')}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                    background: activeTab === 'linkedin' ? 'var(--border-bright)' : 'transparent',
                    color: activeTab === 'linkedin' ? '#fff' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: activeTab === 'linkedin' ? 1 : 0.7 }}>
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span>LinkedIn Bio</span>
                </button>

                <button
                  onClick={() => setActiveTab('recruiter')}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                    background: activeTab === 'recruiter' ? 'var(--border-bright)' : 'transparent',
                    color: activeTab === 'recruiter' ? '#fff' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <Mail size={13} />
                  <span>Recruiter Message</span>
                </button>
              </div>

              {/* Text display panel */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleCopy}
                  className="btn-secondary"
                  style={{ position: 'absolute', right: 10, top: 10, padding: '6px 10px', fontSize: 11, gap: 4 }}
                >
                  <Copy size={11} />
                  <span>Copy</span>
                </button>
                
                <pre style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '48px 16px 16px', fontSize: 12, fontFamily: 'monospace', overflowY: 'auto', maxHeight: 320,
                  whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.6
                }}>
                  {getActiveText()}
                </pre>
              </div>

              {/* Social Prospecting HUD (Boolean search string) */}
              <div style={{ background: 'rgba(6,182,212,0.03)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 10, padding: 16, marginTop: 16 }}>
                <h5 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan-light)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Recruiter Boolean Search Helper</span>
                </h5>
                <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
                  Copy this exact Boolean query into LinkedIn Search or Google to locate target recruiters at <strong>{company}</strong>:
                </p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    readOnly
                    value={`"${company}" AND ("recruiter" OR "talent acquisition" OR "hiring manager") AND ("${role.split(/\s+/)[0]}" OR "engineering" OR "software")`}
                    className="input-field"
                    style={{ fontSize: 11, fontFamily: 'monospace', height: 32, padding: '4px 10px', background: 'var(--bg-secondary)', flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`"${company}" AND ("recruiter" OR "talent acquisition" OR "hiring manager") AND ("${role.split(/\s+/)[0]}" OR "engineering" OR "software")`);
                      triggerToast('Boolean search query copied!');
                    }}
                    className="btn-primary"
                    style={{ height: 32, fontSize: 11, padding: '0 12px' }}
                  >
                    <span>Copy Query</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass" style={{ borderRadius: 14, padding: 80, textAlign: 'center', border: '1px solid var(--border)' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', marginBottom: 12, opacity: 0.4 }}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>AI Generated Assets</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, marginTop: 4 }}>
                Enter target role details and submit to generate customized Cover Letters, LinkedIn Headline/Summaries, and cold outreach recruiter emails.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
