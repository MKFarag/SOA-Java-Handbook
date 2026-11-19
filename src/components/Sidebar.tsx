import React, { useState } from 'react';
import { 
  Home, 
  Bookmark, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Layers, 
  Server, 
  Filter,
  Award
} from 'lucide-react';
import { SECTIONS, ALL_TOPICS } from '../data/topics';
import type { TopicDetail } from '../types';

interface SidebarProps {
  activeTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  onGoHome: () => void;
  onOpenSaved: () => void;
  onOpenProgress: () => void;
  onOpenCertificate: () => void;
  completedTopicIds: Set<string>;
  savedTopicIds: Set<string>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTopicId,
  onSelectTopic,
  onGoHome,
  onOpenSaved,
  onOpenProgress,
  onOpenCertificate,
  completedTopicIds,
  savedTopicIds,
  isOpenMobile,
  onCloseMobile
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true,
    19: true // default expand sample sections
  });

  const toggleSection = (sectionNumber: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionNumber]: !prev[sectionNumber]
    }));
  };

  const part1Sections = SECTIONS.filter(s => s.part === 'Part 1: Java Core');
  const part2Sections = SECTIONS.filter(s => s.part === 'Part 2: Java EE & Jakarta EE');

  const filterTopic = (topic: TopicDetail) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      topic.title.toLowerCase().includes(q) ||
      topic.shortDescription.toLowerCase().includes(q) ||
      topic.versionBadge.toLowerCase().includes(q)
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
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 md:w-80 bg-zinc-50 dark:bg-[#141416] border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-200 ease-in-out lg:translate-x-0 overflow-y-auto ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4 text-left">
          
          {/* Top Quick Links */}
          <div className="space-y-1 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                onGoHome();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
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
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
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
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
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
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Completion Certificate</span>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold text-amber-600 dark:text-amber-400">
                MK Farag
              </span>
            </button>
          </div>

          {/* Quick Filter Bar */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Filter topics..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-[#1e1e1e] border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {/* Part 1: Java Core */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>Part 1: Java Core</span>
            </div>

            <div className="space-y-1">
              {part1Sections.map(section => {
                const isExpanded = expandedSections[section.sectionNumber] || Boolean(filterQuery);
                const sectionTopics = ALL_TOPICS.filter(t => t.sectionNumber === section.sectionNumber && filterTopic(t));
                if (filterQuery && sectionTopics.length === 0) return null;

                return (
                  <div key={section.sectionNumber} className="rounded-lg">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.sectionNumber)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <span className="truncate pr-2 font-sans font-medium">
                        {section.sectionNumber}. {section.title}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pl-3 mt-1 space-y-0.5 border-l border-zinc-200 dark:border-zinc-800 ml-3">
                        {sectionTopics.map(topic => {
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
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                                isActive
                                  ? 'bg-orange-500/15 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold shadow-xs border-l-2 border-orange-500'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                                )}
                                <span className="truncate">{topic.title}</span>
                              </div>
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 shrink-0 ml-1">
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
          </div>

          {/* Part 2: Java EE & Jakarta EE */}
          <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono">
              <Server className="w-3.5 h-3.5" />
              <span>Part 2: Jakarta EE</span>
            </div>

            <div className="space-y-1">
              {part2Sections.map(section => {
                const isExpanded = expandedSections[section.sectionNumber] || Boolean(filterQuery);
                const sectionTopics = ALL_TOPICS.filter(t => t.sectionNumber === section.sectionNumber && filterTopic(t));
                if (filterQuery && sectionTopics.length === 0) return null;

                return (
                  <div key={section.sectionNumber} className="rounded-lg">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.sectionNumber)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <span className="truncate pr-2 font-sans font-medium">
                        {section.sectionNumber}. {section.title}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pl-3 mt-1 space-y-0.5 border-l border-zinc-200 dark:border-zinc-800 ml-3">
                        {sectionTopics.map(topic => {
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
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                                isActive
                                  ? 'bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold shadow-xs border-l-2 border-sky-500'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                                )}
                                <span className="truncate">{topic.title}</span>
                              </div>
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 shrink-0 ml-1">
                                EE
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
          </div>

        </div>
      </aside>
    </>
  );
};
