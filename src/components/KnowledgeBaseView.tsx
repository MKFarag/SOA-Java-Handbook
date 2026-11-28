import React, { useState, useMemo } from 'react';
import {
  Brain,
  Search,
  Plus,
  Code2,
  Clock,
  Trash2,
  Edit3,
  Copy,
  Check,
  ArrowLeft,
  Cloud,
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import type { KnowledgeNote, StudentProfile } from '../types';
import { CodeBlock } from './CodeBlock';

interface KnowledgeBaseViewProps {
  currentStudent: StudentProfile | null;
  notes: KnowledgeNote[];
  onSaveNote: (note: Omit<KnowledgeNote, 'id' | 'ownerCode'> & { id?: string; ownerCode?: string }) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onOpenSyncModal: () => void;
}

const CATEGORY_PRESETS = [
  'ACE & MQ',
  'ESQL',
  'Java Core',
  'Spring Boot',
  'Jakarta EE',
  'Database Systems',
  'Architecture & Cloud',
  'Database & EF Core',
  'ASP.NET Core',
  'General'
];

const LANGUAGE_OPTIONS = [
  { label: 'Command / CLI', value: 'command' },
  { label: 'Java', value: 'java' },
  { label: 'ESQL (ACE)', value: 'esql' },
  { label: 'SQL', value: 'sql' },
  { label: 'Bash / Shell', value: 'bash' },
  { label: 'JSON / YAML', value: 'json' },
  { label: 'HTML / XML', value: 'markup' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'C#', value: 'csharp' },
  { label: 'Plain Text', value: 'text' }
];

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  currentStudent,
  notes,
  onSaveNote,
  onDeleteNote,
  onOpenSyncModal
}) => {
  // Navigation within Knowledge Base
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<KnowledgeNote | null>(null);
  const [deletingNote, setDeletingNote] = useState<KnowledgeNote | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent_updated' | 'recent_created' | 'title_asc'>('recent_updated');

  // Quick feedback state
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

  // Form state for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('ACE & MQ');
  const [customCategory, setCustomCategory] = useState('');
  const [formLanguage, setFormLanguage] = useState('command');
  const [formContent, setFormContent] = useState('');
  const [formCodeSnippet, setFormCodeSnippet] = useState('');
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');

  // Active Note Object
  const activeNote = useMemo(() => {
    if (!activeNoteId) return null;
    return notes.find(n => n.id === activeNoteId) || null;
  }, [activeNoteId, notes]);

  // Filtered & Sorted Notes
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Search filter (title/name, description, content, or code snippet)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        (n.description && n.description.toLowerCase().includes(q)) ||
        (n.content && n.content.toLowerCase().includes(q)) ||
        (n.codeSnippet && n.codeSnippet.toLowerCase().includes(q))
      );
    }

    // Category filter via dropdown
    if (selectedCategory !== 'All') {
      result = result.filter(n => (n.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    // Language filter via dropdown
    if (selectedLanguage !== 'All') {
      result = result.filter(n => (n.language || '').toLowerCase() === selectedLanguage.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'recent_created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      // default: recent_updated
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  }, [notes, searchQuery, selectedCategory, selectedLanguage, sortBy]);

  // Open Create Dialog
  const handleOpenCreate = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('ACE & MQ');
    setCustomCategory('');
    setFormLanguage('command');
    setFormContent('');
    setFormCodeSnippet('');
    setPreviewTab('edit');
    setEditorError(null);
    setIsEditorOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (note: KnowledgeNote) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormDescription(note.description || '');
    if (CATEGORY_PRESETS.includes(note.category)) {
      setFormCategory(note.category);
      setCustomCategory('');
    } else {
      setFormCategory('Custom');
      setCustomCategory(note.category);
    }
    setFormLanguage(note.language || 'java');
    setFormContent(note.content || '');
    setFormCodeSnippet(note.codeSnippet || '');
    setPreviewTab('edit');
    setEditorError(null);
    setIsEditorOpen(true);
  };

  // Save Note handler
  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditorError(null);

    const titleClean = formTitle.trim();
    if (!titleClean) {
      setEditorError('Please provide a note title.');
      return;
    }

    const contentClean = formContent.trim();
    const codeClean = formCodeSnippet.trim();
    if (!contentClean && !codeClean) {
      setEditorError('Note must contain personal written content, a code snippet, or both.');
      return;
    }

    const finalCategory = formCategory === 'Custom'
      ? (customCategory.trim() || 'General')
      : formCategory;

    setIsSaving(true);
    try {
      await onSaveNote({
        id: editingNote?.id,
        title: titleClean,
        description: formDescription.trim(),
        category: finalCategory,
        language: formLanguage,
        content: formContent,
        codeSnippet: formCodeSnippet,
        createdAt: editingNote?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setIsEditorOpen(false);
      setEditingNote(null);
    } catch (err: any) {
      console.error(err);
      setEditorError(err.message || 'Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Note handler
  const handleConfirmDelete = async () => {
    if (!deletingNote) return;
    try {
      await onDeleteNote(deletingNote.id);
      if (activeNoteId === deletingNote.id) {
        setActiveNoteId(null);
      }
      setDeletingNote(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  // Quick Copy Code from Card or Details
  const handleQuickCopyCode = (snippet: string, noteId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(noteId);
    setTimeout(() => {
      setCopiedSnippetId(null);
    }, 2000);
  };

  // Format Date Helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  // Handle Tab Indentation inside Code Snippet Textarea
  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      target.value = val.substring(0, start) + '    ' + val.substring(end);
      target.selectionStart = target.selectionEnd = start + 4;
      setFormCodeSnippet(target.value);
    }
  };

  return (
    <>
      {activeNote ? (
        /* ========================================================================= */
        /* VIEW: NOTE DETAILS PAGE (Phase 4)                                         */
        /* ========================================================================= */
        <div className="max-w-5xl mx-auto py-6 sm:py-10 px-3 sm:px-6 lg:px-8 space-y-6 text-left animate-in fade-in duration-200">
          {/* Navigation & Actions Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveNoteId(null)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Knowledge Base</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(activeNote)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Note</span>
              </button>

              <button
                type="button"
                onClick={() => setDeletingNote(activeNote)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Note Header Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {activeNote.category}
              </span>
              {activeNote.language && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                  {activeNote.language}
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono ml-auto">
                <Clock className="w-3 h-3" />
                <span>Updated {formatDate(activeNote.updatedAt)}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {activeNote.title}
            </h1>

            {activeNote.description && (
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                {activeNote.description}
              </p>
            )}
          </div>

          {/* Main Written Content */}
          {activeNote.content && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Personal Notes &amp; Explanation</span>
              </h2>
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] shadow-xs text-sm sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans">
                {activeNote.content}
              </div>
            </div>
          )}

          {/* Code Snippet Component: 100% Reuses the Redesigned CodeBlock */}
          {activeNote.codeSnippet && activeNote.codeSnippet.trim() && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Implementation Snippet</span>
              </h2>
              <CodeBlock
                code={activeNote.codeSnippet}
                language={activeNote.language || 'java'}
                title={`Snippet: ${activeNote.title}`}
              />
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW: KNOWLEDGE BASE DASHBOARD (Phase 2)                                 */
        /* ========================================================================= */
        <div className="max-w-6xl mx-auto py-6 sm:py-10 px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 text-left">
      
      
      {/* Top Banner: Identity & Cloud Sync Status */}
      <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#161922] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <span>My Knowledge Base</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold">
                  {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl mt-1">
            Your private repository for reusable patterns, architectural snippets, and personal technical implementations.
          </p>
        </div>

        {/* Identity & Add Button */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          {currentStudent ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Synced: <strong className="font-mono">{currentStudent.code}</strong></span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenSyncModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Sync your notes across devices with a Student Code"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-500" />
              <span>Connect Cloud Sync</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Live Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title or content..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1c1f] text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category, Language & Sort Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1c1f] text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORY_PRESETS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Language Filter Dropdown */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1c1f] text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
          >
            <option value="All">All Languages</option>
            {LANGUAGE_OPTIONS.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1c1f] text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
          >
            <option value="recent_updated">Recently Updated</option>
            <option value="recent_created">Recently Created</option>
            <option value="title_asc">Title (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Notes Grid / List */}
      {filteredNotes.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
            {notes.length === 0 ? <Brain className="w-6 h-6" /> : <Search className="w-6 h-6" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
              {notes.length === 0 ? 'Your Knowledge Base is Empty' : 'No matching notes found'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              {notes.length === 0
                ? 'Save your preferred ACE commands, ESQL snippets, Spring Boot patterns, or Java Core notes here.'
                : 'Try adjusting your search query, clearing filters, or create a new note.'}
            </p>
          </div>
          {notes.length === 0 ? (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Note</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedLanguage('All');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const hasSnippet = Boolean(note.codeSnippet && note.codeSnippet.trim());
            return (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className="group relative p-4 sm:p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-[#18181c] hover:border-blue-500/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4"
              >
                {/* Header: Category & Language Badges + Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {note.category}
                    </span>
                    {note.language && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                        {note.language}
                      </span>
                    )}
                  </div>

                  {/* Actions Dropdown / Quick Buttons */}
                  <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    {hasSnippet && (
                      <button
                        type="button"
                        onClick={(e) => handleQuickCopyCode(note.codeSnippet!, note.id, e)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                        title="Quick copy code snippet"
                      >
                        {copiedSnippetId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(note);
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      title="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingNote(note);
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body: Title & Preview */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {note.title}
                  </h3>

                  {note.description ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {note.description}
                    </p>
                  ) : note.content ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {note.content}
                    </p>
                  ) : hasSnippet ? (
                    <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 line-clamp-2 bg-zinc-50 dark:bg-zinc-900/50 p-1.5 rounded border border-zinc-200/50 dark:border-zinc-800/50">
                      {note.codeSnippet}
                    </p>
                  ) : null}
                </div>

                {/* Footer: Date & Snippet Indicator */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                  </span>

                  {hasSnippet && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                      <Code2 className="w-3 h-3" />
                      <span>Has Code</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )}

  {/* ===================================================================== */}
  {/* MODAL: CREATE / EDIT NOTE (Phase 3)                                    */}
  {/* ===================================================================== */}
      {isEditorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/60 dark:bg-zinc-900/60 shrink-0">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {editingNote ? 'Edit Knowledge Note' : 'Create New Knowledge Note'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit vs Preview Toggle */}
                <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('edit')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      previewTab === 'edit'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('preview')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      previewTab === 'preview'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Preview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {editorError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editorError}</span>
                </div>
              )}

              <form id="note-form" onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
                {previewTab === 'edit' ? (
                  <>
                    {/* Title Field (Required) */}
                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Global Exception Handling Filter"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm"
                        required
                      />
                    </div>

                    {/* Category & Language Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                          Category / Technology
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer font-medium"
                        >
                          {CATEGORY_PRESETS.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="Custom">+ Custom Category...</option>
                        </select>

                        {formCategory === 'Custom' && (
                          <input
                            type="text"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            placeholder="Type custom category name..."
                            className="mt-1.5 w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                          Programming Language (Syntax Highlight)
                        </label>
                        <select
                          value={formLanguage}
                          onChange={(e) => setFormLanguage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer font-medium"
                        >
                          {LANGUAGE_OPTIONS.map(l => (
                            <option key={l.value} value={l.value}>{l.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Short Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Brief note on when/why you use this implementation pattern"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium"
                      />
                    </div>

                    {/* Written Content */}
                    <div>
                      <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        Personal Explanations &amp; Notes
                      </label>
                      <textarea
                        rows={4}
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="Explain your approach, architectural rationale, tips, gotchas..."
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-sans leading-relaxed resize-y"
                      />
                    </div>

                    {/* Code Snippet Area */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-blue-500" />
                          <span>Code Snippet (Optional)</span>
                        </label>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          Supports Tab indentation &amp; formatting
                        </span>
                      </div>
                      <textarea
                        rows={8}
                        value={formCodeSnippet}
                        onChange={(e) => setFormCodeSnippet(e.target.value)}
                        onKeyDown={handleCodeKeyDown}
                        placeholder={`// Paste your reusable ${formLanguage.toUpperCase()} code here...\npublic class ExamplePattern {\n    // Reusable implementation\n}`}
                        className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-y leading-relaxed"
                        spellCheck={false}
                      />
                    </div>
                  </>
                ) : (
                  /* Preview Tab */
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {formCategory === 'Custom' ? (customCategory || 'Custom') : formCategory}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                          {formLanguage}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {formTitle || 'Untitled Note'}
                      </h2>
                      {formDescription && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                          {formDescription}
                        </p>
                      )}
                    </div>

                    {formContent && (
                      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1c1c1f] text-xs whitespace-pre-wrap leading-relaxed">
                        {formContent}
                      </div>
                    )}

                    {formCodeSnippet && formCodeSnippet.trim() && (
                      <CodeBlock
                        code={formCodeSnippet}
                        language={formLanguage}
                        title={`Preview: ${formTitle || 'Code Example'}`}
                      />
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="note-form"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving Note...' : editingNote ? 'Update Note' : 'Save to Knowledge Base'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: DELETE CONFIRMATION                                             */}
      {/* ===================================================================== */}
      {deletingNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setDeletingNote(null)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Delete Note
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Are you sure you want to delete <strong className="text-zinc-800 dark:text-zinc-200">"{deletingNote.title}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingNote(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
