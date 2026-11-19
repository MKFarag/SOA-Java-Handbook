import fs from 'fs';
const text = fs.readFileSync('src/data/challenges.ts', 'utf8');
const matches = [...text.matchAll(/id:\s*['"](challenge-\d+)['"]/g)].map(m => m[1]);
console.log('Challenges count:', matches.length);
console.log('Challenge IDs:', matches.join(', '));
