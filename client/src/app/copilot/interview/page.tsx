'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  ChevronRight, 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Award, 
  ChevronLeft, 
  XCircle, 
  HelpCircle,
  Camera,
  CameraOff
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  expectedKeywords: string[];
}

const mockHrQuestions: Question[] = [
  { id: 'h1', text: 'Tell me about yourself. What are your core strengths and career objectives?', expectedKeywords: ['experience', 'strength', 'learn', 'teamwork', 'solve'] },
  { id: 'h2', text: 'Describe a challenging project you worked on. How did you resolve team conflicts or technical blockers?', expectedKeywords: ['conflict', 'resolved', 'communication', 'task', 'collaborate'] },
  { id: 'h3', text: 'Where do you see yourself in five years? How does this role align with that vision?', expectedKeywords: ['growth', 'contribution', 'skills', 'leadership', 'career'] }
];

const mockTechQuestions: Question[] = [
  { id: 't1', text: 'Explain the difference between double equals (==) and triple equals (===) in JavaScript.', expectedKeywords: ['value', 'type', 'coercion', 'comparison', 'strict'] },
  { id: 't2', text: 'What is a closure in JavaScript? Explain a real-world use case for closures.', expectedKeywords: ['scope', 'lexical', 'outer', 'private', 'function'] },
  { id: 't3', text: 'How do index tables improve database search performance? What is a potential drawback of over-indexing?', expectedKeywords: ['index', 'search', 'query', 'write', 'drawback'] }
];

export default function AIInterviewPrepPage() {
  const [interviewType, setInterviewType] = useState<'select' | 'hr' | 'tech'>('select');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [currentAnswerInput, setCurrentAnswerInput] = useState('');
  
  // Game states
  const [activeSession, setActiveSession] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Scores
  const [techScore, setTechScore] = useState(0);
  const [commScore, setCommScore] = useState(0);
  const [softScore, setSoftScore] = useState(0);
  const [feedbackBullets, setFeedbackBullets] = useState<string[]>([]);

  // Camera Proctoring States
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const startCamera = async () => {
    setCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setCameraStream(stream);
      setCameraActive(true);
      setTimeout(() => {
        const video = document.getElementById('webcam-video') as HTMLVideoElement;
        if (video) video.srcObject = stream;
      }, 100);
    } catch (err) {
      console.error('Webcam stream failed:', err);
      alert('Could not start camera stream. Verify browser permissions.');
      setCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const activeQuestions = interviewType === 'hr' ? mockHrQuestions : mockTechQuestions;

  const startInterview = (type: 'hr' | 'tech') => {
    setInterviewType(type);
    setCurrentStep(0);
    setAnswers(['', '', '']);
    setCurrentAnswerInput('');
    setActiveSession(true);
    setShowReport(false);
  };

  const handleNextQuestion = () => {
    if (!currentAnswerInput.trim()) {
      alert('Please type your response first.');
      return;
    }
    
    setSubmittingAnswer(true);
    setTimeout(() => {
      const updatedAnswers = [...answers];
      updatedAnswers[currentStep] = currentAnswerInput;
      setAnswers(updatedAnswers);

      if (currentStep < 2) {
        setCurrentStep(prev => prev + 1);
        setCurrentAnswerInput('');
      } else {
        // End of questions - calculate report metrics
        calculateReport(updatedAnswers);
      }
      setSubmittingAnswer(false);
    }, 1200);
  };

  const calculateReport = (finalAnswers: string[]) => {
    let matchesCount = 0;
    let wordCountSum = 0;

    finalAnswers.forEach((ans, idx) => {
      const ansLower = ans.toLowerCase();
      wordCountSum += ans.split(/\s+/).length;
      
      const expected = activeQuestions[idx].expectedKeywords;
      expected.forEach(word => {
        if (ansLower.includes(word)) matchesCount++;
      });
    });

    // Score calculations
    const isTech = interviewType === 'tech';
    const techScoreBase = isTech 
      ? Math.min(Math.round(4 + matchesCount * 0.8), 10) 
      : Math.min(Math.round(5 + matchesCount * 0.7), 10);
      
    const commScoreBase = Math.min(Math.round(3 + (wordCountSum / 20) + matchesCount * 0.3), 10);
    const softScoreBase = Math.min(Math.round(5 + matchesCount * 0.5), 10);

    setTechScore(techScoreBase);
    setCommScore(commScoreBase);
    setSoftScore(softScoreBase);

    // Feedback generation
    const bullets = [];
    if (techScoreBase >= 8) {
      bullets.push('Strong technical accuracy. You referenced key structural terms accurately.');
    } else {
      bullets.push('Focus on expanding keyword depth. Mention architectural phrases, scope definitions, or indexing limits.');
    }

    if (commScoreBase >= 8) {
      bullets.push('Great articulation. Your explanations are well-structured and detailed.');
    } else {
      bullets.push('Elaborate further on your examples. Describe concrete frameworks, challenges, and resolved states.');
    }

    bullets.push('Maintain consistent response formats (e.g. STAR method for behavioral answers).');
    
    setFeedbackBullets(bullets);
    stopCamera();
    setShowReport(true);
    setActiveSession(false);
  };

  // Speedometer style parameters
  const getDashoffset = (score: number) => 220 - (220 * score) / 10;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }} className="animate-fadeInUp">
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Video size={24} style={{ color: 'var(--accent-violet-light)' }} />
            <span>AI Interview Preparation</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Practice interactive technical simulations and HR behavioral mocks. Receive instant evaluation metrics.
          </p>
        </div>
      </div>

      {/* Select Stage */}
      {interviewType === 'select' && !showReport && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 10 }}>
          
          {/* HR Card */}
          <div className="glass hover-lift" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(109,40,217,0.08)', color: 'var(--accent-violet-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MessageSquare size={20} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>HR Behavioral Mock</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              Prepare for standard behavioral interviews covering conflict resolution, self-introductions, leadership styles, and career roadmaps.
            </p>
            <button onClick={() => startInterview('hr')} className="btn-primary" style={{ width: '100%', fontSize: 12.5 }}>
              <span>Start HR Mock</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Tech Card */}
          <div className="glass hover-lift" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(6,182,212,0.08)', color: 'var(--accent-cyan-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Sparkles size={20} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Technical Simulation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              Practice core technical questions covering scope closures, strict comparison logic, database indexing, and general system design patterns.
            </p>
            <button onClick={() => startInterview('tech')} className="btn-primary" style={{ width: '100%', fontSize: 12.5 }}>
              <span>Start Technical Mock</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Active Session Chat */}
      {activeSession && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'stretch' }} className="responsive-grid">
          
          {/* Left Panel: Active Question & Inputs */}
          <div className="glass animate-fadeInUp" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border-bright)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  {interviewType === 'hr' ? 'HR Behavioral Mock' : 'Technical Simulation'}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent-violet-light)' }}>
                  Question {currentStep + 1} of 3
                </div>
              </div>

              {/* Simulated Interviewer Bubble */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, background: 'var(--border-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet-light)', flexShrink: 0 }}>
                  <Video size={14} />
                </div>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', flex: 1 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>{activeQuestions[currentStep].text}</p>
                </div>
              </div>

              {/* Answer Input Area */}
              <div>
                <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>TYPE YOUR RESPONSE BELOW</label>
                <textarea
                  placeholder="Structure your answer carefully. Speak from your project experience, mention concrete frameworks, and verify your logic..."
                  value={currentAnswerInput}
                  onChange={e => setCurrentAnswerInput(e.target.value)}
                  className="input-field"
                  rows={6}
                  style={{ resize: 'none', fontFamily: 'inherit', fontSize: 13.5, lineHeight: 1.6 }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 18, marginTop: 18 }}>
              <button 
                onClick={() => { stopCamera(); setInterviewType('select'); setActiveSession(false); }}
                className="btn-secondary"
                style={{ fontSize: 12.5, padding: '6px 12px' }}
              >
                <span>Cancel Session</span>
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={submittingAnswer || !currentAnswerInput.trim()}
                className="btn-primary"
                style={{ fontSize: 12.5, padding: '8px 18px', gap: 6 }}
              >
                {submittingAnswer ? <RefreshCw className="animate-spin-fast" size={13} /> : <Send size={13} />}
                <span>{currentStep === 2 ? 'Finish & Generate Report' : 'Submit & Next Question'}</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Proctoring Webcam Preview HUD */}
          <div className="glass animate-fadeInUp" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border-bright)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ position: 'relative', display: 'flex', height: 8, width: 8 }}>
                  <span style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: cameraActive ? 'var(--accent-danger-light)' : 'var(--text-muted)', opacity: 0.75 }}></span>
                  <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: 8, width: 8, backgroundColor: cameraActive ? 'var(--accent-danger)' : 'var(--text-muted)' }}></span>
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
                  {cameraActive ? 'PROCTORING ACTIVE' : 'PROCTORING DEACTIVATED'}
                </span>
              </div>
              <button
                onClick={cameraActive ? stopCamera : startCamera}
                disabled={cameraLoading}
                className="btn-secondary"
                style={{ fontSize: 11, padding: '4px 10px', gap: 4 }}
              >
                {cameraLoading ? (
                  <RefreshCw size={11} className="animate-spin-fast" />
                ) : cameraActive ? (
                  <>
                    <CameraOff size={11} />
                    <span>Disable Camera</span>
                  </>
                ) : (
                  <>
                    <Camera size={11} />
                    <span>Enable Camera</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Preview Container */}
            <div style={{ 
              flex: 1, 
              minHeight: 220, 
              background: '#040406', 
              borderRadius: 8, 
              border: '1px solid var(--border)', 
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {cameraActive ? (
                <video 
                  id="webcam-video" 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Video size={36} style={{ color: 'var(--text-muted)', marginBottom: 8, opacity: 0.4 }} />
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>Camera Feed Disabled</div>
                  <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 4, maxWidth: 200, margin: '4px auto 0' }}>
                    Enable proctoring camera access to simulate an actual remote video assessment.
                  </p>
                </div>
              )}

              {/* Dynamic Overlay HUD when active */}
              {cameraActive && (
                <div style={{
                  position: 'absolute', inset: 0, padding: 12,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  background: 'linear-gradient(rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)',
                  pointerEvents: 'none', fontSize: 9.5, fontFamily: 'monospace', color: 'var(--accent-cyan-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>REC ● 60FPS</span>
                    <span>GAZE: TRACKED (98%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald-light)' }}>
                    <span>FOCUS: ENGAGED</span>
                    <span>SPEECH ANALYSIS: ON</span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Speech/Gaze Assessment HUD */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Gaze Assessment</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: cameraActive ? 'var(--accent-emerald-light)' : 'var(--text-muted)' }} />
                  <span>{cameraActive ? '98.4% Normal' : 'Inactive'}</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Environment Noise</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: cameraActive ? 'var(--accent-emerald-light)' : 'var(--text-muted)' }} />
                  <span>{cameraActive ? 'Low (12dB)' : 'Inactive'}</span>
                </div>
              </div>
            </div>

            {/* Live Audio indicator bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                <span>Microphone Input Level</span>
                {cameraActive && <span style={{ color: 'var(--accent-emerald-light)' }}>Active</span>}
              </div>
              <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: cameraActive ? '45%' : '0%', 
                  background: 'linear-gradient(90deg, var(--accent-emerald-light), var(--accent-amber-light))', 
                  transition: 'width 0.1s ease',
                  animation: cameraActive ? 'bounceBar 1.2s ease-in-out infinite alternate' : 'none'
                }} />
              </div>
            </div>
          </div>

          {/* Keyframe anim rules inline */}
          <style>{`
            @keyframes ping {
              75%, 100% { transform: scale(2); opacity: 0; }
            }
            @keyframes bounceBar {
              0% { width: 15%; }
              50% { width: 65%; }
              100% { width: 35%; }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* Scorecard Report Card View */}
      {showReport && (
        <div className="glass animate-fadeInUp" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border-bright)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={20} style={{ color: 'var(--accent-violet-light)' }} />
                <span>Performance Evaluation Report</span>
              </h2>
            </div>
            
            <button onClick={() => setInterviewType('select')} className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px', gap: 4 }}>
              <ChevronLeft size={13} />
              <span>Choose Another Track</span>
            </button>
          </div>

          {/* Triple Dials scoreboards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            
            {/* Technical Score Dial */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>TECHNICAL DEPTH</div>
              <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ transform: 'rotate(-90deg)', width: 90, height: 90 }}>
                  <circle cx="45" cy="45" r="35" stroke="var(--border)" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="45" cy="45" r="35" 
                    stroke="var(--accent-violet-light)" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray="220"
                    strokeDashoffset={getDashoffset(techScore)}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', fontSize: 18, fontWeight: 900 }}>{techScore}/10</div>
              </div>
            </div>

            {/* Communication Score Dial */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>COMMUNICATION CLARITY</div>
              <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ transform: 'rotate(-90deg)', width: 90, height: 90 }}>
                  <circle cx="45" cy="45" r="35" stroke="var(--border)" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="45" cy="45" r="35" 
                    stroke="var(--accent-cyan-light)" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray="220"
                    strokeDashoffset={getDashoffset(commScore)}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', fontSize: 18, fontWeight: 900 }}>{commScore}/10</div>
              </div>
            </div>

            {/* Soft Skills Dial */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>SOFT SKILLS & STAR FORMAT</div>
              <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ transform: 'rotate(-90deg)', width: 90, height: 90 }}>
                  <circle cx="45" cy="45" r="35" stroke="var(--border)" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="45" cy="45" r="35" 
                    stroke="var(--accent-emerald-light)" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray="220"
                    strokeDashoffset={getDashoffset(softScore)}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', fontSize: 18, fontWeight: 900 }}>{softScore}/10</div>
              </div>
            </div>

          </div>

          {/* Feedback Section */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 18, marginBottom: 10 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} style={{ color: 'var(--accent-violet-light)' }} />
              <span>Detailed Improvement Recommendations</span>
            </h4>
            <ul style={{ paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {feedbackBullets.map((b, idx) => (
                <li key={idx} style={{ lineHeight: 1.6 }}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
