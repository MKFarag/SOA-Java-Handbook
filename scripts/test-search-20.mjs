import fs from 'node:fs';
import MiniSearch from 'minisearch';

const ALL_TOPICS = JSON.parse(fs.readFileSync('src/data/generated-topics.json', 'utf8'));

const ms = new MiniSearch({
  fields: ['id', 'title', 'commandName', 'object', 'action', 'synonyms', 'searchableTerms', 'sectionTitle', 'shortDescription', 'keywords', 'tokens', 'cheatSheetText'],
  storeFields: ['id', 'title', 'slug', 'part', 'sectionNumber', 'sectionTitle', 'shortDescription', 'versionBadge', 'difficulty'],
  tokenize: (text) => {
    const expanded = text.replace(/([a-z])([A-Z])/g, '$1 $2');
    return expanded.split(/[\s,;:!?"'()[\]{}<>/\\+=*&|~^`]+/);
  },
  processTerm: (term, fieldName) => {
    const lower = term.toLowerCase().replace(/^[^\w@]+|[^\w]+$/g, '');
    if (!lower) return null;
    if (fieldName !== undefined) {
      const parts = lower.split(/[@.]/).filter(p => p.length > 0);
      return Array.from(new Set([lower, ...parts]));
    }
    return lower;
  },
  searchOptions: {
    boost: { title: 10, commandName: 10, synonyms: 8, object: 6, action: 5, searchableTerms: 4, id: 3, sectionTitle: 2, shortDescription: 1.5, keywords: 1, tokens: 1, cheatSheetText: 0.8 },
    prefix: true,
    fuzzy: (term) => term.length > 4 ? 0.2 : false
  }
});

const documents = ALL_TOPICS.map(t => {
  const cheatSheetText = t.cheatSheetText 
    || (t.cheatSheet ? `${t.cheatSheet.headers.join(' ')} ${t.cheatSheet.rows.flat().join(' ')}` : '');
  const terms = Array.isArray(t.searchableTerms) ? t.searchableTerms.join(' ') : '';
  const syns = Array.isArray(t.synonyms) ? t.synonyms.join(' ') : (t.synonyms || '');
  return {
    id: t.id,
    title: t.title,
    slug: t.slug,
    part: t.part,
    sectionNumber: t.sectionNumber,
    sectionTitle: t.sectionTitle,
    shortDescription: t.shortDescription,
    versionBadge: t.versionBadge,
    difficulty: t.difficulty,
    commandName: t.commandName || '',
    object: t.object || '',
    action: t.action || '',
    synonyms: syns,
    keywords: `${t.part} ${t.sectionTitle} ${t.whatAndWhy?.definition || ''}`,
    tokens: t.syntaxBreakdown?.tokens?.map(tok => tok.token).join(' ') || '',
    searchableTerms: terms,
    cheatSheetText: cheatSheetText
  };
});

ms.addAll(documents);

function resolveTopic(query) {
  const clean = query.trim().toLowerCase();
  return ALL_TOPICS.find(t => t.id.toLowerCase() === clean || t.slug.toLowerCase() === clean);
}

function executeSearch(rawQuery) {
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];

  const exactTopic = resolveTopic(trimmed);
  const terms = trimmed.split(/\s+/).filter(Boolean);

  let rawResults = [];
  if (terms.length > 1) {
    rawResults = ms.search(trimmed, { combineWith: 'AND' });
    if (rawResults.length === 0) {
      rawResults = ms.search(trimmed, { combineWith: 'OR' });
    }
  } else {
    rawResults = ms.search(trimmed);
  }

  const lowerQuery = trimmed.toLowerCase();
  const scoredList = rawResults.map(r => {
    const topic = ALL_TOPICS.find(t => t.id === r.id);
    let boost = 0;
    let titleMatch = false;
    if (topic) {
      const lowerTitle = topic.title.toLowerCase();
      if (lowerTitle === lowerQuery) {
        boost += 300;
        titleMatch = true;
      } else if (lowerTitle.includes(lowerQuery)) {
        boost += 150;
        titleMatch = true;
      } else if (terms.length > 1 && terms.every(term => lowerTitle.includes(term.toLowerCase()))) {
        boost += 90;
        titleMatch = true;
      }
    }
    return { id: r.id, score: r.score + boost, titleMatch };
  });

  scoredList.sort((a, b) => b.score - a.score);

  let filteredList = scoredList;
  if (filteredList.length > 0) {
    const topScore = filteredList[0].score;
    const cutoff = Math.max(topScore * 0.18, 12);
    filteredList = filteredList.filter(r => r.score >= cutoff);
  }

  let mapped = filteredList.map(r => {
    const topic = ALL_TOPICS.find(t => t.id === r.id);
    return {
      id: topic.id,
      title: topic.title,
      part: topic.part,
      sectionTitle: topic.sectionTitle,
      score: Math.round(r.score * 10) / 10
    };
  }).filter(t => Boolean(t && t.id));

  if (exactTopic && !mapped.some(t => t.id === exactTopic.id)) {
    mapped = [
      { id: exactTopic.id, title: exactTopic.title, part: exactTopic.part, sectionTitle: exactTopic.sectionTitle, score: 999 },
      ...mapped
    ];
  }

  return mapped;
}

const testQueries = [
  { q: 'create node', expected: 'Create an integration node' },
  { q: 'start node', expected: 'Start an integration node' },
  { q: 'delete node', expected: 'Delete an integration node' },
  { q: 'create queue manager', expected: 'Create a queue manager' },
  { q: 'stop queue manager', expected: 'Stop a queue manager' },
  { q: 'connect node to queue manager', expected: 'Link a node to a queue manager' },
  { q: 'policy', expected: 'Connect by policy' },
  { q: 'mq node', expected: 'Which MQ node do I use?' },
  { q: 'MQInput', expected: 'MQInput node' },
  { q: 'strmqm', expected: 'Start a queue manager' },
  { q: 'mqsistart', expected: 'Start an integration node' },
  { q: 'mqsilist', expected: 'List nodes and status' },
  { q: 'deploy bar', expected: 'Deploy a BAR' },
  { q: 'define queue', expected: 'Define a queue' },
  { q: 'queue depth', expected: 'Check queue depth/status' },
  { q: 'BIP8018E', expected: 'the BIP codes reference or the topic explaining it' },
  { q: 'json field', expected: 'Read a JSON field' },
  { q: 'OutputRoot', expected: 'the topic decoding the OutputRoot path' },
  { q: 'loop array', expected: 'Loop over a JSON array' },
  { q: 'throw error', expected: 'Throw an error' }
];

const report = {};
testQueries.forEach((t, i) => {
  const results = executeSearch(t.q);
  report[t.q] = {
    index: i + 1,
    expected: t.expected,
    top5: results.slice(0, 5)
  };
});

fs.writeFileSync('scripts/search-audit-results.json', JSON.stringify(report, null, 2), 'utf-8');
console.log('Saved search audit results to scripts/search-audit-results.json');
