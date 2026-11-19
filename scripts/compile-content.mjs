import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIRS = [
  path.resolve('content/part1-core'),
  path.resolve('content/part2-jakarta'),
  path.resolve('content/part3-spring')
];
const OUTPUT_FILE = path.resolve('src/data/generated-topics.json');

console.log('Compiling markdown handbook content...');

const topics = [];

for (const dir of CONTENT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const rawContent = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(rawContent);

    const data = parsed.data;
    const content = parsed.content;

    topics.push({
      ...data,
      markdownContent: content
    });
  }
}

// Sort topics by topicNumber
topics.sort((a, b) => (a.topicNumber || 0) - (b.topicNumber || 0));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topics, null, 2), 'utf-8');
console.log(`Successfully compiled ${topics.length} markdown topics into ${OUTPUT_FILE}`);
