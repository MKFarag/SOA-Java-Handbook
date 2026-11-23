import React, { useState } from 'react';
import { 
  Code2, 
  Server, 
  Leaf,
  Database,
  ArrowRight,
  Award,
  Trophy,
  ExternalLink,
  Mail,
  ShieldCheck,
  Megaphone,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Check,
  Brain
} from 'lucide-react';
import { SECTIONS, ALL_TOPICS } from '../data/topics';
import type { PartType, BroadcastItem } from '../types';

const LinkedInIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 1.64 1.64 1.64 1.64 0 0 0-1.64-1.64Z"/>
  </svg>
);

interface HomeViewProps {
  onSelectTopic: (topicId: string) => void;
  completedTopicIds: Set<string>;
  onOpenCertificate?: () => void;
  onOpenCapstone?: (part?: PartType) => void;
  onOpenKnowledgeBase?: () => void;
  broadcasts?: BroadcastItem[];
  onOpenBroadcasts?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTopic,
  completedTopicIds,
  onOpenCertificate,
  onOpenCapstone,
  onOpenKnowledgeBase,
  broadcasts,
  onOpenBroadcasts
}) => {
  const [activeTabPart, setActiveTabPart] = useState<PartType>('Part 1: Java Core');

  const part1Sections = SECTIONS.filter(s => s.part === 'Part 1: Java Core');
  const part2Sections = SECTIONS.filter(s => s.part === 'Part 2: Java EE & Jakarta EE');
  const part3Sections = SECTIONS.filter(s => s.part === 'Part 3: Spring Boot & Production Stack');
  const part4Sections = SECTIONS.filter(s => s.part === 'Part 4: Database Systems & Persistence');

  const part1Topics = ALL_TOPICS.filter(t => t.part === 'Part 1: Java Core');
  const part2Topics = ALL_TOPICS.filter(t => t.part === 'Part 2: Java EE & Jakarta EE');
  const part3Topics = ALL_TOPICS.filter(t => t.part === 'Part 3: Spring Boot & Production Stack');
  const part4Topics = ALL_TOPICS.filter(t => t.part === 'Part 4: Database Systems & Persistence');

  const part1Done = part1Topics.filter(t => completedTopicIds.has(t.id)).length;
  const part2Done = part2Topics.filter(t => completedTopicIds.has(t.id)).length;
  const part3Done = part3Topics.filter(t => completedTopicIds.has(t.id)).length;
  const part4Done = part4Topics.filter(t => completedTopicIds.has(t.id)).length;

  const totalCompleted = completedTopicIds.size;
  const progressPercent = Math.round((totalCompleted / ALL_TOPICS.length) * 100);

  const pillars = [
    {
      part: 'Part 1: Java Core' as PartType,
      label: 'Java Core',
      tag: 'Part 1',
      subtitle: 'Zero to Production',
      description: 'Foundations, Object-Oriented Architecture, Virtual Threads (Loom), Concurrency & JVM Internals.',
      icon: Code2,
      accentText: 'text-sky-500 dark:text-sky-400',
      accentBg: 'bg-sky-500/10 dark:bg-sky-500/15',
      accentBorder: 'border-sky-500/20 dark:border-sky-500/30',
      hoverBorder: 'hover:border-sky-500/50',
      glow: 'shadow-sky-500/10',
      topics: part1Topics,
      sections: part1Sections,
      doneCount: part1Done,
      capstoneTitle: 'High-Throughput Multi-Tenant Financial Transaction Engine',
      capstoneHighlights: 'Virtual Threads, Sealed Records, Lock-Free Memory RingBuffer, SHA-256 Ledger, NIO.2 File Channels.'
    },
    {
      part: 'Part 2: Java EE & Jakarta EE' as PartType,
      label: 'Jakarta EE',
      tag: 'Part 2',
      subtitle: 'Enterprise Web Stack',
      description: 'javax to jakarta migration, Tomcat 10.1+ Containers, Servlets, Filters, Sessions, JSP & MVC.',
      icon: Server,
      accentText: 'text-indigo-600 dark:text-indigo-400',
      accentBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
      accentBorder: 'border-indigo-500/20 dark:border-indigo-500/30',
      hoverBorder: 'hover:border-indigo-500/50',
      glow: 'shadow-indigo-500/10',
      topics: part2Topics,
      sections: part2Sections,
      doneCount: part2Done,
      capstoneTitle: 'Enterprise Multi-Tier E-Commerce Core & Banking Gateway',
      capstoneHighlights: 'Front Controller Servlet, CSRF Security Filter Chain, HikariCP Pooling, JPA ORM, and JAX-RS REST.'
    },
    {
      part: 'Part 3: Spring Boot & Production Stack' as PartType,
      label: 'Spring Boot',
      tag: 'Part 3',
      subtitle: 'Cloud-Native Distributed Stack',
      description: 'Spring 6, Inversion of Control, Auto-Configuration, REST Web MVC, Spring Data JPA, Security 6 & Kafka.',
      icon: Leaf,
      accentText: 'text-emerald-600 dark:text-emerald-400',
      accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      accentBorder: 'border-emerald-500/20 dark:border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-500/50',
      glow: 'shadow-emerald-500/10',
      topics: part3Topics,
      sections: part3Sections,
      doneCount: part3Done,
      capstoneTitle: 'Cloud-Native Distributed Fintech Payment Gateway Microservice',
      capstoneHighlights: 'Spring Boot 3, Stateless JWT & RBAC, Multi-Tier Caching (Caffeine + Redis), Resilience4j & Kafka Streaming.'
    },
    {
      part: 'Part 4: Database Systems & Persistence' as PartType,
      label: 'Database Systems',
      tag: 'Part 4',
      subtitle: 'SQL & NoSQL Persistence',
      description: 'Relational vs Document paradigms, MySQL & phpMyAdmin, DDL/DML, MongoDB Compass, MQL & Polyglot Spring Data.',
      icon: Database,
      accentText: 'text-amber-600 dark:text-amber-400',
      accentBg: 'bg-amber-500/10 dark:bg-amber-500/15',
      accentBorder: 'border-amber-500/20 dark:border-amber-500/30',
      hoverBorder: 'hover:border-amber-500/50',
      glow: 'shadow-amber-500/10',
      topics: part4Topics,
      sections: part4Sections,
      doneCount: part4Done,
      capstoneTitle: 'Polyglot Multi-Model Persistence Hub',
      capstoneHighlights: 'MySQL Relational Schema + MongoDB Document Store, Aggregation Pipelines, and Transactional Consistency.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-12 text-left">
      
      {/* Sleek Hero Section */}
      <section className="relative text-center space-y-6 max-w-4xl mx-auto pt-2 sm:pt-4">
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80 shadow-xs backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wide">Production-Grade Reference Standard</span>
          <span className="text-zinc-400 dark:text-zinc-500">·</span>
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">Java 8 to 26 LTS</span>
        </div>

        {/* Clean Hero Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            The Modern Developer Handbook for{' '}
            <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Java, Spring &amp; Distributed Systems
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans">
            A comprehensive, offline-first technical handbook engineered for software developers. Features verified syntax, real-world lookup tables, interactive output traces, and production architecture patterns.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onSelectTopic(ALL_TOPICS[0]?.id || 'topic-01')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Start Learning ({ALL_TOPICS[0]?.title || 'Topic 01'})</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          {onOpenCapstone && (
            <button
              type="button"
              onClick={() => onOpenCapstone('Part 1: Java Core')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-800/90 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold border border-zinc-200 dark:border-zinc-700 shadow-xs transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-sky-500" />
              <span>Capstone Projects</span>
            </button>
          )}

          {onOpenKnowledgeBase && (
            <button
              type="button"
              onClick={onOpenKnowledgeBase}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800/90 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold border border-zinc-200 dark:border-zinc-700 shadow-xs transition-all cursor-pointer"
            >
              <Brain className="w-4 h-4 text-blue-500" />
              <span>My Knowledge Base</span>
            </button>
          )}

          {onOpenCertificate && (
            <button
              type="button"
              onClick={onOpenCertificate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-medium border border-zinc-200/80 dark:border-zinc-700/60 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Certificate</span>
            </button>
          )}
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 text-center shadow-xs">
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {ALL_TOPICS.length}
            </div>
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
              Verified Topics
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 text-center shadow-xs">
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {SECTIONS.length}
            </div>
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
              Curriculum Sections
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 text-center shadow-xs">
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              4
            </div>
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
              Production Capstones
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 text-center shadow-xs">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              100%
            </div>
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
              Offline-First Ready
            </div>
          </div>
        </div>
      </section>

      {/* Course Announcements Banner (Clean & Non-Intrusive) */}
      {broadcasts && broadcasts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Course Announcement
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                  {broadcasts.length} {broadcasts.length === 1 ? 'Notice' : 'Notices'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {broadcasts[0].title}
              </h3>
              {broadcasts[0].content && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 mt-0.5">
                  {broadcasts[0].content}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenBroadcasts}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Curriculum Four Pillars (Interactive Tabs & Overview) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Curriculum Architecture
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Structured into 4 progressive pillars from core foundations to distributed cloud production.
            </p>
          </div>

          {/* Overall Progress Micro-Widget */}
          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/80 px-3.5 py-2 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {totalCompleted} / {ALL_TOPICS.length} Topics
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">
                {progressPercent}% Complete
              </div>
            </div>
            <div className="w-16 bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar) => {
            const IconComp = pillar.icon;
            const isSelected = activeTabPart === pillar.part;
            const completionRatio = Math.round((pillar.doneCount / pillar.topics.length) * 100);

            return (
              <div
                key={pillar.part}
                onClick={() => setActiveTabPart(pillar.part)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `bg-white dark:bg-zinc-800/90 ${pillar.accentBorder} ring-2 ring-blue-500/20 shadow-md`
                    : 'bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${pillar.accentBg} ${pillar.accentText}`}>
                      {pillar.tag}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {pillar.doneCount}/{pillar.topics.length} done
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${pillar.accentBg} ${pillar.accentText}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {pillar.label}
                      </h3>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {pillar.sections.length} Sections
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
                    <span>Progress</span>
                    <span>{completionRatio}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${completionRatio}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pillar Content & Sections Showcase */}
        {(() => {
          const selectedPillar = pillars.find(p => p.part === activeTabPart) || pillars[0];
          const IconComponent = selectedPillar.icon;

          return (
            <div className="mt-8 space-y-6 p-6 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
              
              {/* Selected Pillar Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedPillar.accentBg} ${selectedPillar.accentText}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${selectedPillar.accentText}`}>
                        {selectedPillar.tag} Overview
                      </span>
                      <span className="text-xs text-zinc-400">·</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        {selectedPillar.topics.length} Topics in {selectedPillar.sections.length} Sections
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedPillar.part} ({selectedPillar.subtitle})
                    </h3>
                  </div>
                </div>

                {onOpenCapstone && (
                  <button
                    type="button"
                    onClick={() => onOpenCapstone(selectedPillar.part)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Launch Part Capstone</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                )}
              </div>

              {/* Capstone Spotlight Banner for this Pillar */}
              <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-sky-500" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      {selectedPillar.tag} Capstone Project
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedPillar.capstoneTitle}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {selectedPillar.capstoneHighlights}
                  </p>
                </div>

                {onOpenCapstone && (
                  <button
                    type="button"
                    onClick={() => onOpenCapstone(selectedPillar.part)}
                    className="shrink-0 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Open Project Spec</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Grid of Sections for the Selected Pillar */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPillar.sections.map((section) => {
                  const sectionTopics = ALL_TOPICS.filter(t => t.sectionNumber === section.sectionNumber);
                  const completedCount = sectionTopics.filter(t => completedTopicIds.has(t.id)).length;
                  const isAllDone = sectionTopics.length > 0 && completedCount === sectionTopics.length;

                  return (
                    <div
                      key={section.sectionNumber}
                      className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                            Section {section.sectionNumber}
                          </span>
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isAllDone
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                          }`}>
                            {isAllDone && <Check className="w-3 h-3 text-emerald-500" />}
                            <span>{completedCount}/{sectionTopics.length} done</span>
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                          {section.title}
                        </h4>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {section.description}
                        </p>
                      </div>

                      {/* Topic Jump Links */}
                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1">
                        {sectionTopics.slice(0, 4).map(topic => {
                          const isDone = completedTopicIds.has(topic.id);
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => onSelectTopic(topic.id)}
                              className="w-full flex items-center justify-between text-xs py-1 text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left cursor-pointer group/btn"
                            >
                              <span className="truncate pr-2 flex items-center gap-1.5">
                                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                                <span className={isDone ? 'text-zinc-400 dark:text-zinc-500' : 'font-medium'}>
                                  {topic.title}
                                </span>
                              </span>
                              <ArrowRight className="w-3 h-3 shrink-0 opacity-40 group-hover/btn:opacity-100" />
                            </button>
                          );
                        })}

                        {sectionTopics.length > 4 && (
                          <div className="text-[11px] text-zinc-400 pt-1 font-mono">
                            + {sectionTopics.length - 4} more topics in this section
                          </div>
                        )}
                        {sectionTopics.length === 0 && (
                          <div className="text-[11px] text-zinc-400 italic">
                            Modules in active curriculum queue...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })()}
      </section>

      {/* Real-World Capstone Projects Matrix */}
      {onOpenCapstone && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Production Capstone Engineering Matrix
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                4 end-to-end practical architectures designed to validate senior-level competency.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.part}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs flex flex-col justify-between transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${pillar.accentBg} ${pillar.accentText}`}>
                      {pillar.tag} Capstone
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      JDK 26 Verified
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {pillar.capstoneTitle}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                    {pillar.capstoneHighlights}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">
                    {pillar.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenCapstone(pillar.part)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>View Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Official Mastery Certificate Credential Banner (Prestigious & Clean) */}
      {onOpenCertificate && (
        <section className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-md">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Official Certificate of Completion &amp; Mastery
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Verifiable
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-2xl leading-relaxed">
                  Earned upon mastering curriculum modules across Java Core (Java 8–26 LTS), Jakarta EE (Tomcat 10.1+), and Spring Boot 3+. Includes exportable PDF and cryptographic JSON verification.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenCertificate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Certificate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Global Author & Architecture Accreditation Footer */}
      <footer className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Engineered &amp; Curated by Mohamed Khaled Farag
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
              Curriculum Direction &amp; Lead Systems Architecture · 100% Offline-First Reference
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/mk-farag/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 border border-[#0077b5]/30 transition-colors"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href="mailto:mohammedkhaled.fa@gmail.com"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>mohammedkhaled.fa@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="text-[11px] text-zinc-400 text-center sm:text-left pt-2 font-sans flex flex-wrap items-center justify-between gap-2">
          <span>The Definitive SOA Java Handbook · Zero to Production Reference Standard</span>
          <span className="font-mono">JDK 26 LTS · Tomcat 10.1+ · 160 Automated Tests Passed</span>
        </div>
      </footer>

    </div>
  );
};
