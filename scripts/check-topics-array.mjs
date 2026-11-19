import fs from 'fs';
import path from 'path';

// Read topics.ts
const topicsTsPath = path.resolve('src/data/topics.ts');
const content = fs.readFileSync(topicsTsPath, 'utf8');

// Find all topic objects in topics.ts
// Match each object having an id of topic-XX
const topicBlocks = [];
const idRegex = /(?:id|"id")\s*:\s*['"](topic-(\d+))['"]/g;
let match;
const topicIndices = [];

while ((match = idRegex.exec(content)) !== null) {
  topicIndices.push({
    id: match[1],
    topicNumber: parseInt(match[2], 10),
    index: match.index
  });
}

console.log(`Found ${topicIndices.length} topic indices in topics.ts`);
const missing = [];
for (let i = 1; i <= 87; i++) {
  const found = topicIndices.find(t => t.topicNumber === i);
  if (!found) missing.push(i);
}
console.log('Missing topic numbers in topics.ts:', missing);
