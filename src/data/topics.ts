import type { TopicDetail, SectionMeta, PartType } from '../types';
import rawTopics from './generated-topics.json';
import rawSections from './generated-sections.json';

export const ALL_TOPICS: TopicDetail[] = rawTopics as unknown as TopicDetail[];
export const SECTIONS: SectionMeta[] = rawSections as unknown as SectionMeta[];

export const MAIN_SECTIONS: { part: PartType; label: string; shortLabel: string }[] = [
  { part: 'Part 1: Java Core', label: 'Java Core', shortLabel: 'Java' },
  { part: 'Part 2: Java EE & Jakarta EE', label: 'Jakarta EE', shortLabel: 'EE' },
  { part: 'Part 3: Spring Boot & Production Stack', label: 'Spring Boot', shortLabel: 'Spring' },
  { part: 'Part 4: Database Systems & Persistence', label: 'Database Systems', shortLabel: 'Database' },
  { part: 'Part 5: ACE & MQ', label: 'ACE & MQ', shortLabel: 'ACE & MQ' }
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
  'graalvm-native-image-aot-compilation': 'topic-89',

  // ACE & MQ Legacy Aliases (Redirect 44-topic and 91-topic slugs to renumbered 131-239 topics)
  'scenario-start-everything-from-scratch': 'topic-196',
  'scenario-receive-json-transform-send': 'topic-155',
  'scenario-troubleshoot-and-fix': 'topic-173',
  'bip-codes-reference-directory': 'topic-239',
  'real-session-startup-walkthrough': 'topic-196',
  'mqsiprofile-and-command-console': 'topic-194',
  'mq-queue-manager-commands': 'topic-220',
  'runmqsc-and-mqsc-reference': 'topic-217',
  'mq-test-tools-amqsput-amqsget': 'topic-230',
  'mqsilist-inspecting-nodes-servers': 'topic-197',
  'mqsistart-and-mqsistop': 'topic-199',
  'mqsicreatebroker-and-deletebroker': 'topic-198',
  'integration-servers-execution-groups': 'topic-202',
  'bar-packaging-and-deployment': 'topic-208',
  'message-flow-control-commands': 'topic-211',
  'reading-and-changing-properties': 'topic-200',
  'troubleshooting-with-trace-and-logs': 'topic-214',
  'commands-cheat-sheet': 'topic-216',
  'what-is-ibm-mq-and-ace': 'topic-167',
  'key-words-and-glossary': 'topic-134',
  'runtime-architecture-on-the-machine': 'topic-133',
  'life-of-a-message-through-a-flow': 'topic-142',
  'terminals-and-message-routing': 'topic-143',
  'the-compute-node-overview': 'topic-151',
  'what-is-esql-and-where-does-it-run': 'topic-174',
  'the-compute-node-anatomy-and-properties': 'topic-151',
  'the-message-tree-architecture': 'topic-175',
  'reading-a-field-path-decoding-json': 'topic-177',
  'writing-to-outputroot-four-ways': 'topic-178',
  'variables-data-types-and-constants': 'topic-176',
  'operators-and-conditions': 'topic-181',
  'loops-while-for-repeat': 'topic-181',
  'references-and-move': 'topic-182',
  'working-with-arrays-and-lists': 'topic-183',
  'creating-changing-and-deleting-fields': 'topic-178',
  'built-in-functions': 'topic-179',
  'cast-and-type-conversion': 'topic-180',
  'select-on-the-message-tree': 'topic-188',
  'custom-functions-and-procedures': 'topic-185',
  'environment-and-localenvironment': 'topic-186',
  'error-handling-and-exceptionlist': 'topic-189',
  'propagate-and-terminal-control': 'topic-187',
  'database-access-from-esql': 'topic-188',
  'link-a-node-to-a-queue-manager': 'topic-168',
  'which-mq-node-do-i-use': 'topic-154',
  'connect-by-queue-manager-name': 'topic-169',
  'connect-by-policy': 'topic-170',
  'name-or-policy-decision': 'topic-171',
  'local-vs-remote-queue-manager': 'topic-172',
  'workflow-when-to-use-what': 'topic-148',
  'open-runmqsc': 'topic-217',
  'create-a-queue-manager': 'topic-219',
  'start-a-queue-manager': 'topic-220',
  'stop-a-queue-manager': 'topic-220',
  'delete-a-queue-manager': 'topic-220',
  'list-queue-managers-and-status': 'topic-221',
  'show-mq-version': 'topic-221',
  'define-a-queue': 'topic-222',
  'display-queues': 'topic-223',
  'check-queue-depth-and-status': 'topic-225',
  'alter-a-queue': 'topic-223',
  'clear-a-queue': 'topic-224',
  'delete-a-queue': 'topic-224',
  'define-and-start-a-listener': 'topic-227',
  'check-a-channel': 'topic-228',
  'put-a-test-message': 'topic-230',
  'get-a-test-message': 'topic-231',
  'browse-queue-messages': 'topic-232',
  'open-ace-command-console': 'topic-194',
  'fix-command-not-recognized': 'topic-195',
  'list-nodes-and-status': 'topic-197',
  'create-an-integration-node': 'topic-198',
  'start-an-integration-node': 'topic-199',
  'stop-an-integration-node': 'topic-199',
  'delete-an-integration-node': 'topic-198',
  'change-node-settings': 'topic-201',
  'create-an-integration-server': 'topic-203',
  'delete-an-integration-server': 'topic-205',
  'create-a-bar-file': 'topic-208',
  'deploy-a-bar-file': 'topic-210',
  'read-a-bar-file': 'topic-209',
  'start-a-message-flow': 'topic-211',
  'stop-a-message-flow': 'topic-211',
  'read-runtime-trace-and-logs': 'topic-214',
  'turn-trace-on-and-off': 'topic-213',
  'commands-summary-cheat-sheet': 'topic-216',
  'bip-codes-reference': 'topic-239',
  'sql-server-odbc-setup': 'topic-236',
  'which-transformation-node': 'topic-149',
  'which-transport-protocol': 'topic-148',
  'routing-nodes-route-vs-filter': 'topic-163',
  'floworder-node-and-execution-order': 'topic-147',
  'error-handling-in-flows': 'topic-146',
  'subflows-when-and-how-to-modularize': 'topic-138',
  'common-flow-patterns-cheat-sheet': 'topic-148',
  'start-an-integration-server': 'topic-204',
  'stop-an-integration-server': 'topic-204',
  'run-an-independent-integration-server': 'topic-206',
  'configure-integration-server-yaml': 'topic-207',
  'message-domains-and-parsing': 'topic-144',
  'reparse-with-resetcontentdescriptor': 'topic-153',
  'fileinput-node-batch-processing': 'topic-161'
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
