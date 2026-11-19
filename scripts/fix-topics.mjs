import fs from 'fs';
import path from 'path';

const topicsFilePath = path.join(process.cwd(), 'src/data/topics.ts');
let content = fs.readFileSync(topicsFilePath, 'utf8');

// Find the start of topic-62
const idx62 = content.indexOf("    id: 'topic-62',");
// Find the start of topic-66
const idx66 = content.indexOf("    id: 'topic-66',");

console.log('idx62:', idx62, 'idx66:', idx66);

// Find the closing brace of topic-62
const end62 = content.indexOf('\n  },\n', idx62);
console.log('end62:', end62);

// Find the start of topic-66 block
const start66 = content.lastIndexOf('  {\n', idx66);
console.log('start66:', start66);

// Extract the original topic-66 code
const topic66Code = content.substring(start66);

// Remove everything between topic-62 and topic-66
content = content.substring(0, end62 + '\n  },\n\n'.length) + topic66Code;

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log('Reset topics.ts cleanly back to 63 topics (1-62 + 66)');
