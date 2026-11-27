import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ClipboardList,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Link2,
  FileText,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { TASK_LOG_ITEMS, TASK_TOPICS } from '../data/tasks';
import { CodeBlock } from './CodeBlock';
import type { TaskStep } from '../types';

interface TaskLogViewProps {
  onSelectTopic: (topicId: string) => void;
}

const COMMAND_LANGUAGES = new Set(['bash', 'sh', 'shell', 'command', 'cmd', 'cli', 'powershell']);

/**
 * Render plain text with inline `code` spans safely into React elements.
 */
function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`\n]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={idx} className="font-mono text-[0.875em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

/**
 * Render optional reference as a clickable external link if it is/contains a URL,
 * or as clean plain text (e.g. PDF name + page number).
 */
function renderReference(reference: string): React.ReactNode {
  const trimmed = reference.trim();
  const fullUrlMatch = /^https?:\/\/\S+$/i.test(trimmed);
  if (fullUrlMatch) {
    return (
      <a
        href={trimmed}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 tasklog-accent-text hover:underline break-all"
      >
        <span>{trimmed}</span>
        <ExternalLink className="w-3 h-3 shrink-0" />
      </a>
    );
  }

  const inlineUrlMatch = trimmed.match(/(https?:\/\/\S+)/i);
  if (inlineUrlMatch && inlineUrlMatch.index !== undefined) {
    const url = inlineUrlMatch[1];
    const before = trimmed.slice(0, inlineUrlMatch.index);
    const after = trimmed.slice(inlineUrlMatch.index + url.length);
    return (
      <span className="break-words">
        {before}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 tasklog-accent-text hover:underline break-all"
        >
          <span>{url}</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
        {after}
      </span>
    );
  }

  return <span className="break-words">{trimmed}</span>;
}

function stepMatchesQuery(step: TaskStep, q: string): boolean {
  const lower = step.text.toLowerCase();
  if (lower.includes(q) || lower.replace(/`/g, '').includes(q)) return true;
  if (!step.blocks) return false;
  return step.blocks.some(block => {
    if (block.type === 'code') return block.code.toLowerCase().includes(q);
    if (block.type === 'note') {
      const noteLower = block.text.toLowerCase();
      return noteLower.includes(q) || noteLower.replace(/`/g, '').includes(q);
    }
    if (block.type === 'image') return block.alt.toLowerCase().includes(q);
    return false;
  });
}

export const TaskLogView: React.FC<TaskLogViewProps> = ({ onSelectTopic }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [activeLinkKey, setActiveLinkKey] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const lastPointerTypeRef = useRef<string>('mouse');

  const defaultCollapsed = TASK_LOG_ITEMS.length > 5;
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const item of TASK_LOG_ITEMS) {
      initial[item.id] = !defaultCollapsed;
    }
    return initial;
  });

  // Close lightbox or mobile link popover on Escape
  useEffect(() => {
    if (!lightboxImage && !activeLinkKey) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
        } else if (activeLinkKey) {
          setActiveLinkKey(null);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxImage, activeLinkKey]);

  // Dismiss mobile link popover on outside tap/click
  useEffect(() => {
    if (!activeLinkKey) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-tasklog-link-control="true"]')) return;
      setActiveLinkKey(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [activeLinkKey]);

  const topicFilters = useMemo(() => ['All', ...TASK_TOPICS], []);

  // Compute counts per topic matching current search query
  const topicCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const counts: Record<string, number> = { All: 0 };
    for (const label of TASK_TOPICS) {
      counts[label] = 0;
    }

    for (const task of TASK_LOG_ITEMS) {
      const matches =
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.steps.some(step => stepMatchesQuery(step, q));
      if (matches) {
        counts.All += 1;
        counts[task.topic] = (counts[task.topic] || 0) + 1;
      }
    }
    return counts;
  }, [searchQuery]);

  // Apply both local search and topic filter
  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TASK_LOG_ITEMS.filter(task => {
      if (selectedTopic !== 'All' && task.topic !== selectedTopic) {
        return false;
      }
      if (!q) return true;
      if (task.title.toLowerCase().includes(q)) return true;
      return task.steps.some(step => stepMatchesQuery(step, q));
    });
  }, [searchQuery, selectedTopic]);

  const isExpanded = (taskId: string) => {
    if (taskId in expandedMap) return expandedMap[taskId];
    return !defaultCollapsed;
  };

  const toggleCard = (taskId: string) => {
    setExpandedMap(prev => ({
      ...prev,
      [taskId]: !isExpanded(taskId)
    }));
  };

  const allVisibleExpanded =
    filteredTasks.length > 0 && filteredTasks.every(t => isExpanded(t.id));

  const handleToggleAllVisible = () => {
    const nextValue = !allVisibleExpanded;
    setExpandedMap(prev => {
      const next = { ...prev };
      for (const t of filteredTasks) {
        next[t.id] = nextValue;
      }
      return next;
    });
  };

  const handleLinkIconClick = (linkKey: string, topicId: string) => {
    const isTouchOrMobile =
      lastPointerTypeRef.current === 'touch' ||
      (typeof window !== 'undefined' &&
        (window.matchMedia('(hover: none)').matches || window.innerWidth < 768));

    if (isTouchOrMobile) {
      if (activeLinkKey === linkKey) {
        setActiveLinkKey(null);
        onSelectTopic(topicId);
      } else {
        setActiveLinkKey(linkKey);
      }
      return;
    }

    setActiveLinkKey(null);
    onSelectTopic(topicId);
  };

  return (
    <div className="max-w-4xl mx-auto py-5 sm:py-10 px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 text-left">
      {/* Minimal Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 tasklog-accent-text shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Task Log
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Personal step-by-step solutions for tricky course tasks, linked back to handbook topics.
          </p>
        </div>

        {filteredTasks.length > 1 && (
          <button
            type="button"
            onClick={handleToggleAllVisible}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            {allVisibleExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        )}
      </div>

      {/* Local Search + Topic Filter Chips */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 tasklog-accent-text absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or step..."
            aria-label="Search Task Log"
            className="tasklog-search w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-white dark:bg-[#1e1e22] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              aria-label="Clear task search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Horizontally scrollable Topic filter chips */}
        <div
          role="tablist"
          aria-label="Filter tasks by topic"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        >
          {topicFilters.map(topic => {
            const isActive = selectedTopic === topic;
            const count = topicCounts[topic] ?? 0;
            return (
              <button
                key={topic}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'tasklog-chip-active font-semibold shadow-2xs'
                    : 'bg-white dark:bg-[#1e1e22] border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <span>{topic}</span>
                <span className="text-[10px] font-mono opacity-75">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Cards List */}
      {TASK_LOG_ITEMS.length === 0 ? (
        <div className="py-14 px-4 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-2.5 bg-white/50 dark:bg-[#1a1a1e]/40">
          <ClipboardList className="w-9 h-9 mx-auto tasklog-accent-text opacity-80" />
          <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
            No logged tasks yet
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Add a Markdown task file under <code>content/tasks/&lt;topic-slug&gt;/</code> using <code>TASKLOG.md</code> to see its steps here.
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3 bg-white/50 dark:bg-[#1a1a1e]/40">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            No tasks match your current search or topic filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic('All');
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg tasklog-chip-active border cursor-pointer transition-opacity hover:opacity-90"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredTasks.map(task => {
            const expanded = isExpanded(task.id);
            return (
              <article
                key={task.id}
                className="tasklog-card rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs transition-colors"
              >
                {/* Collapsible Card Header: Topic Badge + Title + Chevron */}
                <button
                  type="button"
                  onClick={() => toggleCard(task.id)}
                  aria-expanded={expanded}
                  className={`w-full min-h-[44px] px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer ${
                    expanded ? 'rounded-t-xl' : 'rounded-xl'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
                    <span className="tasklog-badge self-start sm:self-auto px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0">
                      {task.topic}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                      {task.title}
                    </h2>
                  </div>

                  <span className="text-zinc-400 dark:text-zinc-500 shrink-0 p-1">
                    {expanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {/* Card Body: Numbered Steps + Optional Blocks + Optional Reference */}
                {expanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3.5">
                    <ol className="space-y-3">
                      {task.steps.map((step, stepIndex) => {
                        const activeStepLink = step.links.find(
                          link => `${task.id}:${stepIndex}:${link.topicId}` === activeLinkKey
                        );

                        return (
                          <li
                            key={stepIndex}
                            className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed min-w-0"
                          >
                            <span className="mt-0.5 w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                              {stepIndex + 1}
                            </span>

                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-start justify-between gap-2 min-w-0">
                                <span className="min-w-0 break-words flex-1">
                                  {renderInlineCode(step.text)}
                                </span>

                                {step.links.length > 0 && (
                                  <span className="inline-flex items-center gap-1 shrink-0 mt-0.5">
                                    {step.links.map(link => {
                                      const linkKey = `${task.id}:${stepIndex}:${link.topicId}`;
                                      const isPopoverOpen = activeLinkKey === linkKey;
                                      return (
                                        <span
                                          key={link.topicId}
                                          className="relative inline-flex items-center group/tasklink"
                                          data-tasklog-link-control="true"
                                        >
                                          <button
                                            type="button"
                                            onPointerDown={e => {
                                              lastPointerTypeRef.current = e.pointerType || 'mouse';
                                            }}
                                            onClick={() => handleLinkIconClick(linkKey, link.topicId)}
                                            title={link.title}
                                            aria-label={`Open topic: ${link.title}`}
                                            aria-expanded={isPopoverOpen}
                                            data-topic-id={link.topicId}
                                            className={`tasklog-link-btn p-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center ${
                                              isPopoverOpen ? 'ring-1 ring-current' : ''
                                            }`}
                                          >
                                            <Link2 className="w-3.5 h-3.5" />
                                          </button>

                                          {/* Desktop hover/focus tooltip */}
                                          <span
                                            role="tooltip"
                                            className="hidden md:block pointer-events-none opacity-0 group-hover/tasklink:opacity-100 group-focus-within/tasklink:opacity-100 transition-opacity duration-150 absolute right-0 top-full mt-1.5 z-30 w-max max-w-[240px] px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white text-[11px] font-medium leading-snug shadow-lg border border-zinc-700/80 whitespace-normal text-left"
                                          >
                                            {link.title}
                                          </span>
                                        </span>
                                      );
                                    })}
                                  </span>
                                )}
                              </div>

                              {/* Mobile / touch readable topic popover on tap */}
                              {activeStepLink && (
                                <div
                                  role="region"
                                  aria-label="Linked topic preview"
                                  data-tasklog-link-control="true"
                                  className="px-3 py-2 rounded-lg tasklog-badge flex items-center justify-between gap-2 text-xs shadow-xs"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveLinkKey(null);
                                      onSelectTopic(activeStepLink.topicId);
                                    }}
                                    className="flex-1 min-w-0 text-left font-semibold flex items-center gap-1.5 cursor-pointer hover:underline"
                                  >
                                    <span className="break-words leading-snug">
                                      {activeStepLink.title}
                                    </span>
                                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveLinkKey(null)}
                                    className="p-1 rounded-md opacity-75 hover:opacity-100 cursor-pointer shrink-0"
                                    aria-label="Dismiss topic preview"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                              {/* Optional rich blocks in exact markdown order */}
                              {step.blocks && step.blocks.length > 0 && (
                                <div className="space-y-2.5 min-w-0">
                                  {step.blocks.map((block, blockIndex) => {
                                    if (block.type === 'code') {
                                      const isCmd = COMMAND_LANGUAGES.has(block.language.toLowerCase());
                                      return (
                                        <div key={blockIndex} className="w-full max-w-full min-w-0">
                                          <CodeBlock
                                            code={block.code}
                                            language={block.language}
                                            title={isCmd ? 'Command' : 'Code Snippet'}
                                          />
                                        </div>
                                      );
                                    }

                                    if (block.type === 'image') {
                                      return (
                                        <figure key={blockIndex} className="space-y-1.5">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setLightboxImage({ src: block.src, alt: block.alt })
                                            }
                                            className="block max-w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-zoom-in text-left focus:outline-none focus-visible:ring-2"
                                            aria-label={
                                              block.alt
                                                ? `View image: ${block.alt}`
                                                : 'View step image'
                                            }
                                          >
                                            <img
                                              src={block.src}
                                              alt={block.alt}
                                              loading="lazy"
                                              className="block max-w-full h-auto max-h-80 object-contain rounded-lg bg-zinc-50 dark:bg-zinc-900"
                                            />
                                          </button>
                                          {block.alt && (
                                            <figcaption className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                                              {block.alt}
                                            </figcaption>
                                          )}
                                        </figure>
                                      );
                                    }

                                    return (
                                      <div
                                        key={blockIndex}
                                        className="tasklog-note rounded-r-lg px-3 py-2 text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 flex items-start gap-1.5 leading-relaxed"
                                      >
                                        <span className="font-semibold tasklog-accent-text shrink-0">
                                          Note:
                                        </span>
                                        <span className="min-w-0 break-words">
                                          {renderInlineCode(block.text)}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>

                    {task.reference && (
                      <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800/70 flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0 tasklog-accent-text opacity-80" />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-zinc-600 dark:text-zinc-300 mr-1.5">
                            Reference:
                          </span>
                          {renderReference(task.reference)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Simple Image Lightbox (closes on click or Esc) */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt || 'Step image preview'}
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 gap-3 cursor-zoom-out"
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="self-end p-2 rounded-full bg-zinc-900/80 text-zinc-200 hover:text-white border border-zinc-700 cursor-pointer"
            aria-label="Close image preview"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain bg-zinc-900"
          />

          {lightboxImage.alt && (
            <p className="text-xs sm:text-sm text-zinc-200 text-center max-w-2xl px-3">
              {lightboxImage.alt}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
