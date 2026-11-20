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
  Key,
  Clock,
  KeyRound,
  Sparkles,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import type { StudentProfile, BroadcastItem, BroadcastType } from '../types';
import { 
  getAllStudents, 
  setStudentCertificateStatus, 
  deleteStudentRecord, 
  getBroadcasts, 
  publishBroadcast, 
  deleteBroadcast, 
  verifyAdminPassword,
  getAdminSecurityConfig,
  recordAdminLogin,
  updateAdminPassword,
  getSiteAccessConfig,
  updateSiteAccessConfig,
  DEFAULT_SITE_ACCESS_PASSCODE
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
  const [isVerifying, setIsVerifying] = useState(false);

  // Security Audit Info
  const [lastLoginTime, setLastLoginTime] = useState<string | null>(null);
  const [lastLoginDevice, setLastLoginDevice] = useState<string | null>(null);
  const [previousLoginTime, setPreviousLoginTime] = useState<string | null>(null);
  const [previousLoginDevice, setPreviousLoginDevice] = useState<string | null>(null);

  // Tabs: 'students' | 'broadcasts' | 'security'
  const [activeTab, setActiveTab] = useState<'students' | 'broadcasts' | 'security'>('students');

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

  // Password Management Form State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);
  const [passChangeSuccess, setPassChangeSuccess] = useState<string | null>(null);
  const [passChangeError, setPassChangeError] = useState<string | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  // Global Site Access Passcode Form State
  const [sitePasscode, setSitePasscode] = useState(DEFAULT_SITE_ACCESS_PASSCODE);
  const [siteProtected, setSiteProtected] = useState(true);
  const [isSavingSiteAccess, setIsSavingSiteAccess] = useState(false);
  const [siteAccessSuccess, setSiteAccessSuccess] = useState<string | null>(null);
  const [siteAccessError, setSiteAccessError] = useState<string | null>(null);

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

  const loadAllData = async () => {
    fetchStudents();
    fetchBroadcasts();
  };

  const loadSiteAccess = async () => {
    try {
      const cfg = await getSiteAccessConfig();
      setSiteProtected(cfg.isProtected);
      setSitePasscode(cfg.sitePasscode);
    } catch (err) {
      console.warn('Could not load site access configuration:', err);
    }
  };

  // Load data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      loadSiteAccess();
    }
  }, [isAuthenticated]);

  const handleSaveSiteAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSiteAccess(true);
    setSiteAccessSuccess(null);
    setSiteAccessError(null);
    try {
      await updateSiteAccessConfig({
        isProtected: siteProtected,
        sitePasscode: sitePasscode.trim()
      });
      setSiteAccessSuccess('Course Access Passcode settings saved to cloud successfully!');
      setTimeout(() => setSiteAccessSuccess(null), 3500);
    } catch (err: any) {
      setSiteAccessError(err.message || 'Failed to update site access settings.');
    } finally {
      setIsSavingSiteAccess(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsVerifying(true);

    try {
      const isValid = await verifyAdminPassword(passwordInput);
      if (isValid) {
        // Fetch previous login timestamp before overwriting
        const currentConfig = await getAdminSecurityConfig();
        if (currentConfig.lastLoginTime) {
          setPreviousLoginTime(currentConfig.lastLoginTime);
          setPreviousLoginDevice(currentConfig.lastLoginDevice || 'Previous Session');
        }

        // Detect current browser / device
        const ua = navigator.userAgent;
        let browserName = 'Browser';
        if (ua.includes('Firefox')) browserName = 'Firefox';
        else if (ua.includes('Edg')) browserName = 'Edge';
        else if (ua.includes('Chrome')) browserName = 'Chrome';
        else if (ua.includes('Safari')) browserName = 'Safari';

        const platform = navigator.platform || (ua.includes('Win') ? 'Windows' : 'Mobile / Device');
        const deviceInfo = `${platform} (${browserName})`;

        // Record new login in Firestore & LocalStorage
        const recordedTime = await recordAdminLogin(deviceInfo);
        setLastLoginTime(recordedTime);
        setLastLoginDevice(deviceInfo);

        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError('Incorrect Admin Passcode. Access denied.');
      }
    } catch (err) {
      console.error('Admin authentication error:', err);
      setAuthError('Authentication service failed. Please check internet connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleToggleCertificate = async (code: string, currentStatus: boolean) => {
    try {
      await setStudentCertificateStatus(code, !currentStatus);
      setStudents(prev => prev.map(s => s.code === code ? { ...s, certificateUnlocked: !currentStatus } : s));
    } catch (err) {
      console.error('Failed to update certificate status:', err);
      alert('Failed to update certificate status.');
    }
  };

  const handleDeleteStudent = async (code: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete student "${name}" (${code})?`)) {
      try {
        await deleteStudentRecord(code);
        setStudents(prev => prev.filter(s => s.code !== code));
      } catch (err) {
        console.error('Failed to delete student:', err);
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
        console.error('Failed to delete broadcast:', err);
        alert('Failed to delete broadcast.');
      }
    }
  };

  const generateComplexPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+';
    let pass = 'MKF#';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassInput(pass);
    setConfirmPassInput(pass);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError(null);
    setPassChangeSuccess(null);

    // Verify current password first
    const isCurrentValid = await verifyAdminPassword(currentPassInput);
    if (!isCurrentValid) {
      setPassChangeError('Current password is incorrect.');
      return;
    }

    if (newPassInput.trim().length < 8) {
      setPassChangeError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassChangeError('New password and confirmation do not match.');
      return;
    }

    setIsSavingPass(true);
    try {
      await updateAdminPassword(newPassInput.trim());
      setPassChangeSuccess('Admin password updated successfully across all sessions and devices!');
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setTimeout(() => setPassChangeSuccess(null), 4000);
    } catch (err: any) {
      setPassChangeError(err.message || 'Failed to update admin password.');
    } finally {
      setIsSavingPass(false);
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

  if (!isOpen) return null;

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
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
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
                Enter your instructor passcode to access real-time student analytics, broadcast control, and security settings.
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
                disabled={isVerifying}
                className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Authenticating...' : 'Authenticate & Enter'}
              </button>
            </form>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header Stats Bar + Security Audit Banner */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-3">
              {/* Security Audit Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong>Admin Session Active:</strong> Authenticated on {lastLoginDevice || 'Current Machine'}
                  </span>
                </div>
                {previousLoginTime ? (
                  <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    Last access before this: {new Date(previousLoginTime).toLocaleString()} ({previousLoginDevice})
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    First recorded login session
                  </span>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            </div>

            {/* Tabs Navigation */}
            <div className="px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#18181b]">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('students')}
                  className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
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
                  className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'broadcasts'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Broadcasts & Resources ({broadcasts.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'security'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Security & Passcode</span>
                </button>
              </div>

              {activeTab === 'students' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={fetchStudents}
                    disabled={loadingStudents}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
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
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
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
                                  className="p-1 rounded text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
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
                          <option value="task">Task / Assignment</option>
                          <option value="announcement">Announcement / Notice</option>
                          <option value="file">File / Download Resource</option>
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
                      className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
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
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
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

            {/* Tab 3: Security & Passcode Settings */}
            {activeTab === 'security' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-2xl mx-auto w-full">
                {/* Audit Information Card */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Security Audit & Access History</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
                      <span className="text-zinc-400 text-[11px] block">Current Active Login:</span>
                      <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {lastLoginTime ? new Date(lastLoginTime).toLocaleString() : 'Now'}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Device: {lastLoginDevice || 'Current Session'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
                      <span className="text-zinc-400 text-[11px] block">Previous Admin Login:</span>
                      <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {previousLoginTime ? new Date(previousLoginTime).toLocaleString() : 'None recorded'}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Device: {previousLoginDevice || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Use these timestamps to verify that no unauthorized person has accessed the Admin Console.
                  </p>
                </div>

                {/* Course Access Passcode & Gate Control */}
                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1c1f] space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-orange-500" />
                        <span>Course Access Passcode (Site-Wide Lock)</span>
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Restrict the entire handbook behind a course passcode or registered student codes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        siteProtected 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                          : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                      }`}>
                        {siteProtected ? 'Gate Enabled' : 'Open Access'}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSiteAccess} className="space-y-4 text-xs">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={siteProtected}
                        onChange={(e) => setSiteProtected(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded border-zinc-300 dark:border-zinc-700 focus:ring-orange-500"
                      />
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                          Enable Course Passcode Gate
                        </span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                          When checked, any visitor must enter the Course Passcode or their Student Code to see the handbook.
                        </span>
                      </div>
                    </label>

                    <div>
                      <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Course Access Passcode
                      </label>
                      <input
                        type="text"
                        value={sitePasscode}
                        onChange={(e) => setSitePasscode(e.target.value)}
                        placeholder="e.g. SOA-2026"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                        required
                      />
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Students can enter this passcode, or alternatively use their unique student code (e.g. SOA-XXXX).
                      </p>
                    </div>

                    {siteAccessError && (
                      <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{siteAccessError}</span>
                      </div>
                    )}

                    {siteAccessSuccess && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{siteAccessSuccess}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSavingSiteAccess}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isSavingSiteAccess ? 'Saving Settings...' : 'Save Site Gate Settings'}</span>
                    </button>
                  </form>
                </div>

                {/* Change Password Form */}
                <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1c1f] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>Change Master Admin Password</span>
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Updating your password saves it to Firestore and protects your dashboard across all devices.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={generateComplexPassword}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap self-start sm:self-center"
                      title="Generate a 16-character high-entropy secure passcode"
                    >
                      <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Generate Ultra-Secure</span>
                    </button>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Current Master Passcode *
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                            New Strong Passcode *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1.5 text-[11px] cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0" />}
                            <span>{showPassword ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassInput}
                          onChange={(e) => setNewPassInput(e.target.value)}
                          placeholder="At least 8 complex characters"
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                          Confirm New Passcode *
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassInput}
                          onChange={(e) => setConfirmPassInput(e.target.value)}
                          placeholder="Re-type new passcode"
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                          required
                        />
                      </div>
                    </div>

                    {newPassInput && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400 font-mono">
                          Selected: <strong className="text-orange-500">{newPassInput}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(newPassInput);
                            setCopiedPass(true);
                            setTimeout(() => setCopiedPass(false), 2000);
                          }}
                          className="text-[11px] text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1"
                        >
                          {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : null}
                          <span>{copiedPass ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {passChangeError && (
                      <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{passChangeError}</span>
                      </div>
                    )}

                    {passChangeSuccess && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{passChangeSuccess}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSavingPass}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <KeyRound className="w-4 h-4 shrink-0" />
                      <span>{isSavingPass ? 'Updating Password...' : 'Save & Protect New Password'}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
