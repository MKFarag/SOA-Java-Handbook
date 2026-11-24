import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Layers, 
  Server, 
  Leaf,
  Database,
  ArrowRight, 
  Trophy, 
  Award,
  AlertTriangle,
  BookOpen,
  Target,
  XCircle,
  Network
} from 'lucide-react';
import { ALL_TOPICS } from '../data/topics';
import { SECTION_CHALLENGES } from '../data/challenges';
import type { ChallengeStatus, PartType } from '../types';
import { MilestoneChallengeCard } from './MilestoneChallengeCard';

interface ProgressViewProps {
  completedTopicIds: Set<string>;
  onToggleCompleted: (topicId: string) => void;
  onSelectTopic: (topicId: string) => void;
  onOpenCertificate?: () => void;
  onOpenCapstone?: (part?: PartType) => void;
  challengeStates?: Record<string, ChallengeStatus>;
  targetedReviewIds?: Set<string>;
  onSolveChallenge?: (challengeId: string) => void;
  onNeedHelpChallenge?: (challengeId: string, prerequisiteTopicIds: string[]) => void;
  onResetChallenge?: (challengeId: string) => void;
  onRemoveTargetedReview?: (topicId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  completedTopicIds,
  onToggleCompleted,
  onSelectTopic,
  onOpenCertificate,
  onOpenCapstone,
  challengeStates = {},
  targetedReviewIds = new Set(),
  onSolveChallenge = () => {},
  onNeedHelpChallenge = () => {},
  onResetChallenge = () => {},
  onRemoveTargetedReview = () => {}
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

  const springTopics = ALL_TOPICS.filter(t => t.part === 'Part 3: Spring Boot & Production Stack');
  const springCompleted = springTopics.filter(t => completedTopicIds.has(t.id)).length;
  const springPercent = springTopics.length > 0 
    ? Math.round((springCompleted / springTopics.length) * 100) 
    : 0;

  const dbTopics = ALL_TOPICS.filter(t => t.part === 'Part 4: Database Systems & Persistence');
  const dbCompleted = dbTopics.filter(t => completedTopicIds.has(t.id)).length;
  const dbPercent = dbTopics.length > 0 
    ? Math.round((dbCompleted / dbTopics.length) * 100) 
    : 0;

  const aceTopics = ALL_TOPICS.filter(t => t.part === 'Part 5: ACE & MQ');
  const aceCompleted = aceTopics.filter(t => completedTopicIds.has(t.id)).length;
  const acePercent = aceTopics.length > 0 
    ? Math.round((aceCompleted / aceTopics.length) * 100) 
    : 0;

  // Mastered challenges count
  const masteredChallengesCount = Object.values(challengeStates).filter(s => s === 'mastered').length;

  // Targeted review topics list
  const reviewTopicList = ALL_TOPICS.filter(t => targetedReviewIds.has(t.id));

  return (
    <div className="max-w-4xl mx-auto py-5 sm:py-10 px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 text-left">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Learning Progress &amp; Milestone Tracker
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Track your journey across the Tri-Part architecture: Java Core, Jakarta EE, and Spring Boot. Your progress and challenge evaluations persist automatically on this device.
        </p>
      </div>

      {/* Progress Cards Overview (6 Tiers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Overall Progress */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Overall</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {overallPercentage}%
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {completedCount}/{totalTopics}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Java Core Progress */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Java Core
            </span>
            <Layers className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {corePercent}%
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {coreCompleted}/{coreTopics.length}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${corePercent}%` }}
            />
          </div>
        </div>

        {/* Jakarta EE Progress */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Jakarta EE
            </span>
            <Server className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {jakartaPercent}%
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {jakartaCompleted}/{jakartaTopics.length}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${jakartaPercent}%` }}
            />
          </div>
        </div>

        {/* Spring Boot Progress */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Spring Boot
            </span>
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {springPercent}%
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {springCompleted}/{springTopics.length}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${springPercent}%` }}
            />
          </div>
        </div>

        {/* Database Systems Progress */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Databases
            </span>
            <Database className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {dbPercent}%
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {dbCompleted}/{dbTopics.length}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${dbPercent}%` }}
            />
          </div>
        </div>

        {/* ACE & MQ Progress */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              ACE & MQ
            </span>
            <Network className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {acePercent}%
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {aceCompleted}/{aceTopics.length}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${acePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Targeted Review / Knowledge Gaps Section (CAP-03) */}
      {reviewTopicList.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <h3 className="text-base font-bold">
                  Targeted Review: Flagged Prerequisite Gaps ({reviewTopicList.length})
                </h3>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                  Topics marked for reinforcement following section milestone self-assessments. Master these foundational modules before retrying challenges.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {reviewTopicList.map(topic => (
              <div
                key={topic.id}
                className="p-3 rounded-xl bg-white dark:bg-[#1e1e1e] border border-amber-500/30 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div 
                  className="min-w-0 cursor-pointer flex-1"
                  onClick={() => onSelectTopic(topic.id)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-zinc-400">
                      #{topic.topicNumber.toString().padStart(2, '0')}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-500 truncate">
                      {topic.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-zinc-400 truncate block">
                    {topic.sectionTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectTopic(topic.id)}
                    className="p-1 rounded text-blue-500 hover:bg-blue-500/10 transition-colors"
                    title="Review module"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveTargetedReview(topic.id)}
                    className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Dismiss gap"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Certificate Banner */}
      {onOpenCertificate && (
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Official Completion Certificate</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                  Mohamed Khaled Farag
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans">
                Master the full curriculum across Java SE, Jakarta EE, and Spring Boot to unlock and print your verified engineering certificate.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCertificate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all shrink-0 hover:scale-[1.02] cursor-pointer"
          >
            <span>View Certificate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tri-Part Capstone Projects Overview */}
      {onOpenCapstone && (
        <div className="p-6 rounded-2xl bg-zinc-900 text-white border border-zinc-800 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <span>Tri-Part Capstone Projects</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
                    3 Real-World Systems
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Comprehensive architectural implementations combining multiple modules into end-to-end production engines.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenCapstone()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div
              onClick={() => onOpenCapstone('Part 1: Java Core')}
              className="p-4 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 hover:border-sky-500/50 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-sky-400">Part 1 Capstone</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300">Java SE</span>
              </div>
              <h4 className="text-xs font-bold text-zinc-100 group-hover:text-sky-400 transition-colors">
                Financial Transaction Engine
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-2">
                Virtual Threads, Sealed Records, RingBuffer Queue, SHA-256 Ledger, NIO.2 Channels.
              </p>
            </div>

            <div
              onClick={() => onOpenCapstone('Part 2: Java EE & Jakarta EE')}
              className="p-4 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 hover:border-sky-500/50 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-sky-400">Part 2 Capstone</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300">Jakarta EE</span>
              </div>
              <h4 className="text-xs font-bold text-zinc-100 group-hover:text-sky-400 transition-colors">
                E-Commerce &amp; Banking Gateway
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-2">
                Front Controller, Security Filter Chain, HikariCP, JPA Relations, JAX-RS REST.
              </p>
            </div>

            <div
              onClick={() => onOpenCapstone('Part 3: Spring Boot & Production Stack')}
              className="p-4 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Part 3 Capstone</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">Spring Boot 3</span>
              </div>
              <h4 className="text-xs font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                Distributed Fintech Payment Gateway
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-2">
                Stateless JWT, Multi-Tier Caching (Redis), Resilience4j Breaker, Kafka Streaming.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section Milestone Challenges Dashboard (CAP-01 / CAP-02) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Section Milestone Challenges
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {masteredChallengesCount} / {SECTION_CHALLENGES.length} Mastered
          </span>
        </div>

        <div className="space-y-4">
          {SECTION_CHALLENGES.map(challenge => (
            <MilestoneChallengeCard
              key={challenge.id}
              challenge={challenge}
              status={challengeStates[challenge.id] || 'unattempted'}
              onSolve={onSolveChallenge}
              onNeedHelp={onNeedHelpChallenge}
              onReset={onResetChallenge}
              onSelectTopic={onSelectTopic}
            />
          ))}
        </div>
      </div>

      {/* Topics Checklist */}
      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Curriculum Modules Matrix
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
                    className="text-zinc-400 hover:text-emerald-500 transition-colors shrink-0 cursor-pointer"
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
                          : 'text-zinc-900 dark:text-zinc-100 hover:text-blue-500'
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
                    className="p-1.5 rounded-md text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer"
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
