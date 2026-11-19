import fs from 'fs';
const c = fs.readFileSync('src/data/topics.ts', 'utf8');
const idx = c.indexOf('"id": "topic-95"');
console.log('Index:', idx);
console.log(JSON.stringify(c.slice(idx - 25, idx + 25)));
