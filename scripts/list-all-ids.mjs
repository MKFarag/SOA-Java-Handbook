import fs from 'fs';

const content = fs.readFileSync('src/data/topics.ts', 'utf-8');
const regex = /id:\s*['"](topic-\d+)['"]|"id":\s*"(topic-\d+)"/g;
const ids = [];
let match;
while ((match = regex.exec(content)) !== null) {
  ids.push(match[1] || match[2]);
}
console.log('Total matches:', ids.length);
console.log('List of all IDs in order:', ids);
