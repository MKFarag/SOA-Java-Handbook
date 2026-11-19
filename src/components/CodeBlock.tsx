import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';
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
    <div className="my-6 rounded-lg overflow-hidden border border-[#2e2e32] bg-[#1e1e1e] shadow-xl text-left">
      {/* Tab Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#2e2e32] select-none">
        <div className="flex items-center gap-2">
          {/* Dual Tabs if output exists */}
          {output ? (
            <div className="flex items-center bg-[#18181b] p-0.5 rounded-md border border-[#3f3f46]">
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'code'
                    ? 'bg-[#2563eb] text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code {filename ? `(${filename})` : ''}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('output')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'output'
                    ? 'bg-[#ea580c] text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Terminal Output</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Code2 className="w-4 h-4 text-amber-500" />
              <span>{filename || 'Java Source'}</span>
            </div>
          )}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded text-zinc-300 hover:text-white bg-[#2d2d30] hover:bg-[#3e3e42] border border-[#3f3f46] transition-all"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        {activeTab === 'code' ? (
          <pre className="text-[#d4d4d4] m-0 p-0">
            <code
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        ) : (
          <div className="bg-[#141416] p-3 rounded border border-zinc-800 text-emerald-400">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-zinc-800 text-xs text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-orange-400" />
              <span>Expected Execution Result:</span>
            </div>
            <pre className="text-zinc-200 m-0 whitespace-pre font-mono text-xs leading-5">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
