'use client';
import { useState } from 'react';

// These courses will be managed by admin via the admin panel.
// YouTube links are embedded (not copied — just linked).
// Replace ytId values with your actual YouTube video/playlist IDs.
const courses = [
  // ─── DSA ────────────────────────────────────────────────────────
  {
    id: 'dsa-arrays', category: 'dsa', type: 'playlist', level: 'beginner',
    title: 'Arrays – Complete Guide', instructor: 'Place1 AI', duration: '3h 20m',
    thumbnail: '📦', description: 'From basics to advanced array problems. Covers sliding window, two pointers, prefix sum.',
    ytId: 'PLACEHOLDER_ARRAYS_YT_ID',  // ← Admin adds via panel
    tags: ['Arrays', 'Sliding Window', 'Two Pointers'],
    company: null, rating: 4.8, enrolled: 1240,
  },
  {
    id: 'dsa-strings', category: 'dsa', type: 'playlist', level: 'beginner',
    title: 'Strings – Pattern & Manipulation', instructor: 'Place1 AI', duration: '2h 45m',
    thumbnail: '🔤', description: 'String manipulation, pattern matching, KMP, Rabin-Karp.',
    ytId: 'PLACEHOLDER_STRINGS_YT_ID',
    tags: ['Strings', 'KMP', 'Pattern Matching'],
    company: null, rating: 4.7, enrolled: 980,
  },
  {
    id: 'dsa-linkedlist', category: 'dsa', type: 'playlist', level: 'intermediate',
    title: 'Linked Lists – Full Playlist', instructor: 'Place1 AI', duration: '2h 10m',
    thumbnail: '🔗', description: 'Singly, doubly, circular linked lists. Reversal, cycle detection, merge.',
    ytId: 'PLACEHOLDER_LL_YT_ID',
    tags: ['Linked List', 'Floyd Cycle', 'Reversal'],
    company: null, rating: 4.6, enrolled: 856,
  },
  {
    id: 'dsa-trees', category: 'dsa', type: 'playlist', level: 'intermediate',
    title: 'Trees & Binary Search Trees', instructor: 'Place1 AI', duration: '4h 30m',
    thumbnail: '🌳', description: 'BST, AVL trees, traversals, LCA, diameter, height problems.',
    ytId: 'PLACEHOLDER_TREES_YT_ID',
    tags: ['Trees', 'BST', 'DFS', 'BFS'],
    company: null, rating: 4.9, enrolled: 1560,
  },
  {
    id: 'dsa-graphs', category: 'dsa', type: 'playlist', level: 'advanced',
    title: 'Graph Algorithms – BFS, DFS, Dijkstra', instructor: 'Place1 AI', duration: '5h 15m',
    thumbnail: '🕸️', description: "BFS, DFS, Dijkstra's, Floyd Warshall, Topological Sort, Union-Find.",
    ytId: 'PLACEHOLDER_GRAPHS_YT_ID',
    tags: ['Graphs', 'Dijkstra', 'BFS', 'DFS', 'Topological Sort'],
    company: null, rating: 4.8, enrolled: 1120,
  },
  {
    id: 'dsa-dp', category: 'dsa', type: 'playlist', level: 'advanced',
    title: 'Dynamic Programming – Zero to Hero', instructor: 'Place1 AI', duration: '6h 00m',
    thumbnail: '🧮', description: 'Memoization, tabulation, knapsack, LCS, LIS, coin change and 50+ DP problems.',
    ytId: 'PLACEHOLDER_DP_YT_ID',
    tags: ['DP', 'Knapsack', 'LCS', 'Memoization'],
    company: null, rating: 4.9, enrolled: 2100,
  },
  {
    id: 'dsa-sql', category: 'dsa', type: 'playlist', level: 'beginner',
    title: 'SQL for Placements', instructor: 'Place1 AI', duration: '2h 30m',
    thumbnail: '🗄️', description: 'SELECT, JOINs, GROUP BY, subqueries, window functions. Practice with real problems.',
    ytId: 'PLACEHOLDER_SQL_YT_ID',
    tags: ['SQL', 'Joins', 'Subqueries'],
    company: null, rating: 4.7, enrolled: 1450,
  },
  // ─── APTITUDE ───────────────────────────────────────────────────
  {
    id: 'apt-quant', category: 'aptitude', type: 'playlist', level: 'beginner',
    title: 'Quantitative Aptitude – Full Course', instructor: 'Place1 AI', duration: '4h 40m',
    thumbnail: '🔢', description: 'Profit & Loss, Time & Work, Speed-Distance, Percentages, Probability and more.',
    ytId: 'PLACEHOLDER_QUANT_YT_ID',
    tags: ['Profit Loss', 'Time Work', 'Percentages'],
    company: null, rating: 4.8, enrolled: 3200,
  },
  {
    id: 'apt-reasoning', category: 'aptitude', type: 'playlist', level: 'beginner',
    title: 'Logical Reasoning – Complete Guide', instructor: 'Place1 AI', duration: '3h 10m',
    thumbnail: '🧩', description: 'Puzzles, Blood Relations, Seating Arrangement, Number Series, Coding-Decoding.',
    ytId: 'PLACEHOLDER_LOGIC_YT_ID',
    tags: ['Puzzles', 'Seating', 'Blood Relations'],
    company: null, rating: 4.7, enrolled: 2800,
  },
  {
    id: 'apt-verbal', category: 'aptitude', type: 'playlist', level: 'beginner',
    title: 'Verbal Ability – Synonyms, Grammar, RC', instructor: 'Place1 AI', duration: '2h 50m',
    thumbnail: '📖', description: 'Reading Comprehension, Synonyms/Antonyms, Grammar rules, Sentence Correction.',
    ytId: 'PLACEHOLDER_VERBAL_YT_ID',
    tags: ['Reading Comprehension', 'Grammar', 'Synonyms'],
    company: null, rating: 4.5, enrolled: 1900,
  },
  // ─── COMMUNICATION ───────────────────────────────────────────────
  {
    id: 'comm-spoken', category: 'communication', type: 'playlist', level: 'beginner',
    title: 'Spoken English for Placements', instructor: 'Place1 AI', duration: '3h 20m',
    thumbnail: '🎤', description: 'Fluency, pronunciation, professional vocabulary, telephone & email English.',
    ytId: 'PLACEHOLDER_SPOKEN_YT_ID',
    tags: ['Spoken English', 'Fluency', 'Pronunciation'],
    company: null, rating: 4.6, enrolled: 2200,
  },
  {
    id: 'comm-hr', category: 'communication', type: 'playlist', level: 'beginner',
    title: 'HR Interview Mastery', instructor: 'Place1 AI', duration: '2h 00m',
    thumbnail: '🤝', description: 'Tell me about yourself, strengths/weaknesses, STAR method, salary negotiation.',
    ytId: 'PLACEHOLDER_HR_YT_ID',
    tags: ['HR Interview', 'STAR Method', 'Body Language'],
    company: null, rating: 4.8, enrolled: 3500,
  },
  // ─── COMPANY SPECIFIC ────────────────────────────────────────────
  {
    id: 'comp-tcs', category: 'company-prep', type: 'playlist', level: 'intermediate',
    title: 'TCS NQT – Complete Preparation', instructor: 'Place1 AI', duration: '5h 30m',
    thumbnail: '🏢', description: 'TCS NQT pattern, Numerical Ability, Verbal, Reasoning, Programming Logic & coding sections.',
    ytId: 'PLACEHOLDER_TCS_YT_ID', company: 'TCS',
    tags: ['TCS', 'NQT', 'Programming Logic'],
    rating: 4.9, enrolled: 4200,
  },
  {
    id: 'comp-infosys', category: 'company-prep', type: 'playlist', level: 'intermediate',
    title: 'Infosys InfyTQ – Full Prep', instructor: 'Place1 AI', duration: '4h 00m',
    thumbnail: '🏢', description: 'Infosys exam pattern, Reasoning Math, Verbal English, Pseudocode sections.',
    ytId: 'PLACEHOLDER_INFOSYS_YT_ID', company: 'Infosys',
    tags: ['Infosys', 'InfyTQ', 'Pseudocode'],
    rating: 4.7, enrolled: 3100,
  },
  {
    id: 'comp-zoho', category: 'company-prep', type: 'playlist', level: 'advanced',
    title: 'Zoho – Coding & Problem Solving', instructor: 'Place1 AI', duration: '4h 30m',
    thumbnail: '🏢', description: 'Zoho selection process, General Aptitude, Programming rounds with detailed solutions.',
    ytId: 'PLACEHOLDER_ZOHO_YT_ID', company: 'Zoho',
    tags: ['Zoho', 'Coding Round', 'Programming'],
    rating: 4.8, enrolled: 2600,
  },
];

const categories = [
  { id: 'all', label: 'All Courses', icon: '🎓' },
  { id: 'dsa', label: 'DSA & Coding', icon: '💻' },
  { id: 'aptitude', label: 'Aptitude', icon: '🔢' },
  { id: 'communication', label: 'Communication', icon: '🗣️' },
  { id: 'company-prep', label: 'Company Prep', icon: '🏢' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ fontSize: 12, color: '#f59e0b', marginLeft: 4 }}>{rating}</span>
    </div>
  );
}

function CourseModal({ course, onClose }: { course: typeof courses[0]; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 700, borderRadius: 20, overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* YouTube embed */}
        <div style={{ background: '#000', aspectRatio: '16/9', width: '100%', position: 'relative' }}>
          {course.ytId && !course.ytId.startsWith('PLACEHOLDER') ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${course.ytId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none', position: 'absolute', inset: 0 }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ fontSize: 56 }}>{course.thumbnail}</div>
              <div style={{ color: 'white', fontSize: 15, fontWeight: 600 }}>{course.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>YouTube link will be added by admin</div>
            </div>
          )}
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>{course.title}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {course.tags.map(tag => (
              <span key={tag} style={{ fontSize: 11, background: 'rgba(124,58,237,0.1)', color: 'var(--accent-violet-light)', border: '1px solid rgba(124,58,237,0.2)', padding: '3px 8px', borderRadius: 4 }}>{tag}</span>
            ))}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{course.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
            {[['⏱', course.duration], ['👥', `${course.enrolled.toLocaleString()} enrolled`], ['⭐', `${course.rating} rating`]].map(([icon, val]) => (
              <div key={String(val)} style={{ background: 'var(--bg-primary)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const filtered = courses.filter(c =>
    (category === 'all' || c.category === category) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div>
      {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>🎓 Courses & Videos</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>YouTube-powered learning — watch, track progress, bookmark</p>
        </div>
        <input
          type="text"
          placeholder="🔍 Search courses..."
          className="input-field"
          style={{ width: 220, padding: '8px 14px', fontSize: 13 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: category === cat.id ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'var(--bg-card)', borderColor: category === cat.id ? 'transparent' : 'var(--border)', color: category === cat.id ? 'white' : 'var(--text-secondary)' }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Courses', val: courses.length, icon: '🎓' },
          { label: 'Video Hours', val: '60+', icon: '⏱' },
          { label: 'Enrolled', val: '25K+', icon: '👥' },
          { label: 'Bookmarked', val: bookmarked.length, icon: '🔖' },
        ].map(s => (
          <div key={s.label} className="glass" style={{ padding: '14px 18px', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Course grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {filtered.map(course => (
          <div key={course.id} className="glass hover-lift" style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
            {/* Thumbnail */}
            <div onClick={() => setSelectedCourse(course)} style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontSize: 56 }}>{course.thumbnail}</span>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 52, height: 52, background: 'rgba(0,0,0,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>▶</div>
              </div>
              <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.8)', color: 'white', fontSize: 11, padding: '3px 8px', borderRadius: 4 }}>{course.duration}</div>
            </div>

            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className={`diff-${course.level === 'beginner' ? 'easy' : course.level === 'intermediate' ? 'medium' : 'hard'}`} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>{course.level.toUpperCase()}</span>
                <button onClick={e => { e.stopPropagation(); setBookmarked(b => b.includes(course.id) ? b.filter(x => x !== course.id) : [...b, course.id]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                  {bookmarked.includes(course.id) ? '🔖' : '🔖'}
                </button>
              </div>
              <h3 onClick={() => setSelectedCourse(course)} style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>{course.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: '#f59e0b' }}>{'★'.repeat(Math.floor(course.rating))} <span style={{ color: 'var(--text-muted)' }}>{course.rating}</span></div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>👥 {course.enrolled.toLocaleString()}</span>
              </div>
              {course.company && (
                <div style={{ marginTop: 8, fontSize: 11, background: 'rgba(6,182,212,0.1)', color: '#06b6d4', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>🏢 {course.company} Prep</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p>No courses found. Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
