import type { TopicDetail, SectionMeta } from '../types';
import rawTopics from './generated-topics.json';
import rawSections from './generated-sections.json';

export const ALL_TOPICS: TopicDetail[] = rawTopics as unknown as TopicDetail[];
export const SECTIONS: SectionMeta[] = rawSections as unknown as SectionMeta[];

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

// Unambiguous legacy IDs that never exist in the 127-topic curriculum
export const LEGACY_ONLY_IDS = new Set([
  'topic-76', 'topic-77', 'topic-78', 'topic-81',
  'topic-132', 'topic-133', 'topic-134'
]);

// Single-pass, unchained old -> new mapping
export const OLD_TO_NEW_TOPIC_MAP: Record<string, string> = {
  'topic-75': 'topic-74',
  'topic-76': 'topic-74',
  'topic-77': 'topic-75',
  'topic-78': 'topic-75',
  'topic-81': 'topic-80',
  'topic-130': 'topic-129',
  'topic-131': 'topic-121',
  'topic-132': 'topic-131',
  'topic-133': 'topic-130',
  'topic-134': 'topic-131'
};

export const RETIRED_MICROSERVICE_IDS = new Set([
  'topic-120', 'topic-121', 'topic-122', 'topic-123', 'topic-124',
  'topic-125', 'topic-126', 'topic-127', 'topic-128', 'topic-129'
]);

export const LEGACY_TOPIC_ALIASES: Record<string, string> = {
  // Merged JSP & Presentation topics (unambiguous old IDs)
  'topic-75-legacy': 'topic-74',
  'topic-76': 'topic-74',
  'jsp-implicit-objects-and-standard-actions': 'topic-74',
  'jsp-syntax-elements': 'topic-74',
  'topic-77': 'topic-75',
  'topic-78': 'topic-75',
  'custom-jsp-tag-libraries': 'topic-75',
  'topic-81': 'topic-80',
  'error-pages-and-exception-handling': 'topic-80',

  // Database 134-era unambiguous mappings
  'topic-130-legacy': 'topic-129',
  'topic-131-legacy': 'topic-121',
  'topic-132': 'topic-131',
  'topic-133': 'topic-130',
  'topic-134': 'topic-131',
  'java-mongodb-persistence-spring-data-properties': 'topic-131',
  'mongodb-document-store-compass-queries': 'topic-130',
  'java-mysql-persistence-spring-data-properties': 'topic-131',
  'mysql-fundamentals-queries-xampp': 'topic-121',
  'sql-vs-nosql-architecture-tradeoffs': 'topic-129',

  // Pruned Cloud/Microservices slugs (gracefully redirected to relevant core backend topics)
  'service-discovery-registration-eureka-consul': 'topic-88',
  'api-gateway-spring-cloud-gateway': 'topic-92',
  'centralized-configuration-spring-cloud-config': 'topic-91',
  'declarative-rest-clients-feign-restclient': 'topic-92',
  'distributed-tracing-micrometer-opentelemetry-zipkin': 'topic-104',
  'kafka-resilience-retryable-topics-dlt': 'topic-108',
  'transactional-outbox-pattern-cdc-debezium': 'topic-97',
  'distributed-transactions-saga-pattern': 'topic-97',
  'production-dockerization-layered-jars': 'topic-90',
  'graalvm-native-image-aot-compilation': 'topic-90'
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
