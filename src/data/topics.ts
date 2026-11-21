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
export const LEGACY_TOPIC_ALIASES: Record<string, string> = {
  // Merged JSP & Presentation topics
  'topic-75-legacy': 'topic-74',
  'topic-76': 'topic-74',
  'jsp-implicit-objects-and-standard-actions': 'topic-74',
  'jsp-syntax-elements': 'topic-74',
  'topic-77': 'topic-75',
  'topic-78': 'topic-75',
  'custom-jsp-tag-libraries': 'topic-75',
  'topic-81': 'topic-80',
  'error-pages-and-exception-handling': 'topic-80',

  // Database 134-era mappings
  'topic-130-legacy': 'topic-129',
  'topic-131-legacy': 'topic-120',
  'topic-132': 'topic-131',
  'topic-133': 'topic-130',
  'topic-134': 'topic-131',
  'java-mongodb-persistence-spring-data-properties': 'topic-131',
  'mongodb-document-store-compass-queries': 'topic-130',
  'java-mysql-persistence-spring-data-properties': 'topic-131',
  'mysql-fundamentals-queries-xampp': 'topic-120',
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
