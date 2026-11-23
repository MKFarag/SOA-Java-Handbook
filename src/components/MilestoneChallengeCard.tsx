import React, { useState } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  CheckCircle2, 
  Code2, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { SectionMilestoneChallenge, ChallengeStatus } from '../types';
import { CodeBlock } from './CodeBlock';

interface MilestoneChallengeCardProps {
  challenge: SectionMilestoneChallenge;
  status: ChallengeStatus;
  onSolve: (challengeId: string) => void;
  onNeedHelp: (challengeId: string, prerequisiteTopicIds: string[]) => void;
  onReset: (challengeId: string) => void;
  onSelectTopic?: (topicId: string) => void;
}

export const MilestoneChallengeCard: React.FC<MilestoneChallengeCardProps> = ({
  challenge,
  status,
  onSolve,
  onNeedHelp,
  onReset,
  onSelectTopic
}) => {
  const [showSolutionManual, setShowSolutionManual] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const isMastered = status === 'mastered';
  const needsReview = status === 'needs-review';

  return (
    <div className={`rounded-2xl border transition-all text-left overflow-hidden shadow-sm ${
      isMastered
        ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/15'
        : needsReview
        ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/15'
        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e]'
    }`}>
      {/* Header Banner */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isMastered
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : needsReview
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
          }`}>
            <Trophy className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                Section {challenge.sectionNumber} Milestone
              </span>
              {isMastered && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Mastered
                </span>
              )}
              {needsReview && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Targeted Review Required
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {challenge.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Scenario Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              Enterprise Problem Statement
            </h4>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {challenge.scenario}
            </p>
          </div>

          {/* Architectural Constraints */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              Architectural Constraints
            </h4>
            <ul className="space-y-1.5">
              {challenge.architecturalConstraints.map((constraint, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expected Output */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              Expected Output (Stdout / Telemetry)
            </h4>
            <pre className="p-3 rounded-lg bg-zinc-900 text-zinc-200 text-xs font-mono border border-zinc-800 overflow-x-auto whitespace-pre-wrap">
              {challenge.expectedOutput}
            </pre>
          </div>

          {/* Dual-State Action Trigger Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onSolve(challenge.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  isMastered
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isMastered ? 'Mastered (Solved)' : '✅ I Solved It Successfully'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNeedHelp(challenge.id, challenge.prerequisiteTopicIds)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  needsReview
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>🤔 I'm Stuck / Need Assistance</span>
              </button>
            </div>

            {(isMastered || needsReview) && (
              <button
                type="button"
                onClick={() => onReset(challenge.id)}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Assessment</span>
              </button>
            )}
          </div>

          {/* Diagnostic Remediation View (If user needs assistance) */}
          {needsReview && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Diagnostic Guide &amp; Knowledge Gap Analysis</span>
              </div>

              {/* Hints */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase font-bold text-zinc-500">Step-by-Step Hints:</span>
                <ul className="list-disc list-inside space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                  {challenge.diagnosticHints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </div>

              {/* Pitfalls */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase font-bold text-zinc-500">Common Pitfalls to Avoid:</span>
                <ul className="list-disc list-inside space-y-1 text-xs text-amber-700 dark:text-amber-300">
                  {challenge.commonPitfalls.map((pitfall, idx) => (
                    <li key={idx}>{pitfall}</li>
                  ))}
                </ul>
              </div>

              {/* Prerequisite Topic Tagging */}
              {challenge.prerequisiteTopicIds.length > 0 && onSelectTopic && (
                <div className="pt-2 border-t border-amber-500/20 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block">
                    Recommended Prerequisite Modules to Revisit:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {challenge.prerequisiteTopicIds.map(tid => (
                      <button
                        key={tid}
                        type="button"
                        onClick={() => onSelectTopic(tid)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-medium text-amber-700 dark:text-amber-300 transition-colors cursor-pointer"
                      >
                        <span>Revisit {tid}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowSolutionManual(prev => !prev)}
                className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 underline cursor-pointer"
              >
                {showSolutionManual ? 'Hide Reference Code' : 'Unlock Reference Solution Code'}
              </button>
            </div>
          )}

          {/* Reference Solution Code & Architectural Deep Dive */}
          {(isMastered || (needsReview && showSolutionManual)) && (
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <Code2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Reference Solution Code</span>
              </div>

              <CodeBlock 
                code={challenge.referenceSolutionCode} 
                language="java" 
                filename="ReferenceSolution.java" 
              />

              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-zinc-100">Architectural Note: </strong>
                {challenge.solutionArchitectureNotes}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
