import React from 'react';
import { Bookmark, ArrowUp, ArrowDown, Trash2, BookOpen, ArrowRight } from 'lucide-react';
import { ALL_TOPICS } from '../data/topics';

interface SavedViewProps {
  savedTopicIds: string[];
  onSelectTopic: (topicId: string) => void;
  onRemoveSaved: (topicId: string) => void;
  onReorderSaved: (newOrder: string[]) => void;
  onClearAll: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedTopicIds,
  onSelectTopic,
  onRemoveSaved,
  onReorderSaved,
  onClearAll
}) => {
  const savedTopics = savedTopicIds
    .map(id => ALL_TOPICS.find(t => t.id === id)!)
    .filter(Boolean);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= savedTopicIds.length) return;
    const newOrder = [...savedTopicIds];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    onReorderSaved(newOrder);
  };

  return (
    <div className="max-w-4xl mx-auto py-5 sm:py-10 px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Saved Topics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Your personal offline revision list. Reorder topics as you prepare for interviews or architecture reviews.
          </p>
        </div>

        {savedTopics.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Content */}
      {savedTopics.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
          <BookOpen className="w-10 h-10 mx-auto text-zinc-400 dark:text-zinc-600" />
          <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
            No saved topics yet
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Click the "Bookmark" button at the top of any topic in the handbook to save it here for fast revision.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedTopics.map((topic, index) => (
            <div
              key={topic.id}
              className="p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs flex items-center justify-between gap-2.5 sm:gap-4 group hover:border-amber-500/40 transition-all"
            >
              {/* Left: Reorder buttons & Index */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-sm font-bold text-zinc-400 w-6 text-center">
                  {(index + 1).toString().padStart(2, '0')}
                </span>

                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === savedTopics.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Center: Topic Info */}
              <div
                className="flex-1 cursor-pointer space-y-1 min-w-0"
                onClick={() => onSelectTopic(topic.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10">
                    {topic.versionBadge}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors truncate">
                    {topic.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 font-sans">
                  {topic.shortDescription}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectTopic(topic.id)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                  title="Open topic"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveSaved(topic.id)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
