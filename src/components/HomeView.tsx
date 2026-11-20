import { 
  Coffee, 
  Layers, 
  Server, 
  Leaf,
  Database,
  ArrowRight,
  Award,
  Trophy,
  ExternalLink,
  Mail,
  ShieldCheck,
  Megaphone
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
  broadcasts?: BroadcastItem[];
  onOpenBroadcasts?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTopic,
  completedTopicIds,
  onOpenCertificate,
  onOpenCapstone,
  broadcasts,
  onOpenBroadcasts
}) => {
  const part1Sections = SECTIONS.filter(s => s.part === 'Part 1: Java Core');
  const part2Sections = SECTIONS.filter(s => s.part === 'Part 2: Java EE & Jakarta EE');
  const part3Sections = SECTIONS.filter(s => s.part === 'Part 3: Spring Boot & Production Stack');
  const part4Sections = SECTIONS.filter(s => s.part === 'Part 4: Database Systems & Persistence');

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12 text-left">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
          <Coffee className="w-3.5 h-3.5" />
          <span>Offline-First Interactive Reference</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          The Definitive SOA &amp; Java Handbook
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
          Built from absolute zero for beginners and modern reference engineers. Every topic strictly follows our 11-step depth standard with runnable, locally verified code. Runs 100% offline.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            Java 8 through 26 LTS
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            Jakarta EE 10 &amp; 11
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            Tomcat 10.1+ Verified
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            Zero CDN Runtime Dependencies
          </span>
        </div>
      </div>

      {/* Course Announcements & Shared Resources Banner */}
      {broadcasts && broadcasts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Course Announcements & Resources
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-700 dark:text-orange-300">
                  {broadcasts.length} {broadcasts.length === 1 ? 'Update' : 'Updates'}
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
            className="shrink-0 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>View All ({broadcasts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Part 1: Java Core Section Cards */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <Layers className="w-5 h-5 text-orange-500" />
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Part 1: Java Core (Zero to Production)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Foundations, Object-Oriented Programming, Modern Features, Concurrency, and JVM Internals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {part1Sections.map(section => {
            const sectionTopics = ALL_TOPICS.filter(t => t.sectionNumber === section.sectionNumber);
            const completedCount = sectionTopics.filter(t => completedTopicIds.has(t.id)).length;

            return (
              <div
                key={section.sectionNumber}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] hover:border-orange-500/50 transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400">
                      Section {section.sectionNumber}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {completedCount}/{sectionTopics.length} done
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors">
                    {section.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
                  {sectionTopics.slice(0, 3).map(topic => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => onSelectTopic(topic.id)}
                      className="w-full flex items-center justify-between text-xs py-1 text-zinc-600 dark:text-zinc-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors text-left"
                    >
                      <span className="truncate pr-2 font-medium">{topic.title}</span>
                      <ArrowRight className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100" />
                    </button>
                  ))}
                  {sectionTopics.length > 3 && (
                    <div className="text-[11px] text-zinc-400 pt-1">
                      + {sectionTopics.length - 3} more topics in this section
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Part 1 Capstone Challenge Banner */}
        {onOpenCapstone && (
          <div className="p-5 rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Part 1 Capstone Project · Real-World Engine
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                High-Throughput Multi-Tenant Financial Transaction Engine
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Virtual Threads (Loom), Sealed Records &amp; Pattern Matching, Lock-Free Memory RingBuffer, SHA-256 Audit Ledger, and NIO.2 File Channels.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenCapstone('Part 1: Java Core')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <span>Launch Capstone</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Part 2: Java EE & Jakarta EE Section Cards */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <Server className="w-5 h-5 text-sky-500" />
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Part 2: Java EE &amp; Jakarta EE (Web Architecture)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              The javax to jakarta migration, Tomcat Web Containers, Servlets, Filters, Sessions, JSP, MVC, and Enterprise Stack.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {part2Sections.map(section => {
            const sectionTopics = ALL_TOPICS.filter(t => t.sectionNumber === section.sectionNumber);
            const completedCount = sectionTopics.filter(t => completedTopicIds.has(t.id)).length;

            return (
              <div
                key={section.sectionNumber}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] hover:border-sky-500/50 transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400">
                      Section {section.sectionNumber}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {completedCount}/{sectionTopics.length} done
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-500 transition-colors">
                    {section.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
                  {sectionTopics.slice(0, 3).map(topic => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => onSelectTopic(topic.id)}
                      className="w-full flex items-center justify-between text-xs py-1 text-zinc-600 dark:text-zinc-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors text-left"
                    >
                      <span className="truncate pr-2 font-medium">{topic.title}</span>
                      <ArrowRight className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100" />
                    </button>
                  ))}
                  {sectionTopics.length > 3 && (
                    <div className="text-[11px] text-zinc-400 pt-1">
                      + {sectionTopics.length - 3} more topics in this section
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Part 2 Capstone Challenge Banner */}
        {onOpenCapstone && (
          <div className="p-5 rounded-xl border border-sky-500/30 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-sky-500" />
                <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  Part 2 Capstone Project · Enterprise Web Stack
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Enterprise Multi-Tier E-Commerce Core &amp; Banking Gateway
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Front Controller Servlet, Security Filter Chain (CSRF &amp; Session Guard), HikariCP Lifecycle, JPA Entity ORM, and JAX-RS REST.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenCapstone('Part 2: Java EE & Jakarta EE')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <span>Launch Capstone</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Part 3: Spring Boot & Production Stack Section Cards */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <Leaf className="w-5 h-5 text-emerald-500" />
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Part 3: Spring Boot &amp; The Modern Production Ecosystem
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Spring Core IoC, Auto-Configuration, REST Web MVC, Spring Data JPA, Spring Security 6, Observability, and Kafka.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {part3Sections.map(section => {
            const sectionTopics = ALL_TOPICS.filter(t => t.sectionNumber === section.sectionNumber);
            const completedCount = sectionTopics.filter(t => completedTopicIds.has(t.id)).length;

            return (
              <div
                key={section.sectionNumber}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Section {section.sectionNumber}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {completedCount}/{sectionTopics.length} done
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                    {section.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
                  {sectionTopics.slice(0, 3).map(topic => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => onSelectTopic(topic.id)}
                      className="w-full flex items-center justify-between text-xs py-1 text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer"
                    >
                      <span className="truncate pr-2 font-medium">{topic.title}</span>
                      <ArrowRight className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100" />
                    </button>
                  ))}
                  {sectionTopics.length > 3 && (
                    <div className="text-[11px] text-zinc-400 pt-1">
                      + {sectionTopics.length - 3} more topics in this section
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

        {/* Part 3 Capstone Challenge Banner */}
        {onOpenCapstone && (
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Part 3 Capstone Project · Cloud-Native Distributed Stack
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Cloud-Native Distributed Fintech Payment Gateway Microservice
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Spring Boot 3, Stateless JWT &amp; Method Security RBAC, Multi-Tier Caching (Caffeine + Redis), Resilience4j Circuit Breakers, and Kafka Streaming.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenCapstone('Part 3: Spring Boot & Production Stack')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <span>Launch Capstone</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Part 4: Database Systems & Persistence Section Cards */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <Database className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Part 4: Database Systems &amp; Persistence (SQL &amp; NoSQL)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Relational vs Document Paradigms, MySQL with XAMPP/phpMyAdmin, DDL/DML, Joins, Spring Data JPA Properties, MongoDB Compass, MQL, Aggregations, and Spring Data MongoDB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {part4Sections.map(section => {
            const sectionTopics = ALL_TOPICS.filter(t => t.sectionNumber === section.sectionNumber);
            const completedCount = sectionTopics.filter(t => completedTopicIds.has(t.id)).length;

            return (
              <div
                key={section.sectionNumber}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      Section {section.sectionNumber}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {completedCount}/{sectionTopics.length} done
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                    {section.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
                  {sectionTopics.map(topic => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => onSelectTopic(topic.id)}
                      className="w-full flex items-center justify-between text-xs py-1 text-zinc-600 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors text-left cursor-pointer"
                    >
                      <span className="truncate pr-2 font-medium">{topic.title}</span>
                      <ArrowRight className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Completion Certificate Banner */}
      {onOpenCertificate && (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Official Certificate of Completion &amp; Mastery
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Verifiable
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed">
                Awarded upon mastering all 108 curriculum modules across Core Java (Java 8–26 LTS), Jakarta EE (Tomcat 10.1+), and Spring Boot 3+. Includes exportable PDF and JSON credentials.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCertificate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20 transition-all shrink-0 hover:scale-[1.02]"
          >
            <span>View Certificate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Author & Architecture Accreditation Footer */}
      <footer className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>mohammedkhaled.fa@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="text-[11px] text-zinc-400 text-center sm:text-left pt-2 font-sans flex flex-wrap items-center justify-between gap-2">
          <span>The Definitive SOA &amp; Java Handbook · Zero to Production Reference Standard</span>
          <span className="font-mono">JDK 26 LTS · Tomcat 10.1+ · 160 Automated Tests Passed</span>
        </div>
      </footer>

    </div>
  );
};
