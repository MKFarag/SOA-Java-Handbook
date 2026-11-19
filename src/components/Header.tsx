import React from 'react';
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
  Award
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSaved: () => void;
  onOpenProgress: () => void;
  onOpenCertificate: () => void;
  onGoHome: () => void;
  savedCount: number;
  completedCount: number;
  totalTopics: number;
  isDark: boolean;
  onToggleTheme: () => void;
  fontScale: number;
  onChangeFontScale: (delta: number) => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenSaved,
  onOpenProgress,
  onOpenCertificate,
  onGoHome,
  savedCount,
  completedCount,
  totalTopics,
  isDark,
  onToggleTheme,
  fontScale,
  onChangeFontScale,
  onToggleMobileSidebar
}) => {
  const percentComplete = Math.round((completedCount / Math.max(totalTopics, 1)) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#18181b]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger (mobile) + Branding */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                  Java & Jakarta EE
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                  Java 8–26
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-zinc-500 dark:text-zinc-400">
                Offline Reference Handbook · Zero to Production
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger Button */}
        <div className="flex-1 max-w-md mx-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#1e1e1e] hover:border-orange-500/50 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs sm:text-sm transition-all shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-orange-500" />
              <span>Search handbook...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[11px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Font Scale Adjuster */}
          <div className="hidden md:flex items-center bg-zinc-100 dark:bg-[#252526] rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => onChangeFontScale(-5)}
              className="p-1 hover:text-orange-500 text-zinc-500 dark:text-zinc-400"
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
              className="p-1 hover:text-orange-500 text-zinc-500 dark:text-zinc-400"
              title="Increase font size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bookmarks / Saved Button */}
          <button
            type="button"
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="View bookmarked topics"
          >
            <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'text-orange-500 fill-orange-500' : 'text-zinc-400'}`} />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Progress Tracker Button */}
          <button
            type="button"
            onClick={onOpenProgress}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="View learning progress"
          >
            <CheckCircle2 className={`w-4 h-4 ${percentComplete > 0 ? 'text-emerald-500' : 'text-zinc-400'}`} />
            <span className="hidden sm:inline font-mono">{percentComplete}%</span>
          </button>

          {/* Certificate of Mastery Button */}
          <button
            type="button"
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-xs"
            title="View Official Certificate of Mastery (Mohamed Khaled Farag)"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">Certificate</span>
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
            title={isDark ? "Theme: Dark (Click for Light Mode)" : "Theme: Light (Click for Dark Mode)"}
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
