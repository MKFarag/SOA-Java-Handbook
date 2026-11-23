import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  ExternalLink, 
  FileText, 
  ListChecks, 
  Megaphone, 
  Link as LinkIcon, 
  RefreshCw, 
  Copy, 
  Check
} from 'lucide-react';
import type { BroadcastItem, BroadcastType } from '../types';

interface BroadcastsModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcasts: BroadcastItem[];
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

export const BroadcastsModal: React.FC<BroadcastsModalProps> = ({
  isOpen,
  onClose,
  broadcasts,
  onRefresh,
  isLoading
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | BroadcastType>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = broadcasts.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.type === selectedFilter;
  });

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeIcon = (type: BroadcastType) => {
    switch (type) {
      case 'link':
        return <LinkIcon className="w-4 h-4 text-blue-500" />;
      case 'task':
        return <ListChecks className="w-4 h-4 text-emerald-500" />;
      case 'file':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'announcement':
      default:
        return <Megaphone className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeBadgeClass = (type: BroadcastType) => {
    switch (type) {
      case 'link':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'task':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'file':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'announcement':
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Announcements & Shared Resources</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
                  {broadcasts.length}
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Official course notices, tasks, Google Drive links, and reference materials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            All Updates ({broadcasts.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('link')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              selectedFilter === 'link'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Links & Drive</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('task')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              selectedFilter === 'task'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>Assignments & Tasks</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('announcement')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              selectedFilter === 'announcement'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Notices</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('file')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              selectedFilter === 'file'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Files</span>
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                No updates published yet
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Instructor announcements, project links, or assignments will appear right here automatically.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getTypeBadgeClass(item.type)}`}>
                        {getTypeIcon(item.type)}
                        <span>{item.type}</span>
                      </span>
                      {item.badgeLabel && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {item.badgeLabel}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {item.content && (
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </p>
                )}

                {item.url && (
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(item.url!, item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
