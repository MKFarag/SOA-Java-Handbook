import fs from 'fs';

const content = fs.readFileSync('src/data/topics.ts', 'utf-8');

// Check for double commas or trailing commas before closing bracket
console.log('Has double comma ,, :', content.includes(',,'));
console.log('Has comma newline comma ,\n, :', content.includes(',\n,'));
console.log('Has comma newline space comma ,\n  , :', content.includes(',\n  ,'));

// Search for any empty entries like ",\s*,"
const emptyMatches = [...content.matchAll(/,\s*,/g)];
console.log('Empty comma matches count:', emptyMatches.length);
for (const m of emptyMatches) {
  const start = Math.max(0, m.index - 50);
  const end = Math.min(content.length, m.index + 50);
  console.log('Around empty match:', content.substring(start, end));
}
