import React from 'react';
import { Home, Layers, Search, Bookmark, CheckCircle2 } from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  onGoHome: () => void;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenSaved: () => void;
  onOpenProgress: () => void;
  savedCount: number;
  percentComplete: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onGoHome,
  onToggleSidebar,
  onOpenSearch,
  onOpenSaved,
  onOpenProgress,
  savedCount,
  percentComplete,
}) => {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 dark:bg-[#141416]/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-2 pt-1 transition-colors shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          type="button"
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'home'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5 transition-transform active:scale-90" />
            {currentView === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-500" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* Topics / Outline (Toggles Sidebar Drawer) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'topic'
              ? 'text-sky-600 dark:text-sky-400 font-semibold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5 transition-transform active:scale-90" />
            {currentView === 'topic' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-500" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Topics</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all cursor-pointer"
        >
          <div className="w-9 h-7 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/25">
            <Search className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Search</span>
        </button>

        {/* Saved */}
        <button
          type="button"
          onClick={onOpenSaved}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'saved'
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Bookmark className={`w-5 h-5 transition-transform active:scale-90 ${currentView === 'saved' ? 'fill-amber-500 text-amber-500' : ''}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 px-1 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Saved</span>
        </button>

        {/* Progress */}
        <button
          type="button"
          onClick={onOpenProgress}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'progress'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <CheckCircle2 className="w-5 h-5 transition-transform active:scale-90" />
            {percentComplete > 0 && (
              <span className="absolute -top-1 -right-2.5 flex h-3.5 px-1 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-mono font-bold text-white shadow-xs">
                {percentComplete}%
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Progress</span>
        </button>

      </div>
    </nav>
  );
};
