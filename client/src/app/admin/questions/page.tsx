'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

type QuestionType = 'mcq' | 'coding';
type Difficulty = 'easy' | 'medium' | 'hard';
type Category = 'aptitude' | 'dsa' | 'communication' | 'hr';

const topicMap: Record<Category, string[]> = {
  aptitude: ['Profit & Loss', 'Time & Work', 'Time Speed Distance', 'Percentages', 'Probability', 'Permutation & Combination', 'Averages', 'Ratio & Proportion', 'Puzzles', 'Blood Relations', 'Seating Arrangement', 'Synonyms', 'Grammar', 'Reading Comprehension', 'Data Interpretation', 'Number Series'],
  dsa: ['Basics & Math', 'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'SQL', 'OOPs', 'Stack & Queue', 'Recursion', 'Binary Search', 'Sorting', 'Sliding Window', 'Greedy', 'Heaps', 'Trie'],
  communication: ['Self Introduction', 'HR Questions', 'Email Writing', 'Group Discussion', 'Vocabulary'],
  hr: ['Strengths & Weaknesses', 'Situational Questions', 'Career Goals', 'Company-specific'],
};

const topicToIdMap: Record<string, string> = {
  // Aptitude
  'Profit & Loss': 'profit-loss',
  'Time & Work': 'time-work',
  'Time Speed Distance': 'time-speed',
  'Percentages': 'percentages',
  'Probability': 'probability',
  'Permutation & Combination': 'permutation',
  'Averages': 'averages',
  'Ratio & Proportion': 'ratio',
  'Puzzles': 'puzzles',
  'Blood Relations': 'blood-relations',
  'Seating Arrangement': 'seating',
  'Synonyms': 'synonyms',
  'Grammar': 'grammar',
  'Reading Comprehension': 'reading',
  'Data Interpretation': 'data-interpretation',
  'Number Series': 'number-series',

  // DSA
  'Basics & Math': 'general',
  'Arrays': 'arrays',
  'Strings': 'strings',
  'Linked List': 'linked-list',
  'Trees': 'trees',
  'Graphs': 'graphs',
  'Dynamic Programming': 'dp',
  'SQL': 'sql',
  'OOPs': 'oops',
  'Stack & Queue': 'stack-queue',
  'Recursion': 'recursion',
  'Binary Search': 'binary-search',
  'Sorting': 'sorting',
  'Sliding Window': 'sliding-window',
  'Greedy': 'greedy',
  'Heaps': 'heaps',
  'Trie': 'trie',

  // Communication
  'Self Introduction': 'self-introduction',
  'HR Questions': 'hr-questions',
  'Email Writing': 'email-writing',
  'Group Discussion': 'group-discussion',
  'Vocabulary': 'vocabulary',

  // HR
  'Strengths & Weaknesses': 'strengths-weaknesses',
  'Situational Questions': 'situational-questions',
  'Career Goals': 'career-goals',
  'Company-specific': 'company-specific',
};

const companies = ['TCS', 'Infosys', 'Zoho', 'Wipro', 'Accenture', 'Amazon', 'None'];

const emptyMCQ = { type: 'mcq' as QuestionType, title: '', question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '', difficulty: 'easy' as Difficulty, category: 'aptitude' as Category, topic: '', companies: [] as string[], xpReward: 10 };
const emptyCoding = { type: 'coding' as QuestionType, title: '', description: '', difficulty: 'easy' as Difficulty, category: 'dsa' as Category, topic: '', companies: [] as string[], starterPython: '', starterJava: '', starterCpp: '', testCases: [{ input: '', expected: '' }], constraints: '', xpReward: 30 };

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<QuestionType>('mcq');
  const [mcqForm, setMcqForm] = useState({ ...emptyMCQ });
  const [codingForm, setCodingForm] = useState({ ...emptyCoding });
  const [filter, setFilter] = useState({ category: 'all', difficulty: 'all', type: 'all', search: '' });
  const [saved, setSaved] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'bulk'>('form');

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/questions?limit=1000');
      if (response.data?.success) {
        const mapped = response.data.questions.map((q: any) => ({
          id: q._id,
          type: q.type || 'mcq',
          title: q.title || '',
          topic: Object.keys(topicToIdMap).find(k => topicToIdMap[k] === q.topic) || q.topic || '',
          category: q.category || 'aptitude',
          difficulty: q.difficulty || 'easy',
          companies: q.companies || [],
          raw: q
        }));
        setQuestions(mapped);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filtered = questions.filter(q =>
    (filter.category === 'all' || q.category === filter.category) &&
    (filter.difficulty === 'all' || q.difficulty === filter.difficulty) &&
    (filter.type === 'all' || q.type === filter.type) &&
    (q.title.toLowerCase().includes(filter.search.toLowerCase()))
  );

  const mapQuestionToForm = (q: any) => {
    const raw = q.raw;
    if (q.type === 'mcq') {
      const letters = ['A', 'B', 'C', 'D'];
      return {
        type: 'mcq',
        title: raw.title || '',
        question: raw.description || '',
        optionA: raw.options?.[0] || '',
        optionB: raw.options?.[1] || '',
        optionC: raw.options?.[2] || '',
        optionD: raw.options?.[3] || '',
        correctAnswer: letters[raw.correctAnswer] || 'A',
        explanation: raw.explanation || '',
        difficulty: raw.difficulty || 'easy',
        category: raw.category || 'aptitude',
        topic: q.topic,
        companies: raw.companies || [],
        xpReward: raw.xpReward || 10
      };
    } else {
      return {
        type: 'coding',
        title: raw.title || '',
        description: raw.description || '',
        difficulty: raw.difficulty || 'easy',
        category: raw.category || 'dsa',
        topic: q.topic,
        companies: raw.companies || [],
        starterPython: raw.starterCode?.python || '',
        starterJava: raw.starterCode?.java || '',
        starterCpp: raw.starterCode?.cpp || '',
        testCases: (raw.testCases || []).map((tc: any) => ({
          input: tc.input || '',
          expected: tc.expectedOutput || tc.expected || ''
        })),
        constraints: raw.constraints || '',
        xpReward: raw.xpReward || 30
      };
    }
  };

  const handleEdit = (q: any) => {
    const formVals = mapQuestionToForm(q);
    setEditId(q.id);
    if (q.type === 'mcq') {
      setMcqForm(formVals as any);
      setFormType('mcq');
    } else {
      setCodingForm(formVals as any);
      setFormType('coding');
    }
    setShowForm(true);
    setActiveTab('form');
  };

  const handleSaveMCQ = async () => {
    try {
      const body = {
        type: 'mcq',
        title: mcqForm.title,
        description: mcqForm.question,
        topic: topicToIdMap[mcqForm.topic] || mcqForm.topic.toLowerCase(),
        category: mcqForm.category,
        difficulty: mcqForm.difficulty,
        options: [mcqForm.optionA, mcqForm.optionB, mcqForm.optionC, mcqForm.optionD],
        correctAnswer: ['A', 'B', 'C', 'D'].indexOf(mcqForm.correctAnswer),
        explanation: mcqForm.explanation,
        companies: mcqForm.companies,
        xpReward: mcqForm.xpReward
      };

      if (editId) {
        await api.put(`/questions/${editId}`, body);
      } else {
        await api.post('/questions', body);
      }

      setMcqForm({ ...emptyMCQ });
      setShowForm(false);
      setEditId(null);
      setSaved(true);
      fetchQuestions();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving MCQ question:', err);
      alert('Failed to save question. Make sure backend is running.');
    }
  };

  const handleSaveCoding = async () => {
    try {
      const body = {
        type: 'coding',
        title: codingForm.title,
        description: codingForm.description,
        topic: topicToIdMap[codingForm.topic] || codingForm.topic.toLowerCase(),
        category: codingForm.category,
        difficulty: codingForm.difficulty,
        starterCode: {
          python: codingForm.starterPython,
          java: codingForm.starterJava,
          cpp: codingForm.starterCpp
        },
        testCases: codingForm.testCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expected,
          isHidden: false
        })),
        constraints: codingForm.constraints,
        companies: codingForm.companies,
        xpReward: codingForm.xpReward
      };

      if (editId) {
        await api.put(`/questions/${editId}`, body);
      } else {
        await api.post('/questions', body);
      }

      setCodingForm({ ...emptyCoding });
      setShowForm(false);
      setEditId(null);
      setSaved(true);
      fetchQuestions();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving coding problem:', err);
      alert('Failed to save question. Make sure backend is running.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this question?')) {
      try {
        await api.delete(`/questions/${id}`);
        fetchQuestions();
      } catch (err) {
        console.error('Error deleting question:', err);
        alert('Failed to delete question.');
      }
    }
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        let importedCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
          if (parts.length < 3) continue;

          const [title, question, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty, topic, category] = parts;
          
          if (!title || !question || !category) continue;

          const isMcq = optionA || optionB || optionC || optionD;
          const body: any = {
            title,
            description: question,
            difficulty: difficulty?.toLowerCase() || 'easy',
            topic: topicToIdMap[topic] || topic?.toLowerCase() || 'general',
            category: category?.toLowerCase() || 'aptitude',
            type: isMcq ? 'mcq' : 'coding',
            xpReward: isMcq ? 10 : 30
          };

          if (isMcq) {
            body.options = [optionA || '', optionB || '', optionC || '', optionD || ''];
            body.correctAnswer = ['A', 'B', 'C', 'D'].indexOf(correctAnswer || 'A');
            body.explanation = explanation || '';
          } else {
            body.starterCode = {
              python: 'def solution():\n    pass',
              javascript: 'function solution() {\n}',
              cpp: 'void solution() {\n}',
              java: 'class Solution {\n}'
            };
            body.testCases = [{ input: 'Sample Input', expectedOutput: 'Sample Output', isHidden: false }];
          }

          await api.post('/questions', body);
          importedCount++;
        }

        alert(`Successfully imported ${importedCount} questions!`);
        fetchQuestions();
        setShowForm(false);
      } catch (err: any) {
        console.error('Error importing CSV:', err);
        alert('Failed to parse CSV. Please check formatting.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>❓ Question Bank</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {questions.length} questions • Add MCQs and coding problems
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => { setCodingForm({ ...emptyCoding }); setFormType('coding'); setShowForm(true); setActiveTab('form'); setEditId(null); }}>+ Add Coding Problem</button>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => { setMcqForm({ ...emptyMCQ }); setFormType('mcq'); setShowForm(true); setActiveTab('form'); setEditId(null); }}>+ Add MCQ</button>
        </div>
      </div>

      {saved && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: 10, padding: '10px 16px', marginBottom: 16, color: '#10b981', fontSize: 14 }}>✅ Question saved successfully!</div>}

      {/* Form modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px', overflowY: 'auto' }}>
          <div className="glass" style={{ width: '100%', maxWidth: 780, borderRadius: 20, padding: '28px', marginTop: 20 }}>
            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>
                {editId ? '✏️ Edit Question' : formType === 'mcq' ? '📝 Add MCQ Question' : '💻 Add Coding Problem'}
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {!editId && (['form', 'bulk'] as const).map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: activeTab === t ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent', borderColor: activeTab === t ? 'transparent' : 'var(--border)', color: activeTab === t ? 'white' : 'var(--text-muted)' }}>{t === 'form' ? '📝 Manual' : '📁 Bulk CSV'}</button>
                ))}
                <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 22, marginLeft: 8 }}>✕</button>
              </div>
            </div>

            {activeTab === 'bulk' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Bulk Upload via CSV</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Upload a CSV file with columns: title, question, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty, topic, category</p>
                <div style={{ position: 'relative', border: '2px dashed var(--border-bright)', borderRadius: 12, padding: '40px', cursor: 'pointer', marginBottom: 16 }}>
                  <p style={{ color: 'var(--text-muted)' }}>📎 Drop CSV file here or click to browse</p>
                  <input type="file" accept=".csv" onChange={handleCsvUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>
              </div>
            ) : formType === 'mcq' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>CATEGORY *</label>
                    <select id="q-category" className="input-field" value={mcqForm.category} onChange={e => setMcqForm({...mcqForm, category: e.target.value as Category, topic: ''})} style={{ cursor: 'pointer' }}>
                      <option value="aptitude">Aptitude</option>
                      <option value="dsa">DSA</option>
                      <option value="communication">Communication</option>
                      <option value="hr">HR</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>TOPIC *</label>
                    <select id="q-topic" className="input-field" value={mcqForm.topic} onChange={e => setMcqForm({...mcqForm, topic: e.target.value})} style={{ cursor: 'pointer' }}>
                      <option value="">Select topic</option>
                      {topicMap[mcqForm.category]?.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>DIFFICULTY *</label>
                    <select id="q-difficulty" className="input-field" value={mcqForm.difficulty} onChange={e => setMcqForm({...mcqForm, difficulty: e.target.value as Difficulty})} style={{ cursor: 'pointer' }}>
                      <option value="easy">Easy (+10 XP)</option>
                      <option value="medium">Medium (+20 XP)</option>
                      <option value="hard">Hard (+30 XP)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>QUESTION TITLE *</label>
                  <input id="q-title" className="input-field" placeholder="Short descriptive title" value={mcqForm.title} onChange={e => setMcqForm({...mcqForm, title: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>QUESTION TEXT *</label>
                  <textarea id="q-text" className="input-field" placeholder="Enter the full question here..." value={mcqForm.question} onChange={e => setMcqForm({...mcqForm, question: e.target.value})} rows={3} style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {(['A', 'B', 'C', 'D'] as const).map(opt => (
                    <div key={opt}>
                      <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>OPTION {opt} *</label>
                      <input id={`q-option${opt}`} className="input-field" placeholder={`Option ${opt}`} value={(mcqForm as any)[`option${opt}`]} onChange={e => setMcqForm({...mcqForm, [`option${opt}`]: e.target.value} as any)} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>CORRECT ANSWER *</label>
                    <select id="q-correct" className="input-field" value={mcqForm.correctAnswer} onChange={e => setMcqForm({...mcqForm, correctAnswer: e.target.value})} style={{ cursor: 'pointer' }}>
                      {['A', 'B', 'C', 'D'].map(o => <option key={o} value={o}>Option {o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>COMPANIES (optional)</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {companies.filter(c => c !== 'None').map(c => (
                        <button key={c} type="button" onClick={() => setMcqForm(f => ({ ...f, companies: f.companies.includes(c) ? f.companies.filter(x => x !== c) : [...f.companies, c] }))} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid', fontSize: 11, cursor: 'pointer', background: mcqForm.companies.includes(c) ? 'rgba(6,182,212,0.15)' : 'transparent', borderColor: mcqForm.companies.includes(c) ? '#06b6d4' : 'var(--border)', color: mcqForm.companies.includes(c) ? '#06b6d4' : 'var(--text-muted)', fontWeight: 600 }}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>EXPLANATION *</label>
                  <textarea id="q-explanation" className="input-field" placeholder="Explain why the correct answer is right..." value={mcqForm.explanation} onChange={e => setMcqForm({...mcqForm, explanation: e.target.value})} rows={3} style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" style={{ padding: '10px 20px' }} onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
                  <button id="save-question" className="btn-primary" style={{ padding: '10px 24px' }} onClick={handleSaveMCQ} disabled={!mcqForm.title || !mcqForm.question || !mcqForm.topic}>💾 Save Question</button>
                </div>
              </div>
            ) : (
              /* Coding form */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>TOPIC *</label>
                    <select className="input-field" value={codingForm.topic} onChange={e => setCodingForm({...codingForm, topic: e.target.value})} style={{ cursor: 'pointer' }}>
                      <option value="">Select</option>
                      {topicMap.dsa.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>DIFFICULTY *</label>
                    <select className="input-field" value={codingForm.difficulty} onChange={e => setCodingForm({...codingForm, difficulty: e.target.value as Difficulty})} style={{ cursor: 'pointer' }}>
                      <option value="easy">Easy (+30 XP)</option>
                      <option value="medium">Medium (+50 XP)</option>
                      <option value="hard">Hard (+80 XP)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>CONSTRAINTS</label>
                    <input className="input-field" placeholder="e.g. 1 ≤ n ≤ 10⁴" value={codingForm.constraints} onChange={e => setCodingForm({...codingForm, constraints: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>PROBLEM TITLE *</label>
                  <input className="input-field" placeholder="e.g. Two Sum" value={codingForm.title} onChange={e => setCodingForm({...codingForm, title: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>PROBLEM DESCRIPTION * (supports markdown)</label>
                  <textarea className="input-field" placeholder="Describe the problem clearly..." value={codingForm.description} onChange={e => setCodingForm({...codingForm, description: e.target.value})} rows={5} style={{ resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>PYTHON STARTER CODE</label>
                    <textarea className="input-field" placeholder="def solution():\n    pass" value={codingForm.starterPython} onChange={e => setCodingForm({...codingForm, starterPython: e.target.value})} rows={4} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, resize: 'vertical' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>JAVA STARTER CODE</label>
                    <textarea className="input-field" placeholder="public void solution() {}" value={codingForm.starterJava} onChange={e => setCodingForm({...codingForm, starterJava: e.target.value})} rows={4} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, resize: 'vertical' }} />
                  </div>
                </div>
                {/* Test cases */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>TEST CASES *</label>
                    <button type="button" onClick={() => setCodingForm(f => ({...f, testCases: [...f.testCases, {input:'',expected:''}]}))} style={{ fontSize: 11, color: 'var(--accent-violet-light)', background: 'none', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontWeight: 600 }}>+ Add Test Case</button>
                  </div>
                  {codingForm.testCases.map((tc, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                      <input className="input-field" placeholder={`Input ${i+1}`} value={tc.input} onChange={e => { const t=[...codingForm.testCases];t[i].input=e.target.value;setCodingForm({...codingForm,testCases:t}); }} style={{ fontSize: 12, fontFamily: 'monospace' }} />
                      <input className="input-field" placeholder={`Expected Output ${i+1}`} value={tc.expected} onChange={e => { const t=[...codingForm.testCases];t[i].expected=e.target.value;setCodingForm({...codingForm,testCases:t}); }} style={{ fontSize: 12, fontFamily: 'monospace' }} />
                      <button type="button" onClick={() => setCodingForm(f => ({...f, testCases: f.testCases.filter((_,j)=>j!==i)}))} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, color:'#ef4444', cursor:'pointer', padding:'0 12px' }}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" style={{ padding: '10px 20px' }} onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
                  <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={handleSaveCoding} disabled={!codingForm.title || !codingForm.description}>💾 Save Problem</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, marginBottom: 20 }}>
        <input className="input-field" placeholder="🔍 Search questions..." value={filter.search} onChange={e => setFilter({...filter, search: e.target.value})} style={{ padding: '8px 14px', fontSize: 13 }} />
        <select className="input-field" value={filter.category} onChange={e => setFilter({...filter, category: e.target.value})} style={{ cursor: 'pointer', fontSize: 13 }}>
          <option value="all">All Categories</option>
          <option value="aptitude">Aptitude</option>
          <option value="dsa">DSA</option>
          <option value="communication">Communication</option>
          <option value="hr">HR</option>
        </select>
        <select className="input-field" value={filter.difficulty} onChange={e => setFilter({...filter, difficulty: e.target.value})} style={{ cursor: 'pointer', fontSize: 13 }}>
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: 'var(--accent-violet-light)', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
          {filtered.length} results
        </div>
      </div>

      {/* Questions table */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-secondary)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ width: 30, height: 30, border: '3px solid rgba(124,58,237,0.1)', borderTop: '3px solid var(--accent-violet-light)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <div>Loading questions...</div>
          </div>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>
            {['Title', 'Type', 'Category', 'Topic', 'Difficulty', 'Actions'].map(h => <div key={h}>{h}</div>)}
          </div>
          {filtered.map(q => (
            <div key={q.id} className="table-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 13 }}>
              <div style={{ fontWeight: 600 }}>{q.title}</div>
              <div><span style={{ background: q.type === 'coding' ? 'rgba(6,182,212,0.1)' : 'rgba(124,58,237,0.1)', color: q.type === 'coding' ? '#06b6d4' : 'var(--accent-violet-light)', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{q.type === 'mcq' ? '📝 MCQ' : '💻 Code'}</span></div>
              <div style={{ color: 'var(--text-muted)' }}>{q.category}</div>
              <div style={{ color: 'var(--text-muted)' }}>{q.topic}</div>
              <div><span className={`diff-${q.difficulty}`} style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{q.difficulty.toUpperCase()}</span></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => handleEdit(q)} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 13, color: 'var(--accent-violet-light)' }}>✏️</button>
                <button onClick={() => handleDelete(q.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 13, color: '#ef4444' }}>🗑️</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No questions found. Add your first question above!</div>
          )}
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
