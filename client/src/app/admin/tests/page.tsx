'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { 
  Plus, 
  Trash2, 
  UploadCloud, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Award, 
  Building2, 
  ChevronRight, 
  Edit3, 
  Save, 
  X, 
  Search, 
  Loader2,
  Check,
  AlertTriangle,
  Download
} from 'lucide-react';

interface Question {
  _id: string;
  title: string;
  category: string;
  difficulty: string;
  type: string;
  topic: string;
}

interface TestSection {
  name: string;
  duration?: number;
  questions: string[];
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

interface RowError {
  [key: string]: string;
}

interface ParsedRow {
  id: string;
  title: string;
  category: string;
  company: string;
  duration: string;
  totalMarks: string;
  difficulty: string;
  scheduledAt: string;
  xpReward: string;
  negativeMarking: string;
  negativeMarkValue: string;
  questions: string;
  errors: RowError;
  isValid: boolean;
}

const CATEGORY_OPTIONS = ['aptitude', 'dsa', 'communication', 'full-mock', 'company-specific'];
const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'];

export default function AdminTestsPage() {
  // Lists and state
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsPool, setQuestionsPool] = useState<Question[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Manual Creation Form State
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<string>('aptitude');
  const [formCompany, setFormCompany] = useState('');
  const [formDuration, setFormDuration] = useState('60');
  const [formTotalMarks, setFormTotalMarks] = useState('100');
  const [formDifficulty, setFormDifficulty] = useState<string>('medium');
  const [formScheduledAt, setFormScheduledAt] = useState('');
  const [formXpReward, setFormXpReward] = useState('50');
  const [formNegativeMarking, setFormNegativeMarking] = useState(false);
  const [formNegativeMarkValue, setFormNegativeMarkValue] = useState('0.25');
  const [formSelectedQuestions, setFormSelectedQuestions] = useState<string[]>([]);
  const [qSearchText, setQSearchText] = useState('');
  const [qCategoryFilter, setQCategoryFilter] = useState('all');

  // CSV Uploader and Spreadsheet State
  const [activeTab, setActiveTab] = useState<'list' | 'bulk'>('list');
  const [dragActive, setDragActive] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast helper
  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch tests and questions
  const fetchData = async () => {
    setLoading(true);
    try {
      const testsRes = await api.get('/tests');
      if (testsRes.data?.success) {
        setTests(testsRes.data.tests);
      }
      
      const qRes = await api.get('/questions?limit=1000');
      if (qRes.data?.success) {
        setQuestionsPool(qRes.data.questions);
      }
    } catch (err: any) {
      console.error('Error fetching admin test page data:', err);
      triggerToast(err.response?.data?.message || 'Failed to load test data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Row validator
  const validateRowData = (row: Omit<ParsedRow, 'errors' | 'isValid'>): { errors: RowError; isValid: boolean } => {
    const errors: RowError = {};
    
    if (!row.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!CATEGORY_OPTIONS.includes(row.category.toLowerCase().trim())) {
      errors.category = `Must be one of: ${CATEGORY_OPTIONS.join(', ')}`;
    }
    
    const durationNum = parseInt(row.duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      errors.duration = 'Must be a positive integer';
    }
    
    const marksNum = parseInt(row.totalMarks);
    if (isNaN(marksNum) || marksNum <= 0) {
      errors.totalMarks = 'Must be a positive integer';
    }
    
    if (!DIFFICULTY_OPTIONS.includes(row.difficulty.toLowerCase().trim())) {
      errors.difficulty = 'Must be easy, medium, or hard';
    }
    
    const dateParsed = Date.parse(row.scheduledAt);
    if (isNaN(dateParsed)) {
      errors.scheduledAt = 'Invalid Date Format (use YYYY-MM-DD HH:MM)';
    }
    
    const xpNum = parseInt(row.xpReward);
    if (isNaN(xpNum) || xpNum < 0) {
      errors.xpReward = 'XP Reward must be zero or positive';
    }
    
    const isNeg = row.negativeMarking.toLowerCase().trim() === 'true';
    if (row.negativeMarking && row.negativeMarking.toLowerCase().trim() !== 'true' && row.negativeMarking.toLowerCase().trim() !== 'false') {
      errors.negativeMarking = 'Must be true or false';
    }
    
    if (isNeg) {
      const negVal = parseFloat(row.negativeMarkValue);
      if (isNaN(negVal) || negVal <= 0) {
        errors.negativeMarkValue = 'Must be a decimal number > 0';
      }
    }

    if (row.questions.trim()) {
      const ids = row.questions.split(',').map(s => s.trim());
      const invalidIds = ids.filter(id => id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id));
      if (invalidIds.length > 0) {
        errors.questions = `Contains ${invalidIds.length} invalid 24-character hex ObjectId(s)`;
      }
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };

  // CSV line splitter
  const parseCsvLines = (text: string): string[][] => {
    const lines = text.split(/\r?\n/);
    const rows: string[][] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts: string[] = [];
      let inQuotes = false;
      let currentPart = '';
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(currentPart.trim().replace(/^"|"$/g, ''));
          currentPart = '';
        } else {
          currentPart += char;
        }
      }
      parts.push(currentPart.trim().replace(/^"|"$/g, ''));
      rows.push(parts);
    }
    return rows;
  };

  // Handle CSV processing
  const processCSVContent = (content: string) => {
    try {
      const parsed = parseCsvLines(content);
      if (parsed.length === 0) {
        triggerToast('Empty CSV file', 'error');
        return;
      }
      
      let startIdx = 0;
      let mappedHeaders = {
        title: 0, category: 1, company: 2, duration: 3, totalMarks: 4,
        difficulty: 5, scheduledAt: 6, xpReward: 7, negativeMarking: 8,
        negativeMarkValue: 9, questions: 10
      };

      // Auto-detect header row
      const firstRow = parsed[0].map(c => c.toLowerCase().trim());
      const hasHeader = firstRow.some(col => 
        col.includes('title') || col.includes('category') || col.includes('duration') || col.includes('schedule')
      );

      if (hasHeader) {
        startIdx = 1;
        firstRow.forEach((col, idx) => {
          if (col.includes('title')) mappedHeaders.title = idx;
          else if (col.includes('category')) mappedHeaders.category = idx;
          else if (col.includes('company')) mappedHeaders.company = idx;
          else if (col.includes('duration')) mappedHeaders.duration = idx;
          else if (col.includes('mark') || col.includes('score')) mappedHeaders.totalMarks = idx;
          else if (col.includes('difficulty')) mappedHeaders.difficulty = idx;
          else if (col.includes('scheduled') || col.includes('date') || col.includes('time')) mappedHeaders.scheduledAt = idx;
          else if (col.includes('xp')) mappedHeaders.xpReward = idx;
          else if (col.includes('negativemarking') || col.includes('negative marking') || col.includes('neg marking')) mappedHeaders.negativeMarking = idx;
          else if (col.includes('negativemarkvalue') || col.includes('negative mark value') || col.includes('neg value')) mappedHeaders.negativeMarkValue = idx;
          else if (col.includes('question') || col.includes('ids') || col.includes('qids')) mappedHeaders.questions = idx;
        });
      }

      const rows: ParsedRow[] = [];
      for (let i = startIdx; i < parsed.length; i++) {
        const line = parsed[i];
        if (line.length <= 1 && !line[0]) continue; // Skip blank lines

        const getColVal = (idx: number) => (line[idx] !== undefined ? line[idx].trim() : '');
        
        const rawRow = {
          id: `csv-${i}-${Date.now()}`,
          title: getColVal(mappedHeaders.title),
          category: getColVal(mappedHeaders.category) || 'aptitude',
          company: getColVal(mappedHeaders.company),
          duration: getColVal(mappedHeaders.duration) || '60',
          totalMarks: getColVal(mappedHeaders.totalMarks) || '100',
          difficulty: getColVal(mappedHeaders.difficulty) || 'medium',
          scheduledAt: getColVal(mappedHeaders.scheduledAt) || new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
          xpReward: getColVal(mappedHeaders.xpReward) || '50',
          negativeMarking: getColVal(mappedHeaders.negativeMarking) || 'false',
          negativeMarkValue: getColVal(mappedHeaders.negativeMarkValue) || '0.25',
          questions: getColVal(mappedHeaders.questions)
        };

        const { errors, isValid } = validateRowData(rawRow);
        rows.push({
          ...rawRow,
          errors,
          isValid
        });
      }

      setParsedRows(rows);
      triggerToast(`Parsed ${rows.length} rows successfully. Please review the spreadsheet below.`);
    } catch (err: any) {
      console.error(err);
      triggerToast('Failed to parse CSV file. Ensure it is a valid format.', 'error');
    }
  };

  // File drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target?.result) {
            processCSVContent(evt.target.result as string);
          }
        };
        reader.readAsText(file);
      } else {
        triggerToast('Please upload a standard CSV file.', 'error');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          processCSVContent(evt.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  // Add and delete row from preview grid
  const addPreviewRow = () => {
    const newRow: ParsedRow = {
      id: `manual-row-${Date.now()}`,
      title: 'New Mock Test',
      category: 'aptitude',
      company: '',
      duration: '60',
      totalMarks: '100',
      difficulty: 'medium',
      scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
      xpReward: '50',
      negativeMarking: 'false',
      negativeMarkValue: '0.25',
      questions: '',
      errors: {},
      isValid: true
    };
    setParsedRows([...parsedRows, newRow]);
  };

  const deletePreviewRow = (id: string) => {
    setParsedRows(parsedRows.filter(r => r.id !== id));
  };

  // Edit cell value in the uploader spreadsheet
  const handleCellEdit = (rowId: string, field: string, value: string) => {
    const updated = parsedRows.map(row => {
      if (row.id === rowId) {
        const updatedRow = { ...row, [field]: value };
        const { errors, isValid } = validateRowData(updatedRow);
        return {
          ...updatedRow,
          errors,
          isValid
        };
      }
      return row;
    });
    setParsedRows(updated);
  };

  // Save manual creation
  const handleSaveManualTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return triggerToast('Title is required', 'error');

    const formattedTest = {
      title: formTitle,
      description: formDesc,
      category: formCategory,
      company: formCompany || undefined,
      duration: parseInt(formDuration),
      totalMarks: parseInt(formTotalMarks),
      difficulty: formDifficulty,
      scheduledAt: new Date(formScheduledAt).toISOString(),
      xpReward: parseInt(formXpReward),
      negativeMarking: formNegativeMarking,
      negativeMarkValue: parseFloat(formNegativeMarkValue),
      sections: [
        {
          name: 'General Section',
          duration: parseInt(formDuration),
          questions: formSelectedQuestions
        }
      ]
    };

    try {
      if (editingTestId) {
        const res = await api.put(`/tests/${editingTestId}`, formattedTest);
        if (res.data?.success) {
          triggerToast('Mock Test updated successfully');
          setShowFormModal(false);
          setEditingTestId(null);
          fetchData();
        }
      } else {
        const res = await api.post('/tests', formattedTest);
        if (res.data?.success) {
          triggerToast('Mock Test scheduled successfully');
          setShowFormModal(false);
          fetchData();
        }
      }
    } catch (err: any) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Failed to save mock test', 'error');
    }
  };

  // Trigger manual edit prefill
  const editTest = (test: Test) => {
    setEditingTestId(test._id);
    setFormTitle(test.title);
    setFormDesc(test.description || '');
    setFormCategory(test.category);
    setFormCompany(test.company || '');
    setFormDuration(test.duration.toString());
    setFormTotalMarks(test.totalMarks.toString());
    setFormDifficulty(test.difficulty);
    setFormScheduledAt(new Date(test.scheduledAt).toISOString().slice(0, 16));
    setFormXpReward(test.xpReward.toString());
    setFormNegativeMarking(test.negativeMarking);
    setFormNegativeMarkValue(test.negativeMarkValue.toString());
    
    const activeQuestions = test.sections?.[0]?.questions || [];
    setFormSelectedQuestions(activeQuestions);
    
    setShowFormModal(true);
  };

  // Toggle publish state
  const togglePublish = async (test: Test) => {
    try {
      const res = await api.put(`/tests/${test._id}`, { isPublished: !test.isPublished });
      if (res.data?.success) {
        triggerToast(`Test ${!test.isPublished ? 'published' : 'unpublished'} successfully`);
        fetchData();
      }
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to toggle publish status', 'error');
    }
  };

  // Delete mock test
  const deleteTest = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this mock test? This will remove all student schedules and records associated with it.')) return;
    try {
      const res = await api.delete(`/tests/${id}`);
      if (res.data?.success) {
        triggerToast('Mock test deleted');
        fetchData();
      }
    } catch (err: any) {
      triggerToast('Failed to delete mock test', 'error');
    }
  };

  // Submit bulk imports
  const handleBulkImport = async () => {
    const invalidRowsCount = parsedRows.filter(r => !r.isValid).length;
    if (invalidRowsCount > 0) {
      triggerToast(`Please correct all validation errors (${invalidRowsCount} invalid rows remaining) before uploading.`, 'error');
      return;
    }
    
    if (parsedRows.length === 0) {
      triggerToast('No rows to import', 'error');
      return;
    }

    setLoading(true);
    let successCount = 0;
    
    try {
      for (const row of parsedRows) {
        const qList = row.questions.trim() 
          ? row.questions.split(',').map(q => q.trim()).filter(q => q.length === 24)
          : [];
          
        const formatted = {
          title: row.title,
          description: `Bulk imported test. Category: ${row.category}`,
          category: row.category.toLowerCase().trim(),
          company: row.company ? row.company.trim() : undefined,
          duration: parseInt(row.duration),
          totalMarks: parseInt(row.totalMarks),
          difficulty: row.difficulty.toLowerCase().trim(),
          scheduledAt: new Date(row.scheduledAt.trim()).toISOString(),
          xpReward: parseInt(row.xpReward),
          negativeMarking: row.negativeMarking.toLowerCase().trim() === 'true',
          negativeMarkValue: parseFloat(row.negativeMarkValue),
          sections: [
            {
              name: 'Core Section',
              duration: parseInt(row.duration),
              questions: qList
            }
          ],
          isPublished: false // start as drafts
        };
        
        await api.post('/tests', formatted);
        successCount++;
      }
      
      triggerToast(`Successfully scheduled ${successCount} mock tests!`);
      setParsedRows([]);
      setActiveTab('list');
      fetchData();
    } catch (err: any) {
      console.error(err);
      triggerToast(`Imported ${successCount} tests. FAILED to import next row: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open manual clean form
  const openNewForm = () => {
    setEditingTestId(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory('aptitude');
    setFormCompany('');
    setFormDuration('60');
    setFormTotalMarks('100');
    setFormDifficulty('medium');
    setFormScheduledAt(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
    setFormXpReward('50');
    setFormNegativeMarking(false);
    setFormNegativeMarkValue('0.25');
    setFormSelectedQuestions([]);
    setShowFormModal(true);
  };

  // CSV Template download generator
  const downloadTemplate = () => {
    const headers = ['Title', 'Category', 'Company', 'Duration', 'Total Marks', 'Difficulty', 'Scheduled Date', 'XP Reward', 'Negative Marking', 'Negative Mark Value', 'Question IDs'];
    const sampleRows = [
      ['TCS NQT National Mock', 'company-specific', 'TCS', '90', '100', 'medium', '2026-06-25 10:00', '150', 'false', '0', ''],
      ['DSA Coding Battle #3', 'dsa', '', '120', '120', 'hard', '2026-06-28 14:00', '200', 'true', '0.25', '65882cd8e25d2b001efab81a,65882cd8e25d2b001efab81b']
    ];
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...sampleRows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "place1_test_schedule_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter list of tests
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (test.company && test.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || test.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filter questions pool in manual form
  const filteredQuestions = questionsPool.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(qSearchText.toLowerCase()) || 
                          q.topic.toLowerCase().includes(qSearchText.toLowerCase());
    const matchesCat = qCategoryFilter === 'all' || q.category === qCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const toggleQuestionSelection = (qid: string) => {
    if (formSelectedQuestions.includes(qid)) {
      setFormSelectedQuestions(formSelectedQuestions.filter(id => id !== qid));
    } else {
      setFormSelectedQuestions([...formSelectedQuestions, qid]);
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }} className="animate-fadeInUp">
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1100,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(220,38,38,0.95)',
          color: '#fff', border: `1px solid ${toast.type === 'success' ? '#34d399' : '#f87171'}`,
          borderRadius: 8, padding: '12px 20px', fontSize: 13.5, fontWeight: 500,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 10,
          backdropFilter: 'blur(8px)', animation: 'fadeInUp 0.2s ease-out'
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Title & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={24} style={{ color: 'var(--accent-violet-light)' }} />
            <span>Mock Test Scheduler</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Schedule single mock tests, customize questions, or bulk upload calendar sessions via Excel spreadsheet.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => setActiveTab(activeTab === 'list' ? 'bulk' : 'list')}
            className="btn-secondary"
            style={{ fontSize: 13 }}
          >
            {activeTab === 'list' ? (
              <>
                <UploadCloud size={15} />
                <span>Bulk Upload Spreadsheet</span>
              </>
            ) : (
              <>
                <ChevronRight size={15} style={{ transform: 'rotate(180deg)' }} />
                <span>Back to Tests List</span>
              </>
            )}
          </button>
          
          {activeTab === 'list' && (
            <button 
              onClick={openNewForm}
              className="btn-primary"
              style={{ fontSize: 13 }}
            >
              <Plus size={15} />
              <span>Schedule Test</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'list' ? (
        <>
          {/* Filters Bar */}
          <div className="glass" style={{ borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search mock tests by title or company..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: 38 }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', ...CATEGORY_OPTIONS].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid', cursor: 'pointer',
                    background: categoryFilter === cat ? 'var(--text-primary)' : 'var(--bg-secondary)',
                    borderColor: categoryFilter === cat ? 'var(--text-primary)' : 'var(--border)',
                    color: categoryFilter === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat === 'all' ? 'All Categories' : cat.toUpperCase().replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Test Listing Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
              <Loader2 className="animate-spin-fast" size={32} style={{ color: 'var(--accent-violet-light)' }} />
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="glass" style={{ borderRadius: 14, padding: '60px 20px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <FileSpreadsheet size={40} style={{ color: 'var(--text-muted)', marginBottom: 12, opacity: 0.5 }} />
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>No mock tests found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                Schedule a manual mock test or import tests bulk using a CSV spreadsheet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 }}>
              {filteredTests.map(test => {
                const totalQs = test.sections?.reduce((acc, s) => acc + (s.questions?.length || 0), 0) || 0;
                const isUpcoming = new Date(test.scheduledAt) > new Date();
                
                return (
                  <div key={test._id} className="glass hover-lift" style={{ borderRadius: 12, padding: 20, border: '1px solid var(--border)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 10, background: 'var(--border-bright)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
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
                      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}>DURATION</div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <Clock size={11} style={{ color: 'var(--text-secondary)' }} />
                          <span>{test.duration}m</span>
                        </div>
                      </div>
                      
                      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}>QUESTIONS</div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>
                          {totalQs} Qs
                        </div>
                      </div>

                      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}>XP REWARD</div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <Award size={11} style={{ color: 'var(--accent-violet-light)' }} />
                          <span>+{test.xpReward}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                        <span>{new Date(test.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        {isUpcoming ? (
                          <span style={{ fontSize: 9, background: 'rgba(217,119,6,0.1)', color: 'var(--accent-amber-light)', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>Upcoming</span>
                        ) : (
                          <span style={{ fontSize: 9, background: 'rgba(5,150,105,0.1)', color: 'var(--accent-emerald-light)', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>Live / Past</span>
                        )}
                      </div>
                      
                      {test.negativeMarking && (
                        <div style={{ color: 'var(--accent-danger-light)', fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <AlertCircle size={10} />
                          <span>Negative Marking Enabled (-{test.negativeMarkValue})</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Operations */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                      <button
                        onClick={() => togglePublish(test)}
                        style={{
                          background: test.isPublished ? 'rgba(5,150,105,0.1)' : 'var(--bg-secondary)',
                          border: `1px solid ${test.isPublished ? 'rgba(5,150,105,0.2)' : 'var(--border)'}`,
                          color: test.isPublished ? 'var(--accent-emerald-light)' : 'var(--text-secondary)',
                          fontSize: 11, padding: '4px 10px', borderRadius: 4, fontWeight: 600, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s'
                        }}
                      >
                        {test.isPublished ? <Check size={11} /> : <X size={11} />}
                        <span>{test.isPublished ? 'Published (Live)' : 'Draft (Hidden)'}</span>
                      </button>
                      
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => editTest(test)}
                          className="btn-secondary"
                          style={{ padding: '4px 8px', borderRadius: 4, fontSize: 11 }}
                          title="Edit Details"
                        >
                          <Edit3 size={11} />
                        </button>
                        
                        <button
                          onClick={() => deleteTest(test._id)}
                          style={{
                            background: 'transparent', border: '1px solid var(--border)', color: '#ef4444',
                            padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer'
                          }}
                          title="Delete Mock Test"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* CSV Uploader & Spreadsheet Preview View */
        <div className="glass" style={{ borderRadius: 14, padding: 24, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Bulk Spreadsheet Importer</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                Upload or drag a comma-separated Excel export (.csv).
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={downloadTemplate}
                className="btn-secondary"
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                <Download size={13} />
                <span>Download CSV Template</span>
              </button>
              
              {parsedRows.length > 0 && (
                <button
                  onClick={addPreviewRow}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: '6px 12px' }}
                >
                  <Plus size={13} />
                  <span>Add Row</span>
                </button>
              )}
            </div>
          </div>

          {/* Drag & Drop Area */}
          {parsedRows.length === 0 ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? 'var(--accent-violet)' : 'var(--border)'}`,
                background: dragActive ? 'rgba(109,40,217,0.05)' : 'var(--bg-secondary)',
                borderRadius: 12, padding: '60px 20px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.2s ease', position: 'relative'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              <UploadCloud size={44} style={{ color: dragActive ? 'var(--accent-violet-light)' : 'var(--text-muted)', marginBottom: 12 }} />
              <h4 style={{ fontSize: 15, fontWeight: 600 }}>Drag and drop your spreadsheet here</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4, marginBottom: 16 }}>
                or click to browse local files (Microsoft Excel exported CSV only)
              </p>
              <div style={{ background: 'var(--bg-primary)', display: 'inline-block', padding: '6px 12px', borderRadius: 6, fontSize: 11, border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                Required Fields: Title, Category, Duration, Total Marks, Difficulty, Scheduled Date, XP Reward
              </div>
            </div>
          ) : (
            /* Interactive Spreadsheet Preview Grid */
            <div>
              {/* Status Header info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  <div>Total Rows: <span style={{ fontWeight: 700 }}>{parsedRows.length}</span></div>
                  <div>Valid: <span style={{ fontWeight: 700, color: 'var(--accent-emerald-light)' }}>{parsedRows.filter(r => r.isValid).length}</span></div>
                  <div>Invalid: <span style={{ fontWeight: 700, color: 'var(--accent-danger-light)' }}>{parsedRows.filter(r => !r.isValid).length}</span></div>
                </div>
                
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => { setParsedRows([]); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="btn-secondary"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                  >
                    Clear Spreadsheet
                  </button>
                  <button
                    onClick={handleBulkImport}
                    className="btn-primary"
                    disabled={parsedRows.length === 0 || loading}
                    style={{ fontSize: 12, padding: '6px 12px', background: parsedRows.some(r => !r.isValid) ? 'var(--border)' : 'var(--text-primary)', color: parsedRows.some(r => !r.isValid) ? 'var(--text-muted)' : 'var(--bg-primary)', cursor: parsedRows.some(r => !r.isValid) ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? <Loader2 size={13} className="animate-spin-fast" /> : <Save size={13} />}
                    <span>Bulk Save Schedules ({parsedRows.length} Tests)</span>
                  </button>
                </div>
              </div>

              {parsedRows.some(r => !r.isValid) && (
                <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 8, padding: '10px 16px', marginBottom: 14, fontSize: 12.5, color: 'var(--accent-danger-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={14} />
                  <span>Some rows contain invalid fields (highlighted in red). Double-click a cell to edit and fix it directly inside the grid.</span>
                </div>
              )}

              {/* Grid Scroll Area */}
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, textAlign: 'left', minWidth: 1200 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '8px 10px', width: 40, borderRight: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'center' }}>#</th>
                      <th style={{ padding: '8px 10px', width: 60, borderRight: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '8px 12px', borderRight: '1px solid var(--border)' }}>Title</th>
                      <th style={{ padding: '8px 12px', width: 120, borderRight: '1px solid var(--border)' }}>Category</th>
                      <th style={{ padding: '8px 12px', width: 100, borderRight: '1px solid var(--border)' }}>Company</th>
                      <th style={{ padding: '8px 12px', width: 85, borderRight: '1px solid var(--border)' }}>Dur (min)</th>
                      <th style={{ padding: '8px 12px', width: 85, borderRight: '1px solid var(--border)' }}>Marks</th>
                      <th style={{ padding: '8px 12px', width: 90, borderRight: '1px solid var(--border)' }}>Difficulty</th>
                      <th style={{ padding: '8px 12px', width: 150, borderRight: '1px solid var(--border)' }}>Scheduled Date</th>
                      <th style={{ padding: '8px 12px', width: 80, borderRight: '1px solid var(--border)' }}>XP</th>
                      <th style={{ padding: '8px 12px', width: 80, borderRight: '1px solid var(--border)' }}>Neg Marks</th>
                      <th style={{ padding: '8px 12px', width: 80, borderRight: '1px solid var(--border)' }}>Neg Value</th>
                      <th style={{ padding: '8px 12px', borderRight: '1px solid var(--border)' }}>Question IDs (hex csv)</th>
                      <th style={{ padding: '8px 10px', width: 50, textAlign: 'center' }}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, idx) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid var(--border)', background: row.isValid ? 'transparent' : 'rgba(220,38,38,0.02)' }}>
                        <td style={{ padding: '6px 10px', borderRight: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'center', background: 'var(--bg-secondary)' }}>{idx + 1}</td>
                        <td style={{ padding: '6px 10px', borderRight: '1px solid var(--border)', textAlign: 'center' }}>
                          {row.isValid ? (
                            <CheckCircle2 size={15} style={{ color: 'var(--accent-emerald-light)' }} />
                          ) : (
                            <div title={Object.values(row.errors).join('\n')} style={{ color: 'var(--accent-danger-light)', cursor: 'help', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <AlertCircle size={15} />
                            </div>
                          )}
                        </td>
                        
                        {/* Title Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'title' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)',
                            background: row.errors.title ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.title ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'title' ? (
                            <input
                              type="text"
                              value={row.title}
                              onChange={e => handleCellEdit(row.id, 'title', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5 }}
                            />
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block', minHeight: 18 }}>{row.title || <span style={{ color: 'var(--text-muted)' }}>Empty</span>}</span>
                          )}
                        </td>

                        {/* Category Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'category' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)',
                            background: row.errors.category ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.category ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'category' ? (
                            <select
                              value={row.category}
                              onChange={e => handleCellEdit(row.id, 'category', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'var(--bg-secondary)', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5 }}
                            >
                              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block' }}>{row.category}</span>
                          )}
                        </td>

                        {/* Company Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'company' })}
                          style={{ padding: '6px 12px', borderRight: '1px solid var(--border)' }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'company' ? (
                            <input
                              type="text"
                              value={row.company}
                              onChange={e => handleCellEdit(row.id, 'company', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5 }}
                            />
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block', minHeight: 18 }}>{row.company || <span style={{ color: 'var(--text-muted)' }}>None</span>}</span>
                          )}
                        </td>

                        {/* Duration Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'duration' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)', textAlign: 'right',
                            background: row.errors.duration ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.duration ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'duration' ? (
                            <input
                              type="number"
                              value={row.duration}
                              onChange={e => handleCellEdit(row.id, 'duration', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5, textAlign: 'right' }}
                            />
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block' }}>{row.duration}</span>
                          )}
                        </td>

                        {/* Total Marks Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'totalMarks' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)', textAlign: 'right',
                            background: row.errors.totalMarks ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.totalMarks ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'totalMarks' ? (
                            <input
                              type="number"
                              value={row.totalMarks}
                              onChange={e => handleCellEdit(row.id, 'totalMarks', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5, textAlign: 'right' }}
                            />
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block' }}>{row.totalMarks}</span>
                          )}
                        </td>

                        {/* Difficulty Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'difficulty' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)',
                            background: row.errors.difficulty ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.difficulty ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'difficulty' ? (
                            <select
                              value={row.difficulty}
                              onChange={e => handleCellEdit(row.id, 'difficulty', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'var(--bg-secondary)', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5 }}
                            >
                              {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block' }}>{row.difficulty}</span>
                          )}
                        </td>

                        {/* Scheduled Date Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'scheduledAt' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)',
                            background: row.errors.scheduledAt ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.scheduledAt ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'scheduledAt' ? (
                            <input
                              type="text"
                              value={row.scheduledAt}
                              onChange={e => handleCellEdit(row.id, 'scheduledAt', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                              autoFocus
                              placeholder="YYYY-MM-DD HH:MM"
                              style={{ width: '100%', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5 }}
                            />
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block', fontFamily: 'monospace' }}>{row.scheduledAt}</span>
                          )}
                        </td>

                        {/* XP Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'xpReward' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)', textAlign: 'right',
                            background: row.errors.xpReward ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.xpReward ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'xpReward' ? (
                            <input
                              type="number"
                              value={row.xpReward}
                              onChange={e => handleCellEdit(row.id, 'xpReward', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5, textAlign: 'right' }}
                            />
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block' }}>{row.xpReward}</span>
                          )}
                        </td>

                        {/* Negative Marking Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'negativeMarking' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)',
                            background: row.errors.negativeMarking ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.negativeMarking ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'negativeMarking' ? (
                            <select
                              value={row.negativeMarking}
                              onChange={e => handleCellEdit(row.id, 'negativeMarking', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'var(--bg-secondary)', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5 }}
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block' }}>{row.negativeMarking}</span>
                          )}
                        </td>

                        {/* Negative Value Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'negativeMarkValue' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)', textAlign: 'right',
                            background: row.errors.negativeMarkValue ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.negativeMarkValue ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'negativeMarkValue' ? (
                            <input
                              type="text"
                              value={row.negativeMarkValue}
                              onChange={e => handleCellEdit(row.id, 'negativeMarkValue', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5, textAlign: 'right' }}
                            />
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block' }}>{row.negativeMarkValue}</span>
                          )}
                        </td>

                        {/* Question IDs Cell */}
                        <td 
                          onDoubleClick={() => setEditingCell({ rowId: row.id, field: 'questions' })}
                          style={{
                            padding: '6px 12px', borderRight: '1px solid var(--border)',
                            background: row.errors.questions ? 'rgba(220,38,38,0.08)' : 'transparent',
                            outline: row.errors.questions ? '1px solid var(--accent-danger)' : 'none'
                          }}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'questions' ? (
                            <input
                              type="text"
                              value={row.questions}
                              onChange={e => handleCellEdit(row.id, 'questions', e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                              autoFocus
                              style={{ width: '100%', background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: 12.5 }}
                              placeholder="hexid1,hexid2"
                            />
                          ) : (
                            <span style={{ cursor: 'pointer', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 150, fontFamily: 'monospace', minHeight: 18 }}>
                              {row.questions || <span style={{ color: 'var(--text-muted)' }}>Empty (Auto-created section)</span>}
                            </span>
                          )}
                        </td>

                        {/* Row Delete Cell */}
                        <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                          <button
                            onClick={() => deletePreviewRow(row.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Creation Form Dialog Modal */}
      {showFormModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="glass-bright" style={{
            width: '100%', maxWidth: 850, borderRadius: 16, border: '1px solid var(--border-bright)',
            display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                {editingTestId ? 'Edit Mock Test Schedule' : 'Schedule New Mock Test'}
              </h3>
              <button 
                onClick={() => { setShowFormModal(false); setEditingTestId(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Form Scroll Area */}
            <form onSubmit={handleSaveManualTest} style={{ overflowY: 'auto', flex: 1, padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
                {/* Title */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>TEST TITLE *</label>
                  <input 
                    type="text" 
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. TCS NQT Full Mock Aptitude Test"
                    className="input-field"
                    required
                  />
                </div>

                {/* Description */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>DESCRIPTION</label>
                  <textarea 
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    placeholder="Describe guidelines, number of sections, marking scheme, etc."
                    className="input-field"
                    rows={2}
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>CATEGORY *</label>
                  <select 
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="input-field"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt.toUpperCase().replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>

                {/* Company (if company-specific) */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>TARGET COMPANY (OPTIONAL)</label>
                  <input 
                    type="text" 
                    value={formCompany}
                    onChange={e => setFormCompany(e.target.value)}
                    placeholder="e.g. TCS, Infosys, Zoho"
                    className="input-field"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>DURATION (MINUTES) *</label>
                  <input 
                    type="number" 
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    className="input-field"
                    required
                    min={1}
                  />
                </div>

                {/* Total Marks */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>TOTAL MARKS *</label>
                  <input 
                    type="number" 
                    value={formTotalMarks}
                    onChange={e => setFormTotalMarks(e.target.value)}
                    className="input-field"
                    required
                    min={1}
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>DIFFICULTY *</label>
                  <select 
                    value={formDifficulty}
                    onChange={e => setFormDifficulty(e.target.value)}
                    className="input-field"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    {DIFFICULTY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Scheduled Date */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>SCHEDULE START TIME *</label>
                  <input 
                    type="datetime-local" 
                    value={formScheduledAt}
                    onChange={e => setFormScheduledAt(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                {/* XP reward */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>XP REWARD *</label>
                  <input 
                    type="number" 
                    value={formXpReward}
                    onChange={e => setFormXpReward(e.target.value)}
                    className="input-field"
                    required
                    min={0}
                  />
                </div>

                {/* Negative marking value */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>NEG MARK VALUE (IF ENABLED)</label>
                  <input 
                    type="text" 
                    value={formNegativeMarkValue}
                    onChange={e => setFormNegativeMarkValue(e.target.value)}
                    className="input-field"
                    disabled={!formNegativeMarking}
                  />
                </div>

                {/* Negative Marking Toggle */}
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <input 
                    type="checkbox" 
                    id="negMarkToggle"
                    checked={formNegativeMarking}
                    onChange={e => setFormNegativeMarking(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: 'var(--accent-violet)' }}
                  />
                  <label htmlFor="negMarkToggle" style={{ fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                    Enable Negative Marking scheme (deduct marks for incorrect choices)
                  </label>
                </div>
              </div>

              {/* Question Selection Module */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Link Mock Questions ({formSelectedQuestions.length} selected)</h4>
                
                {/* Search in Modal */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <input 
                    type="text" 
                    placeholder="Search question pool by title, topic..."
                    value={qSearchText}
                    onChange={e => setQSearchText(e.target.value)}
                    className="input-field"
                    style={{ flex: 1 }}
                  />
                  
                  <select
                    value={qCategoryFilter}
                    onChange={e => setQCategoryFilter(e.target.value)}
                    className="input-field"
                    style={{ width: 150, background: 'var(--bg-secondary)' }}
                  >
                    <option value="all">All Categories</option>
                    <option value="aptitude">Aptitude</option>
                    <option value="dsa">DSA</option>
                    <option value="communication">Comm</option>
                    <option value="hr">HR</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>

                {/* Question List Scroll */}
                <div style={{
                  maxHeight: 200, overflowY: 'auto', border: '1px solid var(--border)',
                  borderRadius: 8, background: 'var(--bg-secondary)', padding: '6px'
                }}>
                  {filteredQuestions.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                      No matching questions in pool
                    </div>
                  ) : (
                    filteredQuestions.map(q => {
                      const isSelected = formSelectedQuestions.includes(q._id);
                      return (
                        <div 
                          key={q._id} 
                          onClick={() => toggleQuestionSelection(q._id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                            borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
                            background: isSelected ? 'rgba(109,40,217,0.08)' : 'transparent',
                            borderBottom: '1px solid var(--border)'
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => {}} // handled by click parent
                            style={{ accentColor: 'var(--accent-violet)' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{q.title}</div>
                            <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', display: 'flex', gap: 10, marginTop: 2 }}>
                              <span>Topic: {q.topic}</span>
                              <span>Category: {q.category.toUpperCase()}</span>
                              <span style={{ textTransform: 'uppercase' }}>Difficulty: {q.difficulty}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 20 }}>
                <button 
                  type="button" 
                  onClick={() => { setShowFormModal(false); setEditingTestId(null); }}
                  className="btn-secondary"
                  style={{ padding: '8px 20px' }}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ padding: '8px 20px' }}
                >
                  <Save size={15} />
                  <span>{editingTestId ? 'Save Changes' : 'Schedule Test'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
