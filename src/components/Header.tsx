import React, { useRef } from 'react';
import { 
  Coffee, 
  Search, 
  Bookmark, 
  CheckCircle2, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Menu,
  Award,
  Lock,
  Cloud,
  Bell
} from 'lucide-react';
import type { StudentProfile } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSaved: () => void;
  onOpenProgress: () => void;
  onOpenCertificate: () => void;
  onGoHome: () => void;
  onOpenSync: () => void;
  onOpenBroadcasts: () => void;
  onOpenAdmin: () => void;
  savedCount: number;
  completedCount: number;
  totalTopics: number;
  isDark: boolean;
  onToggleTheme: () => void;
  fontScale: number;
  onChangeFontScale: (delta: number) => void;
  onToggleMobileSidebar: () => void;
  currentStudent: StudentProfile | null;
  unreadBroadcastsCount: number;
  isCertificateUnlocked: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenSaved,
  onOpenProgress,
  onOpenCertificate,
  onGoHome,
  onOpenSync,
  onOpenBroadcasts,
  onOpenAdmin,
  savedCount,
  completedCount,
  totalTopics,
  isDark,
  onToggleTheme,
  fontScale,
  onChangeFontScale,
  onToggleMobileSidebar,
  currentStudent,
  unreadBroadcastsCount,
  isCertificateUnlocked
}) => {
  const percentComplete = Math.round((completedCount / Math.max(totalTopics, 1)) * 100);

  // Hidden 5-tap counter on logo to open secret Admin Dashboard on mobile / desktop
  const logoTapsRef = useRef(0);
  const resetTapsTimerRef = useRef<number | null>(null);

  const handleLogoClick = () => {
    logoTapsRef.current += 1;
    if (resetTapsTimerRef.current) window.clearTimeout(resetTapsTimerRef.current);

    if (logoTapsRef.current >= 5) {
      logoTapsRef.current = 0;
      onOpenAdmin();
      return;
    }

    // Auto reset after 2.5s
    resetTapsTimerRef.current = window.setTimeout(() => {
      logoTapsRef.current = 0;
    }, 2500);

    onGoHome();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Left: Hamburger (mobile) + Branding */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            title="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none"
            title="SOA & Java Handbook (Click to go Home)"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                  SOA
                </span>
                <span className="hidden sm:inline-block font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                  &amp; Java
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                  Java 8–26
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[200px] lg:max-w-none">
                Architecture Handbook · Mohamed Khaled Farag
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger Button */}
        <div className="flex-1 max-w-[200px] sm:max-w-md mx-1 sm:mx-2 min-w-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#1e1e1e] hover:border-orange-500/50 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs sm:text-sm transition-all shadow-inner cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
              <span className="truncate text-xs">Search...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shrink-0">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* Notification Bell (Broadcasts & Drive Links) */}
          <button
            type="button"
            onClick={onOpenBroadcasts}
            className="relative p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="View Course Announcements & Drive Links"
          >
            <Bell className="w-4 h-4 text-orange-500" />
            {unreadBroadcastsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white shadow-xs animate-pulse">
                {unreadBroadcastsCount}
              </span>
            )}
          </button>

          {/* Student Profile / Sync Button (hidden on mobile, visible from sm up) */}
          <button
            type="button"
            onClick={onOpenSync}
            className={`hidden sm:flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentStudent
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
            }`}
            title={currentStudent ? `Logged in as ${currentStudent.name} (${currentStudent.code})` : 'Sync Progress with Your Code'}
          >
            {currentStudent ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden md:inline truncate max-w-[80px]">{currentStudent.name}</span>
                <span className="font-mono text-[10px] bg-emerald-500/20 px-1 rounded">{currentStudent.code}</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-orange-500" />
                <span className="hidden sm:inline">Sync Code</span>
              </>
            )}
          </button>

          {/* Font Scale Adjuster */}
          <div className="hidden lg:flex items-center bg-zinc-100 dark:bg-[#252526] rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => onChangeFontScale(-5)}
              className="p-1 hover:text-orange-500 text-zinc-500 dark:text-zinc-400 cursor-pointer"
              title="Decrease font size"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 min-w-8 text-center">
              {fontScale}%
            </span>
            <button
              type="button"
              onClick={() => onChangeFontScale(5)}
              className="p-1 hover:text-orange-500 text-zinc-500 dark:text-zinc-400 cursor-pointer"
              title="Increase font size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bookmarks / Saved Button (hidden on mobile, visible on sm+) */}
          <button
            type="button"
            onClick={onOpenSaved}
            className="hidden sm:flex relative items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="View bookmarked topics"
          >
            <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'text-orange-500 fill-orange-500' : 'text-zinc-400'}`} />
            <span className="hidden xl:inline">Saved</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Progress Tracker Button (hidden on mobile, visible on sm+) */}
          <button
            type="button"
            onClick={onOpenProgress}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="View learning progress"
          >
            <CheckCircle2 className={`w-4 h-4 ${percentComplete > 0 ? 'text-emerald-500' : 'text-zinc-400'}`} />
            <span className="hidden sm:inline font-mono">{percentComplete}%</span>
          </button>

          {/* Certificate of Mastery Button (Shows Lock if locked) */}
          <button
            type="button"
            onClick={onOpenCertificate}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              isCertificateUnlocked
                ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                : 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
            }`}
            title={isCertificateUnlocked ? "View Verified Certificate" : "Official Certificate (Locked 🔒)"}
          >
            {isCertificateUnlocked ? (
              <Award className="w-4 h-4 text-amber-500" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span className="hidden lg:inline">
              {isCertificateUnlocked ? 'Certificate' : 'Cert (Locked)'}
            </span>
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
            title={isDark ? "Theme: Dark" : "Theme: Light"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
