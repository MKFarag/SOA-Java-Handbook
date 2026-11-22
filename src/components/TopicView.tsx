import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Bookmark, 
  CheckCircle2, 
  ExternalLink, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Award, 
  Lightbulb, 
  AlertOctagon, 
  Info, 
  Layers, 
  BookMarked,
  ChevronsUpDown
} from 'lucide-react';
import { marked } from 'marked';
import Prism from '../lib/prism';
import type { TopicDetail } from '../types';
import { ALL_TOPICS, resolveTopic } from '../data/topics';
import { CodeBlock } from './CodeBlock';
import { ExerciseCard } from './ExerciseCard';

interface TopicViewProps {
  topic: TopicDetail;
  onSelectTopic: (topicId: string) => void;
  isSaved: boolean;
  onToggleSaved: (topicId: string) => void;
  isCompleted: boolean;
  onToggleCompleted: (topicId: string) => void;
}

export const TopicView: React.FC<TopicViewProps> = ({
  topic,
  onSelectTopic,
  isSaved,
  onToggleSaved,
  isCompleted,
  onToggleCompleted
}) => {
  const currentIndex = ALL_TOPICS.findIndex(t => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? ALL_TOPICS[currentIndex - 1] : null;
  const nextTopic = currentIndex < ALL_TOPICS.length - 1 ? ALL_TOPICS[currentIndex + 1] : null;

  const contentRef = useRef<HTMLDivElement>(null);
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const toggleExpandAll = () => {
    const next = !isAllExpanded;
    setIsAllExpanded(next);
    if (contentRef.current) {
      contentRef.current.querySelectorAll('details').forEach(d => {
        (d as HTMLDetailsElement).open = next;
      });
    }
  };

  // Render markdown content safely
  const renderedHtml = useMemo(() => {
    if (!topic.markdownContent) return '';
    try {
      // Clean up internal links (file:///, drive letters, relative ../ or ./) to #topic-id (supporting 2 and 3 digit topics)
      let text = topic.markdownContent.replace(
        /(?:[^\s()]*?[\\/])?([0-9]{2,3})-[a-z0-9-]+\.md/gi,
        (_match, num) => `#topic-${num}`
      );

      // Clean up any remaining file:///c: links
      text = text.replace(/file:\/\/\/[^\s)]+/gi, '#');

      return marked.parse(text, { gfm: true, breaks: false }) as string;
    } catch (e) {
      console.warn('Failed to parse topic markdown:', e);
      return '';
    }
  }, [topic.markdownContent]);

  // Enhance rendered markdown: Dual-Tabs for Code/Output, Solutions, and Prism syntax highlighting
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // 1. Process Code + Output pairs into Dual-Tab blocks
    const outputDetails = container.querySelectorAll('details[data-type="output"]');
    outputDetails.forEach((detailsEl) => {
      if (detailsEl.closest('.code-tab-container')) return;

      // Locate the preceding <pre> element
      let prev = detailsEl.previousElementSibling;
      while (prev && prev.tagName !== 'PRE' && !prev.querySelector('pre')) {
        prev = prev.previousElementSibling;
      }
      const preEl = (prev?.tagName === 'PRE' ? prev : prev?.querySelector('pre')) as HTMLElement | null;
      if (!preEl) return;

      const outputPre = detailsEl.querySelector('pre');
      const outputText = (outputPre ? outputPre.textContent : detailsEl.textContent) || '';
      const codeText = preEl.textContent || '';

      // Create tab container
      const tabContainer = document.createElement('div');
      tabContainer.className = 'code-tab-container my-4 sm:my-6 rounded-xl overflow-hidden border border-zinc-200/80 dark:border-[#2e2e32] bg-[#1e1e1e] shadow-lg text-left';

      // Header bar
      const header = document.createElement('div');
      header.className = 'code-tab-header flex items-center justify-between px-2.5 sm:px-4 py-2 bg-[#252526] border-b border-[#2e2e32] select-none gap-2';

      // Tabs group
      const tabsGroup = document.createElement('div');
      tabsGroup.className = 'flex items-center bg-[#18181b] p-0.5 rounded-lg border border-[#3f3f46]';

      const codeBtn = document.createElement('button');
      codeBtn.type = 'button';
      codeBtn.className = 'tab-btn active flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer bg-zinc-700 text-white';
      codeBtn.innerHTML = '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> <span>Code</span>';

      const outputBtn = document.createElement('button');
      outputBtn.type = 'button';
      outputBtn.className = 'tab-btn flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer text-zinc-400 hover:text-zinc-200';
      outputBtn.innerHTML = '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg> <span>Output</span>';

      tabsGroup.appendChild(codeBtn);
      tabsGroup.appendChild(outputBtn);
      header.appendChild(tabsGroup);

      // Actions group (Wrap + Copy)
      const actionsGroup = document.createElement('div');
      actionsGroup.className = 'flex items-center gap-1.5 shrink-0';

      const wrapBtn = document.createElement('button');
      wrapBtn.type = 'button';
      wrapBtn.className = 'wrap-btn flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs font-medium rounded-md border text-zinc-400 hover:text-zinc-200 bg-[#2d2d30] hover:bg-[#3e3e42] border-[#3f3f46] transition-all cursor-pointer';
      wrapBtn.innerHTML = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><path d="M3 12h15a3 3 0 1 1 0 6h-4"></path><polyline points="16 16 14 18 16 20"></polyline><line x1="3" y1="18" x2="10" y2="18"></line></svg> <span class="hidden sm:inline">Wrap</span>';

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-btn flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md text-zinc-300 hover:text-white bg-[#2d2d30] hover:bg-[#3e3e42] border border-[#3f3f46] transition-all cursor-pointer';
      copyBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span class="hidden sm:inline">Copy</span>';

      actionsGroup.appendChild(wrapBtn);
      actionsGroup.appendChild(copyBtn);
      header.appendChild(actionsGroup);

      // Panes
      const codePane = document.createElement('div');
      codePane.className = 'tab-pane-code p-3 sm:p-4 text-xs sm:text-sm font-mono overflow-x-auto';
      preEl.style.margin = '0';
      preEl.style.border = 'none';
      preEl.style.backgroundColor = 'transparent';
      preEl.style.padding = '0';
      preEl.parentNode?.removeChild(preEl);
      codePane.appendChild(preEl);

      const outputPane = document.createElement('div');
      outputPane.className = 'tab-pane-output hidden p-3 sm:p-4 text-xs sm:text-sm font-mono bg-[#141416] text-emerald-400 overflow-x-auto';
      outputPane.innerHTML = `<div class="flex items-center gap-2 pb-2 mb-2 border-b border-zinc-800 text-xs text-zinc-400">
        <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
        <span>Expected Terminal Output:</span>
      </div>
      <pre class="text-zinc-200 m-0 font-mono text-[11px] sm:text-xs leading-5 whitespace-pre">${outputText.trim()}</pre>`;

      tabContainer.appendChild(header);
      tabContainer.appendChild(codePane);
      tabContainer.appendChild(outputPane);

      let activeTab = 'code';
      let isWrapped = false;

      codeBtn.onclick = () => {
        activeTab = 'code';
        codeBtn.className = 'tab-btn active flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer bg-zinc-700 text-white';
        outputBtn.className = 'tab-btn flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer text-zinc-400 hover:text-zinc-200';
        codePane.classList.remove('hidden');
        outputPane.classList.add('hidden');
      };

      outputBtn.onclick = () => {
        activeTab = 'output';
        outputBtn.className = 'tab-btn active flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer bg-zinc-700 text-white';
        codeBtn.className = 'tab-btn flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer text-zinc-400 hover:text-zinc-200';
        outputPane.classList.remove('hidden');
        codePane.classList.add('hidden');
      };

      wrapBtn.onclick = () => {
        isWrapped = !isWrapped;
        if (isWrapped) {
          wrapBtn.classList.add('bg-zinc-600', 'text-white');
          wrapBtn.classList.remove('text-zinc-400', 'bg-[#2d2d30]');
          codePane.classList.add('whitespace-pre-wrap', 'break-words');
          outputPane.querySelector('pre')?.classList.add('whitespace-pre-wrap', 'break-words');
        } else {
          wrapBtn.classList.remove('bg-zinc-600', 'text-white');
          wrapBtn.classList.add('text-zinc-400', 'bg-[#2d2d30]');
          codePane.classList.remove('whitespace-pre-wrap', 'break-words');
          outputPane.querySelector('pre')?.classList.remove('whitespace-pre-wrap', 'break-words');
        }
      };

      copyBtn.onclick = () => {
        const textToCopy = activeTab === 'code' ? codeText : outputText;
        navigator.clipboard.writeText(textToCopy);
        copyBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> <span class="text-emerald-400 font-semibold hidden sm:inline">Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span class="hidden sm:inline">Copy</span>';
        }, 2000);
      };

      detailsEl.replaceWith(tabContainer);
    });

    // 2. Enhance Solution cards with interactive Reveal / Hide toggle
    const solutionDetails = container.querySelectorAll('details[data-type="solution"]');
    solutionDetails.forEach((detailsEl) => {
      const summary = detailsEl.querySelector('summary');
      if (!summary || summary.querySelector('.solution-btn')) return;

      const updateSummary = () => {
        const isOpen = (detailsEl as HTMLDetailsElement).open;
        summary.innerHTML = `
          <span class="solution-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700 cursor-pointer">
            ${isOpen 
              ? '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> Hide Solution' 
              : '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Reveal Solution & Explanation'}
          </span>
        `;
      };

      updateSummary();
      detailsEl.addEventListener('toggle', updateSummary);
    });

    // 3. Highlight code syntax with Prism
    container.querySelectorAll('pre code').forEach((block) => {
      Prism.highlightElement(block);
    });
  }, [renderedHtml, topic.id]);

  // Auto-open collapsed details if targeted by anchor or search deep link
  useEffect(() => {
    if (!contentRef.current) return;
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      try {
        const target = contentRef.current.querySelector(hash);
        if (target) {
          const parentDetails = target.closest('details');
          if (parentDetails) parentDetails.open = true;
        }
      } catch (_) {}
    }
  }, [topic.id, renderedHtml]);

  // Intercept hash navigation clicks in rendered markdown
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (href && href.startsWith('#')) {
      const topicIdentifier = href.slice(1);
      const targetTopic = resolveTopic(topicIdentifier);
      if (targetTopic) {
        e.preventDefault();
        onSelectTopic(targetTopic.id);
      }
      // If not a recognized topic, allow native in-page anchor jump
    } else if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      target.setAttribute('target', '_blank');
      target.setAttribute('rel', 'noopener noreferrer');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-3 sm:pt-8 pb-8 px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 text-left">
      
      {/* 1. Header & Breadcrumbs */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-normal">
          <span className="truncate max-w-[120px] sm:max-w-none">{topic.part}</span>
          <span>/</span>
          <span className="truncate max-w-[140px] sm:max-w-none">{topic.sectionTitle}</span>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200 font-medium truncate max-w-[160px] sm:max-w-none">{topic.title}</span>
        </div>

        {/* Action Controls & Chips Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-mono font-bold bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
              {topic.versionBadge}
            </span>
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {topic.difficulty}
            </span>
            {topic.relevanceLevel && (
              <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold border ${
                topic.relevanceLevel === 'MUST-KNOW / CORE'
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : topic.relevanceLevel === 'ADVANCED / DEEP-DIVE'
                  ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30'
                  : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
              }`}>
                {topic.relevanceLevel === 'MUST-KNOW / CORE' && '🎯 '}
                {topic.relevanceLevel === 'ADVANCED / DEEP-DIVE' && '🚀 '}
                {topic.relevanceLevel === 'OPTIONAL / LEGACY' && '🏛️ '}
                {topic.relevanceLevel}
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              {topic.readingTime}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleExpandAll}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1e1e1e] text-zinc-600 dark:text-zinc-300 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer"
              title="Expand or collapse all secondary blocks, solutions, and outputs"
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              <span>{isAllExpanded ? 'Collapse All' : 'Expand All'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleSaved(topic.id)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/15 border-amber-500 text-amber-500'
                  : 'bg-white dark:bg-[#1e1e1e] border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-amber-500'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleCompleted(topic.id)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500'
                  : 'bg-white dark:bg-[#1e1e1e] border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-emerald-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'fill-emerald-500' : ''}`} />
              <span>{isCompleted ? 'Completed' : 'Complete'}</span>
            </button>
          </div>
        </div>

        {/* H1 Title & Summary */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans break-words">
          {topic.title}
        </h1>
        <p className="text-sm sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
          {topic.shortDescription}
        </p>
      </div>

      {/* 2. Prerequisites Box (if defined) */}
      {topic.prerequisites && topic.prerequisites.length > 0 && (
        <section className="space-y-2">
          <div className="p-3.5 sm:p-4 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-sky-900 dark:text-sky-200">
              <span className="font-bold uppercase tracking-wider block mb-1">Prerequisites:</span>
              <ul className="list-disc list-inside space-y-0.5 text-sky-800 dark:text-sky-300 font-sans">
                {topic.prerequisites.map((p, idx) => {
                  const resolved = resolveTopic(p);
                  return (
                    <li key={idx}>
                      {resolved ? (
                        <button
                          type="button"
                          onClick={() => onSelectTopic(resolved.id)}
                          className="text-sky-700 dark:text-sky-300 underline hover:text-sky-900 dark:hover:text-white font-medium text-left cursor-pointer inline"
                        >
                          {p}
                        </button>
                      ) : (
                        p
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 3. Primary Content: Markdown or Structured Fallback */}
      {topic.markdownContent ? (
        <div 
          ref={contentRef}
          onClick={handleContentClick}
          className="markdown-body space-y-6 text-zinc-800 dark:text-zinc-200"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      ) : (
        <div className="space-y-8">
          {/* Structured: What and Why */}
          {topic.whatAndWhy && (
            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <BookMarked className="w-5 h-5 text-orange-500 shrink-0" />
                <span>1. What It Is and Why It Exists</span>
              </h2>
              <div className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
                <p>{topic.whatAndWhy.definition}</p>
              </div>

              {topic.whatAndWhy.analogy && (
                <div className="p-3.5 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Intuitive Analogy:
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed font-sans">
                      {topic.whatAndWhy.analogy}
                    </p>
                  </div>
                </div>
              )}

              {topic.whatAndWhy.whyItExists && (
                <div className="text-xs sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Why Does This Feature Exist?
                  </h4>
                  <p>{topic.whatAndWhy.whyItExists}</p>
                </div>
              )}
            </section>
          )}

          {/* Structured: Syntax Breakdown */}
          {topic.syntaxBreakdown && (
            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <Layers className="w-5 h-5 text-orange-500 shrink-0" />
                <span>2. Syntax Breakdown</span>
              </h2>
              {topic.syntaxBreakdown.explanation && (
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {topic.syntaxBreakdown.explanation}
                </p>
              )}
              {topic.syntaxBreakdown.codeSnippet && (
                <CodeBlock code={topic.syntaxBreakdown.codeSnippet} />
              )}
              {topic.syntaxBreakdown.tokens && topic.syntaxBreakdown.tokens.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-1">
                  {topic.syntaxBreakdown.tokens.map((tok, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-[#1e1e1e] border border-zinc-200 dark:border-zinc-800 shadow-xs"
                    >
                      <div className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 pb-1">
                        <code>{tok.token}</code>
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                        {tok.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Structured: Examples */}
          {topic.examples && topic.examples.length > 0 && (
            <section className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <Award className="w-5 h-5 text-orange-500 shrink-0" />
                <span>3. Runnable Code Examples</span>
              </h2>

              {topic.examples.map((ex, idx) => (
                <div key={ex.id || idx} className="space-y-3 p-3.5 sm:p-5 rounded-xl bg-zinc-50 dark:bg-[#141416] border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      Example {idx + 1}: {ex.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider shrink-0 bg-blue-500/15 text-blue-500">
                      {ex.type}
                    </span>
                  </div>
                  {ex.description && (
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                      {ex.description}
                    </p>
                  )}
                  <CodeBlock 
                    code={ex.code} 
                    output={ex.output} 
                    filename={ex.filename} 
                  />
                  {ex.stepByStep && ex.stepByStep.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                        Execution Order:
                      </h4>
                      <ol className="space-y-1 pl-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans list-decimal">
                        {ex.stepByStep.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Structured: Common Mistakes */}
          {topic.commonMistakes && topic.commonMistakes.length > 0 && (
            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0" />
                <span>4. Common Mistakes &amp; Errors</span>
              </h2>
              <div className="space-y-3">
                {topic.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="p-3.5 sm:p-5 rounded-xl bg-white dark:bg-[#1e1e1e] border border-rose-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm sm:text-base">
                      <AlertOctagon className="w-4 h-4 shrink-0" />
                      <span>{mistake.title}</span>
                    </div>
                    {mistake.wrongCode && mistake.fixedCode && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div className="p-2 rounded bg-rose-500/5 border border-rose-500/20">
                          <span className="text-rose-500 font-bold block mb-1">❌ AVOID:</span>
                          <pre className="text-rose-700 dark:text-rose-300 whitespace-pre-wrap">{mistake.wrongCode}</pre>
                        </div>
                        <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/20">
                          <span className="text-emerald-500 font-bold block mb-1">✅ CORRECT:</span>
                          <pre className="text-emerald-700 dark:text-emerald-300 whitespace-pre-wrap">{mistake.fixedCode}</pre>
                        </div>
                      </div>
                    )}
                    <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 space-y-0.5 pt-1">
                      <p><strong>Cause:</strong> {mistake.cause}</p>
                      <p><strong>Fix:</strong> {mistake.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Structured: Cheat Sheet */}
          {topic.cheatSheet && (
            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <Layers className="w-5 h-5 text-orange-500 shrink-0" />
                <span>{topic.cheatSheet.title || 'Summary Cheat Sheet'}</span>
              </h2>
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-xs sm:text-sm font-sans min-w-[460px]">
                  <thead className="bg-zinc-100 dark:bg-[#252526] text-zinc-700 dark:text-zinc-300 uppercase font-mono text-[11px]">
                    <tr>
                      {topic.cheatSheet.headers.map((h, idx) => (
                        <th key={idx} className="p-2.5 sm:p-3 border-b border-zinc-200 dark:border-zinc-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#1e1e1e]">
                    {topic.cheatSheet.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 sm:p-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}

      {/* 4. Interactive Exercises (if defined) */}
      {topic.exercises && topic.exercises.length > 0 && (
        <section className="space-y-3 sm:space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500 shrink-0" />
            <span>Practice Exercises</span>
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {topic.exercises.map((exercise, idx) => (
              <ExerciseCard key={exercise.id || idx} exercise={exercise} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Official Documentation Sources (if defined) */}
      {topic.officialSources && topic.officialSources.length > 0 && (
        <section className="space-y-3 sm:space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Verified Sources</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topic.officialSources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 sm:p-3 rounded-lg bg-zinc-50 dark:bg-[#1e1e1e] border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 hover:text-orange-500 transition-colors"
              >
                <div className="truncate pr-2">
                  <span className="font-semibold block truncate">{source.title}</span>
                  <span className="text-[11px] text-zinc-400 font-mono">{source.organization}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Prev / Next Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-zinc-200 dark:border-zinc-800">
        {prevTopic ? (
          <button
            type="button"
            onClick={() => onSelectTopic(prevTopic.id)}
            className="p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] hover:border-orange-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-orange-500 mb-1">
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Previous Topic</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {prevTopic.title}
            </div>
          </button>
        ) : <div />}

        {nextTopic ? (
          <button
            type="button"
            onClick={() => onSelectTopic(nextTopic.id)}
            className="p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] hover:border-orange-500/50 text-right transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-400 group-hover:text-orange-500 mb-1">
              <span>Next Topic</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {nextTopic.title}
            </div>
          </button>
        ) : <div />}
      </div>

    </div>
  );
};
