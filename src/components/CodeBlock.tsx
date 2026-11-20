import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, WrapText } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';

interface CodeBlockProps {
  code: string;
  output?: string;
  language?: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  output,
  language = 'java',
  filename
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'output'>('code');
  const [isWrapped, setIsWrapped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeTab === 'code' ? code : (output || '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = React.useMemo(() => {
    try {
      const grammar = Prism.languages[language] || Prism.languages.java;
      return Prism.highlight(code.trim(), grammar, language);
    } catch {
      return code.trim();
    }
  }, [code, language]);

  return (
    <div className="my-4 sm:my-6 rounded-xl overflow-hidden border border-zinc-200/80 dark:border-[#2e2e32] bg-[#1e1e1e] shadow-lg text-left transition-all">
      {/* Tab Header Bar */}
      <div className="flex items-center justify-between px-2.5 sm:px-4 py-2 bg-[#252526] border-b border-[#2e2e32] select-none gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Dual Tabs if output exists */}
          {output ? (
            <div className="flex items-center bg-[#18181b] p-0.5 rounded-lg border border-[#3f3f46]">
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-none">
                  Code {filename ? `(${filename})` : ''}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('output')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'output'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Output</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 truncate">
              <Code2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-none">{filename || 'Java Source'}</span>
            </div>
          )}
        </div>

        {/* Action Controls: Wrap Toggle + Copy */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsWrapped(prev => !prev)}
            className={`flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs font-medium rounded-md border transition-all cursor-pointer ${
              isWrapped
                ? 'bg-orange-500/25 text-orange-400 border-orange-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 bg-[#2d2d30] hover:bg-[#3e3e42] border-[#3f3f46]'
            }`}
            title={isWrapped ? "Disable line wrap (scroll mode)" : "Wrap long lines (mobile friendly)"}
          >
            <WrapText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isWrapped ? 'Wrapped' : 'Wrap'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md text-zinc-300 hover:text-white bg-[#2d2d30] hover:bg-[#3e3e42] border border-[#3f3f46] transition-all cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed transition-all ${
        isWrapped ? 'overflow-x-hidden' : 'overflow-x-auto'
      }`}>
        {activeTab === 'code' ? (
          <pre className={`text-[#d4d4d4] m-0 p-0 ${
            isWrapped ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
          }`}>
            <code
              className={`language-${language} ${isWrapped ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        ) : (
          <div className="bg-[#141416] p-2.5 sm:p-3 rounded-lg border border-zinc-800 text-emerald-400">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-zinc-800 text-xs text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-orange-400" />
              <span>Expected Execution Result:</span>
            </div>
            <pre className={`text-zinc-200 m-0 font-mono text-[11px] sm:text-xs leading-5 ${
              isWrapped ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
            }`}>
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
