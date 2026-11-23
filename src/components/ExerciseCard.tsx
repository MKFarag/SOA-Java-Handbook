import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Bug, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { TopicExercise } from '../types';
import { CodeBlock } from './CodeBlock';

interface ExerciseCardProps {
  exercise: TopicExercise;
  index: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  const [showSolution, setShowSolution] = useState(false);

  const getTypeBadge = () => {
    switch (exercise.type) {
      case 'Spot the Bug':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Bug className="w-3 h-3" />
            Spot the Bug
          </span>
        );
      case 'Hands-on Implementation':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Wrench className="w-3 h-3" />
            Hands-on Challenge
          </span>
        );
      case 'Real-world Edge Case':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Edge Case & Architecture
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] p-3.5 sm:p-5 shadow-xs transition-all text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold font-mono shrink-0">
            {index + 1}
          </span>
          <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {exercise.title}
          </h4>
        </div>
        <div>{getTypeBadge()}</div>
      </div>

      {/* Prompt */}
      <p className="mt-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
        {exercise.prompt}
      </p>

      {/* Starter Code if present */}
      {exercise.starterCode && (
        <div className="mt-3">
          <CodeBlock code={exercise.starterCode} />
        </div>
      )}

      {/* Toggle Button */}
      <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowSolution(!showSolution)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-zinc-200 dark:border-zinc-700 cursor-pointer"
        >
          {showSolution ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Solution</span>
              <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal Solution</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </>
          )}
        </button>

        {showSolution && (
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-emerald-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Solution Revealed
          </span>
        )}
      </div>

      {/* Solution Section */}
      {showSolution && (
        <div className="mt-3 p-3 sm:p-4 rounded-xl bg-zinc-50 dark:bg-[#141416] border border-blue-500/20">
          <h5 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Correct Solution:
          </h5>
          <CodeBlock code={exercise.solution} />

          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-3 mb-1">
            Why This Works:
          </h5>
          <p className="text-xs font-sans text-zinc-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
            {exercise.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
