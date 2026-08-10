'use client';
import { useState } from 'react';
import { Calendar as CalendarIcon, Layout, User, Users, Plus, GripVertical, Settings2, MoreHorizontal, Clock, AlertCircle, CheckCircle2, CircleDashed } from 'lucide-react';

type TaskStatus = 'todo' | 'inprogress' | 'done';
type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  tags?: string[];
}

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'workflow' | 'calendar' | 'assigned'>('workflow');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete DSA Array problems (15/15)', status: 'todo', priority: 'high', dueDate: 'Today', tags: ['DSA', 'Practice'] },
    { id: '2', title: 'Review System Design concepts', status: 'todo', priority: 'medium', dueDate: 'Tomorrow', tags: ['System Design'] },
    { id: '3', title: 'Build React UI for Copilot', status: 'inprogress', priority: 'high', dueDate: 'Oct 24', tags: ['Frontend'] },
    { id: '4', title: 'Mock Interview with AI Assistant', status: 'inprogress', priority: 'medium', tags: ['Interview'] },
    { id: '5', title: 'Update Resume with new projects', status: 'done', priority: 'high', dueDate: 'Oct 20', tags: ['Career'] },
    { id: '6', title: 'Solve Weekly Contest', status: 'done', priority: 'low', tags: ['Contest'] }
  ]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(prev => prev.map(t => t.id === draggedTaskId ? { ...t, status } : t));
      setDraggedTaskId(null);
    }
  };

  const columns: { id: TaskStatus; title: string; color: string; bg: string; icon: any }[] = [
    { id: 'todo', title: 'To Do', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.05)', icon: CircleDashed },
    { id: 'inprogress', title: 'In Progress', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.05)', icon: Clock },
    { id: 'done', title: 'Done', color: '#10b981', bg: 'rgba(16, 185, 129, 0.05)', icon: CheckCircle2 }
  ];

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
      case 'medium': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' };
      case 'low': return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 14, 
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))', 
            border: '1px solid rgba(124, 58, 237, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-violet-light)', boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)'
          }}>
            <CalendarIcon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>My Schedule</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '4px 0 0 0', fontWeight: 500 }}>Your personal telemetry & assigned workflows</p>
          </div>
        </div>
        
        <button className="btn-primary" style={{ 
          padding: '10px 20px', fontSize: 14, gap: 8, borderRadius: 10,
          background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
          boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)', border: 'none'
        }}>
          <Plus size={18} strokeWidth={2.5} /> New Task
        </button>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', gap: 6, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', 
        padding: 6, borderRadius: 12, width: 'fit-content', marginBottom: 32,
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {[
          { id: 'personal', label: 'Personal (0)', icon: User },
          { id: 'workflow', label: 'My Workflow', icon: Layout },
          { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
          { id: 'assigned', label: 'Assigned to me (0)', icon: Users },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600,
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: active ? '#fff' : 'var(--text-muted)',
                boxShadow: active ? '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.1)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={(e) => { if (!active) e.currentTarget.style.color = '#fff' }}
              onMouseOut={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <Icon size={16} style={{ color: active ? 'var(--accent-cyan-light)' : 'inherit', transition: 'color 0.25s' }} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'workflow' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
              Drag tasks to reorder stages. Click <Settings2 size={14} style={{ color: 'var(--text-secondary)' }}/> to customize.
            </div>
            <button style={{ 
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, 
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              <Settings2 size={16} /> Customize stages
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, flex: 1, minHeight: 0 }}>
            {columns.map(col => {
              const colTasks = tasks.filter(t => t.status === col.id);
              const ColIcon = col.icon;
              
              return (
                <div 
                  key={col.id} 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                  style={{ 
                    background: 'rgba(12, 12, 14, 0.4)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: 16, padding: '20px 16px', 
                    display: 'flex', flexDirection: 'column',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)'
                  }}
                >
                  {/* Column Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <ColIcon size={18} style={{ color: col.color }} strokeWidth={2.5} />
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{col.title}</h3>
                      <div style={{ 
                        fontSize: 12, fontWeight: 700, color: col.color, 
                        background: col.bg, padding: '2px 8px', borderRadius: 12,
                        border: `1px solid ${col.color}20`
                      }}>
                        {colTasks.length}
                      </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  {/* Task List */}
                  <div style={{ 
                    display: 'flex', flexDirection: 'column', gap: 14, flex: 1, 
                    overflowY: 'auto', paddingRight: 4, paddingBottom: 20 
                  }}>
                    {colTasks.length === 0 ? (
                      <div style={{ 
                        margin: 'auto', color: 'var(--text-muted)', fontSize: 13, 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                        border: '2px dashed rgba(255,255,255,0.05)', borderRadius: 12, padding: 30, width: '100%'
                      }}>
                        <div style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <AlertCircle size={20} style={{ opacity: 0.5 }} />
                        </div>
                        No tasks in this stage
                      </div>
                    ) : (
                      colTasks.map(task => {
                        const prio = getPriorityColor(task.priority);
                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            style={{
                              background: 'rgba(22, 22, 26, 0.7)', 
                              border: '1px solid rgba(255, 255, 255, 0.06)', 
                              borderRadius: 12, padding: 16, cursor: 'grab',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                              opacity: draggedTaskId === task.id ? 0.5 : 1,
                              transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                            onMouseOver={(e) => { 
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                            }}
                            onMouseOut={(e) => { 
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                          >
                            {/* Subtle left border accent based on status */}
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: col.color, opacity: 0.8 }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {/* Priority Badge */}
                                <span style={{ 
                                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase', 
                                  letterSpacing: '0.05em', color: prio.text, background: prio.bg, 
                                  padding: '3px 8px', borderRadius: 6 
                                }}>
                                  {task.priority}
                                </span>
                                {/* Optional Tags */}
                                {task.tags?.map(tag => (
                                  <span key={tag} style={{ 
                                    fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', 
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)',
                                    padding: '2px 8px', borderRadius: 6 
                                  }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <MoreHorizontal size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                            </div>

                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 16 }}>
                              {task.title}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              {/* Due Date */}
                              {task.dueDate ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>
                                  <Clock size={12} /> {task.dueDate}
                                </div>
                              ) : <div/>}
                              
                              {/* Avatar placeholder */}
                              <div style={{ 
                                width: 22, height: 22, borderRadius: '50%', 
                                background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-pink))',
                                border: '2px solid rgba(30,30,34,1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 9, fontWeight: 800, color: '#fff'
                              }}>
                                ME
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>October 2026</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }}>Today</button>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn-secondary" style={{ padding: '6px 8px' }}>&lt;</button>
                <button className="btn-secondary" style={{ padding: '6px 8px' }}>&gt;</button>
              </div>
            </div>
          </div>
          <div className="glass" style={{ 
            borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', 
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', overflow: 'hidden'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ padding: '12px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 3 > 0 && i - 3 <= 31 ? i - 3 : null;
              const hasEvent = dayNum === 15 || dayNum === 24 || dayNum === 20;
              return (
                <div key={i} style={{ 
                  minHeight: 100, padding: 8, borderRight: '1px solid rgba(255,255,255,0.02)', 
                  borderBottom: '1px solid rgba(255,255,255,0.02)',
                  background: dayNum === 24 ? 'rgba(124, 58, 237, 0.05)' : 'transparent'
                }}>
                  {dayNum && (
                    <div style={{ 
                      width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 600, color: dayNum === 24 ? 'var(--accent-violet-light)' : 'var(--text-secondary)',
                      background: dayNum === 24 ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                      marginBottom: 8
                    }}>
                      {dayNum}
                    </div>
                  )}
                  {dayNum === 15 && (
                    <div style={{ fontSize: 10, padding: '4px 6px', borderRadius: 4, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Infosys OA Deadline
                    </div>
                  )}
                  {dayNum === 20 && (
                    <div style={{ fontSize: 10, padding: '4px 6px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Resume Review
                    </div>
                  )}
                  {dayNum === 24 && (
                    <div style={{ fontSize: 10, padding: '4px 6px', borderRadius: 4, background: 'rgba(124, 58, 237, 0.15)', color: 'var(--accent-violet-light)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Mock Interview 2:00 PM
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Personal Tab */}
      {activeTab === 'personal' && (
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div className="glass" style={{ flex: 1, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CircleDashed size={24} style={{ color: 'var(--accent-cyan)' }}/> To-Do List
            </h2>
            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                style={{ 
                  flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14 
                }} 
              />
              <button className="btn-primary" style={{ padding: '0 20px', borderRadius: 10 }}>Add</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { id: 1, text: 'Register for TCS CodeVita', done: true },
                { id: 2, text: 'Revise Computer Networks Notes', done: false },
                { id: 3, text: 'Complete Math Aptitude Sheet', done: false },
                { id: 4, text: 'Update LinkedIn Profile Picture', done: false },
              ].map(todo => (
                <div key={todo.id} style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px', 
                  background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)'
                }}>
                  <div style={{ 
                    width: 20, height: 20, borderRadius: 6, border: `2px solid ${todo.done ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)'}`,
                    background: todo.done ? 'var(--accent-cyan)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}>
                    {todo.done && <CheckCircle2 size={14} color="#000" />}
                  </div>
                  <span style={{ fontSize: 15, color: todo.done ? 'var(--text-muted)' : '#fff', textDecoration: todo.done ? 'line-through' : 'none', fontWeight: 500 }}>
                    {todo.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass" style={{ width: 300, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Productivity Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, color: 'var(--text-muted)' }}>
                  <span>Tasks Completed</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>1/4</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '25%', background: 'var(--accent-cyan)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assigned' && (
        <div className="glass" style={{ borderRadius: 20, padding: 80, textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <Users size={64} style={{ opacity: 0.1, margin: '0 auto 24px' }} strokeWidth={1} />
          <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Assigned to Me</h3>
          <p style={{ fontSize: 14, maxWidth: 300, margin: '0 auto', lineHeight: 1.5 }}>Workflows and challenges directly assigned by mentors and placement coordinators.</p>
        </div>
      )}
      
      <style>{`
        /* Custom scrollbar for columns */
        div::-webkit-scrollbar {
          width: 4px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
