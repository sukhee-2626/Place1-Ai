'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Database, 
  Search, 
  Video, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square
} from 'lucide-react';

export default function SQLCheatsheetPage() {
  const { user, updateUser } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [expandedProblems, setExpandedProblems] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await api.get('/questions?category=sql&limit=1000');
        if (response.data?.success) {
          setQuestions(response.data.questions);
          // Expand first topic by default
          if (response.data.questions.length > 0) {
            const firstTopic = response.data.questions[0].topic;
            setExpandedTopics({ [firstTopic]: true });
          }
        }
      } catch (err) {
        console.error('Error fetching SQL questions:', err);
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

  // Sort subtopic contents by contentOrder
  Object.keys(groupedData).forEach(topic => {
    Object.keys(groupedData[topic]).forEach(subtopic => {
      groupedData[topic][subtopic].sort((a: any, b: any) => (a.contentOrder || 0) - (b.contentOrder || 0));
    });
  });

  // Calculate progress stats
  const totalSubtopics = Object.keys(groupedData).reduce((total, topic) => {
    return total + Object.keys(groupedData[topic]).length;
  }, 0);

  // A subtopic is completed if any of its content items is in user's completedQuestions
  const completedSubtopics = Object.keys(groupedData).reduce((total, topic) => {
    let completedInTopic = 0;
    Object.keys(groupedData[topic]).forEach(subtopic => {
      const items = groupedData[topic][subtopic];
      const isDone = items.some((item: any) => user?.completedQuestions?.includes(item._id));
      if (isDone) completedInTopic++;
    });
    return total + completedInTopic;
  }, 0);

  const progressPercent = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

  const toggleTopic = (topic: string) => {
    setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
  };

  const toggleProblem = (subtopic: string) => {
    setExpandedProblems(prev => ({ ...prev, [subtopic]: !prev[subtopic] }));
  };

  const toggleCompletion = async (items: any[]) => {
    if (items.length === 0) return;
    try {
      let newUserState = { ...user } as any;
      for (const item of items) {
        const response = await api.post('/users/complete-question', { questionId: item._id });
        if (response.data?.success) {
          newUserState = response.data.user;
        }
      }
      updateUser(newUserState);
      
      const isCurrentlyDone = items.some((item: any) => user?.completedQuestions?.includes(item._id));
      setToast({ 
        show: true, 
        message: isCurrentlyDone ? 'Topic marked incomplete.' : 'Topic marked completed! +XP awarded.' 
      });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
    } catch (err) {
      console.error('Error toggling SQL question completion:', err);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setToast({ show: true, message: 'SQL query copied to clipboard!' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 120px)', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '2.5px solid var(--border)', borderTopColor: 'var(--accent-violet-light)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading SQL Interview Sheet...</div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Filter topics or subtopics based on search
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
          <span style={{ background: 'rgba(103,232,249,0.08)', color: 'var(--accent-cyan-light)', border: '1px solid rgba(103,232,249,0.15)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SQL TRACK</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Database size={20} style={{ color: 'var(--accent-cyan-light)' }} /> SQL Interview Sheet
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
          Master key relational algebra patterns, nested queries, subqueries, complex aggregations, joins, and window functions for enterprise tech interviews.
        </p>
        
        {/* Progress bar */}
        <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.01)', borderRadius: 6, padding: '12px 16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Overall Progression</span>
            <span style={{ color: 'var(--accent-cyan-light)' }}>{completedSubtopics} of {totalSubtopics} solved ({progressPercent}%)</span>
          </div>
          <div className="xp-bar" style={{ height: 4 }}>
            <div className="xp-bar-fill" style={{ width: `${progressPercent}%`, background: 'var(--accent-cyan)' }} />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: 16 }}>
        <input 
          className="input-field" 
          placeholder="Search SQL topics, query types, or statements..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ padding: '10px 14px', fontSize: 13 }}
        />
      </div>

      {/* Topics Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredTopics.map((topic) => {
          const subtopics = groupedData[topic];
          const subtopicKeys = Object.keys(subtopics).filter(sub => 
            !search || sub.toLowerCase().includes(search.toLowerCase()) || topic.toLowerCase().includes(search.toLowerCase())
          );
          const isTopicExpanded = expandedTopics[topic];

          let totalInTopic = Object.keys(subtopics).length;
          let completedInTopic = Object.keys(subtopics).filter(sub => 
            subtopics[sub].some((item: any) => user?.completedQuestions?.includes(item._id))
          ).length;
          let topicProgress = totalInTopic > 0 ? Math.round((completedInTopic / totalInTopic) * 100) : 0;

          return (
            <div key={topic} className="glass" style={{ borderRadius: 8, overflow: 'hidden' }}>
              
              {/* Topic Header */}
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
                    <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{completedInTopic} of {totalInTopic} tracks solved</span>
                    <div style={{ width: 60, height: 3, background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${topicProgress}%`, height: '100%', background: 'var(--accent-cyan-light)' }} />
                    </div>
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>
                  {isTopicExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </div>

              {/* Subtopics Listing */}
              {isTopicExpanded && (
                <div style={{ padding: '4px' }}>
                  {subtopicKeys.map(subtopic => {
                    const items = subtopics[subtopic];
                    const isDone = items.some((item: any) => user?.completedQuestions?.includes(item._id));
                    const isProblemExpanded = expandedProblems[subtopic];
                    const difficulty = items[0]?.difficulty || 'medium';

                    return (
                      <div 
                        key={subtopic} 
                        style={{ 
                          background: isProblemExpanded ? 'rgba(255,255,255,0.005)' : 'transparent', 
                          borderBottom: '1px solid var(--border)', 
                          borderRadius: 6, marginBottom: 2, overflow: 'hidden' 
                        }}
                      >
                        {/* Subtopic Header Grid */}
                        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', gap: 10 }}>
                          
                          {/* Checkbox selector */}
                          <div 
                            onClick={() => toggleCompletion(items)} 
                            style={{ 
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              color: isDone ? 'var(--accent-emerald-light)' : 'var(--text-muted)' 
                            }}
                          >
                            {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>

                          {/* Problem Title block */}
                          <div onClick={() => toggleProblem(subtopic)} style={{ flex: 1, cursor: 'pointer', userSelect: 'none' }}>
                            <div style={{ 
                              fontSize: 13, fontWeight: 600, 
                              color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)', 
                              textDecoration: isDone ? 'line-through' : 'none' 
                            }}>
                              {subtopic}
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 2, alignItems: 'center' }}>
                              <span className={`diff-${difficulty}`} style={{ fontSize: 8.5, padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>{difficulty.toUpperCase()}</span>
                              {items.some((it: any) => it.videoLink) && <span style={{ fontSize: 9, color: 'var(--accent-amber-light)', display: 'inline-flex', alignItems: 'center', gap: 2 }}><Video size={10} /> Video</span>}
                              {items.some((it: any) => it.articleLink) && <span style={{ fontSize: 9, color: 'var(--accent-violet-light)', display: 'inline-flex', alignItems: 'center', gap: 2 }}><BookOpen size={10} /> Solution</span>}
                            </div>
                          </div>

                          {/* Toggle Trigger */}
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

                        {/* Expanded details container */}
                        {isProblemExpanded && (
                          <div style={{ padding: '4px 14px 14px 38px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {items.map((item: any) => {
                              if (item.contentType === 'paragraph') {
                                return (
                                  <p key={item._id} style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {item.description}
                                  </p>
                                );
                              } else if (item.contentType === 'table') {
                                return (
                                  <div key={item._id} style={{ overflowX: 'auto', margin: '4px 0', border: '1px solid var(--border)', borderRadius: 6 }}>
                                    <table className="custom-table">
                                      <thead>
                                        <tr style={{ background: 'var(--bg-secondary)' }}>
                                          {item.headers.map((h: string) => (
                                            <th key={h}>{h}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {item.rows.map((row: string[], rIdx: number) => (
                                          <tr key={rIdx}>
                                            {row.map((cell, cIdx) => (
                                              <td key={cIdx} style={{ fontSize: 12 }}>{cell}</td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                    {item.caption && <div style={{ fontSize: 10.5, color: 'var(--text-muted)', padding: '6px 12px', fontStyle: 'italic', borderTop: '1px solid var(--border)' }}>* {item.caption}</div>}
                                  </div>
                                );
                              } else if (item.contentType === 'code' && item.solutionCode) {
                                return (
                                  <div key={item._id} style={{ margin: '6px 0', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '6px 12px', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                                      <span>PRESCRIBED SQL QUERY</span>
                                      <button 
                                        onClick={() => handleCopy(item.solutionCode)} 
                                        style={{ 
                                          background: 'none', border: 'none', color: 'var(--accent-cyan-light)', 
                                          cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 
                                        }}
                                      >
                                        <Copy size={11} /> Copy
                                      </button>
                                    </div>
                                    <pre style={{ margin: 0, padding: '12px', background: '#09090b', overflowX: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--accent-cyan-light)', lineHeight: 1.5 }}>
                                      {item.solutionCode}
                                    </pre>
                                  </div>
                                );
                              } else if (item.contentType === 'link') {
                                return (
                                  <div key={item._id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                    <div>
                                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent-cyan-light)' }}>{item.title}</div>
                                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{item.description}</div>
                                    </div>
                                    <a href={item.articleLink || item.hint} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '4px 10px', fontSize: 11 }}>
                                      Open Resource <ExternalLink size={10} />
                                    </a>
                                  </div>
                                );
                              }
                              return null;
                            })}

                            {/* Watch Video solutions trigger */}
                            {items.some((it: any) => it.videoLink) && (
                              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                {items.filter((it: any) => it.videoLink).map((it: any) => (
                                  <a key={it._id} href={it.videoLink} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '5px 10px', fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                    <Video size={12} /> Watch Video Tutorial
                                  </a>
                                ))}
                              </div>
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

      {/* Dynamic Toast popup notifier */}
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
            <Check size={14} style={{ color: 'var(--accent-emerald-light)' }} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}
