import React, { useState, useEffect, useMemo, useRef } from 'react';
import MiniSearch from 'minisearch';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { ALL_TOPICS } from '../data/topics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize offline search engine
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: ['title', 'shortDescription', 'sectionTitle', 'keywords', 'tokens'],
      storeFields: ['id', 'title', 'slug', 'part', 'sectionTitle', 'shortDescription', 'versionBadge', 'difficulty'],
      searchOptions: {
        boost: { title: 3, sectionTitle: 1.5, keywords: 2 },
        prefix: true,
        fuzzy: 0.2
      }
    });

    const documents = ALL_TOPICS.map(t => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      part: t.part,
      sectionTitle: t.sectionTitle,
      shortDescription: t.shortDescription,
      versionBadge: t.versionBadge,
      difficulty: t.difficulty,
      keywords: `${t.part} ${t.sectionTitle} ${t.whatAndWhy?.definition || ''}`,
      tokens: t.syntaxBreakdown?.tokens?.map(tok => tok.token).join(' ') || ''
    }));

    ms.addAll(documents);
    return ms;
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return ALL_TOPICS.slice(0, 6);
    }
    const results = miniSearch.search(query.trim());
    return results.map(r => ALL_TOPICS.find(t => t.id === r.id)!).filter(Boolean);
  }, [query, miniSearch]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      e.preventDefault();
      onSelectTopic(searchResults[selectedIndex].id);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white dark:bg-[#1e1e1e] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-orange-500 mr-3 shrink-0" />
          <input
            id="search-modal-title"
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search topics, keywords, syntax, JVM concepts, Servlets..."
            className="w-full bg-transparent text-sm md:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-orange-400" />
              <p>No handbook topics matching "{query}"</p>
              <p className="text-xs text-zinc-400 mt-1">Try searching for "javac", "main", "lifecycle", "servlet", or "threads"</p>
            </div>
          ) : (
            searchResults.map((topic, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.id);
                    onClose();
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border border-transparent'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {topic.versionBadge}
                      </span>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {topic.title}
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 font-sans">
                      {topic.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <span>{topic.part}</span>
                      <span>•</span>
                      <span>{topic.sectionTitle}</span>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 mt-1 shrink-0 ${isSelected ? 'text-orange-500' : 'text-zinc-400 opacity-40'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-[#18181b] border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono">Enter</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono">Esc</kbd> Close</span>
          </div>
          <span className="text-orange-600 dark:text-orange-400 font-medium">100% Offline Search Engine</span>
        </div>
      </div>
    </div>
  );
};
