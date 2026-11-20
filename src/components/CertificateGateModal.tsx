import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Key
} from 'lucide-react';
import { 
  loadStudentProfile, 
  normalizeStudentCode, 
  verifyAdminPassword 
} from '../services/firebaseService';
import type { StudentProfile } from '../types';

interface CertificateGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (studentName?: string) => void;
  completedCount: number;
  totalTopics: number;
  currentStudent: StudentProfile | null;
  onOpenSyncModal: () => void;
}

export const CertificateGateModal: React.FC<CertificateGateModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  completedCount,
  totalTopics,
  currentStudent,
  onOpenSyncModal
}) => {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const input = passcode.trim();
    if (!input) {
      setError('Please enter your Student Code or the Master Instructor Passcode.');
      return;
    }

    setLoading(true);
    try {
      // 1. Check if input is Master Admin / Instructor Passcode
      if (verifyAdminPassword(input)) {
        setSuccess('Instructor authorization granted! Unlocking certificate...');
        setTimeout(() => {
          onUnlockSuccess(currentStudent?.name || 'Mohamed Khaled Farag');
          onClose();
        }, 1200);
        return;
      }

      // 2. Check if input matches a Student Code in Firestore
      const cleanCode = normalizeStudentCode(input);
      const student = await loadStudentProfile(cleanCode);

      if (!student) {
        setError('Invalid code. Neither a registered student code nor a valid instructor passcode was found.');
        setLoading(false);
        return;
      }

      // Check student qualifications
      const isComplete = student.completedCount >= totalTopics || student.completedTopics.length >= totalTopics;
      if (student.certificateUnlocked || isComplete) {
        setSuccess(`Verification passed! Congratulations ${student.name}. Unlocking your certificate...`);
        setTimeout(() => {
          onUnlockSuccess(student.name);
          onClose();
        }, 1500);
      } else {
        setError(`Student found (${student.name}), but progress is ${student.completedCount}/${totalTopics} topics. 100% completion is required to unlock.`);
      }
    } catch (err: any) {
      console.error(err);
      setError('Verification service unavailable. Please check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#18181b] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Lock Graphic */}
        <div className="relative px-6 pt-6 pb-5 text-center bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 mb-2">
            Restricted Access
          </div>

          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Official Certificate is Locked
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            This completion credential is protected to preserve academic integrity. It opens exclusively for verified learners who complete all 108 modules or possess an authorized access key.
          </p>
        </div>

        {/* Verification Form */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Enter Student Code or Master Instructor Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. SOA-8291 or Master Passcode"
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono uppercase tracking-wider rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Verify & Unlock Certificate</span>
                </>
              )}
            </button>
          </form>

          {/* Helper details */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Current Local Progress:</span>
            <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">
              {completedCount} / {totalTopics} ({Math.round((completedCount / totalTopics) * 100)}%)
            </span>
          </div>

          {!currentStudent && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSyncModal();
              }}
              className="w-full py-2 text-xs font-medium text-center text-orange-500 hover:text-orange-600 transition-colors"
            >
              Don't have a code yet? Register your student code &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
