import fs from 'fs';
import path from 'path';
import { section24Topics } from './section24-data.mjs';
import { section25Topics } from './section25-data.mjs';
import { section26Topics } from './section26-data.mjs';

const topicsFilePath = path.join(process.cwd(), 'src/data/topics.ts');
let content = fs.readFileSync(topicsFilePath, 'utf8');

const marker = '"id": "topic-95"';
const idx = content.indexOf(marker);

if (idx === -1) {
  console.error('topic-95 not found!');
  process.exit(1);
}

// Find the opening brace before "id": "topic-95"
const braceIdx = content.lastIndexOf('{', idx);

const isCrlf = content.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';

const missingTopics = [...section24Topics, ...section25Topics, ...section26Topics];

const formatted = missingTopics.map(t => {
  return '  ' + JSON.stringify(t, null, 4).trim();
}).join(`,${nl}${nl}`);

const before = content.slice(0, braceIdx);
const after = content.slice(braceIdx);

content = before + formatted + `,${nl}${nl}` + after;

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log(`Successfully inserted ${missingTopics.length} topics (88-94) before topic-95!`);
