'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Building2, 
  ExternalLink, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Briefcase, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  portal: 'LinkedIn' | 'Indeed' | 'Naukri' | 'Foundit' | 'Internshala';
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  salary: string;
  posted: string;
  matchScore: number;
  skillsMatched: string[];
  skillsMissing: string[];
  description: string;
}

const mockJobsPool: Job[] = [
  {
    id: 'j1',
    title: 'Associate Software Engineer (React)',
    company: 'Accenture',
    location: 'Bangalore, India',
    portal: 'Naukri',
    type: 'Full-time',
    salary: '₹6,50,000 - ₹8,50,000 / year',
    posted: '1 day ago',
    matchScore: 92,
    skillsMatched: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
    skillsMissing: ['TypeScript'],
    description: 'We are looking for a passionate Associate Software Engineer to build beautiful, responsive web applications using React.js. You will collaborate with cross-functional teams to design, write, and test high-quality code. Requirements: Solid JavaScript foundation, React lifecycle knowledge, Git version control, and responsive styling. Experience with Next.js is a plus.'
  },
  {
    id: 'j2',
    title: 'Front-End Developer Internship',
    company: 'Zoho Corporation',
    location: 'Chennai, India',
    portal: 'Internshala',
    type: 'Internship',
    salary: '₹25,000 / month',
    posted: 'Just now',
    matchScore: 85,
    skillsMatched: ['JavaScript', 'HTML5', 'CSS3', 'Git'],
    skillsMissing: ['React', 'REST APIs'],
    description: 'Join Zoho as a Front-End Developer Intern. Work closely with product teams to build clean user interfaces. Requirements: Strong HTML/CSS skill, core vanilla JS concepts, document object manipulation, and attention to visual detail. You will get hands-on training on enterprise cloud modules.'
  },
  {
    id: 'j3',
    title: 'Full Stack Engineer (Node & React)',
    company: 'Amazon',
    location: 'Hyderabad, India (Hybrid)',
    portal: 'LinkedIn',
    type: 'Full-time',
    salary: '₹18,00,000 - ₹24,00,000 / year',
    posted: '3 days ago',
    matchScore: 78,
    skillsMatched: ['React', 'JavaScript', 'SQL', 'Git'],
    skillsMissing: ['Node.js', 'AWS', 'Docker', 'REST APIs'],
    description: 'Amazon Prime Video team is seeking a Full Stack Software Development Engineer. You will drive UX design and backend API architecture for global streaming modules. Core Tech: React, Node.js, Express, PostgreSQL, AWS Lambda, and DynamoDB.'
  },
  {
    id: 'j4',
    title: 'Software Developer (SQL & C++)',
    company: 'Infosys',
    location: 'Pune, India',
    portal: 'Indeed',
    type: 'Full-time',
    salary: '₹4,50,000 - ₹6,0,000 / year',
    posted: '2 days ago',
    matchScore: 70,
    skillsMatched: ['SQL', 'Git'],
    skillsMissing: ['C++', 'Data Structures', 'Algorithms'],
    description: 'Infosys is hiring a Software Associate for system modernization projects. Responsibilities: writing database queries, optimizing procedures, and supporting applications built in C++. Candidate should have sound SQL knowledge.'
  },
  {
    id: 'j5',
    title: 'Junior React Developer',
    company: 'TCS',
    location: 'Kolkata, India',
    portal: 'Foundit',
    type: 'Full-time',
    salary: '₹3,80,000 - ₹5,00,000 / year',
    posted: '5 days ago',
    matchScore: 90,
    skillsMatched: ['React', 'JavaScript', 'HTML5', 'CSS3'],
    skillsMissing: ['REST APIs', 'Git'],
    description: 'We are seeking Junior Developers with expertise in building responsive single-page applications. Essential: React functional components, hooks state management, CSS layouts (Flexbox/Grid), and connecting to backend services.'
  },
  {
    id: 'j6',
    title: 'Full-Stack Developer (MERN)',
    company: 'Wipro',
    location: 'Noida, India',
    portal: 'Naukri',
    type: 'Full-time',
    salary: '₹5,50,000 - ₹7,20,000 / year',
    posted: '4 days ago',
    matchScore: 75,
    skillsMatched: ['React', 'JavaScript', 'SQL', 'Git'],
    skillsMissing: ['Node.js', 'MongoDB', 'Express'],
    description: 'Looking for MERN stack developers to migrate legacy application systems. Knowledge of database design, state management, API routes, and cloud hosting is required.'
  }
];

export default function AIJobDiscoveryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedPortals, setSelectedPortals] = useState<string[]>(['LinkedIn', 'Naukri', 'Indeed', 'Foundit', 'Internshala']);
  const [jobs, setJobs] = useState<Job[]>(mockJobsPool);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>('j1');
  const [toast, setToast] = useState<string | null>(null);

  // AI Scanning HUD states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');

  // Load saved jobs & tracker from localStorage to check existing states
  useEffect(() => {
    const saved = localStorage.getItem('neopat_saved_jobs');
    if (saved) setSavedJobs(JSON.parse(saved));
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = () => {
    setIsScanning(true);
    setScanStatus('Connecting to remote API gateways...');
    setTimeout(() => {
      setScanStatus('Aggregating listings across 5 job portals...');
      setTimeout(() => {
        setScanStatus('Re-ranking results based on matching skills...');
        setTimeout(() => {
          setIsScanning(false);
          triggerToast('Re-indexed 6 matching job profiles!');
        }, 500);
      }, 500);
    }, 450);
  };

  const handlePortalToggle = (portalName: string) => {
    if (selectedPortals.includes(portalName)) {
      setSelectedPortals(selectedPortals.filter(p => p !== portalName));
    } else {
      setSelectedPortals([...selectedPortals, portalName]);
    }
  };

  const toggleSaveJob = (id: string) => {
    let updated;
    if (savedJobs.includes(id)) {
      updated = savedJobs.filter(savedId => savedId !== id);
      triggerToast('Removed from bookmarks');
    } else {
      updated = [...savedJobs, id];
      triggerToast('Bookmarked job opportunity!');
    }
    setSavedJobs(updated);
    localStorage.setItem('neopat_saved_jobs', JSON.stringify(updated));
  };

  // Add job directly to Smart Kanban Tracker
  const handleAddToTracker = (job: Job) => {
    const trackerData = localStorage.getItem('neopat_tracker_jobs');
    let currentTracker = [];
    if (trackerData) {
      currentTracker = JSON.parse(trackerData);
    }
    
    // Check if already in tracker
    const exists = currentTracker.some((t: any) => t.jobId === job.id || (t.title === job.title && t.company === job.company));
    if (exists) {
      triggerToast('Already in your Application Tracker!');
      return;
    }

    const newTrackedItem = {
      id: `tracked-${Date.now()}`,
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      portal: job.portal,
      status: 'applied', // Initial Kanban Column
      dateAdded: new Date().toLocaleDateString(),
      notes: 'Added from AI Job Discovery Console.',
      interviewDate: ''
    };

    const updatedTracker = [...currentTracker, newTrackedItem];
    localStorage.setItem('neopat_tracker_jobs', JSON.stringify(updatedTracker));
    triggerToast('Added to Smart Application Tracker!');
  };

  // Send parameters to Resume Optimizer
  const handleOptimizeResume = (job: Job) => {
    const params = new URLSearchParams();
    params.set('title', job.title);
    params.set('company', job.company);
    params.set('desc', job.description);
    params.set('skills', [...job.skillsMatched, ...job.skillsMissing].join(','));
    router.push(`/copilot/resume?${params.toString()}`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.skillsMatched.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          job.skillsMissing.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
                          
    const matchesLoc = job.location.toLowerCase().includes(locationTerm.toLowerCase());
    const matchesPortal = selectedPortals.includes(job.portal);
    
    return matchesSearch && matchesLoc && matchesPortal;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }} className="animate-fadeInUp">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1100,
          background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)',
          borderRadius: 8, padding: '12px 20px', fontSize: 13, color: '#fff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 8,
          backdropFilter: 'blur(8px)', animation: 'fadeInUp 0.15s ease'
        }}>
          <Sparkles size={14} style={{ color: 'var(--accent-violet-light)' }} />
          <span>{toast}</span>
        </div>
      )}

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Briefcase size={24} style={{ color: 'var(--accent-violet-light)' }} />
            <span>AI Job Discovery</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Aggregating opportunities across LinkedIn, Naukri, Indeed, Foundit, and Internshala with AI skill matching.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 8, background: 'rgba(109,40,217,0.06)', border: '1px solid rgba(109,40,217,0.15)', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, color: 'var(--accent-violet-light)', alignItems: 'center' }}>
          <TrendingUp size={14} />
          <span>AI Recommendations Engine Active</span>
        </div>
      </div>

      {/* Search Bar Grid */}
      <div className="glass" style={{ borderRadius: 14, padding: 20, marginBottom: 24, border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 180px', gap: 12, marginBottom: 16 }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search jobs by title, company, or skills (e.g. React, SQL)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 38 }}
            />
          </div>

          {/* Location Search */}
          <div style={{ position: 'relative' }}>
            <MapPin size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter by city or remote..."
              value={locationTerm}
              onChange={e => setLocationTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 38 }}
            />
          </div>
          <button 
            onClick={handleSearch} 
            disabled={isScanning}
            className="btn-primary" 
            style={{ height: '100%', fontSize: 13, gap: 6 }}
          >
            {isScanning ? <RefreshCw size={13} className="animate-spin-fast" /> : <Search size={13} />}
            <span>{isScanning ? 'Searching...' : 'Find Jobs'}</span>
          </button>
        </div>

        {/* Real-time Scanning HUD feedback */}
        {isScanning && (
          <div className="animate-fadeInUp" style={{ 
            background: 'rgba(109,40,217,0.04)', border: '1px dashed rgba(167,139,250,0.3)', 
            borderRadius: 6, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 12, color: 'var(--accent-violet-light)', fontFamily: 'monospace'
          }}>
            <RefreshCw size={13} className="animate-spin-fast" />
            <span style={{ fontWeight: 600 }}>AI STATUS:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{scanStatus}</span>
          </div>
        )}

        {/* Portal Filter Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginRight: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source Portals:</span>
          {['LinkedIn', 'Naukri', 'Indeed', 'Foundit', 'Internshala'].map(portalName => {
            const isSelected = selectedPortals.includes(portalName);
            return (
              <button
                key={portalName}
                onClick={() => handlePortalToggle(portalName)}
                style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, border: '1px solid', cursor: 'pointer',
                  background: isSelected ? 'var(--text-primary)' : 'var(--bg-secondary)',
                  borderColor: isSelected ? 'var(--text-primary)' : 'var(--border)',
                  color: isSelected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.12s'
                }}
              >
                {portalName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Console View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: 20, alignItems: 'flex-start' }}>
        
        {/* Left Side: Jobs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
            SEARCH RESULTS ({filteredJobs.length} JOBS)
          </div>
          
          {filteredJobs.length === 0 ? (
            <div className="glass" style={{ borderRadius: 12, padding: '40px 20px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <AlertCircle size={24} style={{ color: 'var(--text-muted)', marginBottom: 8, opacity: 0.5 }} />
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>No matching jobs found</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>Try broadening your search keywords or checking other portal sources.</p>
            </div>
          ) : (
            filteredJobs.map(job => {
              const isSelected = expandedJobId === job.id;
              const isSaved = savedJobs.includes(job.id);
              
              return (
                <div
                  key={job.id}
                  onClick={() => setExpandedJobId(job.id)}
                  className="glass hover-lift"
                  style={{
                    borderRadius: 12, padding: 16, border: `1px solid ${isSelected ? 'var(--accent-violet-light)' : 'var(--border)'}`,
                    cursor: 'pointer', position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#fff' }}>{job.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>
                        <span>{job.company}</span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <MapPin size={11} />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    
                    {/* Compatibility Rating Badge */}
                    <div style={{
                      background: job.matchScore >= 90 ? 'rgba(5, 150, 105, 0.08)' : job.matchScore >= 80 ? 'rgba(217,119,6,0.08)' : 'rgba(109,40,217,0.08)',
                      color: job.matchScore >= 90 ? 'var(--accent-emerald-light)' : job.matchScore >= 80 ? 'var(--accent-amber-light)' : 'var(--accent-violet-light)',
                      border: `1px solid ${job.matchScore >= 90 ? 'rgba(5, 150, 105, 0.2)' : job.matchScore >= 80 ? 'rgba(217,119,6,0.2)' : 'rgba(109,40,217,0.2)'}`,
                      borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 800, textAlign: 'center'
                    }}>
                      {job.matchScore}% Match
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                        {job.portal}
                      </span>
                      <span>{job.posted}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--accent-violet-light)' : 'var(--text-muted)' }}
                      >
                        {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Detailed Panel */}
        <div style={{ position: 'sticky', top: 80 }}>
          {expandedJobId ? (
            (() => {
              const activeJob = jobs.find(j => j.id === expandedJobId);
              if (!activeJob) return null;
              
              return (
                <div className="glass animate-fadeInUp" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border-bright)' }}>
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 18, marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 10.5, background: 'rgba(109,40,217,0.12)', color: 'var(--accent-violet-light)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, display: 'inline-block' }}>
                          {activeJob.type}
                        </span>
                        <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>{activeJob.title}</h2>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent-violet-light)' }}>{activeJob.matchScore}%</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>Match rating</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, color: 'var(--text-secondary)', fontSize: 12.5, marginTop: 10 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Building2 size={13} />
                        {activeJob.company}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} />
                        {activeJob.location}
                      </span>
                      <span>•</span>
                      <span>{activeJob.salary}</span>
                    </div>
                  </div>

                  {/* Skills Compatibility Section */}
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 18 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>AI Skill Compatibility Checklist</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {/* Matched */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--accent-emerald-light)', fontWeight: 700, marginRight: 4 }}>✓ Matched:</span>
                        {activeJob.skillsMatched.map(s => (
                          <span key={s} style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)', color: 'var(--accent-emerald-light)', fontSize: 10.5, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>

                      {/* Missing */}
                      {activeJob.skillsMissing.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 4 }}>
                          <span style={{ fontSize: 11, color: 'var(--accent-danger-light)', fontWeight: 700, marginRight: 4 }}>✗ Gaps:</span>
                          {activeJob.skillsMissing.map(s => (
                            <span key={s} style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', color: 'var(--accent-danger-light)', fontSize: 10.5, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Role Description</h4>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                      {activeJob.description}
                    </p>
                  </div>

                  {/* Action Group */}
                  <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 18 }}>
                    <button 
                      onClick={() => handleOptimizeResume(activeJob)}
                      className="btn-primary" 
                      style={{ flex: 1, fontSize: 12.5, gap: 6 }}
                    >
                      <Sparkles size={14} />
                      <span>Optimize Resume for Job</span>
                    </button>
                    
                    <button 
                      onClick={() => handleAddToTracker(activeJob)}
                      className="btn-secondary" 
                      style={{ flex: 1, fontSize: 12.5, gap: 6 }}
                    >
                      <Bookmark size={14} />
                      <span>Track Application</span>
                    </button>
                  </div>
                  
                  {/* External Portal Redirect Link */}
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(activeJob.company + " " + activeJob.title)}`}
                    target="_blank" 
                    rel="noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', marginTop: 12,
                      fontWeight: 600, transition: 'color 0.15s'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <span>View original posting on {activeJob.portal}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              );
            })()
          ) : (
            <div className="glass" style={{ borderRadius: 14, padding: 60, textAlign: 'center', border: '1px solid var(--border)' }}>
              <SlidersHorizontal size={36} style={{ color: 'var(--text-muted)', marginBottom: 12, opacity: 0.4 }} />
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Select a Job Opportunity</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, marginTop: 4 }}>Click on any job card in the list to reveal compatibility audits and resume tailoring functions.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
