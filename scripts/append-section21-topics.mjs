import fs from 'fs';
import path from 'path';
import { section21Topics } from './section21-data.mjs';

const topicsFilePath = path.join(process.cwd(), 'src/data/topics.ts');
let content = fs.readFileSync(topicsFilePath, 'utf8');

const targetMarker = '\n];\n\nexport function getTopicById';
if (!content.includes(targetMarker)) {
  console.error('Target marker not found in topics.ts!');
  process.exit(1);
}

const formattedTopics = section21Topics.map(t => {
  return '  ' + JSON.stringify(t, null, 4).trim();
}).join(',\n\n');

content = content.replace(targetMarker, ',\n\n' + formattedTopics + targetMarker);

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log(`Successfully appended topics 74-78 into src/data/topics.ts!`);
