import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  Layers, 
  Server, 
  Leaf, 
  Database,
  Terminal, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { CAPSTONE_PROJECTS, getCapstoneByPart } from '../data/capstoneProjects';
import type { PartType } from '../types';
import { CodeBlock } from './CodeBlock';

interface CapstoneProjectViewProps {
  initialPart?: PartType;
  completedTopicIds: Set<string>;
  onSelectTopic: (topicId: string) => void;
  onGoHome: () => void;
}

export const CapstoneProjectView: React.FC<CapstoneProjectViewProps> = ({
  initialPart = 'Part 1: Java Core',
  completedTopicIds,
  onSelectTopic,
  onGoHome
}) => {
  const [selectedPart, setSelectedPart] = useState<PartType>(initialPart);
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [completedCapstones, setCompletedCapstones] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('java_handbook_capstones_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const project = getCapstoneByPart(selectedPart) || CAPSTONE_PROJECTS[0];

  const toggleRequirement = (reqIndex: number) => {
    const key = `${project.id}-req-${reqIndex}`;
    setCheckedRequirements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleToggleCompleted = () => {
    const nextState = !completedCapstones[project.id];
    const updated = {
      ...completedCapstones,
      [project.id]: nextState
    };
    setCompletedCapstones(updated);
    try {
      localStorage.setItem('java_handbook_capstones_completed', JSON.stringify(updated));
    } catch {
      // storage error fallback
    }
  };

  const getPartBadge = (part: PartType) => {
    switch (part) {
      case 'Part 1: Java Core':
        return {
          icon: Layers,
          color: 'text-orange-500',
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
          accent: 'border-orange-500'
        };
      case 'Part 2: Java EE & Jakarta EE':
        return {
          icon: Server,
          color: 'text-sky-500',
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-500',
          accent: 'border-sky-500'
        };
      case 'Part 3: Spring Boot & Production Stack':
        return {
          icon: Leaf,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
          accent: 'border-emerald-500'
        };
      case 'Part 4: Database Systems & Persistence':
        return {
          icon: Database,
          color: 'text-amber-500',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
          accent: 'border-amber-500'
        };
    }
  };

  const badge = getPartBadge(project.part);
  const isMastered = Boolean(completedCapstones[project.id]);
  const isSolutionRevealed = Boolean(revealedSolutions[project.id]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 text-left">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 via-zinc-100/50 to-zinc-50 dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-zinc-950 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>Multi-Tier Architectural Capstone System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Curriculum Capstone Projects
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Rigorous, enterprise-grade practical projects designed to prove mastery of each architectural paradigm before advancing.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={onGoHome}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200/60 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Back to Handbook
            </button>
          </div>
        </div>

        {/* Tab Selection for 3 Parts */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          {CAPSTONE_PROJECTS.map(p => {
            const isSelected = selectedPart === p.part;
            const isCompleted = completedCapstones[p.id];
            const pBadge = getPartBadge(p.part);
            const Icon = pBadge.icon;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPart(p.part)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? `${pBadge.bg} shadow-xs font-bold ring-1 ring-zinc-400/20`
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{p.part.split(':')[0]} Capstone</span>
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Project Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Title and Metadata */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${badge.bg}`}>
                {project.part}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <Clock className="w-3 h-3 text-zinc-400" />
                {project.estimatedDuration}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {project.difficulty}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              {project.subtitle}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleCompleted}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMastered
                  ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600'
                  : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isMastered ? 'Mastered [Verified]' : 'Mark as Mastered'}</span>
            </button>
          </div>
        </div>

        {/* Prerequisite Modules */}
        {project.prerequisiteTopicIds && project.prerequisiteTopicIds.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Curriculum Prerequisites
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.prerequisiteTopicIds.map((topicId: string) => {
                const isDone = completedTopicIds.has(topicId);
                return (
                  <button
                    key={topicId}
                    type="button"
                    onClick={() => onSelectTopic(topicId)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-orange-500/50'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-500' : 'text-zinc-400'}`} />
                    <span>{topicId}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Real-World Scenario */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            1. Enterprise Scenario & Problem Statement
          </h3>
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
            {project.scenario}
          </div>
        </div>

        {/* Technical Stack Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            2. Required Technical Stack & Primitives
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.technicalStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Architectural Requirements Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              3. Architectural Specifications & Non-Negotiables
            </h3>
            <span className="text-xs text-zinc-500">
              {Object.keys(checkedRequirements).filter(k => k.startsWith(project.id) && checkedRequirements[k]).length} of {project.architecturalRequirements.length} satisfied
            </span>
          </div>

          <div className="space-y-2">
            {project.architecturalRequirements.map((req, idx) => {
              const isChecked = Boolean(checkedRequirements[`${project.id}-req-${idx}`]);
              return (
                <div
                  key={idx}
                  onClick={() => toggleRequirement(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-500/5 border-emerald-500/30 text-zinc-900 dark:text-zinc-100'
                      : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                  />
                  <span className={isChecked ? 'line-through opacity-80' : ''}>
                    {req}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expected Terminal Output */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              4. Expected Verification Console Output
            </h3>
          </div>
          <p className="text-xs text-zinc-500">
            Your implementation must compile on JDK 26 and produce this deterministic verification trace:
          </p>
          <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-[#121214] p-4 text-[11px] sm:text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre">
            {project.expectedTerminalOutput}
          </div>
        </div>

        {/* Evaluation Criteria Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            5. Architecture Board Evaluation Criteria
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.evaluationCriteria.map((c, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {c.category}
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-purple-600 dark:text-purple-400">
                    {c.weight}
                  </span>
                </div>
                <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reference Solution Unlocking */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Senior Architect Reference Architecture
              </h3>
              <p className="text-xs text-zinc-500">
                Self-check your solution against the canonical implementation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRevealedSolutions(prev => ({ ...prev, [project.id]: !prev[project.id] }))}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              {isSolutionRevealed ? 'Hide Reference Code' : 'Unlock Reference Architecture'}
            </button>
          </div>

          {isSolutionRevealed && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  This reference code is fully compilable on JDK 26 and tested to satisfy all architectural constraints.
                </span>
              </div>
              <CodeBlock
                code={project.referenceArchitectureCode}
                language="java"
                filename={`${project.id}-Reference.java`}
              />
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
