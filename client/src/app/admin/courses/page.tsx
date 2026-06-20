'use client';
import { useState } from 'react';

const categories = ['dsa', 'aptitude', 'communication', 'company-prep'];
const companies = ['TCS', 'Infosys', 'Zoho', 'Wipro', 'Accenture', 'Amazon'];

const initialCourses = [
  { id: '1', title: 'Arrays – Complete Guide', category: 'dsa', type: 'youtube', ytId: '', instructor: 'Place1 AI', duration: '3h 20m', level: 'beginner', published: false },
  { id: '2', title: 'TCS NQT Complete Prep', category: 'company-prep', type: 'youtube', ytId: '', instructor: 'Place1 AI', duration: '5h 30m', level: 'intermediate', published: true },
];

const empty = { title: '', category: 'dsa', type: 'youtube', ytId: '', ytPlaylistId: '', pdfUrl: '', instructor: 'Place1 AI', duration: '', level: 'beginner', description: '', tags: '', company: '', published: false };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const newC = { id: Date.now().toString(), title: form.title, category: form.category, type: form.type, ytId: form.ytId, instructor: form.instructor, duration: form.duration, level: form.level, published: form.published };
    setCourses(prev => [...prev, newC]);
    setForm({ ...empty });
    setShowForm(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const togglePublish = (id: string) => setCourses(prev => prev.map(c => c.id === id ? {...c, published: !c.published} : c));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>🎓 Course Management</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Add YouTube playlists, videos, and PDF resources</p>
        </div>
        <button className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }} onClick={() => setShowForm(true)}>+ Add Course / Video</button>
      </div>

      {saved && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: 10, padding: '10px 16px', marginBottom: 16, color: '#10b981', fontSize: 14 }}>✅ Course saved and ready to publish!</div>}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="glass" style={{ width: '100%', maxWidth: 680, borderRadius: 20, padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>🎓 Add Course / Video</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 22 }}>✕</button>
            </div>

            {/* Type selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 8 }}>CONTENT TYPE *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['youtube', '▶️ YouTube Video'], ['playlist', '📋 YouTube Playlist'], ['pdf', '📄 PDF Resource']].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setForm({...form, type: v as string})} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: form.type === v ? 'rgba(239,68,68,0.15)' : 'transparent', borderColor: form.type === v ? '#ef4444' : 'var(--border)', color: form.type === v ? '#ef4444' : 'var(--text-muted)' }}>{l}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>CATEGORY *</label>
                <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ cursor: 'pointer' }}>
                  <option value="dsa">DSA & Coding</option>
                  <option value="aptitude">Aptitude</option>
                  <option value="communication">Communication</option>
                  <option value="company-prep">Company Prep</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>LEVEL *</label>
                <select className="input-field" value={form.level} onChange={e => setForm({...form, level: e.target.value})} style={{ cursor: 'pointer' }}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>COURSE TITLE *</label>
              <input className="input-field" placeholder="e.g. Arrays – Complete Guide" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>DESCRIPTION</label>
              <textarea className="input-field" placeholder="What students will learn..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} style={{ resize: 'vertical' }} />
            </div>

            {/* YouTube fields */}
            {(form.type === 'youtube' || form.type === 'playlist') && (
              <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '16px', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 10 }}>▶️ YouTube Settings</div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>{form.type === 'playlist' ? 'PLAYLIST ID *' : 'VIDEO ID *'}</label>
                  <input className="input-field" placeholder={form.type === 'playlist' ? 'PLxxxxxx (from youtube.com/playlist?list=PLxxxxxx)' : 'dQw4w9WgXcQ (from youtube.com/watch?v=dQw4w9WgXcQ)'} value={form.type === 'playlist' ? form.ytPlaylistId : form.ytId} onChange={e => setForm({...form, [form.type === 'playlist' ? 'ytPlaylistId' : 'ytId']: e.target.value})} />
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Paste the YouTube video/playlist URL and extract the ID from it</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>INSTRUCTOR / CHANNEL</label>
                    <input className="input-field" value={form.instructor} onChange={e => setForm({...form, instructor: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>TOTAL DURATION</label>
                    <input className="input-field" placeholder="e.g. 3h 20m" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {/* PDF fields */}
            {form.type === 'pdf' && (
              <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '16px', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 10 }}>📄 PDF Settings</div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>PDF URL / FILE PATH *</label>
                  <input className="input-field" placeholder="https://... or /uploads/file.pdf" value={form.pdfUrl} onChange={e => setForm({...form, pdfUrl: e.target.value})} />
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>TAGS (comma-separated)</label>
                <input className="input-field" placeholder="Arrays, Sorting, Two Pointers" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
              </div>
              {form.category === 'company-prep' && (
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>COMPANY</label>
                  <select className="input-field" value={form.company} onChange={e => setForm({...form, company: e.target.value})} style={{ cursor: 'pointer' }}>
                    <option value="">Select Company</option>
                    {companies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <input type="checkbox" id="publish-now" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} style={{ width: 18, height: 18, cursor: 'pointer' }} />
              <label htmlFor="publish-now" style={{ fontSize: 13, cursor: 'pointer' }}>Publish immediately (students can see this course)</label>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ padding: '10px 20px' }} onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={handleSave} disabled={!form.title}>💾 Save Course</button>
            </div>
          </div>
        </div>
      )}

      {/* Course table */}
      <div className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 100px', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>
          {['Title', 'Category', 'Type', 'Level', 'Status', 'Actions'].map(h => <div key={h}>{h}</div>)}
        </div>
        {courses.map(c => (
          <div key={c.id} className="table-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 100px', padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 13 }}>
            <div style={{ fontWeight: 600 }}>{c.title}</div>
            <div style={{ color: 'var(--text-muted)' }}>{c.category}</div>
            <div><span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>▶ {c.type}</span></div>
            <div><span className={`diff-${c.level === 'beginner' ? 'easy' : c.level === 'intermediate' ? 'medium' : 'hard'}`} style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{c.level.toUpperCase()}</span></div>
            <div>
              <button onClick={() => togglePublish(c.id)} style={{ background: c.published ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${c.published ? '#10b981' : '#f59e0b'}`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11, color: c.published ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                {c.published ? '✅ Live' : '⏳ Draft'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 13, color: 'var(--accent-violet-light)' }}>✏️</button>
              <button onClick={() => setCourses(prev => prev.filter(x => x.id !== c.id))} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 13, color: '#ef4444' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
