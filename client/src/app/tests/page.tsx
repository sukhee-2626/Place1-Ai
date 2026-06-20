'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  Clock, 
  Award, 
  FileText, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  X, 
  Loader2,
  Lock,
  ArrowLeft,
  FileCheck
} from 'lucide-react';

interface Question {
  _id: string;
  title: string;
  description: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: string;
}

interface TestSection {
  name: string;
  duration?: number;
  questions: string[] | Question[];
}

interface Test {
  _id: string;
  title: string;
  description?: string;
  category: 'aptitude' | 'dsa' | 'communication' | 'full-mock' | 'company-specific';
  company?: string;
  duration: number;
  totalMarks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  scheduledAt: string;
  isPublished: boolean;
  xpReward: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
  sections: TestSection[];
}

function TestEngine({ 
  test, 
  questions, 
  onComplete 
}: { 
  test: Test; 
  questions: Question[]; 
  onComplete: (score: number, totalMarks: number, percentage: number, xpEarned: number) => void 
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabWarning, setTabWarning] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { 
          clearInterval(timer); 
          handleSubmit(); 
          return 0; 
        }
        return t - 1;
      });
    }, 1000);

    // Anti-cheat tab warning handler
    const handleBlur = () => setTabWarning(w => w + 1);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', e => e.preventDefault());

    return () => {
      clearInterval(timer);
      window.removeEventListener('blur', handleBlur);
    };
  }, [timeLeft]);

  const handleSubmit = useCallback(async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    
    try {
      const formattedAnswers = questions.map((q, idx) => ({
        questionId: q._id,
        selectedAnswer: answers[idx],
        timeTaken: 0
      }));

      const timeTaken = test.duration * 60 - timeLeft;
      
      const res = await api.post('/results/submit', {
        testId: test._id,
        answers: formattedAnswers,
        timeTaken: timeTaken > 0 ? timeTaken : 1
      });

      if (res.data?.success) {
        setSubmitted(true);
        const { result, xpEarned } = res.data;
        onComplete(result.score, result.totalMarks, result.percentage, xpEarned);
      } else {
        alert('Failed to process submission. Please retry.');
      }
    } catch (err: any) {
      console.error('Error submitting mock test:', err);
      alert(err.response?.data?.message || 'Failed to submit test results. Contact administrator.');
    } finally {
      setSubmitting(false);
    }
  }, [answers, questions, test, timeLeft, submitting, submitted]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const urgent = timeLeft < 300;

  if (questions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 450 }} className="glass">
          <AlertTriangle size={40} style={{ color: 'var(--accent-amber-light)', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Empty Mock Test</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 8, marginBottom: 20 }}>
            This scheduled test does not contain any questions. Please contact your coordinator.
          </p>
          <button className="btn-primary" onClick={() => onComplete(0, 0, 0, 0)}>Return to Console</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', zIndex: 1000, display: 'flex', flexDirection: 'column' }} className="animate-fadeInUp">
      {/* Header Bar */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>{test.title}</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Question {currentQ + 1} of {questions.length}</p>
        </div>
        
        {tabWarning > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid #f59e0b', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={13} />
            <span>Tab switch detected ({tabWarning}x)</span>
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: urgent ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
            border: `1px solid ${urgent ? '#ef4444' : '#10b981'}`,
            borderRadius: 8, padding: '8px 16px', fontSize: 18, fontWeight: 800,
            color: urgent ? '#ef4444' : '#10b981', fontFamily: 'monospace'
          }}>
            {formatTime(timeLeft)}
          </div>
          
          <button 
            onClick={handleSubmit} 
            className="btn-primary" 
            disabled={submitting}
            style={{ padding: '8px 18px', fontSize: 13 }}
          >
            {submitting ? <Loader2 size={13} className="animate-spin-fast" /> : null}
            <span>Submit Test</span>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main Panel Question Frame */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          <div className="glass" style={{ maxWidth: 750, margin: '0 auto', padding: '28px', borderRadius: 14 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(109,40,217,0.12)', color: 'var(--accent-violet-light)', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                Question {currentQ + 1}
              </span>
              <span style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                Category: {questions[currentQ].category?.toUpperCase() || 'GENERAL'}
              </span>
            </div>
            
            <p style={{ fontSize: 15.5, lineHeight: 1.7, marginBottom: 24, whiteSpace: 'pre-wrap' }}>
              {questions[currentQ].description || questions[currentQ].title}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {questions[currentQ].options.map((opt, i) => {
                const isSelected = answers[currentQ] === i;
                return (
                  <button 
                    key={i} 
                    onClick={() => {
                      const a = [...answers];
                      a[currentQ] = i;
                      setAnswers(a);
                    }} 
                    style={{
                      background: isSelected ? 'rgba(109,40,217,0.08)' : 'var(--bg-secondary)',
                      border: `1.5px solid ${isSelected ? 'var(--accent-violet)' : 'var(--border)'}`,
                      borderRadius: 8, padding: '14px 18px', textAlign: 'left', cursor: 'pointer',
                      color: isSelected ? '#fff' : 'var(--text-primary)', fontSize: 14,
                      transition: 'all 0.15s', display: 'flex', gap: 12, alignItems: 'center'
                    }}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%',
                      border: `1.5px solid ${isSelected ? 'var(--accent-violet)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                      fontWeight: 700, flexShrink: 0,
                      background: isSelected ? 'var(--accent-violet)' : 'transparent',
                      color: isSelected ? '#fff' : 'var(--text-secondary)'
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
              <button 
                className="btn-secondary" 
                onClick={() => setCurrentQ(q => Math.max(0, q - 1))} 
                disabled={currentQ === 0} 
                style={{ padding: '10px 20px' }}
              >
                ← Previous
              </button>
              
              <button 
                className="btn-primary" 
                onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))} 
                disabled={currentQ === questions.length - 1} 
                style={{ padding: '10px 20px' }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Question Grid Navigator */}
        <div style={{ width: 230, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', padding: '20px', overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.05em' }}>QUESTION NAVIGATOR</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {questions.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentQ(i)} 
                style={{
                  height: 34, borderRadius: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 700, transition: 'all 0.15s',
                  border: `1.5px solid ${
                    currentQ === i 
                      ? 'var(--accent-violet)' 
                      : answers[i] !== null 
                        ? 'var(--accent-emerald)' 
                        : 'var(--border)'
                  }`,
                  background: currentQ === i 
                    ? 'rgba(109,40,217,0.12)' 
                    : answers[i] !== null 
                      ? 'rgba(5,150,105,0.08)' 
                      : 'transparent',
                  color: currentQ === i 
                    ? 'var(--accent-violet-light)' 
                    : answers[i] !== null 
                      ? 'var(--accent-emerald-light)' 
                      : 'var(--text-secondary)'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} style={{ color: 'var(--accent-emerald-light)' }} />
                <span>Answered</span>
              </span>
              <span style={{ fontWeight: 700 }}>{answers.filter(a => a !== null).length}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={13} style={{ color: 'var(--text-muted)' }} />
                <span>Unanswered</span>
              </span>
              <span style={{ fontWeight: 700 }}>{answers.filter(a => a === null).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  
  const [testResult, setTestResult] = useState<{ 
    score: number; 
    totalMarks: number; 
    percentage: number; 
    xpEarned: number; 
    test: Test 
  } | null>(null);
  
  const [filter, setFilter] = useState('all');

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tests');
      if (res.data?.success) {
        setTests(res.data.tests);
      }
    } catch (err) {
      console.error('Error loading student mock tests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleStartTest = async (testId: string) => {
    setLoadingTestId(testId);
    try {
      const res = await api.get(`/tests/${testId}`);
      if (res.data?.success) {
        const testDetail = res.data.test;
        
        // Extract flat list of questions from test sections
        const questionPool: Question[] = [];
        testDetail.sections?.forEach((sec: any) => {
          sec.questions?.forEach((q: any) => {
            if (q && typeof q === 'object') {
              questionPool.push(q);
            }
          });
        });
        
        setActiveQuestions(questionPool);
        setActiveTest(testDetail);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      alert('Failed to fetch test questions. Please check your internet connection.');
    } finally {
      setLoadingTestId(null);
    }
  };

  const handleComplete = (score: number, totalMarks: number, percentage: number, xpEarned: number) => {
    if (activeTest) {
      setTestResult({ 
        score, 
        totalMarks, 
        percentage, 
        xpEarned, 
        test: activeTest 
      });
      setActiveTest(null);
    }
  };

  if (activeTest) {
    return <TestEngine test={activeTest} questions={activeQuestions} onComplete={handleComplete} />;
  }

  const filtered = filter === 'all' 
    ? tests 
    : tests.filter(t => t.category === filter || t.company?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="animate-fadeInUp" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>Mock Test Center</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            Take mock examinations scheduled by your instructors to practice placement conditions.
          </p>
        </div>
      </div>

      {/* API Submission Success Result card */}
      {testResult && (
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)',
          borderRadius: 12, padding: '24px 28px', marginBottom: 24,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.02em' }}>SCORE OBTAINED</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent-emerald-light)', marginTop: 4 }}>
              {testResult.score} / {testResult.totalMarks}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.02em' }}>PERCENTAGE</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>
              {Math.round(testResult.percentage)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.02em' }}>XP REWARD EARNED</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent-violet-light)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Award size={20} />
              <span>+{testResult.xpEarned} XP</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button 
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: 13, gap: 6 }} 
              onClick={() => setTestResult(null)}
            >
              <X size={14} />
              <span>Close Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'aptitude', 'dsa', 'company-specific'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            style={{
              padding: '8px 16px', borderRadius: 6, border: '1px solid', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              background: filter === f ? 'var(--text-primary)' : 'transparent',
              borderColor: filter === f ? 'transparent' : 'var(--border)',
              color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.15s'
            }}
          >
            {f === 'all' ? 'All Scheduled Tests' : f === 'company-specific' ? 'Company Placements' : f.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
          <Loader2 className="animate-spin-fast" size={32} style={{ color: 'var(--accent-violet-light)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass" style={{ borderRadius: 14, padding: '80px 20px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <FileCheck size={40} style={{ color: 'var(--text-muted)', marginBottom: 12, opacity: 0.5 }} />
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>No scheduled tests found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            There are no test sessions scheduled under this category right now. Check back later!
          </p>
        </div>
      ) : (
        /* Tests Cards Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {filtered.map(test => {
            const isLive = new Date(test.scheduledAt) <= new Date();
            const totalQs = test.sections?.reduce((acc, s) => acc + (s.questions?.length || 0), 0) || 0;
            
            return (
              <div 
                key={test._id} 
                className="glass hover-lift" 
                style={{ padding: '24px', borderRadius: 12, position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}
              >
                {/* Thin top status border */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: isLive 
                    ? 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))' 
                    : 'linear-gradient(90deg, var(--accent-violet), var(--accent-pink))'
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                        {test.category}
                      </span>
                      {test.company && (
                        <span style={{ fontSize: 10, background: 'rgba(6,182,212,0.15)', color: 'var(--accent-cyan-light)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                          {test.company}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.01em' }}>{test.title}</h3>
                  </div>
                  <span className={`diff-${test.difficulty}`} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, fontWeight: 800 }}>
                    {test.difficulty.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px', textAlign: 'center' }}>
                    <Clock size={15} style={{ color: 'var(--text-secondary)', margin: '0 auto 4px' }} />
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{test.duration} Min</div>
                  </div>
                  
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px', textAlign: 'center' }}>
                    <FileText size={15} style={{ color: 'var(--text-secondary)', margin: '0 auto 4px' }} />
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{totalQs} Qs</div>
                  </div>
                  
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px', textAlign: 'center' }}>
                    <Award size={15} style={{ color: 'var(--accent-violet-light)', margin: '0 auto 4px' }} />
                    <div style={{ fontSize: 12, fontWeight: 700 }}>+{test.xpReward} XP</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                    <span>
                      {isLive 
                        ? 'Available to attempt' 
                        : `Starts ${new Date(test.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                      }
                    </span>
                  </div>
                  
                  {test.negativeMarking && (
                    <div style={{ color: 'var(--accent-danger-light)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                      <AlertTriangle size={11} />
                      <span>Negative Marking Enabled (-{test.negativeMarkValue})</span>
                    </div>
                  )}
                </div>
                
                <button
                  className={isLive ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', padding: '10px', fontSize: 13, gap: 8 }}
                  onClick={() => isLive && handleStartTest(test._id)}
                  disabled={!isLive || loadingTestId !== null}
                >
                  {loadingTestId === test._id ? (
                    <Loader2 size={14} className="animate-spin-fast" />
                  ) : isLive ? (
                    <Play size={13} />
                  ) : (
                    <Clock size={13} />
                  )}
                  <span>{isLive ? 'Start Assessment' : 'Scheduled / Upcoming'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
