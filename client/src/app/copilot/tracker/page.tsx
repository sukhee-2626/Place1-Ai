'use client';

import { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Building2, 
  MapPin, 
  Clock, 
  Trash2, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  ChevronLeft,
  BookOpen,
  ArrowRightLeft
} from 'lucide-react';

interface TrackedItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  portal: string;
  status: 'applied' | 'shortlisted' | 'interview' | 'offer';
  dateAdded: string;
  notes?: string;
  interviewDate?: string;
}

const isStuck = (dateStr: string) => {
  try {
    const addedDate = new Date(dateStr);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - addedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 5;
  } catch (e) {
    return false;
  }
};

const getDaysAgo = (dateStr: string) => {
  try {
    const addedDate = new Date(dateStr);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - addedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'today' : `${diffDays}d ago`;
  } catch (e) {
    return '';
  }
};

const defaultTrackerData: TrackedItem[] = [
  {
    id: 't1',
    title: 'Associate Software Engineer (React)',
    company: 'Accenture',
    location: 'Bangalore, India',
    salary: '₹6,50,000 - ₹8,50,000 / year',
    portal: 'Naukri',
    status: 'applied',
    dateAdded: '2026-06-18',
    notes: 'ATS optimization score was 92%. Awaiting response.'
  },
  {
    id: 't2',
    title: 'Front-End Developer Internship',
    company: 'Zoho Corporation',
    location: 'Chennai, India',
    salary: '₹25,000 / month',
    portal: 'Internshala',
    status: 'interview',
    dateAdded: '2026-06-19',
    notes: 'Technical screening scheduled for 2026-06-25.',
    interviewDate: '2026-06-25 10:00 AM'
  }
];

export default function SmartApplicationTrackerPage() {
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formSalary, setFormSalary] = useState('');
  const [formPortal, setFormPortal] = useState('LinkedIn');
  const [formStatus, setFormStatus] = useState<'applied' | 'shortlisted' | 'interview' | 'offer'>('applied');
  const [formNotes, setFormNotes] = useState('');
  const [formInterviewDate, setFormInterviewDate] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('neopat_tracker_jobs');
    if (data) {
      setItems(JSON.parse(data));
    } else {
      setItems(defaultTrackerData);
      localStorage.setItem('neopat_tracker_jobs', JSON.stringify(defaultTrackerData));
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const saveToStorage = (updatedList: TrackedItem[]) => {
    setItems(updatedList);
    localStorage.setItem('neopat_tracker_jobs', JSON.stringify(updatedList));
  };

  // Move card status
  const moveStatus = (id: string, newStatus: 'applied' | 'shortlisted' | 'interview' | 'offer') => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    saveToStorage(updated);
    triggerToast(`Moved to ${newStatus.toUpperCase()}`);
  };

  // Delete card
  const deleteItem = (id: string) => {
    if (!window.confirm('Delete this tracked application?')) return;
    const updated = items.filter(item => item.id !== id);
    saveToStorage(updated);
    triggerToast('Application removed');
  };

  // Save new custom card
  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCompany.trim()) return;

    const newItem: TrackedItem = {
      id: `tracked-${Date.now()}`,
      title: formTitle,
      company: formCompany,
      location: formLocation || 'Remote',
      salary: formSalary || 'Not specified',
      portal: formPortal,
      status: formStatus,
      dateAdded: new Date().toLocaleDateString(),
      notes: formNotes,
      interviewDate: formInterviewDate ? formInterviewDate.replace('T', ' ') : undefined
    };

    const updated = [...items, newItem];
    saveToStorage(updated);
    
    // Reset form
    setFormTitle('');
    setFormCompany('');
    setFormLocation('');
    setFormSalary('');
    setFormNotes('');
    setFormInterviewDate('');
    setShowAddModal(false);
    triggerToast('Added job to tracking board!');
  };

  const columns: { key: 'applied' | 'shortlisted' | 'interview' | 'offer'; label: string; color: string }[] = [
    { key: 'applied', label: 'APPLIED', color: 'var(--text-secondary)' },
    { key: 'shortlisted', label: 'SHORTLISTED', color: 'var(--accent-cyan-light)' },
    { key: 'interview', label: 'INTERVIEW', color: 'var(--accent-amber-light)' },
    { key: 'offer', label: 'OFFERS RECEIVED', color: 'var(--accent-emerald-light)' }
  ];

  const upcomingInterviews = items.filter(item => item.status === 'interview' && item.interviewDate);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }} className="animate-fadeInUp">
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1100,
          background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)',
          borderRadius: 8, padding: '12px 20px', fontSize: 13, color: '#fff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 8,
          backdropFilter: 'blur(8px)', animation: 'fadeInUp 0.15s ease'
        }}>
          <Layers size={14} style={{ color: 'var(--accent-violet-light)' }} />
          <span>{toast}</span>
        </div>
      )}

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Layers size={24} style={{ color: 'var(--accent-violet-light)' }} />
            <span>Smart Application Tracker</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Track application funnels persistently. Drag or toggle cards to follow status roadmaps.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary" 
          style={{ fontSize: 13 }}
        >
          <Plus size={15} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Board Statistics HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }} className="responsive-grid">
        <div className="glass" style={{ borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Tracked</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 2 }}>{items.length} Jobs</div>
        </div>
        <div className="glass" style={{ borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Shortlisted</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-cyan-light)', marginTop: 2 }}>
            {items.filter(i => i.status === 'shortlisted').length} Companies
          </div>
        </div>
        <div className="glass" style={{ borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Interviews</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-amber-light)', marginTop: 2 }}>
            {items.filter(i => i.status === 'interview').length} Scheduled
          </div>
        </div>
        <div className="glass" style={{ borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Offers Secured</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-emerald-light)', marginTop: 2 }}>
            {items.filter(i => i.status === 'offer').length} Received 🎉
          </div>
        </div>
      </div>

      {/* Interview Alerts Dashboard */}
      {upcomingInterviews.length > 0 && (
        <div className="glass" style={{ borderRadius: 12, padding: '16px 20px', border: '1px solid rgba(217,119,6,0.2)', background: 'rgba(217,119,6,0.03)', marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-amber-light)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Calendar size={14} />
            <span>Upcoming Interview Reminders</span>
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {upcomingInterviews.map(int => (
              <div key={int.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontSize: 12.5, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{int.company}</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span>{int.title}</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ color: 'var(--accent-amber-light)', fontWeight: 600 }}>{int.interviewDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Board Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'flex-start' }}>
        {columns.map(col => {
          const colItems = items.filter(item => item.status === col.key);
          
          return (
            <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px' }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: col.color, letterSpacing: '0.04em' }}>{col.label}</span>
                <span style={{ background: 'var(--border-bright)', color: 'var(--text-secondary)', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
                  {colItems.length}
                </span>
              </div>

              {/* Cards Container */}
              <div style={{
                background: 'rgba(12, 12, 14, 0.3)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 10, minHeight: 480, display: 'flex', flexDirection: 'column', gap: 10
              }}>
                {colItems.length === 0 ? (
                  <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 11.5 }}>
                    No applications
                  </div>
                ) : (
                  colItems.map(item => (
                    <div 
                      key={item.id} 
                      className="glass hover-lift" 
                      style={{ borderRadius: 8, padding: 12, border: '1px solid var(--border)', background: 'rgba(18,18,20,0.85)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 170 }}>{item.title}</h4>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.6 }}
                          onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 11, marginBottom: 8 }}>
                        <Building2 size={10} />
                        <span style={{ fontWeight: 600 }}>{item.company}</span>
                        <span>•</span>
                        <span>{item.portal}</span>
                      </div>

                      {item.salary && item.salary !== 'Not specified' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 10.5, marginBottom: 6 }}>
                          <DollarSign size={9} />
                          <span>{item.salary}</span>
                        </div>
                      )}

                      {item.interviewDate && (
                        <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)', borderRadius: 4, padding: '3px 6px', fontSize: 10, color: 'var(--accent-amber-light)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                          <Clock size={10} />
                          <span>{item.interviewDate}</span>
                        </div>
                      )}

                      {item.notes && (
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {item.notes}
                        </p>
                      )}

                      {/* Time elapsed & Stuck warnings */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 10 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Added {getDaysAgo(item.dateAdded)}</span>
                        {item.status === 'applied' && isStuck(item.dateAdded) && (
                          <span style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.15)', color: 'var(--accent-amber-light)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>⚠️ STUCK (&gt;5d)</span>
                        )}
                      </div>

                      {/* Manual Move Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 8 }}>
                        <button
                          disabled={col.key === 'applied'}
                          onClick={() => {
                            const steps: ('applied' | 'shortlisted' | 'interview' | 'offer')[] = ['applied', 'shortlisted', 'interview', 'offer'];
                            const prevStep = steps[steps.indexOf(col.key) - 1];
                            moveStatus(item.id, prevStep);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', opacity: col.key === 'applied' ? 0.3 : 1 }}
                        >
                          <ChevronLeft size={12} />
                          <span>Prev</span>
                        </button>
                        
                        <button
                          disabled={col.key === 'offer'}
                          onClick={() => {
                            const steps: ('applied' | 'shortlisted' | 'interview' | 'offer')[] = ['applied', 'shortlisted', 'interview', 'offer'];
                            const nextStep = steps[steps.indexOf(col.key) + 1];
                            moveStatus(item.id, nextStep);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', opacity: col.key === 'offer' ? 0.3 : 1 }}
                        >
                          <span>Next</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Application Modal Sheet */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="glass-bright" style={{ width: '100%', maxWidth: 500, borderRadius: 14, border: '1px solid var(--border-bright)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Track Custom Application</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCard} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>JOB TITLE *</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>COMPANY NAME *</label>
                <input 
                  type="text" 
                  value={formCompany}
                  onChange={e => setFormCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="input-field"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>LOCATION</label>
                  <input 
                    type="text" 
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    placeholder="e.g. Bangalore / Remote"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>SALARY BRACKET</label>
                  <input 
                    type="text" 
                    value={formSalary}
                    onChange={e => setFormSalary(e.target.value)}
                    placeholder="e.g. 12 LPA"
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>SOURCE PORTAL</label>
                  <select 
                    value={formPortal} 
                    onChange={e => setFormPortal(e.target.value)} 
                    className="input-field"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Naukri">Naukri</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Foundit">Foundit</option>
                    <option value="Internshala">Internshala</option>
                    <option value="Direct Career Site">Direct Career Site</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>INITIAL STAGE</label>
                  <select 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value as any)} 
                    className="input-field"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer Received</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>INTERVIEW DATE (IF SCHEDULED)</label>
                <input 
                  type="datetime-local" 
                  value={formInterviewDate}
                  onChange={e => setFormInterviewDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>COMMENTS / NOTES</label>
                <textarea 
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Log HR contact emails or application reference numbers..."
                  className="input-field"
                  rows={2}
                  style={{ resize: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ padding: '6px 14px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '6px 14px' }}>Track Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
