import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  CheckCircle2,
  Bookmark,
  X,
  ListCollapse,
  ChevronsUpDown,
  BookOpen
} from 'lucide-react';
import { ALL_TOPICS, SECTIONS } from '../data/topics';
import type { TopicDetail, PartType, SectionMeta } from '../types';

interface SidebarProps {
  selectedPart: PartType;
  activeTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  onGoHome?: () => void;
  completedTopicIds: Set<string>;
  savedTopicIds: Set<string>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isSidebarCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedPart,
  activeTopicId,
  onSelectTopic,
  completedTopicIds,
  savedTopicIds,
  isOpenMobile,
  onCloseMobile,
  isSidebarCollapsed = false
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  // Sections for currently active part
  const partSections = useMemo(() => {
    return SECTIONS.filter(s => s.part === selectedPart);
  }, [selectedPart]);

  // Map of topics by ID for fast lookup
  const topicsMap = useMemo(() => {
    const map = new Map<string, TopicDetail>();
    ALL_TOPICS.forEach(t => map.set(t.id, t));
    return map;
  }, []);

  // Section Accordion expanded state with persistence
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_expanded_sections');
      if (saved) return JSON.parse(saved);
      // Default: expand first two sections
      return { 1: true, 2: true };
    } catch {
      return { 1: true, 2: true };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('java_handbook_expanded_sections', JSON.stringify(expandedSections));
    } catch {}
  }, [expandedSections]);

  // Auto-expand section containing active topic
  useEffect(() => {
    if (!activeTopicId) return;
    const current = topicsMap.get(activeTopicId);
    if (current && current.sectionNumber) {
      setExpandedSections(prev => ({
        ...prev,
        [current.sectionNumber]: true
      }));
    }
  }, [activeTopicId, topicsMap]);

  const toggleSection = (secNum: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [secNum]: !prev[secNum]
    }));
  };

  const expandAll = () => {
    const allSecs: Record<number, boolean> = {};
    partSections.forEach(s => {
      allSecs[s.sectionNumber] = true;
    });
    setExpandedSections(prev => ({ ...prev, ...allSecs }));
  };

  const collapseAll = () => {
    const closed: Record<number, boolean> = {};
    partSections.forEach(s => {
      closed[s.sectionNumber] = false;
    });
    setExpandedSections(prev => ({ ...prev, ...closed }));
  };

  const matchesFilter = (topic: TopicDetail): boolean => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(q) ||
      topic.shortDescription.toLowerCase().includes(q) ||
      topic.versionBadge.toLowerCase().includes(q) ||
      Boolean(topic.relevanceLevel && topic.relevanceLevel.toLowerCase().includes(q))
    );
  };

  const totalTopicsInPart = useMemo(() => {
    let count = 0;
    partSections.forEach(s => {
      count += s.topicIds.length;
    });
    return count;
  }, [partSections]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        aria-label="Topics Navigation Sidebar"
        className={`fixed inset-y-0 left-0 lg:top-14 sm:lg:top-16 z-50 w-72 sm:w-80 bg-zinc-50 dark:bg-[#141416] border-r border-zinc-200/80 dark:border-zinc-800/80 transition-transform duration-200 ease-in-out overflow-y-auto pb-20 lg:pb-8 shadow-2xl lg:shadow-none ${
          isOpenMobile
            ? 'translate-x-0'
            : '-translate-x-full'
        } ${
          isSidebarCollapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0'
        }`}
      >
        <div className="p-3.5 sm:p-4 space-y-3.5 text-left">
          
          {/* Mobile Drawer Top Bar with Close Button */}
          <div className="lg:hidden flex items-center justify-between pb-3 pt-1 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Curriculum Navigation
              </span>
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

          {/* Section Indicator & Filter Header */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 block">
                  {selectedPart.split(':')[1]?.trim() || selectedPart}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {partSections.length} Sections · {totalTopicsInPart} Topics
                </span>
              </div>

              {/* Expand / Collapse All Toggles */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={expandAll}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Expand all sections"
                >
                  <ChevronsUpDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Collapse all sections"
                >
                  <ListCollapse className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Topic Search / Filter Input */}
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter topics in this section..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-white dark:bg-[#1e1e22] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-2xs"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Section Accordion List */}
          <div className="space-y-2 pt-1">
            {partSections.map((section: SectionMeta) => {
              const isSectionOpen = expandedSections[section.sectionNumber] ?? false;

              // Filter topics within this section
              const sectionTopics = section.topicIds
                .map(id => topicsMap.get(id))
                .filter((t): t is TopicDetail => !!t && matchesFilter(t));

              if (filterQuery && sectionTopics.length === 0) {
                return null;
              }

              const completedInSection = section.topicIds.filter(id => completedTopicIds.has(id)).length;

              return (
                <div
                  key={section.sectionNumber}
                  className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/70 dark:bg-[#1a1a1e]/60 overflow-hidden transition-all shadow-2xs"
                >
                  {/* Section Accordion Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.sectionNumber)}
                    className="w-full flex items-center justify-between p-2.5 text-left hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group select-none"
                    aria-expanded={isSectionOpen}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
                        {section.sectionNumber}
                      </span>
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                        {section.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {completedInSection > 0 && (
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {completedInSection}/{section.topicIds.length}
                        </span>
                      )}
                      {isSectionOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-transform" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-transform" />
                      )}
                    </div>
                  </button>

                  {/* Section Topics List */}
                  {isSectionOpen && (
                    <div className="px-1.5 pb-2 pt-0.5 space-y-0.5 border-t border-zinc-100 dark:border-zinc-800/60">
                      {sectionTopics.map((topic) => {
                        const isActive = activeTopicId === topic.id;
                        const isCompleted = completedTopicIds.has(topic.id);
                        const isSaved = savedTopicIds.has(topic.id);

                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => {
                              onSelectTopic(topic.id);
                              onCloseMobile();
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer group text-left ${
                              isActive
                                ? 'bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold border-l-2 border-sky-500 shadow-2xs'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50'
                            }`}
                          >
                            <span className="truncate pr-2">{topic.title}</span>

                            <div className="flex items-center gap-1 shrink-0">
                              {isSaved && (
                                <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                              )}
                              {isCompleted && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </aside>
    </>
  );
};
