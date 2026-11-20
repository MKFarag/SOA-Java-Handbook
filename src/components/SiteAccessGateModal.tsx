import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { 
  verifySiteAccessPasscode, 
  DEFAULT_SITE_ACCESS_PASSCODE 
} from '../services/firebaseService';

interface SiteAccessGateModalProps {
  isOpen: boolean;
  onUnlocked: (info?: { role: string; name?: string; code?: string }) => void;
  onOpenAdmin: () => void;
}

export const SiteAccessGateModal: React.FC<SiteAccessGateModalProps> = ({
  isOpen,
  onUnlocked,
  onOpenAdmin
}) => {
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) {
      setErrorMsg('Please enter your Course Passcode or Student Code.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await verifySiteAccessPasscode(passcodeInput.trim());
      if (res.valid) {
        localStorage.setItem('soa_site_unlocked', 'true');
        localStorage.setItem('soa_unlocked_at', new Date().toISOString());

        if (res.role === 'admin') {
          setSuccessMsg('Master Instructor Authenticated! Welcome, Lead Architect.');
          setTimeout(() => {
            onUnlocked({ role: 'admin', name: res.name });
          }, 600);
        } else if (res.role === 'student') {
          setSuccessMsg(`Welcome back, ${res.name || 'Engineer'}! Progress unlocked.`);
          setTimeout(() => {
            onUnlocked({ role: 'student', name: res.name, code: passcodeInput.trim().toUpperCase() });
          }, 600);
        } else {
          setSuccessMsg('Course Passcode Verified! Handbook unlocked successfully.');
          setTimeout(() => {
            onUnlocked({ role: 'passcode' });
          }, 600);
        }
      } else {
        setErrorMsg('Invalid passcode or student code. Please verify with your instructor.');
      }
    } catch (err: any) {
      console.error('Error verifying site passcode:', err);
      setErrorMsg('Network error verifying code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-100 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-orange-500/20 to-transparent blur-2xl pointer-events-none" />

        {/* Lock Icon & Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mb-1 shadow-lg shadow-orange-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-[11px] font-bold text-orange-400 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Protected Learning Environment</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            NTI Java & SOA Handbook
          </h2>

          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            This architectural reference and master curriculum is reserved for enrolled software engineers. Please enter your <strong>Course Passcode</strong> or unique <strong>Student Code</strong> to unlock full access.
          </p>
        </div>

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="mt-6 space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Access Passcode or Student Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="e.g. SOA-2026 or SOA-XXXX"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all uppercase tracking-wider"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-zinc-500">
              Default semester passcode: <span className="font-mono text-zinc-400 font-semibold">{DEFAULT_SITE_ACCESS_PASSCODE}</span>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
          >
            {isVerifying ? (
              <span>Verifying Passcode...</span>
            ) : (
              <>
                <span>Unlock Full Handbook</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 relative z-10">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Authorized by Mohamed Khaled Farag</span>
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-[11px] text-zinc-400 hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Instructor Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
