import MiniSearch from 'minisearch';
import { readFileSync } from 'fs';

const topics = JSON.parse(readFileSync('./src/data/generated-topics.json', 'utf8'));

function runExperiment(name, config) {
  console.log(`\n=================== ${name} ===================`);
  const ms = new MiniSearch({
    fields: ['id', 'title', 'shortDescription', 'sectionTitle', 'keywords', 'tokens', 'searchableTerms', 'cheatSheetText'],
    storeFields: ['id', 'title', 'slug', 'part', 'sectionTitle', 'shortDescription', 'versionBadge', 'difficulty'],
    ...config
  });

  const documents = topics.map(t => {
    const cheatSheetText = t.cheatSheetText 
      || (t.cheatSheet ? `${t.cheatSheet.headers.join(' ')} ${t.cheatSheet.rows.flat().join(' ')}` : '');
    const terms = Array.isArray(t.searchableTerms) ? t.searchableTerms.join(' ') : '';
    return {
      id: t.id,
      title: t.title,
      slug: t.slug,
      part: t.part,
      sectionTitle: t.sectionTitle,
      shortDescription: t.shortDescription,
      versionBadge: t.versionBadge,
      difficulty: t.difficulty,
      keywords: `${t.part} ${t.sectionTitle} ${t.whatAndWhy?.definition || ''}`,
      tokens: t.syntaxBreakdown?.tokens?.map(tok => tok.token).join(' ') || '',
      searchableTerms: terms,
      cheatSheetText: cheatSheetText
    };
  });

  ms.addAll(documents);

  const testTerms = ['Transactional', '@Transactional', 'format', 'String.format', 'NIO', 'NIO.2', 'readAllLines', 'Scanner', 'JWT', 'printf'];

  for (const term of testTerms) {
    const res = ms.search(term);
    console.log(`${term.padEnd(16)} hits: ${String(res.length).padEnd(4)} top: ${res[0] ? `${res[0].id} - ${res[0].title}` : 'NONE'}`);
  }
}

// Experiment 1: Custom tokenize that splits on whitespace and punctuation except keeping @ and . inside identifiers
// and processTerm returning both full and parts during indexing
runExperiment('Experiment 1: Tokenize keeping @ and . + processTerm splitting on indexing', {
  tokenize: (text) => text.split(/[\s,;:!?"'()\[\]{}<>\/\\+=*&|~^`]+/),
  processTerm: (term, fieldName) => {
    const lower = term.toLowerCase().replace(/^[^\w@]+|[^\w]+$/g, '');
    if (!lower) return null;
    if (fieldName !== undefined) {
      // Indexing: return full token and its parts
      const parts = lower.split(/[@.]/).filter(p => p.length > 0);
      return Array.from(new Set([lower, ...parts]));
    }
    // Querying: return lower
    return lower;
  },
  searchOptions: {
    boost: { id: 6, title: 3, searchableTerms: 2.5, cheatSheetText: 2, sectionTitle: 1.5, tokens: 2, keywords: 1.5 },
    prefix: true,
    fuzzy: (term) => term.length > 3 ? 0.2 : false
  }
});

// Experiment 2: Same but query also expands if term starts with @
runExperiment('Experiment 2: Query also expands @ or .', {
  tokenize: (text) => text.split(/[\s,;:!?"'()\[\]{}<>\/\\+=*&|~^`]+/),
  processTerm: (term, _fieldName) => {
    const lower = term.toLowerCase().replace(/^[^\w@]+|[^\w]+$/g, '');
    if (!lower) return null;
    const parts = lower.split(/[@.]/).filter(p => p.length > 0);
    return Array.from(new Set([lower, ...parts]));
  },
  searchOptions: {
    boost: { id: 6, title: 3, searchableTerms: 2.5, cheatSheetText: 2, sectionTitle: 1.5, tokens: 2, keywords: 1.5 },
    prefix: true,
    fuzzy: (term) => term.length > 3 ? 0.2 : false
  }
});
