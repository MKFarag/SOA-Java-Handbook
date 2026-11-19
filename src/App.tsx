import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopicView } from './components/TopicView';
import { HomeView } from './components/HomeView';
import { SavedView } from './components/SavedView';
import { ProgressView } from './components/ProgressView';
import { CertificateView } from './components/CertificateView';
import { SearchModal } from './components/SearchModal';
import { ALL_TOPICS, getTopicById } from './data/topics';

export function App() {
  // Theme state: respects saved choice or system preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('java_handbook_theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Font scale (default: 100%)
  const [fontScale, setFontScale] = useState<number>(() => {
    const saved = localStorage.getItem('java_handbook_fontscale');
    return saved ? parseInt(saved, 10) : 100;
  });

  // Views: 'home' | 'topic' | 'saved' | 'progress' | 'certificate'
  const [currentView, setCurrentView] = useState<'home' | 'topic' | 'saved' | 'progress' | 'certificate'>('home');
  const [activeTopicId, setActiveTopicId] = useState<string | null>('topic-03');

  // Bookmarked topics
  const [savedTopicIds, setSavedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_saved');
      return saved ? JSON.parse(saved) : ['topic-03', 'topic-66'];
    } catch {
      return ['topic-03', 'topic-66'];
    }
  });

  // Completed topics
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_completed');
      return saved ? new Set(JSON.parse(saved)) : new Set(['topic-03']);
    } catch {
      return new Set(['topic-03']);
    }
  });

  // Modal & mobile sidebar controls
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('java_handbook_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('java_handbook_theme', 'light');
    }
  }, [isDark]);

  // Sync font scale on documentElement
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    localStorage.setItem('java_handbook_fontscale', fontScale.toString());
  }, [fontScale]);

  // Sync saved bookmarks
  useEffect(() => {
    localStorage.setItem('java_handbook_saved', JSON.stringify(savedTopicIds));
  }, [savedTopicIds]);

  // Sync completed topics
  useEffect(() => {
    localStorage.setItem('java_handbook_completed', JSON.stringify([...completedTopicIds]));
  }, [completedTopicIds]);

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTopic = (topicId: string) => {
    setActiveTopicId(topicId);
    setCurrentView('topic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaved = (topicId: string) => {
    setSavedTopicIds(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId) 
        : [...prev, topicId]
    );
  };

  const handleToggleCompleted = (topicId: string) => {
    setCompletedTopicIds(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const activeTopic = activeTopicId ? getTopicById(activeTopicId) : ALL_TOPICS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors selection:bg-orange-500/20 selection:text-orange-500">
      
      {/* Global Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSaved={() => setCurrentView('saved')}
        onOpenProgress={() => setCurrentView('progress')}
        onOpenCertificate={() => setCurrentView('certificate')}
        onGoHome={() => setCurrentView('home')}
        savedCount={savedTopicIds.length}
        completedCount={completedTopicIds.size}
        totalTopics={ALL_TOPICS.length}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
        fontScale={fontScale}
        onChangeFontScale={(delta) => setFontScale(prev => Math.min(130, Math.max(85, prev + delta)))}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      <div className="flex-1 flex w-full">
        {/* Sticky Sidebar Navigation */}
        <Sidebar
          activeTopicId={currentView === 'topic' ? activeTopicId : null}
          onSelectTopic={handleSelectTopic}
          onGoHome={() => setCurrentView('home')}
          onOpenSaved={() => setCurrentView('saved')}
          onOpenProgress={() => setCurrentView('progress')}
          onOpenCertificate={() => setCurrentView('certificate')}
          completedTopicIds={completedTopicIds}
          savedTopicIds={new Set(savedTopicIds)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Workspace Panel */}
        <main className="flex-1 lg:pl-72 md:lg:pl-80 w-full min-h-[calc(100vh-4rem)]">
          {currentView === 'home' && (
            <HomeView
              onSelectTopic={handleSelectTopic}
              completedTopicIds={completedTopicIds}
              onOpenCertificate={() => setCurrentView('certificate')}
            />
          )}

          {currentView === 'topic' && activeTopic && (
            <TopicView
              topic={activeTopic}
              onSelectTopic={handleSelectTopic}
              isSaved={savedTopicIds.includes(activeTopic.id)}
              onToggleSaved={handleToggleSaved}
              isCompleted={completedTopicIds.has(activeTopic.id)}
              onToggleCompleted={handleToggleCompleted}
            />
          )}

          {currentView === 'saved' && (
            <SavedView
              savedTopicIds={savedTopicIds}
              onSelectTopic={handleSelectTopic}
              onRemoveSaved={handleToggleSaved}
              onReorderSaved={setSavedTopicIds}
              onClearAll={() => setSavedTopicIds([])}
            />
          )}

          {currentView === 'progress' && (
            <ProgressView
              completedTopicIds={completedTopicIds}
              onToggleCompleted={handleToggleCompleted}
              onSelectTopic={handleSelectTopic}
              onOpenCertificate={() => setCurrentView('certificate')}
            />
          )}

          {currentView === 'certificate' && (
            <CertificateView
              completedCount={completedTopicIds.size}
              totalTopics={ALL_TOPICS.length}
              onGoBack={() => setCurrentView('home')}
              onGoToProgress={() => setCurrentView('progress')}
              onUnlockAll={() => setCompletedTopicIds(new Set(ALL_TOPICS.map(t => t.id)))}
            />
          )}
        </main>
      </div>

      {/* Global Offline Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTopic={handleSelectTopic}
      />
    </div>
  );
}

export default App;
