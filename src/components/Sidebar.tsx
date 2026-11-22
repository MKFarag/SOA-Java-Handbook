import React, { useState, useEffect } from 'react';
import { 
  Coffee,
  Home, 
  Bookmark, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Layers, 
  Server, 
  Leaf,
  Database,
  Filter,
  Award,
  Trophy,
  Lock,
  Cloud,
  Bell,
  X,
  ChevronsUpDown,
  ListCollapse
} from 'lucide-react';
import { ALL_TOPICS, SECTIONS } from '../data/topics';
import type { TopicDetail, PartType } from '../types';

interface SidebarProps {
  activeTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  onGoHome: () => void;
  onOpenSaved: () => void;
  onOpenProgress: () => void;
  onOpenCertificate: () => void;
  onOpenCapstone: (part?: PartType) => void;
  onOpenSync?: () => void;
  onOpenBroadcasts?: () => void;
  completedTopicIds: Set<string>;
  savedTopicIds: Set<string>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCertificateUnlocked?: boolean;
  unreadBroadcastsCount?: number;
}

interface PartConfig {
  part: PartType;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  tagColor: string;
}

const PARTS: PartConfig[] = [
  {
    part: 'Part 1: Java Core',
    label: 'Part 1: Java Core (Zero to Production)',
    shortLabel: 'Java Core',
    icon: Layers,
    accentColor: 'text-orange-600 dark:text-orange-400',
    badgeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
    activeBg: 'bg-orange-500/15 dark:bg-orange-500/20',
    activeBorder: 'border-l-2 border-orange-500',
    activeText: 'text-orange-600 dark:text-orange-400 font-semibold',
    tagColor: 'text-orange-600 dark:text-orange-400 bg-orange-500/10'
  },
  {
    part: 'Part 2: Java EE & Jakarta EE',
    label: 'Part 2: Jakarta EE & Enterprise Web Stack',
    shortLabel: 'Jakarta EE',
    icon: Server,
    accentColor: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
    activeBg: 'bg-sky-500/15 dark:bg-sky-500/20',
    activeBorder: 'border-l-2 border-sky-500',
    activeText: 'text-sky-600 dark:text-sky-400 font-semibold',
    tagColor: 'text-sky-600 dark:text-sky-400 bg-sky-500/10'
  },
  {
    part: 'Part 3: Spring Boot & Production Stack',
    label: 'Part 3: Spring Boot & Production Ecosystem',
    shortLabel: 'Spring Boot',
    icon: Leaf,
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    activeBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    activeBorder: 'border-l-2 border-emerald-500',
    activeText: 'text-emerald-600 dark:text-emerald-400 font-semibold',
    tagColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
  },
  {
    part: 'Part 4: Database Systems & Persistence',
    label: 'Part 4: Database Systems & Persistence (SQL & NoSQL)',
    shortLabel: 'Databases',
    icon: Database,
    accentColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    activeBg: 'bg-amber-500/15 dark:bg-amber-500/20',
    activeBorder: 'border-l-2 border-amber-500',
    activeText: 'text-amber-600 dark:text-amber-400 font-semibold',
    tagColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTopicId,
  onSelectTopic,
  onGoHome,
  onOpenSaved,
  onOpenProgress,
  onOpenCertificate,
  onOpenCapstone,
  onOpenSync,
  onOpenBroadcasts,
  completedTopicIds,
  savedTopicIds,
  isOpenMobile,
  onCloseMobile,
  isCertificateUnlocked = false,
  unreadBroadcastsCount = 0
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  // Persistent Part Accordion state
  const [expandedParts, setExpandedParts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_expanded_parts');
      return saved ? JSON.parse(saved) : {
        'Part 1: Java Core': true,
        'Part 2: Java EE & Jakarta EE': true,
        'Part 3: Spring Boot & Production Stack': true,
        'Part 4: Database Systems & Persistence': true
      };
    } catch {
      return {
        'Part 1: Java Core': true,
        'Part 2: Java EE & Jakarta EE': true,
        'Part 3: Spring Boot & Production Stack': true,
        'Part 4: Database Systems & Persistence': true
      };
    }
  });

  // Persistent Section Accordion state
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_expanded_sections');
      return saved ? JSON.parse(saved) : { 1: true, 2: true };
    } catch {
      return { 1: true, 2: true };
    }
  });

  // Save state preferences to localStorage
  useEffect(() => {
    localStorage.setItem('java_handbook_expanded_parts', JSON.stringify(expandedParts));
  }, [expandedParts]);

  useEffect(() => {
    localStorage.setItem('java_handbook_expanded_sections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  // Automatically expand active topic's part and section
  useEffect(() => {
    if (!activeTopicId) return;
    const current = ALL_TOPICS.find(t => t.id === activeTopicId);
    if (!current) return;

    setExpandedParts(prev => ({ ...prev, [current.part]: true }));
    setExpandedSections(prev => ({ ...prev, [current.sectionNumber]: true }));
  }, [activeTopicId]);

  const togglePart = (part: PartType) => {
    setExpandedParts(prev => ({
      ...prev,
      [part]: !prev[part]
    }));
  };

  const toggleSection = (sectionNumber: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionNumber]: !prev[sectionNumber]
    }));
  };

  const expandAll = () => {
    const allSecs: Record<number, boolean> = {};
    SECTIONS.forEach(s => {
      allSecs[s.sectionNumber] = true;
    });
    setExpandedSections(allSecs);
    setExpandedParts({
      'Part 1: Java Core': true,
      'Part 2: Java EE & Jakarta EE': true,
      'Part 3: Spring Boot & Production Stack': true,
      'Part 4: Database Systems & Persistence': true
    });
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const filterTopic = (topic: TopicDetail) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(q) ||
      topic.shortDescription.toLowerCase().includes(q) ||
      topic.versionBadge.toLowerCase().includes(q) ||
      (topic.relevanceLevel && topic.relevanceLevel.toLowerCase().includes(q))
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 lg:top-16 z-50 w-72 sm:w-80 bg-zinc-50 dark:bg-[#141416] border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-200 ease-in-out lg:translate-x-0 overflow-y-auto pb-20 lg:pb-6 shadow-2xl lg:shadow-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3.5 sm:p-4 space-y-3.5 sm:space-y-4 text-left">
          
          {/* Mobile Drawer Header with Close Button */}
          <div className="lg:hidden flex items-center justify-between pb-3 pt-1 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  SOA &amp; Java Topics
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {ALL_TOPICS.length} Modules Catalog
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 cursor-pointer"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Quick Links */}
          <div className="space-y-1 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                onGoHome();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-orange-500" />
              <span>Handbook Home</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenSaved();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Saved Topics</span>
              </div>
              {savedTopicIds.size > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                  {savedTopicIds.size}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenProgress();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Progress Overview</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {completedTopicIds.size} done
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenCertificate();
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isCertificateUnlocked
                  ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                  : 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isCertificateUnlocked ? (
                  <Award className="w-4 h-4 text-amber-500" />
                ) : (
                  <Lock className="w-4 h-4 text-zinc-400" />
                )}
                <span>Completion Certificate</span>
              </div>
              <span className={`text-[10px] uppercase font-mono font-bold ${isCertificateUnlocked ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400'}`}>
                {isCertificateUnlocked ? 'Verified' : '🔒 Locked'}
              </span>
            </button>

            {onOpenSync && (
              <button
                type="button"
                onClick={() => {
                  onOpenSync();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Cloud className="w-4 h-4 text-orange-500" />
                  <span>Cloud Sync & Code</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-500">
                  Sync
                </span>
              </button>
            )}

            {onOpenBroadcasts && (
              <button
                type="button"
                onClick={() => {
                  onOpenBroadcasts();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-blue-500" />
                  <span>Announcements & Links</span>
                </div>
                {unreadBroadcastsCount !== undefined && unreadBroadcastsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                    {unreadBroadcastsCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onOpenCapstone();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-purple-500" />
                <span>Capstone Projects</span>
              </div>
              <span className="text-[9.5px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300">
                3 Tiers
              </span>
            </button>
          </div>

          {/* Instant Search & Quick Filter */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Instant filter topics..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-[#1e1e1e] border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-orange-500/50"
            />
            {filterQuery && (
              <button 
                type="button"
                onClick={() => setFilterQuery('')}
                className="absolute right-2.5 top-2 text-[10px] text-zinc-400 hover:text-zinc-200 font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Section Expansion Controls (Expand All / Collapse All) */}
          <div className="flex items-center justify-between text-xs px-1 pt-0.5">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono">
              Sections ({SECTIONS.length})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={expandAll}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-200/70 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                title="Expand all sections to view all topics"
              >
                <ChevronsUpDown className="w-3 h-3 text-orange-500 shrink-0" />
                <span>Expand All</span>
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-200/70 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                title="Collapse topics back into sections"
              >
                <ListCollapse className="w-3 h-3 text-zinc-400 shrink-0" />
                <span>Collapse All</span>
              </button>
            </div>
          </div>

          {/* Multi-Level Tri-Part Accordion Structure */}
          <div className="space-y-4 pt-1">
            {PARTS.map(partConfig => {
              const partTopics = ALL_TOPICS.filter(t => t.part === partConfig.part);
              const matchingTopics = partTopics.filter(filterTopic);
              
              if (filterQuery && matchingTopics.length === 0) return null;

              const isPartExpanded = filterQuery ? true : Boolean(expandedParts[partConfig.part]);
              const completedInPart = partTopics.filter(t => completedTopicIds.has(t.id)).length;
              const PartIcon = partConfig.icon;

              return (
                <div 
                  key={partConfig.part}
                  className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 overflow-hidden shadow-xs"
                >
                  {/* Part Header Accordion Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-zinc-100/60 dark:bg-zinc-800/50 border-b border-zinc-200/60 dark:border-zinc-800/60 select-none">
                    <button
                      type="button"
                      onClick={() => togglePart(partConfig.part)}
                      className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer group"
                    >
                      <PartIcon className={`w-4 h-4 shrink-0 ${partConfig.accentColor}`} />
                      <div className="truncate">
                        <span className={`text-xs font-bold font-mono tracking-tight block truncate ${partConfig.accentColor}`}>
                          {partConfig.shortLabel}
                        </span>
                      </div>
                      {isPartExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60 text-zinc-400 group-hover:text-zinc-200 transition-transform" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60 text-zinc-400 group-hover:text-zinc-200 transition-transform" />
                      )}
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      {/* Part Topics Counter */}
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {completedInPart}/{partTopics.length}
                      </span>
                    </div>
                  </div>

                  {/* Part Body: Section-Level Accordions */}
                  {isPartExpanded && (
                    <div className="p-1.5 space-y-1.5">
                      {SECTIONS.filter(s => s.part === partConfig.part).map(section => {
                        const secTopics = ALL_TOPICS.filter(t => t.sectionNumber === section.sectionNumber);
                        const matchingSecTopics = secTopics.filter(filterTopic);

                        if (filterQuery && matchingSecTopics.length === 0) return null;

                        const isSecExpanded = filterQuery ? true : Boolean(expandedSections[section.sectionNumber]);
                        const completedInSec = secTopics.filter(t => completedTopicIds.has(t.id)).length;
                        const isSecActive = secTopics.some(t => t.id === activeTopicId);

                        return (
                          <div 
                            key={section.sectionNumber}
                            className={`rounded-lg border transition-colors overflow-hidden ${
                              isSecActive 
                                ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-800/30' 
                                : 'border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/20'
                            }`}
                          >
                            {/* Section Header Accordion Toggle */}
                            <button
                              type="button"
                              onClick={() => toggleSection(section.sectionNumber)}
                              className="w-full flex items-center justify-between p-2 text-left hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 transition-colors select-none cursor-pointer group"
                            >
                              <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-1">
                                <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 shrink-0">
                                  {section.sectionNumber.toString().padStart(2, '0')}
                                </span>
                                <span className={`text-[11.5px] font-semibold truncate ${
                                  isSecActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'
                                }`}>
                                  {section.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[9.5px] font-mono text-zinc-400">
                                  {completedInSec}/{secTopics.length}
                                </span>
                                {isSecExpanded ? (
                                  <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-zinc-200 transition-transform" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-200 transition-transform" />
                                )}
                              </div>
                            </button>

                            {/* Section Topics List */}
                            {isSecExpanded && (
                              <div className="p-1 space-y-0.5 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/40 dark:bg-zinc-900/30">
                                {secTopics.filter(filterTopic).map(topic => {
                                  const isActive = activeTopicId === topic.id;
                                  const isCompleted = completedTopicIds.has(topic.id);

                                  return (
                                    <button
                                      key={topic.id}
                                      type="button"
                                      onClick={() => {
                                        onSelectTopic(topic.id);
                                        onCloseMobile();
                                      }}
                                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-all text-left cursor-pointer ${
                                        isActive
                                          ? `${partConfig.activeBg} ${partConfig.activeBorder} ${partConfig.activeText} shadow-xs font-semibold`
                                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        {isCompleted ? (
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        ) : (
                                          <span className="text-[9.5px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0 w-3.5 text-center">
                                            {topic.topicNumber.toString().padStart(2, '0')}
                                          </span>
                                        )}
                                        <span className="truncate text-[11px]">{topic.title}</span>
                                      </div>
                                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 shrink-0 ml-1">
                                        {topic.versionBadge.split(' ')[0]}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty Filter State */}
          {filterQuery && ALL_TOPICS.filter(filterTopic).length === 0 && (
            <div className="p-6 text-center text-xs text-zinc-500 space-y-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-100/40 dark:bg-zinc-900/30">
              <p className="text-zinc-600 dark:text-zinc-400">No topics found matching "{filterQuery}"</p>
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

        </div>
      </aside>
    </>
  );
};