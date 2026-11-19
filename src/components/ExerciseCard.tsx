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
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] p-5 shadow-sm transition-all text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold font-mono">
            {index + 1}
          </span>
          <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {exercise.title}
          </h4>
        </div>
        <div>{getTypeBadge()}</div>
      </div>

      {/* Prompt */}
      <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
        {exercise.prompt}
      </p>

      {/* Starter Code if present */}
      {exercise.starterCode && (
        <div className="mt-3">
          <CodeBlock code={exercise.starterCode} />
        </div>
      )}

      {/* Toggle Button */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowSolution(!showSolution)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors border border-zinc-200 dark:border-zinc-700"
        >
          {showSolution ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Solution</span>
              <ChevronUp className="w-3.5 h-3.5 ml-1" />
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal Solution & Explanation</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </>
          )}
        </button>

        {showSolution && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Solution Revealed
          </span>
        )}
      </div>

      {/* Solution Section */}
      {showSolution && (
        <div className="mt-4 p-4 rounded-lg bg-zinc-50 dark:bg-[#141416] border border-orange-500/20 animate-fadeIn">
          <h5 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2">
            Correct Solution:
          </h5>
          <CodeBlock code={exercise.solution} />

          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-4 mb-1">
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
