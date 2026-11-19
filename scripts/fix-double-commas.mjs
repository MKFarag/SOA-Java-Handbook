import fs from 'fs';

let content = fs.readFileSync('src/data/topics.ts', 'utf-8');
content = content.replace(/,,/g, ',');

fs.writeFileSync('src/data/topics.ts', content, 'utf-8');
console.log('Fixed double commas in src/data/topics.ts');
