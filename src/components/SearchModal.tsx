import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import MiniSearch from 'minisearch';
import { Search, X, BookOpen, ArrowRight, Filter, Sparkles, Compass } from 'lucide-react';
import { ALL_TOPICS, MAIN_SECTIONS, SECTIONS, resolveTopic } from '../data/topics';
import type { PartType, TopicDetail } from '../types';

export type SearchResultTopic = TopicDetail & {
  isBestMatch?: boolean;
  matchScore?: number;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
  initialPart?: PartType;
}

interface PartFilterOption {
  id: PartType | 'all';
  label: string;
  shortLabel: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  initialPart
}) => {
  const [query, setQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState<PartType | 'all'>(initialPart || 'all');
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // List of part filters
  const partFilters = useMemo<PartFilterOption[]>(() => [
    { id: 'all', label: 'All Topics', shortLabel: 'All' },
    ...MAIN_SECTIONS.map(m => ({
      id: m.part,
      label: m.label,
      shortLabel: m.shortLabel
    }))
  ], []);

  // Available sections within selected part
  const availableSections = useMemo(() => {
    if (selectedPart === 'all') return [];
    return SECTIONS.filter(s => s.part === selectedPart);
  }, [selectedPart]);

  // Initialize offline search engine
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: ['id', 'title', 'commandName', 'object', 'action', 'synonyms', 'searchableTerms', 'sectionTitle', 'shortDescription', 'keywords', 'tokens', 'cheatSheetText'],
      storeFields: ['id', 'title', 'slug', 'part', 'sectionNumber', 'sectionTitle', 'shortDescription', 'versionBadge', 'difficulty'],
      tokenize: (text) => {
        const expanded = text.replace(/([a-z])([A-Z])/g, '$1 $2');
        return expanded.split(/[\s,;:!?"'()[\]{}<>/\\+=*&|~^`]+/);
      },
      processTerm: (term, fieldName) => {
        const lower = term.toLowerCase().replace(/^[^\w@]+|[^\w]+$/g, '');
        if (!lower) return null;
        if (fieldName !== undefined) {
          const parts = lower.split(/[@.]/).filter(p => p.length > 0);
          return Array.from(new Set([lower, ...parts]));
        }
        return lower;
      },
      searchOptions: {
        boost: { title: 10, commandName: 10, synonyms: 8, object: 6, action: 5, searchableTerms: 4, id: 3, sectionTitle: 2, shortDescription: 1.5, keywords: 1, tokens: 1, cheatSheetText: 0.8 },
        prefix: true,
        fuzzy: (term) => term.length > 4 ? 0.2 : false
      }
    });

    const documents = ALL_TOPICS.map(t => {
      const cheatSheetText = t.cheatSheetText 
        || (t.cheatSheet ? `${t.cheatSheet.headers.join(' ')} ${t.cheatSheet.rows.flat().join(' ')}` : '');
      const terms = Array.isArray(t.searchableTerms) ? t.searchableTerms.join(' ') : '';
      const syns = Array.isArray(t.synonyms) ? t.synonyms.join(' ') : (t.synonyms || '');
      return {
        id: t.id,
        title: t.title,
        slug: t.slug,
        part: t.part,
        sectionNumber: t.sectionNumber,
        sectionTitle: t.sectionTitle,
        shortDescription: t.shortDescription,
        versionBadge: t.versionBadge,
        difficulty: t.difficulty,
        commandName: t.commandName || '',
        object: t.object || '',
        action: t.action || '',
        synonyms: syns,
        keywords: `${t.part} ${t.sectionTitle} ${t.whatAndWhy?.definition || ''}`,
        tokens: t.syntaxBreakdown?.tokens?.map(tok => tok.token).join(' ') || '',
        searchableTerms: terms,
        cheatSheetText: cheatSheetText
      };
    });

    ms.addAll(documents);
    return ms;
  }, []);

  // Helper to execute high-precision search with AND-first strategy and phrase boosting
  const executeSearch = useCallback((rawQuery: string): SearchResultTopic[] => {
    const trimmed = rawQuery.trim();
    if (!trimmed) return [];

    const exactTopic = resolveTopic(trimmed);
    const terms = trimmed.split(/\s+/).filter(Boolean);

    let rawResults: { id: string; score: number }[] = [];
    if (terms.length > 1) {
      // Multi-word query: prioritize topics matching ALL search words (AND)
      rawResults = miniSearch.search(trimmed, { combineWith: 'AND' }) as unknown as { id: string; score: number }[];
      // Fallback to OR if no topic contains all words
      if (rawResults.length === 0) {
        rawResults = miniSearch.search(trimmed, { combineWith: 'OR' }) as unknown as { id: string; score: number }[];
      }
    } else {
      rawResults = miniSearch.search(trimmed) as unknown as { id: string; score: number }[];
    }

    // Exact phrase and title boost
    const lowerQuery = trimmed.toLowerCase();
    const scoredList = rawResults.map(r => {
      const topic = ALL_TOPICS.find(t => t.id === r.id);
      let boost = 0;
      let titleMatch = false;
      if (topic) {
        const lowerTitle = topic.title.toLowerCase();
        if (lowerTitle === lowerQuery) {
          boost += 300;
          titleMatch = true;
        } else if (lowerTitle.includes(lowerQuery)) {
          boost += 150;
          titleMatch = true;
        } else if (terms.length > 1 && terms.every(term => lowerTitle.includes(term.toLowerCase()))) {
          boost += 90;
          titleMatch = true;
        }
      }
      return { id: r.id, score: r.score + boost, titleMatch };
    });

    scoredList.sort((a, b) => b.score - a.score);

    // Score threshold cutoff: eliminate distant low-relevance noise
    let filteredList = scoredList;
    if (filteredList.length > 0) {
      const topScore = filteredList[0].score;
      const cutoff = Math.max(topScore * 0.18, 12);
      filteredList = filteredList.filter(r => r.score >= cutoff);
    }

    const topScore = filteredList[0]?.score || 0;
    const hasAnyStrongConfidence = filteredList.some(r => r.titleMatch || r.score >= 120);

    let mapped: SearchResultTopic[] = filteredList.map((r, index) => {
      const topic = ALL_TOPICS.find(t => t.id === r.id)!;
      // Best Match Criteria:
      // Only qualify if there is a strong match (exact topic, titleMatch, or high score)
      const isBest = hasAnyStrongConfidence && (
        r.titleMatch || (index < 3 && r.score >= topScore * 0.7 && r.score >= 50)
      );
      return {
        ...topic,
        matchScore: r.score,
        isBestMatch: isBest
      };
    }).filter(t => Boolean(t && t.id));

    if (exactTopic && !mapped.some(t => t.id === exactTopic.id)) {
      mapped = [
        { ...exactTopic, matchScore: topScore + 500, isBestMatch: true },
        ...mapped
      ];
    }

    return mapped;
  }, [miniSearch]);

  // Compute live match counts for each filter pill based on the current search query
  const partCounts = useMemo<Record<string, number>>(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      const counts: Record<string, number> = { all: ALL_TOPICS.length };
      ALL_TOPICS.forEach(t => {
        counts[t.part] = (counts[t.part] || 0) + 1;
      });
      return counts;
    }

    const matchedTopics = executeSearch(trimmed);
    const counts: Record<string, number> = { all: matchedTopics.length };
    matchedTopics.forEach(t => {
      counts[t.part] = (counts[t.part] || 0) + 1;
    });
    return counts;
  }, [query, executeSearch]);

  // Filtered search results
  const searchResults = useMemo<SearchResultTopic[]>(() => {
    const trimmed = query.trim();

    let list: SearchResultTopic[] = [];
    if (!trimmed) {
      if (selectedPart === 'all') {
        list = ALL_TOPICS.slice(0, 8).map(t => ({ ...t, isBestMatch: false }));
      } else {
        let partTopics = ALL_TOPICS.filter(t => t.part === selectedPart);
        if (selectedSectionNumber !== null) {
          partTopics = partTopics.filter(t => t.sectionNumber === selectedSectionNumber);
        }
        list = partTopics.map(t => ({ ...t, isBestMatch: false }));
      }
      return list;
    }

    let mapped = executeSearch(trimmed);

    // Apply Part and Section scopes
    if (selectedPart !== 'all') {
      mapped = mapped.filter(t => t.part === selectedPart);
    }
    if (selectedSectionNumber !== null) {
      mapped = mapped.filter(t => t.sectionNumber === selectedSectionNumber);
    }

    return mapped.slice(0, 15);
  }, [query, executeSearch, selectedPart, selectedSectionNumber]);

  // Handle Part selection
  const handleSelectPart = useCallback((partId: PartType | 'all') => {
    setSelectedPart(partId);
    setSelectedSectionNumber(null);
    setSelectedIndex(0);
    // Keep focus in search input
    inputRef.current?.focus();
  }, []);

  // Handle section selection
  const handleSelectSection = useCallback((secNum: number | null) => {
    setSelectedSectionNumber(secNum);
    setSelectedIndex(0);
    inputRef.current?.focus();
  }, []);

  // Modal open reset
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedPart(initialPart || 'all');
      setSelectedSectionNumber(null);
      setSelectedIndex(0);
      itemRefs.current = [];
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialPart]);

  // Reset selected index when search results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  // Auto-scroll results list to keep selected item in view
  useEffect(() => {
    const activeElement = itemRefs.current[selectedIndex];
    if (activeElement) {
      activeElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'auto'
      });
    }
  }, [selectedIndex]);

  // Global keyboard navigation while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Escape closes modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Arrow navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, searchResults.length - 1)));
        return;
      }

      // Enter to select
      if (e.key === 'Enter') {
        if (searchResults[selectedIndex]) {
          e.preventDefault();
          onSelectTopic(searchResults[selectedIndex].id);
          onClose();
        }
        return;
      }

      // Page down / Page up
      if (e.key === 'PageDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(searchResults.length - 1, prev + 5));
        return;
      }

      if (e.key === 'PageUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 5));
        return;
      }

      // Home / End
      if (e.key === 'Home' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSelectedIndex(0);
        return;
      }

      if (e.key === 'End' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSelectedIndex(Math.max(0, searchResults.length - 1));
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, searchResults, selectedIndex, onClose, onSelectTopic]);

  if (!isOpen) return null;

  const currentPartLabel = selectedPart === 'all'
    ? 'All Topics'
    : partFilters.find(p => p.id === selectedPart)?.label || selectedPart;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-16 px-3 sm:px-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden text-left flex flex-col transition-all max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 sm:py-3.5 border-b border-zinc-200 dark:border-zinc-800 gap-2 sm:gap-3 bg-white dark:bg-[#18181b] shrink-0">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            id="search-modal-title"
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search topics, syntax, JVM, policies, ESQL, Spring..."
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
              title="Clear search query"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scope / Topic Filter Bar */}
        <div className="px-3 sm:px-4 py-2 border-b border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/50 shrink-0 flex flex-col gap-2">
          {/* Main Part Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Scope:
            </span>
            {partFilters.map(pf => {
              const isActive = selectedPart === pf.id;
              const count = partCounts[pf.id] ?? 0;
              return (
                <button
                  key={pf.id}
                  type="button"
                  onMouseDown={e => e.preventDefault()} // Keeps focus inside input
                  onClick={() => handleSelectPart(pf.id)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300/70 dark:hover:bg-zinc-700'
                  }`}
                >
                  <span>{pf.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-blue-700/80 text-blue-100'
                        : 'bg-white/60 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-section Filter (Active when a specific Part is selected) */}
          {selectedPart !== 'all' && availableSections.length > 0 && (
            <div className="flex items-center gap-2 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0">Section filter:</span>
              <select
                value={selectedSectionNumber ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  handleSelectSection(val ? parseInt(val, 10) : null);
                }}
                className="text-xs bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[280px] sm:max-w-md truncate"
              >
                <option value="">All sections in this topic ({availableSections.length} sections)</option>
                {availableSections.map(sec => (
                  <option key={sec.sectionNumber} value={sec.sectionNumber}>
                    {sec.sectionNumber}. {sec.title}
                  </option>
                ))}
              </select>

              {selectedSectionNumber !== null && (
                <button
                  type="button"
                  onClick={() => handleSelectSection(null)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Show all sections
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results List */}
        <div
          ref={resultsContainerRef}
          className="overflow-y-auto p-2 space-y-1 divide-y divide-transparent flex-1 focus:outline-none"
        >
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-400" />
              <p className="font-medium">No handbook topics matching "{query}"</p>
              {selectedPart !== 'all' ? (
                <div className="mt-3 flex flex-col items-center gap-2">
                  <p className="text-xs text-zinc-400">
                    No results found in <span className="font-semibold text-zinc-300">{currentPartLabel}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectPart('all')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium cursor-pointer transition-colors"
                  >
                    Search across all topics ({partCounts.all} available)
                  </button>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 mt-1">
                  Try searching for "policy", "node", "threads", "servlet", "esql", or "lifecycle"
                </p>
              )}
            </div>
          ) : (
            searchResults.map((topic, index) => {
              const isSelected = index === selectedIndex;
              const isSearching = query.trim().length > 0;
              const hasBestMatches = searchResults.some(t => t.isBestMatch);
              const showBestHeader = isSearching && hasBestMatches && topic.isBestMatch && index === 0;
              const showRelatedHeader = isSearching && hasBestMatches && !topic.isBestMatch && (index === 0 || searchResults[index - 1]?.isBestMatch);
              const showClosestOnlyHeader = isSearching && !hasBestMatches && index === 0;

              return (
                <React.Fragment key={topic.id}>
                  {showClosestOnlyHeader && (
                    <div className="flex items-center justify-between px-2.5 pt-1.5 pb-1 text-xs text-amber-600 dark:text-amber-400 font-semibold select-none">
                      <div className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-amber-500" />
                        <span>Closest Matches / نتائج متقاربة</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-mono">
                          {searchResults.length} {searchResults.length === 1 ? 'topic' : 'topics'}
                        </span>
                      </div>
                      <span className="text-[10px] font-normal text-zinc-400 hidden sm:inline">
                        Showing closest topics matching your keywords
                      </span>
                    </div>
                  )}

                  {showBestHeader && (
                    <div className="flex items-center justify-between px-2.5 pt-1.5 pb-1 text-xs text-blue-600 dark:text-blue-400 font-semibold select-none">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span>Best Matches</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono">
                          Direct Hits
                        </span>
                      </div>
                      <span className="text-[10px] font-normal text-zinc-400 hidden sm:inline">
                        Most relevant to what you typed
                      </span>
                    </div>
                  )}

                  {showRelatedHeader && (
                    <div className="pt-3 pb-1.5 px-2.5 select-none">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <Compass className="w-3.5 h-3.5 text-amber-500" />
                          <span>You Might Also Mean / Related Topics</span>
                        </div>
                        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                      </div>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Related topics that might also cover what you need
                      </p>
                    </div>
                  )}

                  <div
                    ref={el => { itemRefs.current[index] = el; }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => {
                      onSelectTopic(topic.id);
                      onClose();
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-500/40 shadow-xs ring-1 ring-blue-500/20'
                        : isSearching && topic.isBestMatch
                        ? 'bg-blue-50/20 dark:bg-blue-950/15 border border-blue-200/50 dark:border-blue-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border border-transparent'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {topic.versionBadge}
                        </span>
                        <h4 className={`text-sm font-semibold truncate ${
                          isSelected ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-zinc-900 dark:text-zinc-100'
                        }`}>
                          {topic.title}
                        </h4>
                        {isSearching && topic.isBestMatch && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                            <Sparkles className="w-2.5 h-2.5" />
                            Best Match
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400">
                          {topic.difficulty}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 font-sans">
                        {topic.shortDescription}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500 flex-wrap">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleSelectPart(topic.part);
                          }}
                          className="hover:text-blue-500 dark:hover:text-blue-400 hover:underline cursor-pointer"
                          title="Filter by this part"
                        >
                          {topic.part.replace(/^Part \d+:\s*/, '')}
                        </button>
                        <span>•</span>
                        <span>{topic.sectionTitle.replace(/^Part [A-Z]\s*—\s*/, '')}</span>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 mt-2 shrink-0 transition-all ${
                        isSelected
                          ? 'text-blue-500 translate-x-1 opacity-100'
                          : 'text-zinc-400 opacity-40'
                      }`}
                    />
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Footer shortcuts & filter info */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-50 dark:bg-[#151518] border-t border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono text-[9px] sm:text-[10px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono text-[9px] sm:text-[10px]">Enter</kbd> Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono text-[9px] sm:text-[10px]">Esc</kbd> Close
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedPart !== 'all' && (
              <button
                type="button"
                onClick={() => handleSelectPart('all')}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
              >
                Reset filter
              </button>
            )}
            <span className="text-zinc-400">
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
