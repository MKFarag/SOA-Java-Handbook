import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopicView } from './components/TopicView';
import { HomeView } from './components/HomeView';
import { SavedView } from './components/SavedView';
import { ProgressView } from './components/ProgressView';
import { CertificateView } from './components/CertificateView';
import { CapstoneProjectView } from './components/CapstoneProjectView';
import { SearchModal } from './components/SearchModal';
import { StudentSyncModal } from './components/StudentSyncModal';
import { CertificateGateModal } from './components/CertificateGateModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { BroadcastsModal } from './components/BroadcastsModal';
import { MobileNav } from './components/MobileNav';
import { ALL_TOPICS, getTopicById, resolveTopic, migrateProfileData, CURRENT_TOPIC_IDS } from './data/topics';
import type { ChallengeStatus, PartType, StudentProfile, BroadcastItem } from './types';
import { saveStudentProfile, getBroadcasts } from './services/firebaseService';

type ViewType = 'home' | 'topic' | 'saved' | 'progress' | 'certificate' | 'capstone';

const parseInitialNav = (): { view: ViewType; topicId: string } => {
  const fallbackTopicId = ALL_TOPICS[0]?.id || 'topic-01';
  if (typeof window === 'undefined') {
    return { view: 'home', topicId: fallbackTopicId };
  }
  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!rawHash || rawHash === 'home') return { view: 'home', topicId: fallbackTopicId };
  if (rawHash === 'saved') return { view: 'saved', topicId: fallbackTopicId };
  if (rawHash === 'progress') return { view: 'progress', topicId: fallbackTopicId };
  if (rawHash === 'certificate') return { view: 'certificate', topicId: fallbackTopicId };
  if (rawHash === 'capstone') return { view: 'capstone', topicId: fallbackTopicId };

  const matched = resolveTopic(rawHash);
  if (matched) {
    return { view: 'topic', topicId: matched.id };
  }
  return { view: 'home', topicId: fallbackTopicId };
};

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

  // Synchronous Initial View & Active Topic Parsing to eliminate refresh flicker
  const initialNav = parseInitialNav();
  const [currentView, setCurrentView] = useState<ViewType>(initialNav.view);
  const [selectedCapstonePart, setSelectedCapstonePart] = useState<PartType>('Part 1: Java Core');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(initialNav.topicId);

  // Bookmarked topics
  const [savedTopicIds, setSavedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_saved');
      const parsed = saved ? JSON.parse(saved) : ['topic-03', 'topic-66'];
      return Array.isArray(parsed) ? parsed.filter((id: string) => CURRENT_TOPIC_IDS.has(id)) : ['topic-03', 'topic-66'];
    } catch {
      return ['topic-03', 'topic-66'];
    }
  });

  // Completed topics with versioned migration
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_completed');
      const studentRaw = localStorage.getItem('soa_student_profile');
      const student = studentRaw ? JSON.parse(studentRaw) : null;
      const initialList = saved ? JSON.parse(saved) : (student?.completedTopics || ['topic-03']);
      const currentSchemaVer = localStorage.getItem('soa_data_schema_version') ? parseInt(localStorage.getItem('soa_data_schema_version')!, 10) : 1;
      const migrated = migrateProfileData({
        completedTopics: initialList,
        lastActive: student?.lastActive,
        schemaVersion: currentSchemaVer
      });
      localStorage.setItem('soa_data_schema_version', '2');
      localStorage.setItem('java_handbook_completed', JSON.stringify(migrated.completedTopics));
      return new Set(migrated.completedTopics);
    } catch {
      return new Set(['topic-03']);
    }
  });

  // Valid completed count: counts ONLY topics that exist in the modern curriculum
  const validCompletedCount = useMemo(() => {
    let count = 0;
    for (const id of completedTopicIds) {
      if (CURRENT_TOPIC_IDS.has(id)) count++;
    }
    return count;
  }, [completedTopicIds]);

  // Challenge assessment states: record of challengeId -> ChallengeStatus
  const [challengeStates, setChallengeStates] = useState<Record<string, ChallengeStatus>>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_challenges');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Targeted review topics: Set of topicIds flagged for knowledge gap remediation
  const [targetedReviewIds, setTargetedReviewIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_targeted_review');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // --- Student Cloud Sync & Security State ---
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('soa_student_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCertificateUnlocked, setIsCertificateUnlocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('soa_certificate_unlocked');
    return saved === 'true';
  });

  const [unlockedStudentName, setUnlockedStudentName] = useState<string>(() => {
    return localStorage.getItem('java_handbook_custom_name') || 'Mohamed Khaled Farag';
  });

  // Modals visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isCertGateOpen, setIsCertGateOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBroadcastsModalOpen, setIsBroadcastsModalOpen] = useState(false);

  // Syncing state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Broadcasts & Notifications
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [unreadBroadcastsCount, setUnreadBroadcastsCount] = useState<number>(0);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(false);

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

  // Sync saved bookmarks locally
  useEffect(() => {
    localStorage.setItem('java_handbook_saved', JSON.stringify(savedTopicIds));
  }, [savedTopicIds]);

  // Sync completed topics locally
  useEffect(() => {
    localStorage.setItem('java_handbook_completed', JSON.stringify([...completedTopicIds]));
  }, [completedTopicIds]);

  // Sync challenge states locally
  useEffect(() => {
    localStorage.setItem('java_handbook_challenges', JSON.stringify(challengeStates));
  }, [challengeStates]);

  // Sync targeted review locally
  useEffect(() => {
    localStorage.setItem('java_handbook_targeted_review', JSON.stringify([...targetedReviewIds]));
  }, [targetedReviewIds]);

  // Sync student profile locally
  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('soa_student_profile', JSON.stringify(currentStudent));
      if (currentStudent.certificateUnlocked) {
        setIsCertificateUnlocked(true);
        localStorage.setItem('soa_certificate_unlocked', 'true');
      }
    } else {
      localStorage.removeItem('soa_student_profile');
    }
  }, [currentStudent]);

  // Sync certificate unlocked status locally
  useEffect(() => {
    localStorage.setItem('soa_certificate_unlocked', isCertificateUnlocked ? 'true' : 'false');
  }, [isCertificateUnlocked]);

  // Fetch broadcasts on startup and calculate unread count
  const refreshBroadcasts = useCallback(async () => {
    setLoadingBroadcasts(true);
    try {
      const data = await getBroadcasts();
      setBroadcasts(data);

      const lastRead = localStorage.getItem('soa_last_read_broadcast_time') || '1970-01-01';
      const unread = data.filter(b => new Date(b.createdAt) > new Date(lastRead)).length;
      setUnreadBroadcastsCount(unread);
    } catch (err) {
      console.warn('Could not fetch broadcasts:', err);
    } finally {
      setLoadingBroadcasts(false);
    }
  }, []);

  useEffect(() => {
    refreshBroadcasts();
  }, [refreshBroadcasts]);

  // Open Broadcasts Modal & mark read
  const handleOpenBroadcasts = () => {
    setIsBroadcastsModalOpen(true);
    setUnreadBroadcastsCount(0);
    localStorage.setItem('soa_last_read_broadcast_time', new Date().toISOString());
  };

  // Automated Cloud Sync to Firestore (Debounced)
  const syncTimeoutRef = useRef<number | null>(null);

  const forceSyncToCloud = useCallback(async () => {
    if (!currentStudent) return;
    setIsSyncing(true);
    try {
      await saveStudentProfile({
        code: currentStudent.code,
        name: currentStudent.name,
        completedTopics: [...completedTopicIds],
        savedTopics: savedTopicIds,
        challengeStates: challengeStates,
        targetedReviewIds: [...targetedReviewIds],
        certificateUnlocked: isCertificateUnlocked
      });
      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Auto-sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [currentStudent, completedTopicIds, savedTopicIds, challengeStates, targetedReviewIds, isCertificateUnlocked]);

  useEffect(() => {
    if (!currentStudent) return;

    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = window.setTimeout(() => {
      forceSyncToCloud();
    }, 1200);

    return () => {
      if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
    };
  }, [completedTopicIds, savedTopicIds, challengeStates, targetedReviewIds, currentStudent, forceSyncToCloud]);

  // Student Login callback
  const handleStudentLogin = (profile: StudentProfile) => {
    setCurrentStudent(profile);
    setUnlockedStudentName(profile.name);
    localStorage.setItem('java_handbook_custom_name', profile.name);

    // Merge or load cloud progress
    if (profile.completedTopics && profile.completedTopics.length > 0) {
      setCompletedTopicIds(new Set(profile.completedTopics));
    }
    if (profile.savedTopics && profile.savedTopics.length > 0) {
      setSavedTopicIds(profile.savedTopics);
    }
    if (profile.challengeStates && Object.keys(profile.challengeStates).length > 0) {
      setChallengeStates(profile.challengeStates);
    }
    if (profile.targetedReviewIds && profile.targetedReviewIds.length > 0) {
      setTargetedReviewIds(new Set(profile.targetedReviewIds));
    }
    if (profile.certificateUnlocked) {
      setIsCertificateUnlocked(true);
    }
    setLastSyncTime(new Date());
  };

  // Student Logout callback
  const handleStudentLogout = () => {
    setCurrentStudent(null);
    setIsCertificateUnlocked(false);
    localStorage.removeItem('soa_student_profile');
    localStorage.removeItem('soa_certificate_unlocked');
  };

  const handleNavigateView = (view: ViewType) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Certificate Open Gate Check
  const handleOpenCertificate = () => {
    const isLocalComplete = validCompletedCount >= ALL_TOPICS.length;
    if (isCertificateUnlocked || isLocalComplete) {
      handleNavigateView('certificate');
    } else {
      setIsCertGateOpen(true);
    }
  };

  const handleUnlockCertificateSuccess = (studentName?: string) => {
    setIsCertificateUnlocked(true);
    if (studentName) {
      setUnlockedStudentName(studentName);
      localStorage.setItem('java_handbook_custom_name', studentName);
    }
    handleNavigateView('certificate');
  };

  // Global Shortcuts Listener (Ctrl+K for search, Ctrl+Shift+A for secret Admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K -> Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      // Ctrl+Shift+A -> Secret Admin Portal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };

    // URL Hash Navigation Listener (#topic-id, #slug, #saved, #progress, #admin, #capstone, #certificate)
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!rawHash) {
        setCurrentView('home');
        return;
      }
      if (rawHash === 'admin' || rawHash === 'admin-portal') {
        setIsAdminModalOpen(true);
        return;
      }
      if (rawHash === 'home') {
        setCurrentView('home');
        return;
      }
      if (rawHash === 'saved') {
        setCurrentView('saved');
        return;
      }
      if (rawHash === 'progress') {
        setCurrentView('progress');
        return;
      }
      if (rawHash === 'certificate') {
        setCurrentView('certificate');
        return;
      }
      if (rawHash === 'capstone') {
        setCurrentView('capstone');
        return;
      }

      const matched = resolveTopic(rawHash);
      if (matched) {
        setActiveTopicId(matched.id);
        setCurrentView('topic');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);

    // Initial check for secret admin modal on direct link
    const initialRaw = window.location.hash.replace(/^#\/?/, '').trim();
    if (initialRaw === 'admin' || initialRaw === 'admin-portal') {
      setIsAdminModalOpen(true);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSolveChallenge = (challengeId: string) => {
    setChallengeStates(prev => ({
      ...prev,
      [challengeId]: 'mastered'
    }));
  };

  const handleNeedHelpChallenge = (challengeId: string, prerequisiteTopicIds: string[]) => {
    setChallengeStates(prev => ({
      ...prev,
      [challengeId]: 'needs-review'
    }));
    setTargetedReviewIds(prev => {
      const next = new Set(prev);
      prerequisiteTopicIds.forEach(id => next.add(id));
      return next;
    });
  };

  const handleResetChallenge = (challengeId: string) => {
    setChallengeStates(prev => {
      const next = { ...prev };
      delete next[challengeId];
      return next;
    });
  };

  const handleRemoveTargetedReview = (topicId: string) => {
    setTargetedReviewIds(prev => {
      const next = new Set(prev);
      next.delete(topicId);
      return next;
    });
  };

  const handleSelectTopic = (topicId: string) => {
    const topic = getTopicById(topicId) || resolveTopic(topicId);
    const targetId = topic ? topic.id : topicId;
    setActiveTopicId(targetId);
    setCurrentView('topic');
    if (topic) {
      window.location.hash = topic.slug || topic.id;
    } else {
      window.location.hash = topicId;
    }
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
        onOpenSaved={() => handleNavigateView('saved')}
        onOpenProgress={() => handleNavigateView('progress')}
        onOpenCertificate={handleOpenCertificate}
        onGoHome={() => handleNavigateView('home')}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenBroadcasts={handleOpenBroadcasts}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        savedCount={savedTopicIds.length}
        completedCount={validCompletedCount}
        totalTopics={ALL_TOPICS.length}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
        fontScale={fontScale}
        onChangeFontScale={(delta) => setFontScale(prev => Math.min(130, Math.max(85, prev + delta)))}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        currentStudent={currentStudent}
        unreadBroadcastsCount={unreadBroadcastsCount}
        isCertificateUnlocked={isCertificateUnlocked || validCompletedCount >= ALL_TOPICS.length}
      />

      <div className="flex-1 flex w-full pt-14 sm:pt-16">
        {/* Sticky Sidebar Navigation */}
        <Sidebar
          activeTopicId={currentView === 'topic' ? activeTopicId : null}
          onSelectTopic={handleSelectTopic}
          onGoHome={() => handleNavigateView('home')}
          onOpenSaved={() => handleNavigateView('saved')}
          onOpenProgress={() => handleNavigateView('progress')}
          onOpenCertificate={handleOpenCertificate}
          onOpenCapstone={(part) => {
            if (part) setSelectedCapstonePart(part);
            handleNavigateView('capstone');
          }}
          onOpenSync={() => setIsSyncModalOpen(true)}
          onOpenBroadcasts={handleOpenBroadcasts}
          completedTopicIds={completedTopicIds}
          savedTopicIds={new Set(savedTopicIds)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCertificateUnlocked={isCertificateUnlocked || validCompletedCount >= ALL_TOPICS.length}
          unreadBroadcastsCount={unreadBroadcastsCount}
        />

        {/* Main Workspace Panel */}
        <main className="flex-1 lg:pl-72 xl:pl-80 w-full min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] pb-20 lg:pb-8">
          {currentView === 'home' && (
            <HomeView
              onSelectTopic={handleSelectTopic}
              completedTopicIds={completedTopicIds}
              onOpenCertificate={handleOpenCertificate}
              onOpenCapstone={(part) => {
                if (part) setSelectedCapstonePart(part);
                handleNavigateView('capstone');
              }}
              broadcasts={broadcasts}
              onOpenBroadcasts={handleOpenBroadcasts}
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
              onOpenCertificate={handleOpenCertificate}
              onOpenCapstone={(part) => {
                if (part) setSelectedCapstonePart(part);
                handleNavigateView('capstone');
              }}
              challengeStates={challengeStates}
              targetedReviewIds={targetedReviewIds}
              onSolveChallenge={handleSolveChallenge}
              onNeedHelpChallenge={handleNeedHelpChallenge}
              onResetChallenge={handleResetChallenge}
              onRemoveTargetedReview={handleRemoveTargetedReview}
            />
          )}

          {currentView === 'certificate' && (
            <CertificateView
              completedCount={validCompletedCount}
              totalTopics={ALL_TOPICS.length}
              onGoBack={() => handleNavigateView('home')}
              onGoToProgress={() => handleNavigateView('progress')}
              studentName={unlockedStudentName}
            />
          )}

          {currentView === 'capstone' && (
            <CapstoneProjectView
              initialPart={selectedCapstonePart}
              completedTopicIds={completedTopicIds}
              onSelectTopic={handleSelectTopic}
              onGoHome={() => handleNavigateView('home')}
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

      {/* Student Cloud Sync Modal */}
      <StudentSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        currentStudent={currentStudent}
        onStudentLogin={handleStudentLogin}
        onStudentLogout={handleStudentLogout}
        onSyncNow={forceSyncToCloud}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        currentCompletedCount={validCompletedCount}
        currentSavedCount={savedTopicIds.length}
      />

      {/* Certificate Gate Modal */}
      <CertificateGateModal
        isOpen={isCertGateOpen}
        onClose={() => setIsCertGateOpen(false)}
        onUnlockSuccess={handleUnlockCertificateSuccess}
        completedCount={validCompletedCount}
        totalTopics={ALL_TOPICS.length}
        currentStudent={currentStudent}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Announcements & Shared Resources Modal */}
      <BroadcastsModal
        isOpen={isBroadcastsModalOpen}
        onClose={() => setIsBroadcastsModalOpen(false)}
        broadcasts={broadcasts}
        onRefresh={refreshBroadcasts}
        isLoading={loadingBroadcasts}
      />

      {/* Secret Instructor & Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        totalHandbookTopics={ALL_TOPICS.length}
        onBroadcastsUpdated={refreshBroadcasts}
      />


      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentView={currentView}
        onGoHome={() => handleNavigateView('home')}
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSaved={() => handleNavigateView('saved')}
        onOpenProgress={() => handleNavigateView('progress')}
        savedCount={savedTopicIds.length}
        percentComplete={Math.min(100, Math.round((validCompletedCount / Math.max(ALL_TOPICS.length, 1)) * 100))}
      />
    </div>
  );
}

export default App;
