import React from 'react';
import { CheckCircle2, Circle, Layers, Server, ArrowRight, Trophy, Award } from 'lucide-react';
import { ALL_TOPICS } from '../data/topics';

interface ProgressViewProps {
  completedTopicIds: Set<string>;
  onToggleCompleted: (topicId: string) => void;
  onSelectTopic: (topicId: string) => void;
  onOpenCertificate: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  completedTopicIds,
  onToggleCompleted,
  onSelectTopic,
  onOpenCertificate
}) => {
  const totalTopics = ALL_TOPICS.length;
  const completedCount = completedTopicIds.size;
  const overallPercentage = Math.round((completedCount / Math.max(totalTopics, 1)) * 100);

  const coreTopics = ALL_TOPICS.filter(t => t.part === 'Part 1: Java Core');
  const coreCompleted = coreTopics.filter(t => completedTopicIds.has(t.id)).length;
  const corePercent = Math.round((coreCompleted / Math.max(coreTopics.length, 1)) * 100);

  const jakartaTopics = ALL_TOPICS.filter(t => t.part === 'Part 2: Java EE & Jakarta EE');
  const jakartaCompleted = jakartaTopics.filter(t => completedTopicIds.has(t.id)).length;
  const jakartaPercent = Math.round((jakartaCompleted / Math.max(jakartaTopics.length, 1)) * 100);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 text-left">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Learning Progress &amp; Milestone Tracker
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Track your journey across all 87 Java Core and Jakarta EE topics. Your progress is saved automatically on your machine.
        </p>
      </div>

      {/* Progress Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Progress */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Overall Handbook</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {overallPercentage}%
            </span>
            <span className="text-xs font-mono text-zinc-500">
              {completedCount} of {totalTopics}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Java Core Progress */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Java Core
            </span>
            <Layers className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {corePercent}%
            </span>
            <span className="text-xs font-mono text-zinc-500">
              {coreCompleted} of {coreTopics.length}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${corePercent}%` }}
            />
          </div>
        </div>

        {/* Jakarta EE Progress */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Jakarta EE
            </span>
            <Server className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {jakartaPercent}%
            </span>
            <span className="text-xs font-mono text-zinc-500">
              {jakartaCompleted} of {jakartaTopics.length}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${jakartaPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Completion Certificate Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Official Completion Certificate</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                Mohamed Khaled Farag
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans">
              Complete all 87 curriculum topics to unlock and print your high-resolution verified certificate of engineering mastery.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCertificate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20 transition-all shrink-0 hover:scale-[1.02]"
        >
          <span>View Certificate</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Topics Checklist */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Topics Checklist
        </h2>

        <div className="space-y-2">
          {ALL_TOPICS.map(topic => {
            const isDone = completedTopicIds.has(topic.id);

            return (
              <div
                key={topic.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-500/5 border-emerald-500/25 dark:bg-emerald-500/10'
                    : 'bg-white dark:bg-[#1e1e1e] border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {/* Left: Checkbox toggle & Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onToggleCompleted(topic.id)}
                    className="text-zinc-400 hover:text-emerald-500 transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div
                    className="cursor-pointer min-w-0"
                    onClick={() => onSelectTopic(topic.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">
                        #{topic.topicNumber.toString().padStart(2, '0')}
                      </span>
                      <h4 className={`text-sm font-semibold truncate ${
                        isDone
                          ? 'text-zinc-600 dark:text-zinc-400 line-through'
                          : 'text-zinc-900 dark:text-zinc-100 hover:text-orange-500'
                      }`}>
                        {topic.title}
                      </h4>
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {topic.part} • {topic.sectionTitle}
                    </div>
                  </div>
                </div>

                {/* Right: Badge & Jump */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {topic.versionBadge}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectTopic(topic.id)}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
                    title="View topic"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
