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
