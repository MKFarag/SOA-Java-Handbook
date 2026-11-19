import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const content = fs.readFileSync('src/data/topics.ts', 'utf8');

// Strip TypeScript type annotations to evaluate ALL_TOPICS
let jsCode = content
  .replace(/import\s+type\s+[^;]+;/g, '')
  .replace(/:\s*TopicDetail\[\]/g, '')
  .replace(/:\s*SectionMeta\[\]/g, '')
  .replace(/export\s+const\s+/g, 'const ')
  .replace(/export\s+function\s+[\s\S]+$/, '');

jsCode += '\nmodule.exports = { ALL_TOPICS };';
fs.writeFileSync('scripts/temp-sync-topics.cjs', jsCode, 'utf8');

const { ALL_TOPICS } = require(path.resolve('scripts/temp-sync-topics.cjs'));
fs.unlinkSync('scripts/temp-sync-topics.cjs');

console.log(`Loaded ${ALL_TOPICS.length} topics. Synchronizing Markdown frontmatter...`);

const DIRS = ['content/part1-core', 'content/part2-jakarta'];

let updatedCount = 0;

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const parsed = matter(fileContent);

    // Extract topic number from filename prefix (e.g. 01-what-is-... or 33-generics-...)
    const numMatch = file.match(/^(\d+)-/);
    if (!numMatch) {
      console.warn(`Could not extract topic number from filename: ${file}`);
      continue;
    }
    const topicNum = parseInt(numMatch[1], 10);
    const topic = ALL_TOPICS.find(t => t.topicNumber === topicNum);

    if (!topic) {
      console.error(`ERROR: No matching topic in topics.ts for topicNumber ${topicNum} (${file})`);
      continue;
    }

    // Build canonical frontmatter
    const canonicalData = {
      id: topic.id,
      slug: topic.slug,
      topicNumber: topic.topicNumber,
      title: topic.title,
      part: topic.part,
      sectionNumber: topic.sectionNumber,
      sectionTitle: topic.sectionTitle,
      versionBadge: topic.versionBadge,
      difficulty: topic.difficulty,
      readingTime: topic.readingTime,
      shortDescription: topic.shortDescription,
      prerequisites: topic.prerequisites || []
    };

    // Reconstruct file with canonical frontmatter
    const newFileContent = matter.stringify(parsed.content.trimStart(), canonicalData);
    fs.writeFileSync(fullPath, newFileContent, 'utf8');
    updatedCount++;
  }
}

console.log(`Successfully synchronized ${updatedCount} Markdown files with canonical frontmatter!`);
