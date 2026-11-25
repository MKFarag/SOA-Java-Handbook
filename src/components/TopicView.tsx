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
  ChevronsUpDown,
  Home
} from 'lucide-react';
import { marked } from 'marked';
import Prism from '../lib/prism';
import type { TopicDetail } from '../types';
import { ALL_TOPICS, resolveTopic } from '../data/topics';
import { CodeBlock } from './CodeBlock';
import { ExerciseCard } from './ExerciseCard';
import { highlightCodeLines } from '../lib/codeHighlight';

interface TopicViewProps {
  topic: TopicDetail;
  onSelectTopic: (topicId: string) => void;
  onGoHome?: () => void;
  isSaved: boolean;
  onToggleSaved: (topicId: string) => void;
  isCompleted: boolean;
  onToggleCompleted: (topicId: string) => void;
}

export const TopicView: React.FC<TopicViewProps> = ({
  topic,
  onSelectTopic,
  onGoHome,
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
      // Clean up internal links (file:///, drive letters, relative ../ or ./) to #topic-id
      let text = topic.markdownContent.replace(
        /(?:[^\s()]*?[\\/])?([0-9]{2,3})-[a-z0-9-]+\.md/gi,
        (_match, num) => `#topic-${num}`
      );

      // Clean up any remaining file:/// links
      text = text.replace(/file:\/\/\/[^\s)]+/gi, '#');

      return marked.parse(text, { gfm: true, breaks: false }) as string;
    } catch (e) {
      console.warn('Failed to parse topic markdown:', e);
      return '';
    }
  }, [topic.markdownContent]);

  // Enhance rendered markdown: Dual-Tabs for Code/Output, Line Numbers, Proper Line Wrapping, and Solutions
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Helper to build line-numbered DOM elements
    const renderCodeLinesIntoPane = (codeText: string, lang: string, targetPane: HTMLElement) => {
      const lines = highlightCodeLines(codeText, lang);
      const padDigits = lines.length >= 100 ? 3 : 2;

      const linesWrapper = document.createElement('div');
      linesWrapper.className = 'code-lines-wrapper min-w-full font-mono';

      lines.forEach((l) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'code-line flex items-start hover:bg-white/[0.03] transition-colors';

        const lineNum = document.createElement('span');
        lineNum.className = 'line-num select-none text-zinc-500/70 font-mono text-[11px] sm:text-xs text-right pr-3.5 sm:pr-4 shrink-0 tabular-nums leading-relaxed';
        lineNum.style.width = `${padDigits * 0.75 + 1.25}rem`;
        lineNum.setAttribute('aria-hidden', 'true');
        lineNum.textContent = String(l.lineNumber).padStart(padDigits, '0');

        const lineContent = document.createElement('span');
        lineContent.className = 'line-content flex-1 text-[#d4d4d4] font-mono leading-relaxed whitespace-pre';
        lineContent.innerHTML = l.html;

        lineDiv.appendChild(lineNum);
        lineDiv.appendChild(lineContent);
        linesWrapper.appendChild(lineDiv);
      });

      targetPane.innerHTML = '';
      targetPane.appendChild(linesWrapper);
    };

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

      const codeEl = preEl.querySelector('code');
      const langClass = Array.from(codeEl?.classList || []).find(c => c.startsWith('language-'));
      const langName = langClass ? langClass.replace('language-', '') : 'java';

      // Create tab container
      const tabContainer = document.createElement('div');
      tabContainer.className = 'code-tab-container code-scrollable my-4 sm:my-6 rounded-xl overflow-hidden border border-zinc-200/80 dark:border-[#2e2e34] bg-[#1e1e1e] shadow-lg text-left';

      // Example Title & Language derivation
      const classMatch = codeText.match(/(?:public\s+)?(?:class|interface|record|enum)\s+([A-Za-z0-9_]+)/);
      const exampleTitle = classMatch ? `Example: ${classMatch[1]}` : (topic.title ? `Example: ${topic.title}` : 'Code Example');
      const displayLang = langName.toLowerCase() === 'java' ? 'Java' : langName.toUpperCase();

      // Header Top Bar: Title & Language Badge
      const topBar = document.createElement('div');
      topBar.className = 'code-tab-topbar flex items-center justify-between px-3.5 sm:px-4 py-2 bg-[#252528] border-b border-[#2e2e34] select-none gap-2';
      topBar.innerHTML = `
        <div class="flex items-center gap-2 min-w-0">
          <svg class="w-4 h-4 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          <span class="font-semibold text-xs sm:text-sm text-zinc-100 font-mono truncate">${exampleTitle}</span>
        </div>
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">${displayLang}</span>
      `;

      // Tabs & Actions Toolbar
      const toolbar = document.createElement('div');
      toolbar.className = 'code-tab-toolbar flex items-center justify-between px-3 sm:px-4 py-1.5 bg-[#1e1e22] border-b border-[#2a2a30] select-none gap-2';

      // Tabs group
      const tabsGroup = document.createElement('div');
      tabsGroup.className = 'flex items-center gap-1';

      const codeBtn = document.createElement('button');
      codeBtn.type = 'button';
      codeBtn.className = 'tab-btn active flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer bg-[#24344d] text-blue-400 border border-blue-500/30 shadow-xs';
      codeBtn.innerHTML = '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> <span>Code</span>';

      const outputBtn = document.createElement('button');
      outputBtn.type = 'button';
      outputBtn.className = 'tab-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-zinc-400 hover:text-zinc-200 border border-transparent';
      outputBtn.innerHTML = '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg> <span>Output</span>';

      tabsGroup.appendChild(codeBtn);
      tabsGroup.appendChild(outputBtn);
      toolbar.appendChild(tabsGroup);

      // Actions group (Wrap + Copy)
      const actionsGroup = document.createElement('div');
      actionsGroup.className = 'flex items-center gap-1.5 shrink-0';

      const wrapBtn = document.createElement('button');
      wrapBtn.type = 'button';
      wrapBtn.className = 'wrap-btn flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border text-zinc-400 hover:text-zinc-200 bg-[#2d2d30] hover:bg-[#3e3e42] border-[#3f3f46] transition-all cursor-pointer';
      wrapBtn.innerHTML = '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><path d="M3 12h15a3 3 0 1 1 0 6h-4"></path><polyline points="16 16 14 18 16 20"></polyline><line x1="3" y1="18" x2="10" y2="18"></line></svg> <span class="hidden sm:inline">Wrap</span>';

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-btn flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg text-zinc-300 hover:text-white bg-[#2d2d30] hover:bg-[#3e3e42] border border-[#3f3f46] transition-all cursor-pointer';
      copyBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span class="hidden sm:inline">Copy</span>';

      actionsGroup.appendChild(wrapBtn);
      actionsGroup.appendChild(copyBtn);
      toolbar.appendChild(actionsGroup);

      // Panes
      const codePane = document.createElement('div');
      codePane.className = 'tab-pane-code p-3 sm:p-4 text-xs sm:text-sm font-mono overflow-x-auto';
      renderCodeLinesIntoPane(codeText, langName, codePane);

      const outputPane = document.createElement('div');
      outputPane.className = 'tab-pane-output hidden p-3 sm:p-4 text-xs sm:text-sm font-mono bg-[#141416] text-emerald-400';
      outputPane.innerHTML = `<div class="flex items-center gap-2 pb-2 mb-2 border-b border-zinc-800 text-xs text-zinc-400">
        <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
        <span>Expected Terminal Output:</span>
      </div>
      <pre class="text-zinc-200 m-0 font-mono text-[11px] sm:text-xs leading-5 whitespace-pre overflow-x-auto">${outputText.trim()}</pre>`;

      tabContainer.appendChild(topBar);
      tabContainer.appendChild(toolbar);
      tabContainer.appendChild(codePane);
      tabContainer.appendChild(outputPane);

      let activeTab = 'code';
      let isWrapped = false;

      codeBtn.onclick = () => {
        activeTab = 'code';
        codeBtn.className = 'tab-btn active flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer bg-[#24344d] text-blue-400 border border-blue-500/30 shadow-xs';
        outputBtn.className = 'tab-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-zinc-400 hover:text-zinc-200 border border-transparent';
        codePane.classList.remove('hidden');
        outputPane.classList.add('hidden');
      };

      outputBtn.onclick = () => {
        activeTab = 'output';
        outputBtn.className = 'tab-btn active flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer bg-[#24344d] text-blue-400 border border-blue-500/30 shadow-xs';
        codeBtn.className = 'tab-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-zinc-400 hover:text-zinc-200 border border-transparent';
        outputPane.classList.remove('hidden');
        codePane.classList.add('hidden');
      };

      wrapBtn.onclick = () => {
        isWrapped = !isWrapped;
        tabContainer.classList.toggle('code-wrapped', isWrapped);
        tabContainer.classList.toggle('code-scrollable', !isWrapped);

        const outPre = outputPane.querySelector('pre');
        const codeLinesWrapper = codePane.querySelector('.code-lines-wrapper');

        if (isWrapped) {
          wrapBtn.className = 'wrap-btn flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md border transition-all cursor-pointer bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-xs';
          const span = wrapBtn.querySelector('span');
          if (span) span.textContent = 'Wrapped';

          codePane.classList.remove('overflow-x-auto');
          codePane.classList.add('overflow-x-hidden');
          if (codeLinesWrapper) {
            codeLinesWrapper.classList.remove('min-w-fit', 'w-max');
            codeLinesWrapper.classList.add('w-full', 'max-w-full', 'min-w-0');
          }
          codePane.querySelectorAll('.line-content').forEach((el) => {
            el.classList.remove('whitespace-pre');
            el.classList.add('whitespace-pre-wrap', 'break-words', 'overflow-hidden');
          });

          if (outPre) {
            outPre.classList.remove('whitespace-pre', 'overflow-x-auto');
            outPre.classList.add('whitespace-pre-wrap', 'break-words', 'overflow-x-hidden');
          }
        } else {
          wrapBtn.className = 'wrap-btn flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md border transition-all cursor-pointer text-zinc-400 hover:text-zinc-200 bg-[#2d2d30] hover:bg-[#3e3e42] border-[#3f3f46]';
          const span = wrapBtn.querySelector('span');
          if (span) span.textContent = 'Wrap';

          codePane.classList.add('overflow-x-auto');
          codePane.classList.remove('overflow-x-hidden');
          if (codeLinesWrapper) {
            codeLinesWrapper.classList.remove('w-full', 'max-w-full', 'min-w-0');
            codeLinesWrapper.classList.add('min-w-full', 'w-max');
          }
          codePane.querySelectorAll('.line-content').forEach((el) => {
            el.classList.add('whitespace-pre');
            el.classList.remove('whitespace-pre-wrap', 'break-words', 'overflow-hidden');
          });

          if (outPre) {
            outPre.classList.add('whitespace-pre', 'overflow-x-auto');
            outPre.classList.remove('whitespace-pre-wrap', 'break-words', 'overflow-x-hidden');
          }
        }
      };

      copyBtn.onclick = () => {
        const textToCopy = activeTab === 'code' ? codeText.trim() : outputText.trim();
        navigator.clipboard.writeText(textToCopy);
        copyBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> <span class="text-emerald-400 font-semibold hidden sm:inline">Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span class="hidden sm:inline">Copy</span>';
        }, 2000);
      };

      preEl.remove();
      detailsEl.replaceWith(tabContainer);
    });

    // 2. Enhance Standalone Code blocks with Language tag, Wrap toggle, Line numbers, and Copy button
    const standalonePres = container.querySelectorAll('pre');
    standalonePres.forEach((preEl) => {
      if (preEl.closest('.code-tab-container') || preEl.closest('.standalone-code-container')) return;
      if (preEl.closest('td') || preEl.closest('th') || preEl.closest('summary')) return;

      const codeEl = preEl.querySelector('code');
      const codeText = (codeEl ? codeEl.textContent : preEl.textContent) || '';
      if (!codeText.trim()) return;

      const langClass = Array.from(codeEl?.classList || []).find(c => c.startsWith('language-'));
      const langName = langClass ? langClass.replace('language-', '') : 'java';

      const codeContainer = document.createElement('div');
      codeContainer.className = 'standalone-code-container code-scrollable my-4 sm:my-6 rounded-xl overflow-hidden border border-zinc-200/80 dark:border-[#2e2e34] bg-[#1e1e1e] shadow-lg text-left';

      const classMatch = codeText.match(/(?:public\s+)?(?:class|interface|record|enum)\s+([A-Za-z0-9_]+)/);
      const exampleTitle = classMatch ? `Example: ${classMatch[1]}` : (topic.title ? `Example: ${topic.title}` : 'Code Example');
      const displayLang = langName.toLowerCase() === 'java' ? 'Java' : langName.toUpperCase();

      const header = document.createElement('div');
      header.className = 'code-tab-header flex items-center justify-between px-3.5 sm:px-4 py-2 bg-[#252528] border-b border-[#2e2e34] select-none gap-2';

      const titleGroup = document.createElement('div');
      titleGroup.className = 'flex items-center gap-2 min-w-0';
      titleGroup.innerHTML = `
        <svg class="w-4 h-4 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        <span class="font-semibold text-xs sm:text-sm text-zinc-100 font-mono truncate">${exampleTitle}</span>
      `;
      header.appendChild(titleGroup);

      const actionsGroup = document.createElement('div');
      actionsGroup.className = 'flex items-center gap-2 shrink-0';

      const langBadge = document.createElement('span');
      langBadge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0';
      langBadge.textContent = displayLang;
      actionsGroup.appendChild(langBadge);

      const wrapBtn = document.createElement('button');
      wrapBtn.type = 'button';
      wrapBtn.className = 'wrap-btn flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md border text-zinc-400 hover:text-zinc-200 bg-[#2d2d30] hover:bg-[#3e3e42] border-[#3f3f46] transition-all cursor-pointer';
      wrapBtn.innerHTML = '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><path d="M3 12h15a3 3 0 1 1 0 6h-4"></path><polyline points="16 16 14 18 16 20"></polyline><line x1="3" y1="18" x2="10" y2="18"></line></svg> <span class="hidden sm:inline">Wrap</span>';

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-btn flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md text-zinc-300 hover:text-white bg-[#2d2d30] hover:bg-[#3e3e42] border border-[#3f3f46] transition-all cursor-pointer';
      copyBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span class="hidden sm:inline">Copy</span>';

      actionsGroup.appendChild(wrapBtn);
      actionsGroup.appendChild(copyBtn);
      header.appendChild(actionsGroup);

      const codePane = document.createElement('div');
      codePane.className = 'p-3 sm:p-4 text-xs sm:text-sm font-mono overflow-x-auto';
      renderCodeLinesIntoPane(codeText, langName, codePane);

      let isWrapped = false;
      wrapBtn.onclick = () => {
        isWrapped = !isWrapped;
        codeContainer.classList.toggle('code-wrapped', isWrapped);
        codeContainer.classList.toggle('code-scrollable', !isWrapped);

        const codeLinesWrapper = codePane.querySelector('.code-lines-wrapper');

        if (isWrapped) {
          wrapBtn.className = 'wrap-btn flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md border transition-all cursor-pointer bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-xs';
          const span = wrapBtn.querySelector('span');
          if (span) span.textContent = 'Wrapped';

          codePane.classList.remove('overflow-x-auto');
          codePane.classList.add('overflow-x-hidden');
          if (codeLinesWrapper) {
            codeLinesWrapper.classList.remove('min-w-fit', 'w-max');
            codeLinesWrapper.classList.add('w-full', 'max-w-full', 'min-w-0');
          }
          codePane.querySelectorAll('.line-content').forEach((el) => {
            el.classList.remove('whitespace-pre');
            el.classList.add('whitespace-pre-wrap', 'break-words', 'overflow-hidden');
          });
        } else {
          wrapBtn.className = 'wrap-btn flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md border transition-all cursor-pointer text-zinc-400 hover:text-zinc-200 bg-[#2d2d30] hover:bg-[#3e3e42] border-[#3f3f46]';
          const span = wrapBtn.querySelector('span');
          if (span) span.textContent = 'Wrap';

          codePane.classList.add('overflow-x-auto');
          codePane.classList.remove('overflow-x-hidden');
          if (codeLinesWrapper) {
            codeLinesWrapper.classList.remove('w-full', 'max-w-full', 'min-w-0');
            codeLinesWrapper.classList.add('min-w-full', 'w-max');
          }
          codePane.querySelectorAll('.line-content').forEach((el) => {
            el.classList.add('whitespace-pre');
            el.classList.remove('whitespace-pre-wrap', 'break-words', 'overflow-hidden');
          });
        }
      };

      copyBtn.onclick = () => {
        navigator.clipboard.writeText(codeText.trim());
        copyBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> <span class="text-emerald-400 font-semibold hidden sm:inline">Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = '<svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span class="hidden sm:inline">Copy</span>';
        }, 2000);
      };

      preEl.replaceWith(codeContainer);
      codeContainer.appendChild(header);
      codeContainer.appendChild(codePane);
    });

    // 3. Enhance Solution cards with interactive Reveal / Hide toggle
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

    // 4. Ensure tables are wrapped in a horizontally scrollable container
    container.querySelectorAll('table').forEach((table) => {
      if (table.parentElement?.classList.contains('table-scroll-wrapper')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll-wrapper w-full overflow-x-auto my-4 rounded-lg border border-zinc-200 dark:border-zinc-800';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // 5. Transform blockquotes with [!NOTE], [!TIP], etc. into GitHub-style callouts
    container.querySelectorAll('blockquote').forEach((bq) => {
      const p = bq.querySelector('p');
      if (!p) return;
      const text = p.textContent || '';
      const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (match) {
        const type = match[1].toUpperCase();
        bq.classList.add('callout', `callout-${type.toLowerCase()}`);
        p.innerHTML = p.innerHTML.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br\s*\/?>)?/i, '');
      }
    });

    // 6. Highlight any remaining code syntax with Prism
    container.querySelectorAll('pre code').forEach((block) => {
      if (!block.closest('.code-tab-container') && !block.closest('.standalone-code-container')) {
        Prism.highlightElement(block);
      }
    });
  }, [renderedHtml, topic.id]);

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
    } else if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      target.setAttribute('target', '_blank');
      target.setAttribute('rel', 'noopener noreferrer');
    }
  };

  return (
    <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto pt-4 sm:pt-6 pb-12 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 text-left">
      
      {/* 1. Header & Breadcrumbs & Annotation Trigger */}
      <div className="space-y-3 sm:space-y-4">
        
        {/* Breadcrumb Row + Annotation Action */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
          <nav 
            aria-label="Breadcrumb Navigation"
            className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-sans min-w-0"
          >
            {onGoHome && (
              <button
                type="button"
                onClick={onGoHome}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 cursor-pointer"
                title="Handbook Home"
              >
                <Home className="w-3.5 h-3.5 text-sky-500" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
            <span>/</span>
            <span className="hover:text-zinc-700 dark:hover:text-zinc-300 truncate max-w-[140px] sm:max-w-none">
              {topic.part.split(':')[1]?.trim() || topic.part}
            </span>
            {topic.sectionTitle && (
              <>
                <span>/</span>
                <span className="hover:text-zinc-700 dark:hover:text-zinc-300 truncate max-w-[160px] sm:max-w-none">
                  {topic.sectionTitle.replace(/^Part [A-Z]\s*—\s*/, '')}
                </span>
              </>
            )}
            <span>/</span>
            <span className="text-zinc-900 dark:text-zinc-200 font-semibold truncate max-w-[160px] sm:max-w-none">
              {topic.title}
            </span>
          </nav>
        </div>

        {/* Action Controls & Chips Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-mono font-bold bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30">
              {topic.versionBadge}
            </span>
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {topic.difficulty}
            </span>
            <span className="flex items-center gap-1 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {topic.readingTime}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleExpandAll}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1e1e22] text-zinc-700 dark:text-zinc-300 hover:border-sky-500 hover:text-sky-500 transition-all cursor-pointer shadow-2xs"
              title="Expand or collapse all solutions and secondary panels"
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              <span>{isAllExpanded ? 'Collapse All' : 'Expand All'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleSaved(topic.id)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
                isSaved
                  ? 'bg-amber-500/15 border-amber-500 text-amber-500'
                  : 'bg-white dark:bg-[#1e1e22] border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-500'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleCompleted(topic.id)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
                isCompleted
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500'
                  : 'bg-white dark:bg-[#1e1e22] border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'fill-emerald-500' : ''}`} />
              <span>{isCompleted ? 'Completed' : 'Complete'}</span>
            </button>
          </div>
        </div>

        {/* H1 Title & Summary */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans [overflow-wrap:anywhere] pt-1">
          {topic.title}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
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
          {/* Structured Fallback: What and Why */}
          {topic.whatAndWhy && (
            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <BookMarked className="w-5 h-5 text-sky-500 shrink-0" />
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
                <Layers className="w-5 h-5 text-sky-500 shrink-0" />
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
                      className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-[#1e1e22] border border-zinc-200 dark:border-zinc-800 shadow-2xs"
                    >
                      <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 pb-1">
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
                <Award className="w-5 h-5 text-sky-500 shrink-0" />
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
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
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
                  <div key={idx} className="p-3.5 sm:p-5 rounded-xl bg-white dark:bg-[#1e1e22] border border-rose-500/20 space-y-2">
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
                <Layers className="w-5 h-5 text-sky-500 shrink-0" />
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
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-[#1e1e22]">
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
            <Award className="w-5 h-5 text-sky-500 shrink-0" />
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
            <ExternalLink className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Verified Sources</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topic.officialSources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 sm:p-3 rounded-lg bg-zinc-50 dark:bg-[#1e1e22] border border-zinc-200 dark:border-zinc-800 hover:border-sky-500/50 flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 hover:text-sky-500 transition-colors"
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

      {/* 6. Prev / Next Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-zinc-200 dark:border-zinc-800">
        {prevTopic ? (
          <button
            type="button"
            onClick={() => onSelectTopic(prevTopic.id)}
            className="p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e22] hover:border-sky-500/50 text-left transition-all group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-sky-500 mb-1">
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
            className="p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e22] hover:border-sky-500/50 text-right transition-all group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-400 group-hover:text-sky-500 mb-1">
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
