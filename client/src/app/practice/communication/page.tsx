'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const hrQuestions = [
  { id: 1, q: 'Tell me about yourself.', tips: 'Structure: Present → Past → Future. Keep it 2 minutes. Highlight your strengths and what makes you suitable.', sample: 'I am a final-year CSE student at Anna University. I have strong skills in Java and DSA, and have built 3 projects including a web-based library system. I am passionate about problem-solving and aim to join a product company where I can grow as a software developer.' },
  { id: 2, q: 'What are your strengths?', tips: 'Choose strengths relevant to the role. Always back them up with a brief example.', sample: 'My strongest skill is problem-solving. During my internship at XYZ, I optimized a database query that reduced load time by 40%. I am also a fast learner and adapt well to new technologies.' },
  { id: 3, q: 'Why do you want to join this company?', tips: 'Research the company before. Mention their products, culture, or mission. Show you\'ve done your homework.', sample: 'I admire TCS\'s commitment to innovation and its learning culture through TCS iON. I believe the structured training program here will help me grow into a strong software engineer.' },
  { id: 4, q: 'Where do you see yourself in 5 years?', tips: 'Show ambition but stay realistic. Align with the company\'s growth path.', sample: 'In 5 years, I see myself as a senior developer leading a small team, having contributed meaningfully to the company\'s product roadmap, and continuously upskilling in cloud and AI technologies.' },
  { id: 5, q: 'What is your greatest weakness?', tips: 'Be honest but show self-awareness and improvement. Never say "I am a perfectionist" — that\'s overused.', sample: 'I sometimes overthink problems before starting to code. But I have been working on it by following a timed approach — I give myself 10 minutes to plan and then start implementing.' },
];

const gdTopics = [
  { topic: 'Work from Home vs Office Culture', category: 'Management', tips: ['Address both sides', 'Bring data/examples', 'Listen actively'] },
  { topic: 'Is AI a threat to software jobs?', category: 'Technology', tips: ['Don\'t be extreme', 'Talk about upskilling', 'Mention human creativity'] },
  { topic: 'Should coding be mandatory in schools?', category: 'Education', tips: ['Consider rural access', 'Mention digital literacy', 'Compare global trends'] },
  { topic: 'Electric Vehicles: Future of Transport?', category: 'Environment', tips: ['Infrastructure challenges', 'Cost factor', 'Government policy'] },
];

const spokenLessons = [
  { id: 1, title: 'Introduction & Self Introduction', duration: '15 min', level: 'beginner', icon: '🎤', yt: 'dQw4w9WgXcQ' },
  { id: 2, title: 'Business English Essentials', duration: '20 min', level: 'intermediate', icon: '💼', yt: 'dQw4w9WgXcQ' },
  { id: 3, title: 'Answering Tough Interview Questions', duration: '25 min', level: 'intermediate', icon: '🎯', yt: 'dQw4w9WgXcQ' },
  { id: 4, title: 'Email Writing for Professionals', duration: '12 min', level: 'beginner', icon: '📧', yt: 'dQw4w9WgXcQ' },
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<'hr' | 'gd' | 'spoken' | 'email'>('hr');
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [showSample, setShowSample] = useState<number | null>(null);
  const [hrQuestionsState, setHrQuestionsState] = useState<any[]>(hrQuestions);
  const [gdTopicsState, setGdTopicsState] = useState<any[]>(gdTopics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const [commRes, hrRes] = await Promise.all([
          api.get('/questions?category=communication&limit=1000'),
          api.get('/questions?category=hr&limit=1000')
        ]);
        
        let loadedHr = [...hrQuestions];
        let loadedGd = [...gdTopics];
        
        if (hrRes.data?.success && hrRes.data.questions?.length > 0) {
          const formattedHr = hrRes.data.questions.map((q: any, index: number) => ({
            id: hrQuestions.length + index + 1,
            q: q.title || q.description || '',
            tips: q.explanation || 'Structure your answer around specific examples from your past experience.',
            sample: q.description || 'Sample answer not provided yet. Craft your answer highlighting your problem-solving skills.'
          }));
          loadedHr = [...hrQuestions, ...formattedHr];
        }
        
        if (commRes.data?.success && commRes.data.questions?.length > 0) {
          const gdQuestions = commRes.data.questions.filter((q: any) => q.topic === 'group-discussion');
          if (gdQuestions.length > 0) {
            const formattedGd = gdQuestions.map((q: any) => ({
              topic: q.title || q.description || '',
              category: 'General Discussion',
              tips: q.explanation ? [q.explanation] : ['State clear arguments', 'Acknowledge other viewpoints', 'Provide logical conclusions']
            }));
            loadedGd = [...gdTopics, ...formattedGd];
          }
        }
        
        setHrQuestionsState(loadedHr);
        setGdTopicsState(loadedGd);
      } catch (err) {
        console.error('Error fetching communication questions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>🗣️ Communication Training</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Master HR interviews, Group Discussions, Spoken English & Email Writing</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {[
          { id: 'hr', label: '🎤 HR Interview', },
          { id: 'gd', label: '👥 Group Discussion' },
          { id: 'spoken', label: '🔊 Spoken English' },
          { id: 'email', label: '📧 Email Writing' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '10px 18px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent-violet)' : 'transparent'}`, color: activeTab === tab.id ? 'var(--accent-violet-light)' : 'var(--text-muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: -1 }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* HR Interview */}
      {activeTab === 'hr' && (
        <div>
          <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>💡 Pro Tip</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Practice answering aloud. Record yourself and listen back. Focus on clarity, confidence, and keeping answers under 2 minutes.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {hrQuestionsState.map(item => (
              <div key={item.id} className="glass" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setExpandedQ(expandedQ === item.id ? null : item.id)} style={{ width: '100%', background: 'none', border: 'none', padding: '18px 20px', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Q{item.id}. {item.q}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>{expandedQ === item.id ? '▾' : '▸'}</span>
                </button>
                {expandedQ === item.id && (
                  <div style={{ padding: '0 20px 20px' }}>
                    <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4', marginBottom: 4 }}>💡 Tips</div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.tips}</p>
                    </div>
                    <button onClick={() => setShowSample(showSample === item.id ? null : item.id)} className="btn-secondary" style={{ padding: '7px 14px', fontSize: 12 }}>
                      {showSample === item.id ? 'Hide Sample Answer' : '👁️ View Sample Answer'}
                    </button>
                    {showSample === item.id && (
                      <div style={{ marginTop: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 4 }}>✅ Sample Answer</div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.sample}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GD Topics */}
      {activeTab === 'gd' && (
        <div>
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 4, color: '#f59e0b' }}>👥 GD Strategy</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Start strong or summarize at the end. Use data to support points. Listen actively and build on others' ideas. Avoid interrupting.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {gdTopicsState.map((g, i) => (
              <div key={i} className="glass hover-lift" style={{ padding: '20px', borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, background: 'rgba(124,58,237,0.1)', color: 'var(--accent-violet-light)', padding: '3px 8px', borderRadius: 4 }}>{g.category}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{g.topic}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {g.tips.map((tip: string, j: number) => (
                    <div key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 6 }}>
                      <span style={{ color: '#10b981' }}>✓</span> {tip}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spoken English */}
      {activeTab === 'spoken' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {spokenLessons.map(lesson => (
              <div key={lesson.id} className="glass hover-lift" style={{ padding: '20px', borderRadius: 14, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{lesson.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{lesson.title}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⏱ {lesson.duration}</span>
                      <span className={`diff-${lesson.level === 'beginner' ? 'easy' : 'medium'}`} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3 }}>{lesson.level.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#000', borderRadius: 8, aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32 }}>▶️</div>
                    <div style={{ fontSize: 11, color: '#fff', marginTop: 4, opacity: 0.7 }}>Add your YouTube link</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Writing */}
      {activeTab === 'email' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { title: 'Formal Email Template', subject: 'Request for Internship Opportunity', body: `Dear [Name],\n\nI hope this email finds you well. I am writing to express my interest in an internship position at [Company Name].\n\nI am a final-year student of Computer Science Engineering at [College]. I have strong skills in Java and Python and have built several full-stack projects.\n\nI would be grateful for an opportunity to contribute to your team. Please find my resume attached.\n\nThank you for your consideration.\n\nWarm regards,\n[Your Name]` },
            { title: 'Follow-up After Interview', subject: 'Thank You – [Position] Interview on [Date]', body: `Dear [Interviewer Name],\n\nThank you for taking the time to interview me for the [Position] role at [Company].\n\nI thoroughly enjoyed our conversation about [specific topic discussed]. The opportunity to work on [specific project/team] is very exciting to me.\n\nI look forward to hearing about next steps.\n\nBest regards,\n[Your Name]` },
          ].map((template, i) => (
            <div key={i} className="glass" style={{ padding: '20px', borderRadius: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📧 {template.title}</h3>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '14px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                <div style={{ color: '#06b6d4', marginBottom: 6 }}>Subject: {template.subject}</div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>{template.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
