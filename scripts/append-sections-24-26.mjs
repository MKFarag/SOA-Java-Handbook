import fs from 'fs';
import path from 'path';
import { section24Topics } from './section24-data.mjs';
import { section25Topics } from './section25-data.mjs';
import { section26Topics } from './section26-data.mjs';

const topicsFilePath = path.join(process.cwd(), 'src/data/topics.ts');
let content = fs.readFileSync(topicsFilePath, 'utf8');

const isCrlf = content.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';
const targetMarker = `${nl}];${nl}${nl}export function getTopicById`;

if (!content.includes(targetMarker)) {
  console.error('Target marker not found in topics.ts!');
  process.exit(1);
}

const allNewTopics = [...section24Topics, ...section25Topics, ...section26Topics];

const formattedTopics = allNewTopics.map(t => {
  return '  ' + JSON.stringify(t, null, 4).trim();
}).join(`,${nl}${nl}`);

content = content.replace(targetMarker, () => `,${nl}${nl}` + formattedTopics + targetMarker);

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log(`Successfully appended ${allNewTopics.length} topics (88-94) into src/data/topics.ts!`);
