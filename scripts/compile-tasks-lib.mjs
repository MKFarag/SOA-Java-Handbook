import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'to', 'for', 'with', 'from',
  'by', 'is', 'are', 'was', 'were', 'be', 'been', 'as', 'at', 'it', 'its', 'that',
  'this', 'your', 'my', 'our', 'their', 'into', 'onto', 'using', 'used', 'via',
  'vs', 'how', 'what', 'when', 'where', 'why', 'which', 'who', 'first', 'new',
  'all', 'any', 'one', 'two', 'three', 'four', 'five', 'more', 'without',
  'through', 'inside', 'outside', 'step', 'steps', 'only', 'also', 'then',
  'than', 'over', 'under', 'part', 'section', 'guide', 'basic', 'basics',
  'overview', 'common', 'full', 'example', 'examples', 'real', 'simple',
  'modern', 'production', 'enterprise', 'fundamentals', 'architecture',
  'essentials', 'deep', 'dive', 'quickstart', 'walkthrough', 'everything',
  'scratch', 'really', 'actually', 'need', 'needs', 'make', 'made', 'way',
  'ways', 'tip', 'tips', 'fix', 'fixes', 'you', 'can', 'will', 'should', 'must'
]);

const ULTRA_GENERIC_TECH = new Set([
  'java', 'spring', 'boot', 'jakarta', 'ee', 'ace', 'mq', 'sql', 'mysql',
  'mongodb', 'json', 'xml', 'http', 'rest', 'api', 'web', 'node', 'nodes',
  'server', 'servers', 'queue', 'queues', 'manager', 'managers', 'message',
  'messages', 'flow', 'flows', 'file', 'files', 'data', 'code', 'list', 'map',
  'set', 'class', 'classes', 'method', 'methods', 'object', 'objects', 'error',
  'errors', 'test', 'testing', 'read', 'write', 'create', 'delete', 'start',
  'stop', 'local', 'remote', 'port', 'ports', 'mode', 'path', 'log', 'logs',
  'trace', 'property', 'properties', 'header', 'headers', 'field', 'fields',
  'array', 'arrays', 'string', 'strings', 'thread', 'threads', 'lock', 'locks',
  'pool', 'cache', 'batch', 'event', 'stream', 'streams', 'record', 'records',
  'enum', 'pipe', 'channel', 'channels', 'listener', 'listeners', 'user',
  'role', 'query', 'queries', 'table', 'tables', 'index', 'join', 'database',
  'client', 'application', 'library', 'subflow', 'policy', 'broker',
  'execution', 'group', 'console', 'command', 'commands', 'toolkit',
  'workspace', 'runtime', 'environment', 'terminal', 'terminals', 'variable',
  'variables', 'loop', 'loops', 'operator', 'operators', 'switch', 'type',
  'types', 'value', 'values', 'null', 'cast', 'select', 'insert', 'update',
  'clear', 'alter', 'define', 'display', 'status', 'deploy', 'package',
  'build', 'config', 'setup', 'connect', 'link', 'handle', 'handling',
  'check', 'open', 'run', 'send', 'get', 'put', 'add', 'remove', 'change',
  'inspect', 'parse', 'format', 'convert', 'override', 'verify', 'confirm',
  'name', 'named', 'default', 'output', 'input', 'root', 'tree', 'custom',
  'view', 'panel', 'cheat', 'sheet', 'reference', 'glossary', 'dictionary',
  'integration', 'managed', 'independent', 'concurrent', 'collections',
  'formatted', 'pipelines', 'endpoint', 'expose', 'folder', 'archive',
  'detection', 'mistakes', 'bugs', 'double', 'single', 'missing', 'starts',
  'recognized', 'session', 'startup', 'sequence', 'specifiers', 'explicit',
  'suffix', 'powershell'
]);

const NOISY_PHRASES = new Set([
  'cheat sheet',
  'quick reference',
  'best practice',
  'common mistake',
  'common bug',
  'real session',
  'startup walkthrough',
  'everything scratch',
  'command cheat sheet',
  'quick fix',
  'quick glossary',
  'definitive dictionary',
  'life message',
  'four panel',
  'first time',
  'managed integration server',
  'integration server',
  'integration node',
  'queue manager',
  'mq ace'
]);

const KNOWN_TECHNICAL_SINGLE_TOKENS = new Set([
  'printf', 'coalesce', 'cardinality', 'substring', 'asbitstream', 'passthru',
  'localenvironment', 'floworder', 'resetcontentdescriptor', 'completablefuture',
  'autocloseable', 'flyway', 'resilience4j', 'testcontainers', 'mapstruct',
  'lombok', 'hikaricp', 'shedlock', 'bigdecimal', 'prometheus', 'micrometer',
  'swagger', 'openapi', 'sockjs', 'stomp', 'thymeleaf', 'hibernate', 'mockito',
  'junit', 'kafka', 'redis', 'caffeine', 'tomcat', 'xampp', 'phpmyadmin',
  'ibmint', 'runmqsc', 'crtmqm', 'strmqm', 'endmqm', 'dltmqm', 'dspmq',
  'dspmqver', 'amqsput', 'amqsget', 'amqsbcg', 'mqmd', 'mqrfh2', 'chlauth',
  'svrconn', 'qstatus', 'qalias', 'explain'
]);

const STEM_IRREGULARS = {
  creating: 'create',
  created: 'create',
  creates: 'create',
  creation: 'create',
  deleting: 'delete',
  deleted: 'delete',
  deletes: 'delete',
  deletion: 'delete',
  removing: 'remove',
  removed: 'remove',
  removes: 'remove',
  starting: 'start',
  started: 'start',
  starts: 'start',
  stopping: 'stop',
  stopped: 'stop',
  stops: 'stop',
  deploying: 'deploy',
  deployed: 'deploy',
  deploys: 'deploy',
  deployment: 'deploy',
  defining: 'define',
  defined: 'define',
  defines: 'define',
  configuring: 'configure',
  configured: 'configure',
  configures: 'configure',
  configuration: 'configure',
  connecting: 'connect',
  connected: 'connect',
  connects: 'connect',
  connection: 'connect',
  connections: 'connect',
  linking: 'link',
  linked: 'link',
  links: 'link',
  reading: 'read',
  reads: 'read',
  writing: 'write',
  writes: 'write',
  testing: 'test',
  tested: 'test',
  tests: 'test',
  opening: 'open',
  opened: 'open',
  opens: 'open',
  checking: 'check',
  checked: 'check',
  checks: 'check',
  inspecting: 'inspect',
  inspected: 'inspect',
  inspects: 'inspect',
  altering: 'alter',
  altered: 'alter',
  clearing: 'clear',
  cleared: 'clear',
  browsing: 'browse',
  browsed: 'browse',
  sending: 'send',
  sends: 'send',
  sent: 'send',
  receiving: 'receive',
  received: 'receive',
  parsing: 'parse',
  parsed: 'parse',
  parses: 'parse',
  converting: 'convert',
  converted: 'convert',
  conversion: 'convert',
  conversions: 'convert',
  handling: 'handle',
  handled: 'handle',
  packaging: 'package',
  packaged: 'package',
  packages: 'package',
  overriding: 'override',
  overrode: 'override',
  overrides: 'override',
  running: 'run',
  runs: 'run',
  troubleshooting: 'troubleshoot',
  logging: 'log',
  logged: 'log',
  caching: 'cache',
  cached: 'cache',
  pooling: 'pool',
  pooled: 'pool',
  migrating: 'migration',
  migrate: 'migration',
  migrations: 'migration',
  validating: 'validate',
  validated: 'validate',
  validation: 'validate',
  authenticating: 'authentication',
  authenticate: 'authentication',
  authorizing: 'authorization',
  authorize: 'authorization',
  referencing: 'reference',
  referenced: 'reference',
  references: 'reference',
  reloading: 'reload',
  reloaded: 'reload',
  restarting: 'restart',
  restarted: 'restart',
  formatting: 'format',
  formatted: 'format',
  filtering: 'filter',
  filtered: 'filter',
  routing: 'route',
  routed: 'route',
  transforming: 'transform',
  transformed: 'transform',
  transformation: 'transform',
  serializing: 'serialize',
  serialized: 'serialize',
  serialization: 'serialize',
  deserializing: 'deserialize',
  deserialized: 'deserialize',
  indexing: 'index',
  indexed: 'index',
  indexes: 'index',
  indices: 'index',
  grouping: 'group',
  grouped: 'group',
  aggregating: 'aggregation',
  aggregate: 'aggregation',
  joining: 'join',
  joined: 'join',
  joins: 'join',
  wrapping: 'wrap',
  wrapped: 'wrap'
};

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function stemWord(raw) {
  const w = raw.toLowerCase();
  if (STEM_IRREGULARS[w]) return STEM_IRREGULARS[w];
  if (w.length <= 3) return w;
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('sses')) return w.slice(0, -2);
  if (/(?:ches|shes|xes|zes)$/.test(w) && w.length > 5) return w.slice(0, -2);
  if (w.endsWith('s') && !/(?:ss|us|is|as|os)$/.test(w) && w.length > 3) {
    return w.slice(0, -1);
  }
  return w;
}

/**
 * Parse MAIN_SECTIONS and LEGACY_TOPIC_ALIASES directly from src/data/topics.ts
 * so top-nav configuration remains the single source of truth without hardcoding.
 */
export function loadTopNavAndAliases(repoRoot) {
  const topicsTsPath = path.join(repoRoot, 'src', 'data', 'topics.ts');
  const source = fs.readFileSync(topicsTsPath, 'utf-8');

  const sectionsMatch = source.match(/export const MAIN_SECTIONS[^=]*=\s*\[([\s\S]*?)\];/);
  if (!sectionsMatch) {
    throw new Error('Could not parse MAIN_SECTIONS from src/data/topics.ts');
  }

  const mainSections = [];
  const itemRegex = /\{\s*part:\s*'([^']+)'\s*,\s*label:\s*'([^']+)'\s*,\s*shortLabel:\s*'([^']+)'\s*\}/g;
  let m;
  while ((m = itemRegex.exec(sectionsMatch[1])) !== null) {
    mainSections.push({
      part: m[1],
      label: m[2],
      shortLabel: m[3],
      slug: slugify(m[2])
    });
  }
  if (mainSections.length === 0) {
    throw new Error('Parsed 0 entries from MAIN_SECTIONS in src/data/topics.ts');
  }

  const aliasesMatch = source.match(/export const LEGACY_TOPIC_ALIASES[^=]*=\s*\{([\s\S]*?)\};/);
  const aliasesByTopicId = new Map();
  if (aliasesMatch) {
    const aliasPairRegex = /'([^']+)'\s*:\s*'([^']+)'/g;
    let a;
    while ((a = aliasPairRegex.exec(aliasesMatch[1])) !== null) {
      const aliasPhrase = a[1].replace(/[-_]+/g, ' ').trim();
      const targetId = a[2];
      if (!aliasesByTopicId.has(targetId)) {
        aliasesByTopicId.set(targetId, []);
      }
      aliasesByTopicId.get(targetId).push(aliasPhrase);
    }
  }

  return { mainSections, aliasesByTopicId };
}

function tokenizeWords(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[`'"()[\]{}<>,;!?|\\/=+*&~^]/g, ' ')
    .replace(/[:.](?=\s|$)/g, ' ')
    .replace(/(?:^|\s)-+(?=\s|$)/g, ' ')
    .split(/\s+/)
    .map(t => t.replace(/^[-.:]+|[-.:]+$/g, ''))
    .filter(Boolean);
}

function tokenizePreservingFlags(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[`'"()[\]{}<>,;!?|\\/=+*&~^]/g, ' ')
    .replace(/[:.](?=\s|$)/g, ' ')
    .split(/\s+/)
    .map(t => t.replace(/^[.:]+|[.:]+$/g, ''))
    .filter(Boolean);
}

function extractPhraseSegments(rawText) {
  return String(rawText || '')
    .split(/[:&,/()|—–]+|\bvs\b|\band\b/i)
    .map(s => s.trim())
    .filter(Boolean);
}

function toContentPhrase(rawSegment) {
  const words = tokenizeWords(rawSegment)
    .flatMap(w => w.split('-').filter(Boolean))
    .filter(w => !STOPWORDS.has(w))
    .map(stemWord)
    .filter(w => w.length >= 2 && !/^\d+$/.test(w));

  const deduped = [];
  for (const w of words) {
    if (deduped[deduped.length - 1] !== w) {
      deduped.push(w);
    }
  }
  return deduped;
}

function isTechnicalIdentifier(origToken) {
  const lower = origToken.toLowerCase();
  if (!origToken || lower.length < 3) return false;
  if (STOPWORDS.has(lower) || ULTRA_GENERIC_TECH.has(lower)) return false;
  if (/^\d+$/.test(lower)) return false;

  if (origToken.startsWith('@') && origToken.length >= 4) return true;
  if (/^[a-z0-9_]+\.[a-z0-9_.]+$/i.test(origToken) && origToken.length >= 5) return true;
  if (/[a-z][A-Z]/.test(origToken) || /[A-Z]{2,}[a-z]/.test(origToken)) return true;
  if (/^(?:mqsi|amqs|mqrc|crtmqm|strmqm|endmqm|dltmqm|dspmq|runmqsc)/i.test(lower)) return true;
  if (KNOWN_TECHNICAL_SINGLE_TOKENS.has(lower)) return true;

  return false;
}

/**
 * Build deterministic Topic Index from generated-topics.json + LEGACY_TOPIC_ALIASES.
 */
export function buildTopicIndex(topics, aliasesByTopicId) {
  const tokenDf = new Map();
  const titleOwnedTokens = new Set(); // technical tokens explicitly appearing in a topic's title
  const topicRawMeta = new Map();

  for (const topic of topics) {
    const legacyAliases = aliasesByTopicId.get(topic.id) || [];
    const titleLower = (topic.title || '').toLowerCase();
    const isSummaryTopic =
      titleLower.includes('cheat sheet') ||
      titleLower.includes('glossary') ||
      titleLower.includes('definitive dictionary') ||
      titleLower.includes('quick reference');

    const titleTokens = tokenizeWords(topic.title || '');
    for (const tok of titleTokens) {
      titleOwnedTokens.add(tok.toLowerCase());
    }

    const rawSources = [
      topic.title || '',
      topic.commandName || '',
      ...(Array.isArray(topic.synonyms) ? topic.synonyms : []),
      (topic.slug || '').replace(/-/g, ' '),
      ...legacyAliases
    ];

    const docTokens = new Set();
    for (const src of rawSources) {
      for (const tok of tokenizeWords(src)) {
        const lower = tok.toLowerCase();
        if (lower.length >= 3 && !STOPWORDS.has(lower)) {
          docTokens.add(lower);
        }
      }
    }
    for (const dt of docTokens) {
      tokenDf.set(dt, (tokenDf.get(dt) || 0) + 1);
    }

    topicRawMeta.set(topic.id, { legacyAliases, isSummaryTopic });
  }

  // Track which technical tokens appear in the title of which topics
  const titleOwnerCount = new Map();
  for (const topic of topics) {
    const titleLower = (topic.title || '').toLowerCase();
    const isSummary =
      titleLower.includes('cheat sheet') ||
      titleLower.includes('glossary') ||
      titleLower.includes('definitive dictionary');
    if (isSummary) continue;
    const toks = new Set(tokenizeWords(topic.title || ''));
    for (const t of toks) {
      titleOwnerCount.set(t, (titleOwnerCount.get(t) || 0) + 1);
    }
  }

  const indexEntries = [];

  for (const topic of topics) {
    const meta = topicRawMeta.get(topic.id);
    const exactTokens = new Map();
    const commandFlagPairs = [];
    const phrases = [];
    const seenPhraseKeys = new Set();

    const titleTokenSet = new Set(tokenizeWords(topic.title || ''));

    // Detect command+flag patterns like "mqsicreatebroker -q" or "mqsistart -e / mqsistop -e"
    if (topic.commandName) {
      const cmdParts = String(topic.commandName).split(/[&/]+/).map(s => s.trim()).filter(Boolean);
      for (const part of cmdParts) {
        const toks = tokenizePreservingFlags(part);
        if (toks.length === 2 && toks[1].startsWith('-') && toks[1].length >= 2 && toks[0].length >= 4) {
          commandFlagPairs.push({ cmd: toks[0], flag: toks[1], weight: 100 });
        }
      }
    }

    const candidateSources = [
      { text: topic.title || '', baseWeight: 92, fromTitle: true },
      { text: topic.commandName || '', baseWeight: 90, fromTitle: false },
      ...(Array.isArray(topic.synonyms) ? topic.synonyms : []).map(s => ({
        text: s,
        baseWeight: 84,
        fromTitle: false
      }))
    ];

    for (const src of candidateSources) {
      if (meta.isSummaryTopic) continue;
      const origTokens = String(src.text)
        .replace(/[`'"()[\]{}<>,;!?|\\/=+*&~^]/g, ' ')
        .replace(/[:.](?=\s|$)/g, ' ')
        .split(/\s+/)
        .map(t => t.replace(/^[-.:]+|[-.:]+$/g, ''))
        .filter(Boolean);

      for (const orig of origTokens) {
        if (!isTechnicalIdentifier(orig)) continue;
        const lower = orig.toLowerCase();

        // If another topic specifically owns this token in its title, don't let secondary references steal it
        if (!titleTokenSet.has(lower) && (titleOwnerCount.get(lower) || 0) > 0) {
          continue;
        }

        const df = tokenDf.get(lower) || 1;
        const titleCount = titleOwnerCount.get(lower) || 0;
        if (titleCount > 2 && !titleTokenSet.has(lower)) continue;
        if (df > 2 && titleCount !== 1 && !orig.startsWith('@') && !orig.includes('.')) continue;

        const prev = exactTokens.get(lower);
        const weight = src.baseWeight + (titleCount === 1 && titleTokenSet.has(lower) ? 6 : 0);
        if (!prev || prev.weight < weight) {
          exactTokens.set(lower, { weight });
        }
      }
    }

    const phraseSources = [
      ...extractPhraseSegments(topic.title || ''),
      topic.title || '',
      ...extractPhraseSegments(topic.commandName || ''),
      ...(Array.isArray(topic.synonyms) ? topic.synonyms : []),
      (topic.slug || '').replace(/-/g, ' '),
      ...meta.legacyAliases
    ];

    for (const seg of phraseSources) {
      const words = toContentPhrase(seg);
      if (words.length < 2 || words.length > 6) continue;
      const joined = words.join(' ');
      if (NOISY_PHRASES.has(joined)) continue;

      if (meta.isSummaryTopic) {
        if (
          !joined.includes('cheat sheet') &&
          !joined.includes('glossary') &&
          !joined.includes('dictionary')
        ) {
          continue;
        }
      }

      const dfs = words.map(w => tokenDf.get(w) || 1);
      const minDf = Math.min(...dfs);
      const allUltraGeneric = words.every(w => ULTRA_GENERIC_TECH.has(w));
      if (words.length === 2 && allUltraGeneric && minDf > 6) continue;

      if (seenPhraseKeys.has(joined)) continue;
      seenPhraseKeys.add(joined);

      const avgIdf =
        dfs.reduce((acc, d) => acc + Math.max(0, 10 - Math.min(d, 10)), 0) / words.length;

      phrases.push({
        words,
        raw: joined,
        specificity: avgIdf
      });
    }

    indexEntries.push({
      id: topic.id,
      slug: topic.slug,
      topicNumber: topic.topicNumber,
      title: topic.title,
      part: topic.part,
      isSummaryTopic: meta.isSummaryTopic,
      exactTokens,
      commandFlagPairs,
      phrases
    });
  }

  return indexEntries;
}

/**
 * Match a single step against the Topic Index deterministically.
 * Returns up to 2 confident Topic links.
 */
export function matchStepToTopics(stepText, taskPart, topicIndex) {
  const cleanText = String(stepText || '').trim();
  if (!cleanText) return [];

  const codeSpans = [];
  const codeRegex = /`([^`\n]+)`/g;
  let cm;
  while ((cm = codeRegex.exec(cleanText)) !== null) {
    codeSpans.push(cm[1]);
  }

  const stepRawTokens = tokenizePreservingFlags(cleanText);
  const stepRawSet = new Set(stepRawTokens);

  const stepWordSeq = tokenizeWords(cleanText)
    .flatMap(w => w.split('-').filter(Boolean))
    .map(w => ({ raw: w, stem: stemWord(w), isStop: STOPWORDS.has(w) }));

  const stemPositions = new Map();
  stepWordSeq.forEach((tok, idx) => {
    if (tok.isStop) return;
    if (!stemPositions.has(tok.stem)) {
      stemPositions.set(tok.stem, []);
    }
    stemPositions.get(tok.stem).push(idx);
  });

  const activeCommandFlags = new Set();
  for (let i = 0; i < stepRawTokens.length; i++) {
    const tok = stepRawTokens[i];
    if (tok.startsWith('-')) continue;
    for (let j = i + 1; j < Math.min(stepRawTokens.length, i + 6); j++) {
      if (stepRawTokens[j].startsWith('-')) {
        activeCommandFlags.add(`${tok} ${stepRawTokens[j]}`);
      }
    }
  }

  const candidates = [];

  for (const entry of topicIndex) {
    let bestScore = 0;
    const isSameDomain = entry.part === taskPart;
    const domainAdjust = isSameDomain ? 18 : -25;

    let matchedCommandFlag = false;
    for (const pair of entry.commandFlagPairs) {
      if (activeCommandFlags.has(`${pair.cmd} ${pair.flag}`)) {
        bestScore = Math.max(bestScore, pair.weight + domainAdjust);
        matchedCommandFlag = true;
      }
    }

    for (const [tok, info] of entry.exactTokens.entries()) {
      if (stepRawSet.has(tok)) {
        if (
          (tok === 'mqsistart' || tok === 'mqsistop') &&
          activeCommandFlags.has(`${tok} -e`) &&
          !matchedCommandFlag &&
          entry.commandFlagPairs.length === 0
        ) {
          continue;
        }
        const inInlineCode = codeSpans.some(span =>
          tokenizePreservingFlags(span).includes(tok)
        );
        const score = info.weight + (inInlineCode ? 8 : 0) + domainAdjust;
        bestScore = Math.max(bestScore, score);
      }
    }

    for (const phrase of entry.phrases) {
      const pWords = phrase.words;
      if (!pWords.every(w => stemPositions.has(w))) continue;

      const posLists = pWords.map(w => stemPositions.get(w));
      let minSpan = Infinity;
      let bestOrdered = false;
      const maxAllowedSpan = pWords.length + 4;

      const searchWindow = (depth, currentPositions) => {
        if (depth === posLists.length) {
          const minP = Math.min(...currentPositions);
          const maxP = Math.max(...currentPositions);
          const span = maxP - minP + 1;
          if (span <= maxAllowedSpan) {
            let ordered = true;
            for (let k = 1; k < currentPositions.length; k++) {
              if (currentPositions[k] <= currentPositions[k - 1]) {
                ordered = false;
                break;
              }
            }
            if (span < minSpan || (span === minSpan && ordered && !bestOrdered)) {
              minSpan = span;
              bestOrdered = ordered;
            }
          }
          return;
        }
        for (const p of posLists[depth]) {
          if (currentPositions.includes(p)) continue;
          currentPositions.push(p);
          searchWindow(depth + 1, currentPositions);
          currentPositions.pop();
        }
      };

      searchWindow(0, []);
      if (minSpan === Infinity) continue;

      let base = pWords.length >= 4 ? 82 : pWords.length === 3 ? 70 : 48;
      if (bestOrdered) base += 14;
      if (minSpan === pWords.length) base += 8;
      base += Math.round(phrase.specificity * 1.5);

      const total = base + domainAdjust;
      bestScore = Math.max(bestScore, total);
    }

    if (bestScore >= 68) {
      candidates.push({
        topicId: entry.id,
        slug: entry.slug,
        title: entry.title,
        part: entry.part,
        topicNumber: entry.topicNumber,
        score: bestScore
      });
    }
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.topicNumber - b.topicNumber;
  });

  const selected = [];
  const seenIds = new Set();
  for (const cand of candidates) {
    if (seenIds.has(cand.topicId)) continue;
    if (selected.length === 1 && selected[0].score - cand.score > 45 && cand.score < 85) {
      continue;
    }
    seenIds.add(cand.topicId);
    selected.push({
      topicId: cand.topicId,
      slug: cand.slug,
      title: cand.title,
      part: cand.part
    });
    if (selected.length >= 2) break;
  }

  return selected;
}

const MAX_IMAGE_BYTES = 300 * 1024;

function stripLeadingIndent(line, indentLen) {
  let removed = 0;
  let idx = 0;
  while (idx < line.length && removed < indentLen) {
    if (line[idx] === ' ') {
      removed += 1;
      idx += 1;
    } else if (line[idx] === '\t') {
      removed += 2;
      idx += 1;
    } else {
      break;
    }
  }
  return line.slice(idx);
}

function normalizeCodeLanguage(rawInfo) {
  const cleaned = String(rawInfo || '').trim().toLowerCase();
  if (!cleaned || cleaned === 'plain text' || cleaned === 'plaintext' || cleaned === 'plain' || cleaned === 'txt') {
    return 'text';
  }
  return cleaned.split(/\s+/)[0];
}

/**
 * Parse numbered steps and optional ordered rich blocks (code, image, note)
 * from the markdown task body.
 */
export function parseRichSteps(markdownBody, { taskDirPath, tasksRoot, taskLabel, warnings = [] } = {}) {
  const lines = String(markdownBody || '').split(/\r?\n/);
  const steps = [];
  let currentStep = null;
  let inCodeFence = null;
  let currentNote = null;
  let hasStartedBlocks = false;

  const flushNote = () => {
    if (currentNote && currentStep) {
      const noteText = currentNote.lines.join(' ').trim();
      if (noteText) {
        currentStep.blocks.push({ type: 'note', text: noteText });
      }
    }
    currentNote = null;
  };

  const flushStep = () => {
    flushNote();
    if (currentStep && currentStep.text.trim()) {
      steps.push({
        text: currentStep.text.trim(),
        blocks: currentStep.blocks
      });
    }
    currentStep = null;
    hasStartedBlocks = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Inside an open fenced code block: preserve verbatim content and ignore step numbering
    if (inCodeFence) {
      const closeMatch = line.match(
        new RegExp(`^\\s*${inCodeFence.fenceChar}{${inCodeFence.fenceLen},}\\s*$`)
      );
      if (closeMatch) {
        if (currentStep) {
          currentStep.blocks.push({
            type: 'code',
            language: inCodeFence.language,
            code: inCodeFence.lines.join('\n')
          });
        }
        inCodeFence = null;
      } else {
        inCodeFence.lines.push(stripLeadingIndent(line, inCodeFence.indentLen));
      }
      continue;
    }

    // Opening code fence under a step
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
    if (fenceMatch && currentStep) {
      flushNote();
      hasStartedBlocks = true;
      inCodeFence = {
        indentLen: fenceMatch[1].length,
        fenceChar: fenceMatch[2][0],
        fenceLen: fenceMatch[2].length,
        language: normalizeCodeLanguage(fenceMatch[3]),
        lines: []
      };
      continue;
    }

    // Top-level numbered step item
    const itemMatch = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (itemMatch) {
      flushStep();
      currentStep = {
        text: itemMatch[1].trim(),
        blocks: []
      };
      continue;
    }

    if (!currentStep) continue;

    // Image block under step: ![alt](./images/file.png)
    const imageMatch = line.match(/^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/);
    if (imageMatch) {
      flushNote();
      hasStartedBlocks = true;
      const alt = imageMatch[1].trim();
      const rawSrc = imageMatch[2].trim();
      let resolvedSrc = rawSrc;

      if (!/^https?:\/\//i.test(rawSrc) && taskDirPath && tasksRoot) {
        const absImgPath = path.resolve(taskDirPath, rawSrc);
        const relFromTasks = path.relative(tasksRoot, absImgPath).replace(/\\/g, '/');
        if (relFromTasks.startsWith('..')) {
          throw new Error(
            `Image path "${rawSrc}" in ${taskLabel || 'task'} escapes content/tasks/`
          );
        }
        if (!fs.existsSync(absImgPath)) {
          throw new Error(
            `Missing image "${rawSrc}" referenced in ${taskLabel || 'task'} (expected at content/tasks/${relFromTasks})`
          );
        }
        const sizeBytes = fs.statSync(absImgPath).size;
        if (sizeBytes > MAX_IMAGE_BYTES) {
          warnings.push(
            `Image "content/tasks/${relFromTasks}" is ${Math.round(sizeBytes / 1024)} KB (> 300 KB). Consider optimizing or converting to WebP.`
          );
        }
        resolvedSrc = relFromTasks;
      }

      currentStep.blocks.push({
        type: 'image',
        src: resolvedSrc,
        alt
      });
      continue;
    }

    // Note blockquote under step: > Note: ...
    const quoteMatch = line.match(/^\s*>\s*(.*)$/);
    if (quoteMatch) {
      hasStartedBlocks = true;
      const content = quoteMatch[1].trim();
      if (currentNote === null) {
        const noteMatch = content.match(/^note:\s*(.*)$/i);
        const initialLine = noteMatch ? noteMatch[1].trim() : content;
        currentNote = { lines: initialLine ? [initialLine] : [] };
      } else if (content) {
        currentNote.lines.push(content);
      }
      continue;
    }

    if (line.trim() === '') {
      flushNote();
      continue;
    }

    flushNote();
    if (!hasStartedBlocks && !/^\s*[-*#]/.test(line)) {
      currentStep.text += ' ' + line.trim();
    }
  }

  // Close unclosed fence gracefully if needed
  if (inCodeFence && currentStep) {
    currentStep.blocks.push({
      type: 'code',
      language: inCodeFence.language,
      code: inCodeFence.lines.join('\n')
    });
  }

  flushStep();
  return steps;
}

/**
 * Parse numbered steps from the markdown task body (text only).
 */
export function parseNumberedSteps(markdownBody) {
  return parseRichSteps(markdownBody).map(s => s.text);
}

/**
 * Compile all tasks in content/tasks/<topic-slug>/NN-<title-slug>.md
 */
export function compileAllTasks(repoRoot = process.cwd()) {
  const { mainSections, aliasesByTopicId } = loadTopNavAndAliases(repoRoot);

  const labelToSection = new Map();
  const slugToSection = new Map();
  for (const sec of mainSections) {
    labelToSection.set(sec.label, sec);
    slugToSection.set(sec.slug, sec);
  }

  const topicsJsonPath = path.join(repoRoot, 'src', 'data', 'generated-topics.json');
  const topics = fs.existsSync(topicsJsonPath)
    ? JSON.parse(fs.readFileSync(topicsJsonPath, 'utf-8'))
    : [];

  const topicIndex = buildTopicIndex(topics, aliasesByTopicId);
  const tasksRoot = path.join(repoRoot, 'content', 'tasks');
  const tasks = [];
  const warnings = [];

  if (fs.existsSync(tasksRoot)) {
    const topicDirs = fs.readdirSync(tasksRoot, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name)
      .sort();

    for (const topicSlug of topicDirs) {
      const folderSection = slugToSection.get(topicSlug);
      if (!folderSection) {
        throw new Error(
          `Unknown task folder "content/tasks/${topicSlug}". Allowed topic folders: ${[...slugToSection.keys()].join(', ')}`
        );
      }

      const dirPath = path.join(tasksRoot, topicSlug);
      const mdFiles = fs.readdirSync(dirPath)
        .filter(f => f.endsWith('.md'))
        .sort();

      for (const file of mdFiles) {
        const fileMatch = file.match(/^(\d+)-([a-z0-9-]+)\.md$/);
        if (!fileMatch) {
          throw new Error(
            `Invalid task filename "content/tasks/${topicSlug}/${file}". Expected NN-<title-slug>.md`
          );
        }

        const order = parseInt(fileMatch[1], 10);
        const fullPath = path.join(dirPath, file);
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const parsed = matter(raw);
        const data = parsed.data || {};

        const topicLabel = typeof data.topic === 'string' ? data.topic.trim() : '';
        const matchedSection = labelToSection.get(topicLabel);
        if (!matchedSection) {
          throw new Error(
            `Invalid topic "${topicLabel}" in ${topicSlug}/${file}. Allowed topics: ${mainSections.map(s => s.label).join(', ')}`
          );
        }
        if (matchedSection.slug !== topicSlug) {
          throw new Error(
            `Topic/folder mismatch in ${topicSlug}/${file}: topic "${topicLabel}" belongs under "${matchedSection.slug}/"`
          );
        }

        const title = typeof data.title === 'string' ? data.title.trim() : '';
        if (!title) {
          throw new Error(`Missing title in frontmatter of ${topicSlug}/${file}`);
        }

        const reference =
          typeof data.reference === 'string' && data.reference.trim()
            ? data.reference.trim()
            : undefined;

        const parsedSteps = parseRichSteps(parsed.content, {
          taskDirPath: dirPath,
          tasksRoot,
          taskLabel: `${topicSlug}/${file}`,
          warnings
        });
        if (parsedSteps.length === 0) {
          throw new Error(`No numbered steps found in ${topicSlug}/${file}`);
        }

        const steps = parsedSteps.map(step => ({
          text: step.text,
          links: matchStepToTopics(step.text, matchedSection.part, topicIndex),
          ...(step.blocks.length > 0 ? { blocks: step.blocks } : {})
        }));

        tasks.push({
          id: `${topicSlug}/${file.replace(/\.md$/, '')}`,
          order,
          topic: matchedSection.label,
          topicSlug: matchedSection.slug,
          title,
          ...(reference ? { reference } : {}),
          steps
        });
      }
    }
  }

  tasks.sort((a, b) => {
    if (b.order !== a.order) return b.order - a.order;
    return a.id.localeCompare(b.id);
  });

  const outPath = path.join(repoRoot, 'src', 'data', 'generated-tasks.json');
  const nextJson = JSON.stringify(tasks, null, 2) + '\n';
  const prevJson = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf-8') : null;
  if (prevJson !== nextJson) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, nextJson, 'utf-8');
  }

  return { tasks, outPath, topicCount: topics.length, warnings };
}
