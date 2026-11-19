import fs from 'fs';

const content = fs.readFileSync('src/data/topics.ts', 'utf-8');
const idx = content.lastIndexOf('topic-66');
console.log('Context before last topic-66:');
console.log(content.substring(idx - 600, idx + 100));
