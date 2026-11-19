import fs from 'fs';

const content = fs.readFileSync('src/data/topics.ts', 'utf-8');
const ids = [...content.matchAll(/id:\s*['"](topic-\d+)['"]/g)].map(m => m[1]);
console.log('Total topic occurrences:', ids.length);
const uniqueIds = [...new Set(ids)];
console.log('Unique topic count:', uniqueIds.length);
console.log('First 5:', uniqueIds.slice(0, 5));
console.log('Last 5:', uniqueIds.slice(-5));
