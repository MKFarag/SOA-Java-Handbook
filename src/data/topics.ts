import type { TopicDetail, SectionMeta, PartType } from '../types';
import rawTopics from './generated-topics.json';
import rawSections from './generated-sections.json';

export const ALL_TOPICS: TopicDetail[] = rawTopics as unknown as TopicDetail[];
export const SECTIONS: SectionMeta[] = rawSections as unknown as SectionMeta[];

export const MAIN_SECTIONS: { part: PartType; label: string; shortLabel: string }[] = [
  { part: 'Part 1: Java Core', label: 'Java Core', shortLabel: 'Java' },
  { part: 'Part 2: Java EE & Jakarta EE', label: 'Jakarta EE', shortLabel: 'EE' },
  { part: 'Part 3: Spring Boot & Production Stack', label: 'Spring Boot', shortLabel: 'Spring' },
  { part: 'Part 4: Database Systems & Persistence', label: 'Database Systems', shortLabel: 'Database' }
];

export function getTopicById(id: string): TopicDetail | undefined {
  return ALL_TOPICS.find(t => t.id === id);
}

export function getTopicBySlug(slug: string): TopicDetail | undefined {
  return ALL_TOPICS.find(t => t.slug === slug);
}

/**
 * Map of legacy topic IDs and slugs from earlier curriculum iterations (e.g. 134-topic era)
 * to their permanent consolidated or renumbered destinations in the 127-topic architecture.
 */
export const CURRENT_TOPIC_IDS = new Set(ALL_TOPICS.map(t => t.id));

export const REBUILD_TIMESTAMP_MS = new Date('2026-11-21T19:32:50.000Z').getTime();

// Unambiguous legacy IDs that never exist in the 130-topic curriculum
export const LEGACY_ONLY_IDS = new Set([
  'topic-131-legacy', 'topic-132', 'topic-133', 'topic-134'
]);

// Single-pass, unchained old -> new mapping for stored profile bookmarks
export const OLD_TO_NEW_TOPIC_MAP: Record<string, string> = {
  'topic-131-legacy': 'topic-120',
  'topic-132': 'topic-130',
  'topic-133': 'topic-129',
  'topic-134': 'topic-130'
};

export const RETIRED_MICROSERVICE_IDS = new Set([
  'topic-120-legacy', 'topic-121-legacy', 'topic-122-legacy', 'topic-123-legacy', 'topic-124-legacy',
  'topic-125-legacy', 'topic-126-legacy', 'topic-127-legacy', 'topic-128-legacy', 'topic-129-legacy'
]);

export const LEGACY_TOPIC_ALIASES: Record<string, string> = {
  // Merged JSP & Presentation topics
  'jsp-implicit-objects-and-standard-actions': 'topic-77',
  'jsp-syntax-elements': 'topic-77',
  'custom-jsp-tag-libraries': 'topic-78',
  'error-pages-and-exception-handling': 'topic-80',

  // Database 134-era mappings
  'topic-130-legacy': 'topic-129',
  'topic-131-legacy': 'topic-120',
  'topic-132': 'topic-130',
  'topic-133': 'topic-129',
  'topic-134': 'topic-130',
  'java-mongodb-persistence-spring-data-properties': 'topic-130',
  'mongodb-document-store-compass-queries': 'topic-129',
  'java-mysql-persistence-spring-data-properties': 'topic-130',
  'mysql-fundamentals-queries-xampp': 'topic-120',
  'sql-vs-nosql-architecture-tradeoffs': 'topic-128',

  // Pruned Cloud/Microservices slugs (gracefully redirected to relevant core backend topics)
  'service-discovery-registration-eureka-consul': 'topic-87',
  'api-gateway-spring-cloud-gateway': 'topic-91',
  'centralized-configuration-spring-cloud-config': 'topic-90',
  'declarative-rest-clients-feign-restclient': 'topic-91',
  'distributed-tracing-micrometer-opentelemetry-zipkin': 'topic-103',
  'kafka-resilience-retryable-topics-dlt': 'topic-107',
  'transactional-outbox-pattern-cdc-debezium': 'topic-96',
  'distributed-transactions-saga-pattern': 'topic-96',
  'production-dockerization-layered-jars': 'topic-89',
  'graalvm-native-image-aot-compilation': 'topic-89'
};

/**
 * Versioned profile migration: sanitizes stored completed & saved topics
 */
export function migrateProfileData(profile: any): any {
  if (!profile) return profile;
  if (profile.schemaVersion && profile.schemaVersion >= 2) {
    const sanitizedCompleted = Array.from(new Set(
      (profile.completedTopics || []).filter((id: string) => CURRENT_TOPIC_IDS.has(id))
    ));
    const sanitizedSaved = Array.from(new Set(
      (profile.savedTopics || []).filter((id: string) => CURRENT_TOPIC_IDS.has(id))
    ));
    return {
      ...profile,
      completedTopics: sanitizedCompleted,
      completedCount: sanitizedCompleted.length,
      savedTopics: sanitizedSaved,
      certificateUnlocked: sanitizedCompleted.length === ALL_TOPICS.length
    };
  }

  const rawCompleted: string[] = profile.completedTopics || [];
  const rawSaved: string[] = profile.savedTopics || [];

  const hasLegacyOnlyIds = rawCompleted.concat(rawSaved).some(id => LEGACY_ONLY_IDS.has(id));
  const isPreRebuildTimestamp = profile.lastActive && (new Date(profile.lastActive).getTime() < REBUILD_TIMESTAMP_MS);
  const isOldEra = hasLegacyOnlyIds || Boolean(isPreRebuildTimestamp);

  const migrateList = (list: string[]) => {
    const result = new Set<string>();
    for (const id of list) {
      if (isOldEra) {
        if (RETIRED_MICROSERVICE_IDS.has(id)) {
          // Drop retired microservices
          continue;
        }
        const mappedId = OLD_TO_NEW_TOPIC_MAP[id] || id;
        if (CURRENT_TOPIC_IDS.has(mappedId)) {
          result.add(mappedId);
        }
      } else {
        const mappedId = (LEGACY_ONLY_IDS.has(id) && OLD_TO_NEW_TOPIC_MAP[id]) ? OLD_TO_NEW_TOPIC_MAP[id] : id;
        if (CURRENT_TOPIC_IDS.has(mappedId)) {
          result.add(mappedId);
        }
      }
    }
    return Array.from(result);
  };

  const migratedCompleted = migrateList(rawCompleted);
  const migratedSaved = migrateList(rawSaved);

  return {
    ...profile,
    schemaVersion: 2,
    completedTopics: migratedCompleted,
    completedCount: migratedCompleted.length,
    savedTopics: migratedSaved,
    certificateUnlocked: migratedCompleted.length === ALL_TOPICS.length
  };
}

export function resolveTopic(identifier: string): TopicDetail | undefined {
  if (!identifier) return undefined;

  // Clean leading '#', '/', whitespace and decode URI components
  let clean = '';
  try {
    clean = decodeURIComponent(identifier).trim().replace(/^[#/]+/, '').replace(/\.md$/, '').toLowerCase();
  } catch {
    clean = identifier.trim().replace(/^[#/]+/, '').replace(/\.md$/, '').toLowerCase();
  }
  if (!clean) return undefined;

  // 1. Direct ID match (case-insensitive)
  const byId = ALL_TOPICS.find(t => t.id.toLowerCase() === clean);
  if (byId) return byId;

  // 2. Direct Slug match (case-insensitive)
  const bySlug = ALL_TOPICS.find(t => t.slug.toLowerCase() === clean);
  if (bySlug) return bySlug;

  // 2b. Legacy Alias check for relocated/renumbered/merged topics
  if (LEGACY_TOPIC_ALIASES[clean]) {
    const targetId = LEGACY_TOPIC_ALIASES[clean];
    const target = ALL_TOPICS.find(t => t.id === targetId);
    if (target) return target;
  }
  if (LEGACY_TOPIC_ALIASES[`topic-${clean}`]) {
    const targetId = LEGACY_TOPIC_ALIASES[`topic-${clean}`];
    const target = ALL_TOPICS.find(t => t.id === targetId);
    if (target) return target;
  }

  // 3. Match "topic-{number}" or "t-{number}" or "topic{number}" with any digit count
  const topicNumMatch = clean.match(/^(?:topic|t)[-_]?(\d+)$/i);
  if (topicNumMatch) {
    const num = parseInt(topicNumMatch[1], 10);
    const byNum = ALL_TOPICS.find(t => t.topicNumber === num);
    if (byNum) return byNum;
  }

  // 4. Pure numeric string ("1", "01", "67", "120")
  if (/^\d+$/.test(clean)) {
    const num = parseInt(clean, 10);
    const byNum = ALL_TOPICS.find(t => t.topicNumber === num);
    if (byNum) return byNum;
  }

  // 5. Filename-style slug: "{number}-{slug}" e.g. "01-what-is-programming"
  const filePrefixMatch = clean.match(/^(\d{1,3})[-_](.+)$/);
  if (filePrefixMatch) {
    const num = parseInt(filePrefixMatch[1], 10);
    const strippedSlug = filePrefixMatch[2];
    const byStrippedSlug = ALL_TOPICS.find(t => t.slug.toLowerCase() === strippedSlug);
    if (byStrippedSlug) return byStrippedSlug;
    const byNum = ALL_TOPICS.find(t => t.topicNumber === num);
    if (byNum && (byNum.slug.toLowerCase() === strippedSlug || byNum.slug.toLowerCase().startsWith(strippedSlug))) {
      return byNum;
    }
  }

  // 6. Descriptive prefix: "topic 01: ..." or "topic 1 - ..."
  const topicPrefixMatch = clean.match(/^topic\s+(\d+)/i);
  if (topicPrefixMatch) {
    const num = parseInt(topicPrefixMatch[1], 10);
    const byNum = ALL_TOPICS.find(t => t.topicNumber === num);
    if (byNum) return byNum;
  }

  return undefined;
}
