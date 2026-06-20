'use client';
import { useState } from 'react';

const companies = [
  {
    id: 'tcs', name: 'Tata Consultancy Services', shortName: 'TCS',
    logo: '🔵', color: '#0047AB', bgColor: 'rgba(0,71,171,0.1)',
    openings: '25,000+', package: '3.36 – 7 LPA', employees: '600,000+',
    description: 'India\'s largest IT services company. Known for large-scale digital transformation, BPS, and IT infrastructure services.',
    selectionProcess: ['Online Test (NQT)', 'Technical Interview', 'Managerial Round', 'HR Interview'],
    examPattern: {
      sections: [
        { name: 'Numerical Ability', questions: 26, duration: 40, marks: 26 },
        { name: 'Verbal Ability', questions: 24, duration: 30, marks: 24 },
        { name: 'Reasoning & Aptitude', questions: 30, duration: 50, marks: 30 },
        { name: 'Programming Logic', questions: 10, duration: 15, marks: 20 },
        { name: 'Coding (Advanced)', questions: 2, duration: 45, marks: 0 },
      ]
    },
    focusTopics: ['Quantitative Aptitude', 'C Programming', 'Data Structures', 'DBMS', 'OOPs'],
    interviewExps: [
      { name: 'Priya R., 2024', branch: 'CSE', text: 'TCS interview was mostly HR-focused. They asked about projects, strengths, and location preference. Aptitude cutoff was around 65%.' },
      { name: 'Arun M., 2024', branch: 'IT', text: 'The NQT was tough, especially programming logic. Practice pseudo-code questions. HR round was straightforward.' },
    ],
    ytPlaylistId: 'PLACEHOLDER_TCS_PLAYLIST',
    website: 'https://careers.tcs.com',
  },
  {
    id: 'infosys', name: 'Infosys Limited', shortName: 'Infosys',
    logo: '🟤', color: '#007CC2', bgColor: 'rgba(0,124,194,0.1)',
    openings: '50,000+', package: '3.6 – 8 LPA', employees: '350,000+',
    description: 'Global leader in next-generation digital services and consulting with presence in 50+ countries.',
    selectionProcess: ['InfyTQ / Hackwithinfy', 'Online Test', 'Technical Interview', 'HR Interview'],
    examPattern: {
      sections: [
        { name: 'Reasoning & Math Ability', questions: 15, duration: 25, marks: 15 },
        { name: 'Verbal English', questions: 20, duration: 20, marks: 20 },
        { name: 'Pseudocode', questions: 5, duration: 10, marks: 10 },
        { name: 'Puzzle Solving', questions: 3, duration: 15, marks: 15 },
      ]
    },
    focusTopics: ['Logical Reasoning', 'Verbal English', 'Pseudocode', 'OOPs in Java', 'DBMS'],
    interviewExps: [
      { name: 'Kavya S., 2024', branch: 'ECE', text: 'Infosys interview was technical + HR. They asked 2 coding questions and DBMS basics. Very friendly atmosphere.' },
    ],
    ytPlaylistId: 'PLACEHOLDER_INFOSYS_PLAYLIST',
    website: 'https://www.infosys.com/careers',
  },
  {
    id: 'zoho', name: 'Zoho Corporation', shortName: 'Zoho',
    logo: '🟢', color: '#E42527', bgColor: 'rgba(228,37,39,0.1)',
    openings: '2,000+', package: '4 – 12 LPA', employees: '15,000+',
    description: 'India-headquartered SaaS giant. Known for technical rigor, best work culture, and exceptional growth opportunities.',
    selectionProcess: ['General Aptitude Test', 'Advanced Technical Test', 'Programming Round', 'Technical Interview', 'HR'],
    examPattern: {
      sections: [
        { name: 'General Aptitude', questions: 30, duration: 60, marks: 30 },
        { name: 'Advanced Technical', questions: 20, duration: 40, marks: 20 },
        { name: 'Programming Round', questions: 3, duration: 90, marks: 60 },
      ]
    },
    focusTopics: ['Core Programming (C/C++/Java)', 'Algorithms & DS', 'OOPs', 'System Design Basics'],
    interviewExps: [
      { name: 'Ravi K., 2024', branch: 'CSE', text: 'Zoho is hard! Programming round requires actual coding. They gave me string manipulation and sorting problems. 6 rounds total but once you crack it, the package is worth it.' },
    ],
    ytPlaylistId: 'PLACEHOLDER_ZOHO_PLAYLIST',
    website: 'https://careers.zoho.com',
  },
  {
    id: 'wipro', name: 'Wipro Limited', shortName: 'Wipro',
    logo: '🟡', color: '#341A6F', bgColor: 'rgba(52,26,111,0.1)',
    openings: '15,000+', package: '3.5 – 6.5 LPA', employees: '250,000+',
    description: 'Leading global IT, consulting, and business process services company with 57 years of history.',
    selectionProcess: ['Online Test (NLTH)', 'Written Communication Test', 'Technical Interview', 'HR Interview'],
    examPattern: {
      sections: [
        { name: 'Aptitude', questions: 18, duration: 16, marks: 18 },
        { name: 'Logical Reasoning', questions: 18, duration: 16, marks: 18 },
        { name: 'Verbal Ability', questions: 22, duration: 18, marks: 22 },
        { name: 'Written Communication', questions: 2, duration: 20, marks: 20 },
        { name: 'Online Programming Test', questions: 2, duration: 60, marks: 40 },
      ]
    },
    focusTopics: ['Aptitude', 'Logical Reasoning', 'Essay Writing', 'Basic Java/Python', 'SDLC'],
    interviewExps: [
      { name: 'Deepa T., 2024', branch: 'IT', text: 'Wipro NLTH had 5 sections. The written communication section is unique — they ask you to write an essay. Tech interview was easy — mostly theory.' },
    ],
    ytPlaylistId: 'PLACEHOLDER_WIPRO_PLAYLIST',
    website: 'https://careers.wipro.com',
  },
  {
    id: 'accenture', name: 'Accenture', shortName: 'Accenture',
    logo: '🟣', color: '#A100FF', bgColor: 'rgba(161,0,255,0.1)',
    openings: '40,000+', package: '4.5 – 8 LPA', employees: '700,000+',
    description: 'Global professional services company with capabilities in digital, cloud, and security consulting.',
    selectionProcess: ['Online Assessment', 'Communication Assessment', 'Technical Interview', 'HR Interview'],
    examPattern: {
      sections: [
        { name: 'Cognitive Assessment', questions: 50, duration: 55, marks: 50 },
        { name: 'Technical Assessment', questions: 40, duration: 40, marks: 40 },
        { name: 'Coding', questions: 2, duration: 45, marks: 10 },
        { name: 'Communication Test (Versant)', questions: 0, duration: 10, marks: 10 },
      ]
    },
    focusTopics: ['Aptitude', 'Communication Skills', 'Basic Coding', 'SDLC', 'Agile Methodology'],
    interviewExps: [
      { name: 'Meera P., 2024', branch: 'CSE', text: 'Accenture process is smooth. The Versant communication test checks spoken English. Tech interview was project-based. Focus on communication skills!' },
    ],
    ytPlaylistId: 'PLACEHOLDER_ACCENTURE_PLAYLIST',
    website: 'https://www.accenture.com/in-en/careers',
  },
  {
    id: 'amazon', name: 'Amazon India', shortName: 'Amazon',
    logo: '🟠', color: '#FF9900', bgColor: 'rgba(255,153,0,0.1)',
    openings: '5,000+', package: '18 – 40 LPA', employees: '80,000+ (India)',
    description: 'World\'s largest e-commerce and cloud (AWS) company. Highly selective process focused on leadership principles and DSA.',
    selectionProcess: ['Online Assessment (OA)', 'Technical Round 1', 'Technical Round 2', 'Bar Raiser', 'Hiring Manager'],
    examPattern: {
      sections: [
        { name: 'Coding (OA)', questions: 2, duration: 70, marks: 100 },
        { name: 'Workstyle Assessment', questions: 0, duration: 15, marks: 0 },
        { name: 'Technical Interviews (×2)', questions: 0, duration: 120, marks: 0 },
        { name: 'Bar Raiser (LP + Coding)', questions: 0, duration: 60, marks: 0 },
      ]
    },
    focusTopics: ['Advanced DSA (Trees, Graphs, DP)', 'System Design', 'Amazon Leadership Principles', 'OOPs', 'Database Design'],
    interviewExps: [
      { name: 'Suresh N., 2024', branch: 'CSE', text: 'Amazon is DSA-heavy. Got Graphs and DP in OA. Tech rounds had 2 coding + behavioural questions. Study Leadership Principles deeply — they ask STAR stories for every LP.' },
    ],
    ytPlaylistId: 'PLACEHOLDER_AMAZON_PLAYLIST',
    website: 'https://www.amazon.jobs/en/locations/india',
  },
];

export default function CompaniesPage() {
  const [selected, setSelected] = useState<typeof companies[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'pattern' | 'experience' | 'prep'>('overview');

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>🏢 Company-Wise Preparation</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Exam patterns, interview experiences, and tailored prep material</p>
      </div>

      {selected ? (
        // Company detail view
        <div>
          <button className="btn-secondary" onClick={() => setSelected(null)} style={{ padding: '8px 16px', fontSize: 13, marginBottom: 20 }}>← All Companies</button>

          {/* Company header */}
          <div className="glass" style={{ padding: '28px', borderRadius: 16, marginBottom: 20, background: selected.bgColor, border: `1px solid ${selected.color}33` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 72, height: 72, background: selected.bgColor, border: `2px solid ${selected.color}44`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{selected.logo}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800 }}>{selected.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{selected.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'center' }}>
                {[['📋', 'Openings', selected.openings], ['💰', 'Package', selected.package], ['👥', 'Employees', selected.employees]].map(([icon, label, val]) => (
                  <div key={String(label)} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px' }}>
                    <div style={{ fontSize: 18 }}>{icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{val}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            {[['overview','📋 Overview'],['pattern','📊 Exam Pattern'],['experience','💬 Experiences'],['prep','📚 Prep Material']].map(([t, l]) => (
              <button key={t} onClick={() => setActiveTab(t as any)} style={{ padding: '12px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === t ? 'var(--accent-violet)' : 'transparent'}`, color: activeTab === t ? 'var(--accent-violet-light)' : 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: -1 }}>{l}</button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="glass" style={{ padding: '24px', borderRadius: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🗺️ Selection Process</h3>
                {selected.selectionProcess.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: 14 }}>{step}</span>
                  </div>
                ))}
              </div>
              <div className="glass" style={{ padding: '24px', borderRadius: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🎯 Focus Topics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selected.focusTopics.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 8 }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span style={{ fontSize: 13 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pattern' && (
            <div className="glass" style={{ padding: '24px', borderRadius: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Exam Section Breakdown</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Section', 'Questions', 'Duration', 'Marks'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selected.examPattern.sections.map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }} className="table-row">
                        <td style={{ padding: '12px', fontWeight: 600 }}>{s.name}</td>
                        <td style={{ padding: '12px', color: 'var(--accent-violet-light)' }}>{s.questions}</td>
                        <td style={{ padding: '12px', color: '#f59e0b' }}>{s.duration} min</td>
                        <td style={{ padding: '12px', color: '#10b981' }}>{s.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {selected.interviewExps.map((exp, i) => (
                <div key={i} className="glass" style={{ padding: '20px', borderRadius: 14 }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #7c3aed, #ec4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{exp.name[0]}</div>
                    <div><div style={{ fontWeight: 700, fontSize: 14 }}>{exp.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{exp.branch}</div></div>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>"{exp.text}"</p>
                </div>
              ))}
              <div className="glass" style={{ padding: '20px', borderRadius: 14, border: '1px dashed var(--border-bright)', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📝</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>More interview experiences will be added by admin</p>
              </div>
            </div>
          )}

          {activeTab === 'prep' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: '📺', title: 'Video Playlist', desc: 'Admin-added YouTube playlist for ' + selected.shortName + ' prep', action: 'Watch Now', color: '#ef4444' },
                { icon: '📝', title: 'Practice Test', desc: selected.shortName + ' pattern mock test with 90 questions', action: 'Take Test', color: '#7c3aed' },
                { icon: '📄', title: 'PDF Notes', desc: 'Downloadable notes and previous year questions', action: 'Download', color: '#10b981' },
                { icon: '🗺️', title: 'Study Roadmap', desc: '30-day preparation plan for ' + selected.shortName, action: 'View Plan', color: '#f59e0b' },
              ].map(item => (
                <div key={item.title} className="glass hover-lift" style={{ padding: '20px', borderRadius: 14, cursor: 'pointer' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>{item.desc}</p>
                  <button className="btn-primary" style={{ padding: '8px 18px', fontSize: 12, background: `linear-gradient(135deg, ${item.color}, ${item.color}bb)` }}>{item.action} →</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Company grid
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {companies.map(company => (
              <div key={company.id} className="glass hover-lift" style={{ padding: '24px', borderRadius: 16, cursor: 'pointer', border: `1px solid ${company.color}22`, transition: 'all 0.2s' }} onClick={() => { setSelected(company); setActiveTab('overview'); }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 56, height: 56, background: company.bgColor, border: `2px solid ${company.color}44`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{company.logo}</div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800 }}>{company.shortName}</h3>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{company.name}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[['💰', company.package], ['📋', company.openings + ' openings']].map(([icon, val]) => (
                    <div key={String(val)} style={{ background: 'var(--bg-primary)', borderRadius: 8, padding: '8px', fontSize: 12 }}>
                      <span>{icon}</span> <span style={{ color: 'var(--text-secondary)' }}>{val}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{company.description}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {company.focusTopics.slice(0, 3).map(t => (
                    <span key={t} style={{ fontSize: 10, background: 'rgba(124,58,237,0.1)', color: 'var(--accent-violet-light)', padding: '2px 7px', borderRadius: 4 }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
