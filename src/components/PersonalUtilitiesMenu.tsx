import React, { useState, useRef, useEffect } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Award,
  Lock,
  Cloud,
  Bell,
  Trophy,
  Brain,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  ChevronDown,
  LogOut
} from 'lucide-react';
import type { StudentProfile } from '../types';

interface PersonalUtilitiesMenuProps {
  currentStudent: StudentProfile | null;
  savedCount: number;
  completedCount: number;
  totalTopics: number;
  isCertificateUnlocked: boolean;
  unreadBroadcastsCount: number;
  fontScale: number;
  onChangeFontScale: (delta: number) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSaved: () => void;
  onOpenProgress: () => void;
  onOpenKnowledgeBase?: () => void;
  knowledgeNotesCount?: number;
  onOpenCertificate: () => void;
  onOpenBroadcasts: () => void;
  onOpenSync: () => void;
  onOpenCapstone: () => void;
  onLogoutStudent?: () => void;
}

export const PersonalUtilitiesMenu: React.FC<PersonalUtilitiesMenuProps> = ({
  currentStudent,
  savedCount,
  completedCount,
  totalTopics,
  isCertificateUnlocked,
  unreadBroadcastsCount,
  fontScale,
  onChangeFontScale,
  isDark,
  onToggleTheme,
  onOpenSaved,
  onOpenProgress,
  onOpenKnowledgeBase,
  knowledgeNotesCount = 0,
  onOpenCertificate,
  onOpenBroadcasts,
  onOpenSync,
  onOpenCapstone,
  onLogoutStudent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const percentComplete = Math.min(100, Math.round((completedCount / Math.max(totalTopics, 1)) * 100));

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Student Initials
  const initials = currentStudent?.name
    ? currentStudent.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'M';

  const handleAction = (callback: () => void) => {
    setIsOpen(false);
    callback();
  };

  return (
    <div className="relative shrink-0" ref={menuRef}>
      {/* Trigger Button: Sleek Profile Avatar with Dropdown Arrow */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700/80"
        title="Personal utilities & profile"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            {initials}
          </div>
          {/* Notification / Unread Badge */}
          {unreadBroadcastsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#18181b]" />
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#1e1e22] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
          
          {/* User Header Section */}
          <div className="p-3 pb-3 mb-1.5 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {currentStudent ? currentStudent.name : 'Guest Learner'}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                    {currentStudent ? `ID: ${currentStudent.code}` : 'Local Browser Session'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAction(onOpenSync)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors"
                title="Student Cloud Sync Settings"
              >
                <Cloud className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Mini Progress Bar */}
            <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
                <span>Curriculum Progress</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{percentComplete}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>
          </div>

          {/* Core Personal Features List */}
          <div className="space-y-0.5">
            {/* My Knowledge Base */}
            {onOpenKnowledgeBase && (
              <button
                type="button"
                onClick={() => handleAction(onOpenKnowledgeBase)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-blue-500/10 dark:hover:bg-blue-500/15 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    My Knowledge Base
                  </span>
                </div>
                {knowledgeNotesCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono">
                    {knowledgeNotesCount}
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 font-mono">New</span>
                )}
              </button>
            )}

            {/* Saved Topics */}
            <button
              type="button"
              onClick={() => handleAction(onOpenSaved)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Saved Topics</span>
              </div>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Learning Progress Overview */}
            <button
              type="button"
              onClick={() => handleAction(onOpenProgress)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Learning Progress</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {completedCount}/{totalTopics}
              </span>
            </button>

            {/* Certificate of Mastery */}
            <button
              type="button"
              onClick={() => handleAction(onOpenCertificate)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {isCertificateUnlocked ? (
                  <Award className="w-4 h-4 text-amber-500" />
                ) : (
                  <Lock className="w-4 h-4 text-zinc-400" />
                )}
                <span>Completion Certificate</span>
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase ${isCertificateUnlocked ? 'text-amber-500' : 'text-zinc-400'}`}>
                {isCertificateUnlocked ? 'Verified' : 'Locked'}
              </span>
            </button>

            {/* Capstone Projects */}
            <button
              type="button"
              onClick={() => handleAction(onOpenCapstone)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-purple-500" />
                <span>Capstone Projects</span>
              </div>
              <span className="text-[10px] font-mono text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded">
                3 Tiers
              </span>
            </button>

            {/* Announcements & Links */}
            <button
              type="button"
              onClick={() => handleAction(onOpenBroadcasts)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-sky-500" />
                <span>Announcements & Drive</span>
              </div>
              {unreadBroadcastsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-sky-500 text-white font-mono">
                  {unreadBroadcastsCount}
                </span>
              )}
            </button>
          </div>

          {/* Preferences Section: Font Scaling & Dark Mode */}
          <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1">
            {/* Font Scale Adjuster */}
            <div className="flex items-center justify-between px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300">
              <span className="text-zinc-500 dark:text-zinc-400">Reading Size</span>
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700/80">
                <button
                  type="button"
                  onClick={() => onChangeFontScale(-5)}
                  className="p-1 hover:text-sky-500 text-zinc-500 dark:text-zinc-400 cursor-pointer"
                  title="Decrease font size"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-200 min-w-8 text-center">
                  {fontScale}%
                </span>
                <button
                  type="button"
                  onClick={() => onChangeFontScale(5)}
                  className="p-1 hover:text-sky-500 text-zinc-500 dark:text-zinc-400 cursor-pointer"
                  title="Increase font size"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-500" />}
                <span>Appearance</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-sans">
                {isDark ? 'Dark Theme' : 'Light Theme'}
              </span>
            </button>
          </div>

          {/* Cloud Sync Status / Login Button */}
          <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            {currentStudent ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onLogoutStudent) onLogoutStudent();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Student Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleAction(onOpenSync)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 transition-all cursor-pointer"
              >
                <Cloud className="w-4 h-4" />
                <span>Sync with Student Code</span>
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
