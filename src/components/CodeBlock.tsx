import React, { useState, useMemo } from 'react';
import { Copy, Check, Terminal, Code2, WrapText } from 'lucide-react';
import { highlightCodeLines } from '../lib/codeHighlight';

interface CodeBlockProps {
  code: string;
  output?: string;
  language?: string;
  filename?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  output,
  language = 'java',
  filename,
  title
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'output'>('code');
  const [isWrapped, setIsWrapped] = useState(false);
  const [copied, setCopied] = useState(false);

  const cleanCode = useMemo(() => code.trim(), [code]);

  const lines = useMemo(() => {
    return highlightCodeLines(cleanCode, language);
  }, [cleanCode, language]);

  const displayTitle = useMemo(() => {
    if (title) return title;
    if (filename) return filename;
    const match = cleanCode.match(/(?:public\s+)?(?:class|interface|record|enum)\s+([A-Za-z0-9_]+)/);
    if (match) return `Example: ${match[1]}`;
    return 'Code Example';
  }, [title, filename, cleanCode]);

  const isCommandLang = ['command', 'cmd', 'cli', 'bash', 'shell', 'sh'].includes(language.toLowerCase());

  const displayLang = useMemo(() => {
    const lower = language.toLowerCase();
    if (lower === 'java') return 'Java';
    if (lower === 'command' || lower === 'cmd' || lower === 'cli') return 'COMMAND';
    if (lower === 'bash' || lower === 'shell') return 'BASH';
    if (lower === 'esql') return 'ESQL';
    return language.toUpperCase();
  }, [language]);

  const handleCopy = () => {
    const textToCopy = activeTab === 'code' ? cleanCode : (output?.trim() || '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const padDigits = lines.length >= 100 ? 3 : 2;

  return (
    <div className={`code-tab-container my-4 sm:my-6 rounded-xl overflow-hidden border border-zinc-200/80 dark:border-[#2e2e34] bg-[#1e1e1e] shadow-lg text-left transition-all ${
      isWrapped ? 'code-wrapped' : 'code-scrollable'
    }`}>
      {/* Header Top Bar: Title & Language Badge */}
      <div className="code-tab-topbar flex items-center justify-between px-3.5 sm:px-4 py-2 bg-[#252528] border-b border-[#2e2e34] select-none gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isCommandLang ? (
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Code2 className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span className="font-semibold text-xs sm:text-sm text-zinc-100 font-mono truncate">
            {displayTitle}
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          {displayLang}
        </span>
      </div>

      {/* Tabs & Actions Bar */}
      <div className="code-tab-toolbar flex items-center justify-between px-3 sm:px-4 py-1.5 bg-[#1e1e22] border-b border-[#2a2a30] select-none gap-2">
        {/* Tabs Group */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`tab-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#24344d] text-blue-400 font-semibold border border-blue-500/30 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 shrink-0" />
            <span>Code</span>
          </button>

          {output && (
            <button
              type="button"
              onClick={() => setActiveTab('output')}
              className={`tab-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'output'
                  ? 'bg-[#24344d] text-blue-400 font-semibold border border-blue-500/30 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              <span>Output</span>
            </button>
          )}
        </div>

        {/* Actions Group (Wrap Toggle + Copy) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsWrapped(prev => !prev)}
            className={`wrap-btn flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              isWrapped
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 bg-[#2d2d30] hover:bg-[#3e3e42] border-[#3f3f46]'
            }`}
            title={isWrapped ? "Disable line wrap (scroll mode)" : "Wrap long lines within container width"}
            aria-pressed={isWrapped}
          >
            <WrapText className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{isWrapped ? 'Wrapped' : 'Wrap'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="copy-btn flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg text-zinc-300 hover:text-white bg-[#2d2d30] hover:bg-[#3e3e42] border border-[#3f3f46] transition-all cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      {activeTab === 'code' ? (
        <div
          className={`tab-pane-code p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed transition-all ${
            isWrapped ? 'overflow-x-hidden' : 'overflow-x-auto'
          }`}
          style={{ tabSize: 4 }}
        >
          <div className={`code-lines-wrapper ${isWrapped ? 'w-full max-w-full min-w-0' : 'w-max min-w-full'}`}>
            {lines.map((line) => (
              <div
                key={line.lineNumber}
                className="code-line flex items-start hover:bg-white/[0.03] transition-colors"
              >
                {/* Line Number Gutter */}
                <span
                  className="line-num select-none text-zinc-500/70 font-mono text-[11px] sm:text-xs text-right pr-3.5 sm:pr-4 shrink-0 tabular-nums leading-relaxed"
                  style={{ width: `${padDigits * 0.75 + 1.25}rem` }}
                  aria-hidden="true"
                >
                  {String(line.lineNumber).padStart(padDigits, '0')}
                </span>

                {/* Line Content */}
                <span
                  className={`line-content flex-1 text-[#d4d4d4] font-mono leading-relaxed ${
                    isWrapped
                      ? 'whitespace-pre-wrap break-words overflow-hidden [overflow-wrap:anywhere]'
                      : 'whitespace-pre'
                  }`}
                  dangerouslySetInnerHTML={{ __html: line.html }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Output Pane */
        <div className="tab-pane-output p-3 sm:p-4 text-xs sm:text-sm font-mono bg-[#141416] text-emerald-400">
          <div className="flex items-center gap-2 pb-2 mb-2 border-b border-zinc-800 text-xs text-zinc-400">
            <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Expected Terminal Output:</span>
          </div>
          <pre
            className={`text-zinc-200 m-0 font-mono text-[11px] sm:text-xs leading-5 ${
              isWrapped
                ? 'whitespace-pre-wrap break-words overflow-x-hidden [overflow-wrap:anywhere]'
                : 'whitespace-pre overflow-x-auto'
            }`}
          >
            {output?.trim()}
          </pre>
        </div>
      )}
    </div>
  );
};
