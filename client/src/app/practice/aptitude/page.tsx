'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  CheckSquare, 
  Square,
  BookOpen,
  Info
} from 'lucide-react';

export default function AptitudeCheatsheetPage() {
  const { user, updateUser } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [expandedProblems, setExpandedProblems] = useState<Record<string, boolean>>({});
  
  // Track selected option index for each question locally by question ID
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await api.get('/questions?category=aptitude&limit=1000');
        if (response.data?.success) {
          setQuestions(response.data.questions);
          // Expand first topic by default
          if (response.data.questions.length > 0) {
            setExpandedTopics({ [response.data.questions[0].topic]: true });
          }
        }
      } catch (err) {
        console.error('Error fetching Aptitude questions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // Group items by topic, then by subtopic
  const groupedData = questions.reduce((acc, q) => {
    if (!acc[q.topic]) {
      acc[q.topic] = {};
    }
    if (!acc[q.topic][q.subtopic]) {
      acc[q.topic][q.subtopic] = [];
    }
    acc[q.topic][q.subtopic].push(q);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  // Calculate progress stats
  const totalQuestions = questions.length;
  const completedQuestions = questions.filter(q => user?.completedQuestions?.includes(q._id)).length;
  const progressPercent = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  const toggleTopic = (topic: string) => {
    setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const toggleProblem = (subtopic: string) => {
    setExpandedProblems(prev => ({ ...prev, [subtopic]: !prev[subtopic] }));
  };

  const toggleCompletion = async (questionId: string) => {
    try {
      const response = await api.post('/users/complete-question', { questionId });
      if (response.data?.success) {
        updateUser(response.data.user);
        
        const isDone = user?.completedQuestions?.includes(questionId);
        setToast({ 
          show: true, 
          message: isDone ? 'Marked incomplete' : 'Question marked completed! +XP awarded.' 
        });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
      }
    } catch (err) {
      console.error('Error toggling problem completion:', err);
    }
  };

  const handleSelectOption = (questionId: string, optIdx: number) => {
    if (userAnswers[questionId] !== undefined) return; // Answer already selected
    setUserAnswers(prev => ({ ...prev, [questionId]: optIdx }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 120px)', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '2.5px solid var(--border)', borderTopColor: 'var(--accent-violet-light)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading Aptitude Cheatsheet...</div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Filter topics based on search
  const filteredTopics = Object.keys(groupedData).filter(topic => {
    if (!search) return true;
    const matchesTopic = topic.toLowerCase().includes(search.toLowerCase());
    const matchesSubtopic = Object.keys(groupedData[topic]).some(sub => 
      sub.toLowerCase().includes(search.toLowerCase())
    );
    return matchesTopic || matchesSubtopic;
  });

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', paddingBottom: 40 }} className="animate-fadeInUp">
      
      {/* Header Panel */}
      <div className="glass" style={{ padding: '24px', borderRadius: 8, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ background: 'rgba(167,139,250,0.08)', color: 'var(--accent-violet-light)', border: '1px solid rgba(167,139,250,0.15)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>APTITUDE SHEET</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          <HelpCircle size={20} style={{ color: 'var(--accent-violet-light)' }} /> Aptitude Cheat Sheet
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
          Master quantitative equations, logical reasoning matrices, and verbal aptitude structures. Solve interactive inline MCQs with step-by-step mathematical explanations.
        </p>
        
        {/* Progress Bar */}
        <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.01)', borderRadius: 6, padding: '12px 16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Overall Progress</span>
            <span style={{ color: 'var(--accent-violet-light)' }}>{completedQuestions} of {totalQuestions} solved ({progressPercent}%)</span>
          </div>
          <div className="xp-bar" style={{ height: 4 }}>
            <div className="xp-bar-fill" style={{ width: `${progressPercent}%`, background: 'var(--accent-violet)' }} />
          </div>
        </div>
      </div>

      {/* Search Field */}
      <div style={{ marginBottom: 16 }}>
        <input 
          className="input-field" 
          placeholder="Search mathematical chapters, topics, or question keywords..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ padding: '10px 14px', fontSize: 13 }}
        />
      </div>

      {/* Accordions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredTopics.map((topic) => {
          const subtopics = groupedData[topic];
          const subtopicKeys = Object.keys(subtopics).filter(sub => 
            !search || sub.toLowerCase().includes(search.toLowerCase()) || topic.toLowerCase().includes(search.toLowerCase())
          );
          const isTopicExpanded = expandedTopics[topic];

          let totalInTopic = 0;
          let completedInTopic = 0;
          Object.keys(subtopics).forEach(sub => {
            totalInTopic += subtopics[sub].length;
            completedInTopic += subtopics[sub].filter((q: any) => user?.completedQuestions?.includes(q._id)).length;
          });
          let topicProgress = totalInTopic > 0 ? Math.round((completedInTopic / totalInTopic) * 100) : 0;

          return (
            <div key={topic} className="glass" style={{ borderRadius: 8, overflow: 'hidden' }}>
              {/* Topic Title Toggle */}
              <div 
                onClick={() => toggleTopic(topic)} 
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '14px 18px', cursor: 'pointer', background: 'var(--bg-secondary)', 
                  userSelect: 'none', borderBottom: isTopicExpanded ? '1px solid var(--border)' : 'none' 
                }}
              >
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700 }}>{topic}</h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{completedInTopic} / {totalInTopic} equations solved</span>
                    <div style={{ width: 60, height: 3, background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${topicProgress}%`, height: '100%', background: 'var(--accent-violet-light)' }} />
                    </div>
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>
                  {isTopicExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </div>

              {/* Subtopic Items */}
              {isTopicExpanded && (
                <div style={{ padding: '4px' }}>
                  {subtopicKeys.map(subtopic => {
                    const items = subtopics[subtopic];
                    if (items.length === 0) return null;
                    
                    const q = items[0];
                    const isDone = user?.completedQuestions?.includes(q._id);
                    const isProblemExpanded = expandedProblems[subtopic];
                    const selectedOptIdx = userAnswers[q._id];
                    const hasSelected = selectedOptIdx !== undefined;

                    return (
                      <div 
                        key={subtopic} 
                        style={{ 
                          background: isProblemExpanded ? 'rgba(255,255,255,0.005)' : 'transparent', 
                          borderBottom: '1px solid var(--border)', 
                          borderRadius: 6, marginBottom: 2, overflow: 'hidden' 
                        }}
                      >
                        {/* Question Row */}
                        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', gap: 10 }}>
                          
                          {/* Completion indicator */}
                          <div 
                            onClick={() => toggleCompletion(q._id)} 
                            style={{ 
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: isDone ? 'var(--accent-emerald-light)' : 'var(--text-muted)'
                            }}
                          >
                            {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>

                          {/* Problem Title */}
                          <div onClick={() => toggleProblem(subtopic)} style={{ flex: 1, cursor: 'pointer', userSelect: 'none' }}>
                            <div style={{ 
                              fontSize: 13, fontWeight: 600, 
                              color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)', 
                              textDecoration: isDone ? 'line-through' : 'none' 
                            }}>
                              {subtopic}
                            </div>
                            <div style={{ display: 'flex', gap: 6, marginTop: 2, alignItems: 'center' }}>
                              <span className={`diff-${q.difficulty}`} style={{ fontSize: 8.5, padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>{q.difficulty.toUpperCase()}</span>
                              <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 2 }}><Award size={10} /> +{q.xpReward || 10} XP</span>
                            </div>
                          </div>

                          {/* Toggle Expand */}
                          <button 
                            onClick={() => toggleProblem(subtopic)} 
                            style={{ 
                              background: 'none', border: 'none', color: 'var(--text-muted)', 
                              fontSize: 11.5, cursor: 'pointer', fontWeight: 500 
                            }}
                          >
                            {isProblemExpanded ? 'Collapse' : 'Expand'}
                          </button>
                        </div>

                        {/* Interactive Quiz Sandbox */}
                        {isProblemExpanded && (
                          <div style={{ padding: '4px 14px 14px 38px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* Question body */}
                            <p style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.55, fontWeight: 500 }}>
                              {q.description}
                            </p>

                            {/* Option selections (Typeform/Brilliant style) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, maxWidth: 650 }}>
                              {q.options.map((opt: string, i: number) => {
                                const isSelected = selectedOptIdx === i;
                                const isCorrectOpt = q.correctAnswer === i;
                                
                                let optBg = 'var(--bg-secondary)';
                                let optBorder = 'var(--border)';
                                let optColor = 'var(--text-primary)';
                                let StateIcon = null;

                                if (hasSelected) {
                                  if (isCorrectOpt) {
                                    optBg = 'rgba(5, 150, 105, 0.04)';
                                    optBorder = 'var(--accent-emerald)';
                                    optColor = 'var(--accent-emerald-light)';
                                    StateIcon = <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald-light)' }} />;
                                  } else if (isSelected) {
                                    optBg = 'rgba(220, 38, 38, 0.04)';
                                    optBorder = 'var(--accent-danger)';
                                    optColor = 'var(--accent-danger-light)';
                                    StateIcon = <XCircle size={14} style={{ color: 'var(--accent-danger-light)' }} />;
                                  }
                                }

                                return (
                                  <button
                                    key={i}
                                    onClick={() => handleSelectOption(q._id, i)}
                                    disabled={hasSelected}
                                    style={{
                                      background: optBg,
                                      border: `1px solid ${optBorder}`,
                                      borderRadius: 6,
                                      padding: '10px 14px',
                                      textAlign: 'left',
                                      cursor: hasSelected ? 'default' : 'pointer',
                                      color: optColor,
                                      fontSize: 13,
                                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 10,
                                      width: '100%'
                                    }}
                                  >
                                    <span style={{
                                      width: 20, height: 20, borderRadius: '50%',
                                      background: hasSelected && (isCorrectOpt || isSelected) ? 'transparent' : 'var(--bg-primary)',
                                      border: `1px solid ${optBorder}`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      fontSize: 10, fontWeight: 700, flexShrink: 0,
                                      color: optColor
                                    }}>
                                      {StateIcon ? StateIcon : String.fromCharCode(65 + i)}
                                    </span>
                                    <span style={{ flex: 1 }}>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Dynamic explanation block */}
                            {hasSelected && (
                              <div style={{ 
                                background: 'rgba(255,255,255,0.01)', borderLeft: '3px solid var(--accent-violet-light)', 
                                borderRadius: '0 6px 6px 0', padding: '12px 16px', marginTop: 4, maxWidth: 650 
                              }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-violet-light)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                  <BookOpen size={14} /> MATHEMATICAL EXPLANATION
                                </div>
                                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                  {q.explanation}
                                </p>
                              </div>
                            )}

                            {/* Mark Completed button */}
                            {hasSelected && !isDone && (
                              <button 
                                onClick={() => toggleCompletion(q._id)} 
                                className="btn-primary" 
                                style={{ alignSelf: 'flex-start', padding: '4px 10px', fontSize: 11, height: 24, marginTop: 4 }}
                              >
                                Mark Question Solved ✓
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Toast popup */}
      {toast.show && (
        <div className="toast-container">
          <div className="glass" style={{ 
            padding: '10px 16px', 
            borderRadius: 6, 
            border: '1px solid var(--border-bright)', 
            background: 'rgba(12, 12, 14, 0.95)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            fontSize: 12.5,
            color: 'var(--text-primary)'
          }}>
            <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald-light)' }} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}
