import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const content = fs.readFileSync('src/data/topics.ts', 'utf8');

// Strip TypeScript imports and type annotations to evaluate ALL_TOPICS
let jsCode = content
  .replace(/import\s+type\s+[^;]+;/g, '')
  .replace(/:\s*TopicDetail\[\]/g, '')
  .replace(/:\s*SectionMeta\[\]/g, '')
  .replace(/export\s+const\s+/g, 'const ')
  .replace(/export\s+function\s+[\s\S]+$/, '');

jsCode += '\nmodule.exports = { SECTIONS, ALL_TOPICS };';

fs.writeFileSync('scripts/temp-topics.cjs', jsCode, 'utf8');

try {
  const { SECTIONS, ALL_TOPICS } = require(path.resolve('scripts/temp-topics.cjs'));
  console.log(`Successfully loaded ${ALL_TOPICS.length} topics from topics.ts!`);
  console.log(`Successfully loaded ${SECTIONS.length} sections!`);

  // Print first and last
  console.log('Topic 1:', ALL_TOPICS[0].id, ALL_TOPICS[0].title);
  console.log('Topic 87:', ALL_TOPICS[86].id, ALL_TOPICS[86].title);
} catch (err) {
  console.error('Failed to evaluate topics:', err);
} finally {
  fs.unlinkSync('scripts/temp-topics.cjs');
}
