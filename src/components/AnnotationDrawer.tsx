import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2, Copy, Check, BookOpen, Sparkles } from 'lucide-react';
import type { TopicDetail } from '../types';

interface AnnotationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TopicDetail | null;
  onAnnotationChange?: (topicId: string, hasContent: boolean) => void;
}

export const AnnotationDrawer: React.FC<AnnotationDrawerProps> = ({
  isOpen,
  onClose,
  topic,
  onAnnotationChange
}) => {
  const [noteContent, setNoteContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);

  // Load existing note when topic changes or drawer opens
  useEffect(() => {
    if (!topic) return;
    try {
      const stored = localStorage.getItem(`java_handbook_topic_notes_${topic.id}`);
      setNoteContent(stored || '');
      if (stored) {
        setSavedTime('Loaded from device');
      } else {
        setSavedTime(null);
      }
    } catch {
      setNoteContent('');
    }
  }, [topic, isOpen]);

  // Handle note change with autosave
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteContent(val);
    if (!topic) return;

    try {
      if (val.trim()) {
        localStorage.setItem(`java_handbook_topic_notes_${topic.id}`, val);
        setSavedTime('Auto-saved just now');
        if (onAnnotationChange) onAnnotationChange(topic.id, true);
      } else {
        localStorage.removeItem(`java_handbook_topic_notes_${topic.id}`);
        setSavedTime(null);
        if (onAnnotationChange) onAnnotationChange(topic.id, false);
      }
    } catch (err) {
      console.warn('Could not save annotation:', err);
    }
  };

  const handleClear = () => {
    if (!topic) return;
    if (window.confirm('Are you sure you want to delete your notes for this topic?')) {
      setNoteContent('');
      localStorage.removeItem(`java_handbook_topic_notes_${topic.id}`);
      setSavedTime(null);
      if (onAnnotationChange) onAnnotationChange(topic.id, false);
    }
  };

  const handleCopy = () => {
    if (!noteContent.trim()) return;
    navigator.clipboard.writeText(noteContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside
          aria-label="Study notes and topic annotations"
          className="w-screen max-w-md bg-white dark:bg-[#18181b] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-all duration-300 ease-in-out text-left"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/80 dark:bg-[#1e1e22]/80 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
                <Edit3 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
                  Topic Notes &amp; Annotation
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {topic.title}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              title="Close drawer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col space-y-4 overflow-y-auto">
            {/* Quick Context Banner */}
            <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <span className="font-semibold block">Personal Learning Scratchpad</span>
                <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80">
                  Write down key exam reminders, architectural caveats, or code snippets for this module. Notes are persisted locally on your device.
                </p>
              </div>
            </div>

            {/* Note Editor Textarea */}
            <div className="flex-1 flex flex-col relative min-h-[260px]">
              <textarea
                value={noteContent}
                onChange={handleChange}
                placeholder={`Write your personal notes, key takeaways, and reminders for ${topic.title}...\n\nExample:\n• Remember: PECS rule applies to variance.\n• Checked exceptions force compiler catch/specify.\n• JPA @Version provides optimistic locking.`}
                className="w-full flex-1 p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141416] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all resize-none leading-relaxed"
              />
              {savedTime && (
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono text-right mt-1.5">
                  {savedTime}
                </div>
              )}
            </div>

            {/* Suggested Study Prompts */}
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-[#1e1e22]/50 text-xs space-y-1.5">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                <span>Recommended Takeaways for this Topic:</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 text-[11px]">
                <li>Core architectural reason this feature was designed.</li>
                <li>Performance trade-off vs alternative implementations.</li>
                <li>Common production pitfall to watch out for in code reviews.</li>
              </ul>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-[#1e1e22]/80 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!noteContent.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!noteContent.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
