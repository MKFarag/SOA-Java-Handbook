import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  ClipboardList,
  Search,
  X,
  Link2,
  FileText,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { TASK_LOG_ITEMS, TASK_TOPICS } from '../data/tasks';
import { CodeBlock } from './CodeBlock';
import type { TaskLogEntry, TaskStep } from '../types';

interface TaskLogViewProps {
  onSelectTopic: (topicId: string) => void;
}

const COMMAND_LANGUAGES = new Set(['bash', 'sh', 'shell', 'command', 'cmd', 'cli', 'powershell']);
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getTaskSlug(task: TaskLogEntry): string {
  return task.id.split('/').pop() || task.id;
}

function findTaskBySlugParam(param: string | null): TaskLogEntry | null {
  if (!param) return null;
  const clean = param.trim().toLowerCase();
  if (!clean) return null;
  return (
    TASK_LOG_ITEMS.find(t => {
      const slug = getTaskSlug(t).toLowerCase();
      const noPrefix = slug.replace(/^\d+-/, '');
      return slug === clean || t.id.toLowerCase() === clean || noPrefix === clean;
    }) || null
  );
}

function getVisibleFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    el => el.offsetParent !== null || el === document.activeElement
  );
}

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
  if (step.method && step.method.toLowerCase().includes(q)) return true;
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

interface StepGroup {
  method?: string;
  items: Array<{ step: TaskStep; stepIndex: number }>;
}

/**
 * Group consecutive steps by optional Method label while keeping each step's flat array index.
 */
function groupStepsByMethod(steps: TaskStep[]): StepGroup[] {
  const groups: StepGroup[] = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.method === step.method) {
      lastGroup.items.push({ step, stepIndex: i });
    } else {
      groups.push({ method: step.method, items: [{ step, stepIndex: i }] });
    }
  }
  return groups;
}

export const TaskLogView: React.FC<TaskLogViewProps> = ({ onSelectTopic }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return findTaskBySlugParam(params.get('task'))?.id ?? null;
  });
  const [activeLinkKey, setActiveLinkKey] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const lastPointerTypeRef = useRef<string>('mouse');
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lightboxCloseBtnRef = useRef<HTMLButtonElement>(null);
  const cardButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const lastLightboxTriggerRef = useRef<HTMLElement | null>(null);
  const prevSelectedTaskIdRef = useRef<string | null>(null);
  const prevLightboxOpenRef = useRef<boolean>(false);

  const selectedTask = useMemo(
    () => (selectedTaskId ? TASK_LOG_ITEMS.find(t => t.id === selectedTaskId) ?? null : null),
    [selectedTaskId]
  );

  const openTaskDrawer = useCallback((task: TaskLogEntry, triggerEl?: HTMLElement | null) => {
    lastTriggerRef.current =
      triggerEl ??
      cardButtonRefs.current[task.id] ??
      (document.activeElement as HTMLElement | null);
    setActiveLinkKey(null);
    setLightboxImage(null);
    setSelectedTaskId(task.id);

    const slug = getTaskSlug(task);
    const nextUrl = `/tasks?task=${encodeURIComponent(slug)}`;
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.pushState({ taskSlug: slug }, '', nextUrl);
    }
  }, []);

  const closeTaskDrawer = useCallback(() => {
    setLightboxImage(null);
    setActiveLinkKey(null);
    setSelectedTaskId(null);

    const url = new URL(window.location.href);
    if (url.searchParams.has('task')) {
      url.searchParams.delete('task');
      const nextSearch = url.searchParams.toString();
      const nextUrl = `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}`;
      window.history.replaceState(null, '', nextUrl);
    }
  }, []);

  // Sync drawer open/close with browser Back/Forward navigation
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const matched = findTaskBySlugParam(params.get('task'));
      setLightboxImage(null);
      setActiveLinkKey(null);
      setSelectedTaskId(matched ? matched.id : null);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Lock background page scroll while drawer is open
  useEffect(() => {
    if (!selectedTask) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [selectedTask]);

  // Manage drawer focus on open and restore focus to clicked card on close
  useEffect(() => {
    const prevId = prevSelectedTaskIdRef.current;
    const nextId = selectedTask?.id ?? null;

    if (nextId && nextId !== prevId) {
      if (drawerCloseBtnRef.current) {
        drawerCloseBtnRef.current.focus({ preventScroll: true });
      } else {
        drawerRef.current?.focus({ preventScroll: true });
      }
    } else if (!nextId && prevId) {
      const fallbackCard = cardButtonRefs.current[prevId];
      const returnTarget =
        lastTriggerRef.current && document.contains(lastTriggerRef.current)
          ? lastTriggerRef.current
          : fallbackCard;
      lastTriggerRef.current = null;
      returnTarget?.focus({ preventScroll: true });
    }

    prevSelectedTaskIdRef.current = nextId;
  }, [selectedTask]);

  // Manage lightbox focus on open and restore focus inside drawer on close
  useEffect(() => {
    const isOpen = Boolean(lightboxImage);
    if (isOpen && !prevLightboxOpenRef.current) {
      lightboxCloseBtnRef.current?.focus({ preventScroll: true });
    } else if (!isOpen && prevLightboxOpenRef.current) {
      const trigger = lastLightboxTriggerRef.current;
      lastLightboxTriggerRef.current = null;
      if (trigger && document.contains(trigger)) {
        trigger.focus({ preventScroll: true });
      } else {
        drawerCloseBtnRef.current?.focus({ preventScroll: true });
      }
    }
    prevLightboxOpenRef.current = isOpen;
  }, [lightboxImage]);

  // Keyboard handling: Esc priority (lightbox -> drawer) and focus trap
  useEffect(() => {
    if (!selectedTask && !lightboxImage && !activeLinkKey) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const hasExternalModal = Array.from(
        document.querySelectorAll('[role="dialog"][aria-modal="true"]')
      ).some(el => el !== drawerRef.current && el !== lightboxRef.current);
      if (hasExternalModal) return;

      if (e.key === 'Escape') {
        if (lightboxImage) {
          e.preventDefault();
          setLightboxImage(null);
          return;
        }
        if (selectedTask) {
          e.preventDefault();
          closeTaskDrawer();
          return;
        }
        if (activeLinkKey) {
          setActiveLinkKey(null);
        }
        return;
      }

      if (e.key === 'Tab') {
        const activeContainer = lightboxImage ? lightboxRef.current : selectedTask ? drawerRef.current : null;
        if (!activeContainer) return;

        const focusables = getVisibleFocusableElements(activeContainer);
        if (focusables.length === 0) {
          e.preventDefault();
          activeContainer.focus();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!current || current === first || !activeContainer.contains(current)) {
            e.preventDefault();
            last.focus();
          }
        } else if (!current || current === last || !activeContainer.contains(current)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedTask, lightboxImage, activeLinkKey, closeTaskDrawer]);

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

  const renderStepItem = (task: TaskLogEntry, step: TaskStep, stepIndex: number) => {
    const displayNumber = step.number ?? stepIndex + 1;
    const activeStepLink = step.links.find(
      link => `${task.id}:${stepIndex}:${link.topicId}` === activeLinkKey
    );

    return (
      <li
        key={stepIndex}
        className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed min-w-0"
      >
        <span className="mt-0.5 w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
          {displayNumber}
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
                        onClick={e => {
                          lastLightboxTriggerRef.current = e.currentTarget;
                          setLightboxImage({ src: block.src, alt: block.alt });
                        }}
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

      {/* Compact Task Cards List */}
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
        <div className="space-y-2.5">
          {filteredTasks.map(task => {
            const isOpen = selectedTask?.id === task.id;
            const slug = getTaskSlug(task);
            return (
              <article
                key={task.id}
                className="tasklog-card rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs transition-colors"
              >
                <button
                  ref={el => {
                    cardButtonRefs.current[task.id] = el;
                  }}
                  type="button"
                  onClick={e => openTaskDrawer(task, e.currentTarget)}
                  aria-haspopup="dialog"
                  aria-expanded={isOpen}
                  data-task-slug={slug}
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-left hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tasklog-accent)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
                    <span className="tasklog-badge self-start sm:self-auto px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0">
                      {task.topic}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                      {task.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.reference && (
                      <span
                        title="Includes reference"
                        aria-label="Includes reference"
                        className="inline-flex items-center justify-center p-1 rounded-md tasklog-accent-text opacity-85"
                      >
                        <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[11px] font-medium whitespace-nowrap">
                      {task.steps.length} {task.steps.length === 1 ? 'step' : 'steps'}
                    </span>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Task Details Side Drawer (Desktop right panel / Mobile bottom sheet) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            aria-hidden="true"
            onClick={closeTaskDrawer}
            className="tasklog-drawer-backdrop fixed inset-0 bg-black/50 backdrop-blur-[1px]"
          />

          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={selectedTask.title}
            tabIndex={-1}
            className="tasklog-drawer-panel fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto bg-white dark:bg-[#1e1e1e] border-zinc-200 dark:border-zinc-800 md:border-y-0 md:border-r-0 shadow-2xl flex flex-col text-left focus:outline-none"
          >
            {/* Drawer Header */}
            <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-[#18181b]/90 flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="tasklog-badge inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap">
                  {selectedTask.topic}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                  {selectedTask.title}
                </h2>
              </div>

              <button
                ref={drawerCloseBtnRef}
                type="button"
                onClick={closeTaskDrawer}
                aria-label="Close task drawer"
                title="Close (Esc)"
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tasklog-accent)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-4">
              {selectedTask.reference && (
                <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80 flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0 tasklog-accent-text opacity-80" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-zinc-600 dark:text-zinc-300 mr-1.5">
                      Reference:
                    </span>
                    {renderReference(selectedTask.reference)}
                  </div>
                </div>
              )}

              {(() => {
                const stepGroups = groupStepsByMethod(selectedTask.steps);
                let methodCounter = 0;

                return (
                  <div className="space-y-3.5 pb-4">
                    {stepGroups.map((group, groupIdx) => {
                      if (group.method) {
                        methodCounter += 1;
                        return (
                          <section
                            key={`method-${groupIdx}`}
                            aria-label={`Method ${methodCounter}: ${group.method}`}
                            className="rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-3 sm:p-3.5 space-y-3"
                          >
                            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
                              <span className="tasklog-badge px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0">
                                Method {methodCounter}
                              </span>
                              <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                                {group.method}
                              </h3>
                            </div>
                            <ol className="space-y-3">
                              {group.items.map(({ step, stepIndex }) =>
                                renderStepItem(selectedTask, step, stepIndex)
                              )}
                            </ol>
                          </section>
                        );
                      }

                      return (
                        <ol key={`steps-${groupIdx}`} className="space-y-3">
                          {group.items.map(({ step, stepIndex }) =>
                            renderStepItem(selectedTask, step, stepIndex)
                          )}
                        </ol>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Simple Image Lightbox (opens ABOVE drawer; Esc closes lightbox first) */}
      {lightboxImage && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt || 'Step image preview'}
          tabIndex={-1}
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 gap-3 cursor-zoom-out"
        >
          <button
            ref={lightboxCloseBtnRef}
            type="button"
            onClick={e => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
            className="self-end p-2 rounded-full bg-zinc-900/80 text-zinc-200 hover:text-white border border-zinc-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close image preview"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            onClick={e => e.stopPropagation()}
            className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain bg-zinc-900 cursor-default"
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
