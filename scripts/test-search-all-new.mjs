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

const queries = [
  { q: 'start integration server', expectedId: 'topic-184' },
  { q: 'stop integration server', expectedId: 'topic-184' },
  { q: 'independent integration server', expectedId: 'topic-186' },
  { q: 'server.conf.yaml', expectedId: 'topic-187' },
  { q: 'message domains', expectedId: 'topic-144' },
  { q: 'resetcontentdescriptor', expectedId: 'topic-153' },
  { q: 'fileinput node', expectedId: 'topic-161' },
  { q: 'fileoutput node', expectedId: 'topic-162' }
];

let allPassed = true;
for (const { q, expectedId } of queries) {
  const results = ms.search(q);
  const top1 = results[0];
  const rank = results.findIndex(r => r.id === expectedId) + 1;
  const passed = rank >= 1 && rank <= 3;
  console.log(`Query: "${q}" -> Expected: ${expectedId} | Found Rank: ${rank} (${top1 ? top1.title : 'None'}) -> ${passed ? 'PASS' : 'FAIL'}`);
  if (!passed) allPassed = false;
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('ALL 8 SEARCH QUERIES PASSED IN TOP 3!');
}
