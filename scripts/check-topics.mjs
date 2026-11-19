import { ALL_TOPICS } from '../src/data/topics.ts';
console.log('ALL_TOPICS length:', ALL_TOPICS.length);
const ids = ALL_TOPICS.map(t => t.id);
console.log('Missing in 1..108:');
for (let i = 1; i <= 108; i++) {
  const expected = `topic-${String(i).padStart(2, '0')}`;
  if (!ids.includes(expected)) {
    console.log('  Missing:', expected);
  }
}
