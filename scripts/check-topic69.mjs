import fs from 'fs';

const content = fs.readFileSync('src/data/topics.ts', 'utf-8');
const idx = content.lastIndexOf('"id": "topic-69"');
console.log('Context around topic-69:');
console.log(content.substring(idx, idx + 400));
console.log('--- Last 200 chars of file ---');
console.log(content.substring(content.length - 200));
