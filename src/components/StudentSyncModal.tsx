import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Key, 
  User, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  LogOut, 
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Award
} from 'lucide-react';
import type { StudentProfile } from '../types';
import { 
  loadStudentProfile, 
  saveStudentProfile, 
  normalizeStudentCode 
} from '../services/firebaseService';

interface StudentSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfile | null;
  onStudentLogin: (profile: StudentProfile) => void;
  onStudentLogout: () => void;
  onSyncNow: () => Promise<void>;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  currentCompletedCount: number;
  currentSavedCount: number;
}

export const StudentSyncModal: React.FC<StudentSyncModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onStudentLogin,
  onStudentLogout,
  onSyncNow,
  isSyncing,
  lastSyncTime,
  currentCompletedCount,
  currentSavedCount
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newCode = `SOA-${rand}`;
    setCode(newCode);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanCode = normalizeStudentCode(code);
    if (!cleanCode) {
      setError('Please enter a valid unique code.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        // Load existing profile from Firebase
        const profile = await loadStudentProfile(cleanCode);
        if (!profile) {
          setError(`No profile found for code "${cleanCode}". If you're new, click "Create New Code" below.`);
          setLoading(false);
          return;
        }
        onStudentLogin(profile);
        setSuccess(`Welcome back, ${profile.name}! Progress loaded successfully.`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        // Register new profile
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }

        // Check if code already taken
        const existing = await loadStudentProfile(cleanCode);
        if (existing) {
          setError(`Code "${cleanCode}" is already in use by someone else. Please choose another code or click "Auto-Generate".`);
          setLoading(false);
          return;
        }

        await saveStudentProfile({
          code: cleanCode,
          name: name.trim()
        });

        const newProfile: StudentProfile = {
          code: cleanCode,
          name: name.trim(),
          completedTopics: [],
          completedCount: 0,
          savedTopics: [],
          challengeStates: {},
          targetedReviewIds: [],
          certificateUnlocked: false,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };

        onStudentLogin(newProfile);
        setSuccess(`Account created! Your unique code is ${cleanCode}. Keep it safe.`);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Firebase sync failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transition-all text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Cloud Progress & Sync</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  Free Forever
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Track your SOA & Java journey across PC, laptop, and mobile with a single code.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Active Logged-in Profile View */}
          {currentStudent ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-[#202023] dark:to-[#1a1a1c] border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                      {currentStudent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                        {currentStudent.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                          {currentStudent.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(currentStudent.code)}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          title="Copy Code"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Cloud Connected</span>
                    </div>
                    {lastSyncTime && (
                      <span className="text-[10px] text-zinc-400">
                        Synced {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Mini Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700/60 text-center">
                  <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/40">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 mb-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Completed</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200">
                      {currentCompletedCount}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/40">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 mb-0.5">
                      <Bookmark className="w-3 h-3 text-amber-500" />
                      <span>Saved</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200">
                      {currentSavedCount}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/40">
                    <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 mb-0.5">
                      <Award className="w-3 h-3 text-purple-500" />
                      <span>Certificate</span>
                    </div>
                    <span className={`text-[11px] font-bold ${currentStudent.certificateUnlocked ? 'text-emerald-500' : 'text-zinc-400'}`}>
                      {currentStudent.certificateUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: Sync Now & Logout */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={onSyncNow}
                  disabled={isSyncing}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing to Cloud...' : 'Sync Now (Force Save)'}</span>
                </button>

                <button
                  type="button"
                  onClick={onStudentLogout}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Switch / Log out</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Tip:</strong> Any topics you mark as completed or bookmark on this device will automatically sync to Firestore under code <strong className="font-mono">{currentStudent.code}</strong>.
                </span>
              </div>
            </div>
          ) : (
            /* Unregistered / Login / Register Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  I Have a Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                    setSuccess(null);
                    if (!code) generateRandomCode();
                  }}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'register'
                      ? 'bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  Create New Code
                </button>
              </div>

              {/* Name field (Register only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Your Full Name (appears on your Certificate)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ahmed Ali"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                      required={mode === 'register'}
                    />
                  </div>
                </div>
              )}

              {/* Unique Code field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {mode === 'login' ? 'Enter Your Unique Student Code' : 'Your Unique Code'}
                  </label>
                  {mode === 'register' && (
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="text-[11px] font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Generate</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SOA-8291 or AHMED-JAVA"
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono uppercase tracking-wider rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                  {mode === 'login' 
                    ? 'Entering this code on any device loads your saved topics and progress immediately.'
                    : 'Remember this code! You will use it to resume your progress on mobile or PC.'}
                </p>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : mode === 'login' ? (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Load My Progress</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create & Start Tracking</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
