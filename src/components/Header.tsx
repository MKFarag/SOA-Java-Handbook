import React, { useRef } from 'react';
import {
  Search,
  Cloud,
  Check,
  AlertCircle,
  Loader2,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon
} from 'lucide-react';
import { Logo } from './Logo';
import { PersonalUtilitiesMenu } from './PersonalUtilitiesMenu';
import type { StudentProfile, PartType } from '../types';
import { MAIN_SECTIONS } from '../data/topics';

export type SyncVisualState = 'idle' | 'syncing' | 'success' | 'error';

interface HeaderProps {
  selectedPart: PartType;
  onSelectPart: (part: PartType) => void;
  isSidebarCollapsed: boolean;
  onToggleDesktopSidebar: () => void;
  onToggleMobileSidebar: () => void;
  onOpenSearch: () => void;
  onOpenSaved: () => void;
  onOpenProgress: () => void;
  onOpenKnowledgeBase?: () => void;
  knowledgeNotesCount?: number;
  onOpenCertificate: () => void;
  onGoHome: () => void;
  onOpenSync: () => void;
  onOpenBroadcasts: () => void;
  onOpenAdmin: () => void;
  onOpenCapstone: () => void;
  savedCount: number;
  completedCount: number;
  totalTopics: number;
  isDark: boolean;
  onToggleTheme: () => void;
  fontScale: number;
  onChangeFontScale: (delta: number) => void;
  currentStudent: StudentProfile | null;
  unreadBroadcastsCount: number;
  isCertificateUnlocked: boolean;
  syncStatus: SyncVisualState;
  onLogoutStudent?: () => void;
}


export const Header: React.FC<HeaderProps> = ({
  selectedPart,
  onSelectPart,
  isSidebarCollapsed,
  onToggleDesktopSidebar,
  onToggleMobileSidebar,
  onOpenSearch,
  onOpenSaved,
  onOpenProgress,
  onOpenKnowledgeBase,
  knowledgeNotesCount = 0,
  onOpenCertificate,
  onGoHome,
  onOpenSync,
  onOpenBroadcasts,
  onOpenAdmin,
  onOpenCapstone,
  savedCount,
  completedCount,
  totalTopics,
  isDark,
  onToggleTheme,
  fontScale,
  onChangeFontScale,
  currentStudent,
  unreadBroadcastsCount,
  isCertificateUnlocked,
  syncStatus,
  onLogoutStudent
}) => {
  // Hidden 5-tap counter on logo to open secret Admin Dashboard
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

    resetTapsTimerRef.current = window.setTimeout(() => {
      logoTapsRef.current = 0;
    }, 2500);

    onGoHome();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-[#141416]/95 backdrop-blur-md transition-colors shadow-xs">
      
      {/* Top Primary Bar */}
      <div className="w-full px-3 sm:px-5 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: Controls + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Navigation Drawer Trigger */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            title="Toggle topics drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className="hidden lg:flex p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar for wider reading"}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* New Modern Vector Logo */}
          <div className="group cursor-pointer">
            <Logo
              variant="desktop"
              onClick={handleLogoClick}
              className="group-hover:opacity-90 transition-opacity"
            />
          </div>
        </div>

        {/* Center: Main Section Navigation (Desktop / Tablet) */}
        <nav 
          aria-label="Main Section Tabs" 
          className="hidden md:flex items-center p-1 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/70 border border-zinc-200/70 dark:border-zinc-700/60 shrink-0"
        >
          {MAIN_SECTIONS.map((sec) => {
            const isSelected = selectedPart === sec.part;
            return (
              <button
                key={sec.part}
                type="button"
                onClick={() => onSelectPart(sec.part)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/40'
                }`}
              >
                <span className="hidden lg:inline">{sec.label}</span>
                <span className="lg:hidden">{sec.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Global Search, Cloud Sync, Appearance, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Global Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#1e1e22] hover:border-sky-500/50 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs transition-all shadow-2xs cursor-pointer min-w-[36px] sm:min-w-[140px] md:min-w-[180px]"
            title="Search documentation (Ctrl+K)"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="hidden sm:inline text-xs truncate">Search topics...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shrink-0">
              Ctrl K
            </kbd>
          </button>

          {/* Cloud Sync Status Indicator */}
          <button
            type="button"
            onClick={onOpenSync}
            className={`relative p-2 rounded-xl transition-all cursor-pointer border ${
              syncStatus === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : syncStatus === 'syncing'
                ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
                : syncStatus === 'error'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/80 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
            title={
              syncStatus === 'success'
                ? 'Cloud Sync: Synchronized'
                : syncStatus === 'syncing'
                ? 'Cloud Sync: Synchronizing...'
                : syncStatus === 'error'
                ? 'Cloud Sync: Failed (click to inspect)'
                : 'Cloud Sync: Idle (click to configure)'
            }
          >
            {syncStatus === 'syncing' ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
            ) : syncStatus === 'success' ? (
              <div className="relative">
                <Cloud className="w-4 h-4 text-emerald-500" />
                <Check className="w-2.5 h-2.5 text-emerald-500 absolute -bottom-1 -right-1 font-bold" />
              </div>
            ) : syncStatus === 'error' ? (
              <div className="relative">
                <Cloud className="w-4 h-4 text-rose-500" />
                <AlertCircle className="w-2.5 h-2.5 text-rose-500 absolute -bottom-1 -right-1 font-bold" />
              </div>
            ) : (
              <Cloud className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700/80"
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600" />
            )}
          </button>

          {/* Personal Utilities Menu Dropdown */}
          <PersonalUtilitiesMenu
            currentStudent={currentStudent}
            savedCount={savedCount}
            completedCount={completedCount}
            totalTopics={totalTopics}
            isCertificateUnlocked={isCertificateUnlocked}
            unreadBroadcastsCount={unreadBroadcastsCount}
            fontScale={fontScale}
            onChangeFontScale={onChangeFontScale}
            isDark={isDark}
            onToggleTheme={onToggleTheme}
            onOpenSaved={onOpenSaved}
            onOpenProgress={onOpenProgress}
            onOpenKnowledgeBase={onOpenKnowledgeBase}
            knowledgeNotesCount={knowledgeNotesCount}
            onOpenCertificate={onOpenCertificate}
            onOpenBroadcasts={onOpenBroadcasts}
            onOpenSync={onOpenSync}
            onOpenCapstone={onOpenCapstone}
            onLogoutStudent={onLogoutStudent}
          />

        </div>
      </div>

      {/* Mobile Horizontal Section Tabs Strip (Visible only below md breakpoint) */}
      <div className="md:hidden flex items-center px-3 py-1.5 border-t border-zinc-200/60 dark:border-zinc-800/60 overflow-x-auto no-scrollbar gap-1.5 bg-zinc-50/50 dark:bg-[#18181b]/50">
        {MAIN_SECTIONS.map((sec) => {
          const isSelected = selectedPart === sec.part;
          return (
            <button
              key={sec.part}
              type="button"
              onClick={() => onSelectPart(sec.part)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {sec.shortLabel}
            </button>
          );
        })}
      </div>

    </header>
  );
};
