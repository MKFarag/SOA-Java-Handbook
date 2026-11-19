import fs from 'fs';

const content = fs.readFileSync('src/data/topics.ts', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('topicNumber:') || line.includes('"topicNumber":')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
}
