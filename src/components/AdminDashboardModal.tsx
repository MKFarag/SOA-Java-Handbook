import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Megaphone, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Download, 
  RefreshCw, 
  Search, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Key
} from 'lucide-react';
import type { StudentProfile, BroadcastItem, BroadcastType } from '../types';
import { 
  getAllStudents, 
  setStudentCertificateStatus, 
  deleteStudentRecord, 
  getBroadcasts, 
  publishBroadcast, 
  deleteBroadcast, 
  verifyAdminPassword 
} from '../services/firebaseService';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalHandbookTopics: number;
  onBroadcastsUpdated?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  totalHandbookTopics,
  onBroadcastsUpdated
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: 'students' | 'broadcasts'
  const [activeTab, setActiveTab] = useState<'students' | 'broadcasts'>('students');

  // Students Data
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Broadcasts Data
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(false);

  // New Broadcast Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<BroadcastType>('link');
  const [newUrl, setNewUrl] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [submittingBroadcast, setSubmittingBroadcast] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Load data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const loadAllData = async () => {
    fetchStudents();
    fetchBroadcasts();
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchBroadcasts = async () => {
    setLoadingBroadcasts(true);
    try {
      const data = await getBroadcasts();
      setBroadcasts(data);
      if (onBroadcastsUpdated) onBroadcastsUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBroadcasts(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (verifyAdminPassword(passwordInput)) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      setAuthError('Incorrect Admin Passcode. Access denied.');
    }
  };

  const handleToggleCertificate = async (code: string, currentStatus: boolean) => {
    try {
      await setStudentCertificateStatus(code, !currentStatus);
      setStudents(prev => prev.map(s => s.code === code ? { ...s, certificateUnlocked: !currentStatus } : s));
    } catch (err) {
      alert('Failed to update certificate status.');
    }
  };

  const handleDeleteStudent = async (code: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete student "${name}" (${code})?`)) {
      try {
        await deleteStudentRecord(code);
        setStudents(prev => prev.filter(s => s.code !== code));
      } catch (err) {
        alert('Failed to delete student.');
      }
    }
  };

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!newTitle.trim()) {
      setFormError('Title is required.');
      return;
    }

    setSubmittingBroadcast(true);
    try {
      await publishBroadcast({
        title: newTitle.trim(),
        type: newType,
        url: newUrl.trim() || undefined,
        content: newContent.trim(),
        badgeLabel: newBadge.trim() || undefined,
        createdAt: new Date().toISOString(),
        author: 'Mohamed Khaled Farag (Lead Instructor)'
      });

      setFormSuccess('Broadcast published to all students successfully!');
      setNewTitle('');
      setNewUrl('');
      setNewContent('');
      setNewBadge('');
      fetchBroadcasts();
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to publish broadcast.');
    } finally {
      setSubmittingBroadcast(false);
    }
  };

  const handleDeleteBroadcast = async (id: string, title: string) => {
    if (window.confirm(`Delete broadcast "${title}"? This will immediately remove it for all users.`)) {
      try {
        await deleteBroadcast(id);
        setBroadcasts(prev => prev.filter(b => b.id !== id));
        if (onBroadcastsUpdated) onBroadcastsUpdated();
      } catch (err) {
        alert('Failed to delete broadcast.');
      }
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('No students to export.');
      return;
    }

    const headers = ['Code', 'Name', 'Completed Topics', 'Progress %', 'Certificate Unlocked', 'Last Active'];
    const rows = students.map(s => [
      `"${s.code}"`,
      `"${s.name}"`,
      s.completedCount,
      `${Math.round((s.completedCount / totalHandbookTopics) * 100)}%`,
      s.certificateUnlocked ? 'YES' : 'NO',
      `"${s.lastActive}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `soa_students_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter students by query
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const totalStudents = students.length;
  const certifiedStudents = students.filter(s => s.certificateUnlocked || s.completedCount >= totalHandbookTopics).length;
  const totalTopicsCompletedAll = students.reduce((acc, s) => acc + s.completedCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-5xl max-h-[90vh] bg-white dark:bg-[#18181b] border border-orange-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Instructor & Admin Command Center
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold uppercase">
                  Confidential
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                NTI Java & SOA Master Curriculum · Mohamed Khaled Farag
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Password Authentication Gate */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-5 max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-orange-500 shadow-inner">
              <Key className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Master Security Gate
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Enter your instructor passcode to access real-time student analytics and broadcast control.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Master Passcode"
                autoFocus
                className="w-full px-4 py-2.5 text-center text-sm font-mono tracking-widest rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />

              {authError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                Authenticate & Enter
              </button>
            </form>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block">
                  Registered Students
                </span>
                <span className="text-xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                  {totalStudents}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block">
                  Certificates Unlocked
                </span>
                <span className="text-xl font-extrabold font-mono text-amber-500">
                  {certifiedStudents}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block">
                  Total Completed Modules
                </span>
                <span className="text-xl font-extrabold font-mono text-emerald-500">
                  {totalTopicsCompletedAll}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block">
                  Active Broadcasts
                </span>
                <span className="text-xl font-extrabold font-mono text-blue-500">
                  {broadcasts.length}
                </span>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#18181b]">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('students')}
                  className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                    activeTab === 'students'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Students Roster ({students.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('broadcasts')}
                  className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                    activeTab === 'broadcasts'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Broadcasts & Resources ({broadcasts.length})</span>
                </button>
              </div>

              {activeTab === 'students' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={fetchStudents}
                    disabled={loadingStudents}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    title="Refresh Students"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingStudents ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Tab 1: Students Roster View */}
            {activeTab === 'students' && (
              <div className="flex-1 flex flex-col p-6 overflow-hidden space-y-4">
                {/* Search Bar */}
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name or unique code..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                </div>

                {/* Table Container */}
                <div className="flex-1 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800/90 text-zinc-600 dark:text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="py-2.5 px-4">Student Name</th>
                        <th className="py-2.5 px-3">Unique Code</th>
                        <th className="py-2.5 px-4">Completed Topics</th>
                        <th className="py-2.5 px-3">Last Active</th>
                        <th className="py-2.5 px-3 text-center">Certificate</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-zinc-400">
                            {loadingStudents ? 'Loading students from Firestore...' : 'No students registered yet.'}
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => {
                          const pct = Math.round((student.completedCount / totalHandbookTopics) * 100);
                          return (
                            <tr key={student.code} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                              <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                                {student.name}
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                                  {student.code}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="space-y-1 max-w-[140px]">
                                  <div className="flex items-center justify-between text-[11px] font-mono">
                                    <span>{student.completedCount} / {totalHandbookTopics}</span>
                                    <span className="font-bold">{pct}%</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full"
                                      style={{ width: `${Math.min(pct, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">
                                {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleCertificate(student.code, student.certificateUnlocked)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                    student.certificateUnlocked
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                                  }`}
                                  title="Click to toggle certificate access"
                                >
                                  {student.certificateUnlocked ? (
                                    <>
                                      <Unlock className="w-3 h-3 text-emerald-500" />
                                      <span>Unlocked</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3 h-3 text-zinc-400" />
                                      <span>Locked</span>
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(student.code, student.name)}
                                  className="p-1 rounded text-zinc-400 hover:text-red-500 transition-colors"
                                  title="Delete Student Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Broadcasts & Shared Resources */}
            {activeTab === 'broadcasts' && (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
                {/* Left: Create Form */}
                <div className="space-y-4">
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-orange-500" />
                      <span>Publish New Announcement or Resource</span>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Broadcast Google Drive folders, project assignments, or direct notices to all students.
                    </p>
                  </div>

                  <form onSubmit={handleCreateBroadcast} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Title / Subject *
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Capstone Project Assets (Google Drive)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                          Resource Type
                        </label>
                        <select
                          value={newType}
                          onChange={(e) => setNewType(e.target.value as BroadcastType)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                        >
                          <option value="link">Link (Google Drive / GitHub / URL)</option>
                          <option value="task">Task / Assignment (واجب)</option>
                          <option value="announcement">Announcement (إعلان عام)</option>
                          <option value="file">File / Download (ملف)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                          Badge Tag (Optional)
                        </label>
                        <input
                          type="text"
                          value={newBadge}
                          onChange={(e) => setNewBadge(e.target.value)}
                          placeholder="e.g. Drive, HW #1, Urgent"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Resource URL (Google Drive, GitHub repo, Form, etc.)
                      </label>
                      <input
                        type="url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Detailed Content / Notes
                      </label>
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        rows={3}
                        placeholder="Write detailed instructions or context for students..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                      />
                    </div>

                    {formError && (
                      <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
                        {formError}
                      </div>
                    )}

                    {formSuccess && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                        {formSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submittingBroadcast}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{submittingBroadcast ? 'Publishing...' : 'Publish to All Students'}</span>
                    </button>
                  </form>
                </div>

                {/* Right: Existing Broadcasts with Delete */}
                <div className="space-y-4">
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Active Broadcasts ({broadcasts.length})
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Students see these in their notification tray. You can delete any item below.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchBroadcasts}
                      disabled={loadingBroadcasts}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingBroadcasts ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {broadcasts.length === 0 ? (
                      <div className="text-center py-10 text-zinc-400 text-xs">
                        No broadcasts published yet. Use the form to post your first link or announcement.
                      </div>
                    ) : (
                      broadcasts.map((item) => (
                        <div 
                          key={item.id}
                          className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                  {item.type}
                                </span>
                                {item.badgeLabel && (
                                  <span className="font-bold text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                    {item.badgeLabel}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                                {item.title}
                              </h4>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteBroadcast(item.id, item.title)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Delete Broadcast"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {item.content && (
                            <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">
                              {item.content}
                            </p>
                          )}

                          {item.url && (
                            <div className="pt-1">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-orange-500 hover:underline font-medium text-[11px]"
                              >
                                <span>{item.url}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          <div className="text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                            Posted {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
