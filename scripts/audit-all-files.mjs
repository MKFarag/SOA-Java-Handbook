import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

console.log('====================================================');
console.log('   FULL PROJECT INTEGRITY & CONTENT AUDIT (87 TOPICS)');
console.log('====================================================');

const PART1_DIR = path.resolve('content/part1-core');
const PART2_DIR = path.resolve('content/part2-jakarta');
const TOPICS_TS = path.resolve('src/data/topics.ts');
const GENERATED_JSON = path.resolve('src/data/generated-topics.json');

let errorsFound = 0;
let warningsFound = 0;
const expectedTopics = 87;

// 1. Audit src/data/topics.ts
console.log('\n[1/5] Auditing src/data/topics.ts ...');
let ALL_TOPICS = [];
try {
  const content = fs.readFileSync(TOPICS_TS, 'utf8');
  let jsCode = content
    .replace(/import\s+type\s+[^;]+;/g, '')
    .replace(/:\s*TopicDetail\[\]/g, '')
    .replace(/:\s*SectionMeta\[\]/g, '')
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+function\s+[\s\S]+$/, '');
  jsCode += '\nmodule.exports = { ALL_TOPICS };';
  fs.writeFileSync('scripts/temp-audit-topics.cjs', jsCode, 'utf8');
  const loaded = require(path.resolve('scripts/temp-audit-topics.cjs'));
  ALL_TOPICS = loaded.ALL_TOPICS;
  fs.unlinkSync('scripts/temp-audit-topics.cjs');

  console.log(`Loaded ${ALL_TOPICS.length} topics from topics.ts.`);
  if (ALL_TOPICS.length !== expectedTopics) {
    console.error(`ERROR: Expected ${expectedTopics} topics, found ${ALL_TOPICS.length}!`);
    errorsFound++;
  }

  // Validate topic structure
  for (const t of ALL_TOPICS) {
    if (!t.id || !t.title || !t.topicNumber || !t.slug || !t.part || !t.sectionNumber) {
      console.error(`ERROR: Incomplete topic data for topic ${t.topicNumber || 'unknown'}: ${t.id}`);
      errorsFound++;
    }
    if (!t.whatAndWhy || !t.syntaxBreakdown || !t.examples || !t.commonMistakes || !t.bestPractices || !t.versionNotes || !t.cheatSheet || !t.exercises || !t.officialSources) {
      console.error(`ERROR: Topic ${t.topicNumber} (${t.id}) is missing one of the 11 required structural sections!`);
      errorsFound++;
    }
    if (!Array.isArray(t.examples) || t.examples.length < 2) {
      console.warn(`WARNING: Topic ${t.topicNumber} (${t.id}) has fewer than 2 examples: ${t.examples?.length}`);
      warningsFound++;
    }
  }
} catch (err) {
  console.error('ERROR reading topics.ts:', err.message);
  errorsFound++;
}

// 2. Audit Markdown Files
console.log('\n[2/5] Auditing Markdown content files in content/ ...');
const part1Files = fs.existsSync(PART1_DIR) ? fs.readdirSync(PART1_DIR).filter(f => f.endsWith('.md')) : [];
const part2Files = fs.existsSync(PART2_DIR) ? fs.readdirSync(PART2_DIR).filter(f => f.endsWith('.md')) : [];
const totalMdFiles = part1Files.length + part2Files.length;

console.log(`Found ${part1Files.length} files in part1-core`);
console.log(`Found ${part2Files.length} files in part2-jakarta`);
console.log(`Total markdown files: ${totalMdFiles} / ${expectedTopics}`);

if (totalMdFiles !== expectedTopics) {
  console.error(`ERROR: Expected ${expectedTopics} markdown files, found ${totalMdFiles}!`);
  errorsFound++;
}

const mdTopicNumbers = new Set();
const allMdFiles = [
  ...part1Files.map(f => ({ dir: PART1_DIR, file: f })),
  ...part2Files.map(f => ({ dir: PART2_DIR, file: f }))
];

for (const { dir, file } of allMdFiles) {
  const fullPath = path.join(dir, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  if (content.trim().length === 0) {
    console.error(`ERROR: Empty file: ${file}`);
    errorsFound++;
    continue;
  }

  try {
    const parsed = matter(content);
    const { data, content: body } = parsed;

    if (!data.id) {
      console.error(`ERROR: Missing 'id' in frontmatter: ${file}`);
      errorsFound++;
    }
    if (!data.title) {
      console.error(`ERROR: Missing 'title' in frontmatter: ${file}`);
      errorsFound++;
    }
    if (typeof data.topicNumber !== 'number') {
      console.error(`ERROR: Missing or non-numeric 'topicNumber' in frontmatter: ${file}`);
      errorsFound++;
    } else {
      mdTopicNumbers.add(data.topicNumber);
    }

    if (body.trim().length < 200) {
      console.warn(`WARNING: File body unusually short (${body.trim().length} chars): ${file}`);
      warningsFound++;
    }
  } catch (err) {
    console.error(`ERROR: Failed to parse frontmatter in ${file}:`, err.message);
    errorsFound++;
  }
}

// Check for missing topic numbers from 1 to 87
for (let i = 1; i <= expectedTopics; i++) {
  if (!mdTopicNumbers.has(i)) {
    console.error(`ERROR: Missing Markdown topic for topicNumber ${i}!`);
    errorsFound++;
  }
}

// 3. Audit src/data/generated-topics.json
console.log('\n[3/5] Auditing src/data/generated-topics.json ...');
try {
  if (!fs.existsSync(GENERATED_JSON)) {
    console.error('ERROR: generated-topics.json does not exist!');
    errorsFound++;
  } else {
    const jsonContent = fs.readFileSync(GENERATED_JSON, 'utf8');
    const parsed = JSON.parse(jsonContent);
    console.log(`generated-topics.json contains ${parsed.length} compiled topics.`);
    if (parsed.length !== expectedTopics) {
      console.error(`ERROR: Expected ${expectedTopics} topics in JSON, found ${parsed.length}!`);
      errorsFound++;
    }

    // Verify ordering 1 to 87
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i].topicNumber !== i + 1) {
        console.error(`ERROR: Topic out of sequence at index ${i}: expected topicNumber ${i + 1}, found ${parsed[i].topicNumber}`);
        errorsFound++;
      }
    }
  }
} catch (err) {
  console.error('ERROR reading generated-topics.json:', err.message);
  errorsFound++;
}

// 4. Audit Example Files
console.log('\n[4/5] Auditing runnable examples in examples/ ...');
const coreExamples = fs.existsSync('examples/core') ? fs.readdirSync('examples/core').filter(f => f.endsWith('.java')) : [];
const webExamples = fs.existsSync('examples/web') ? fs.readdirSync('examples/web').filter(f => f.endsWith('.java')) : [];
const enterpriseExamples = fs.existsSync('examples/enterprise') ? fs.readdirSync('examples/enterprise').filter(f => f.endsWith('.java')) : [];

console.log(`examples/core: ${coreExamples.length} Java files`);
console.log(`examples/web: ${webExamples.length} Java files`);
console.log(`examples/enterprise: ${enterpriseExamples.length} Java files`);
console.log(`Total example Java files: ${coreExamples.length + webExamples.length + enterpriseExamples.length}`);

// Summary
console.log('\n[5/5] Audit Summary:');
console.log(`Errors: ${errorsFound}`);
console.log(`Warnings: ${warningsFound}`);

if (errorsFound === 0) {
  console.log('\n========================================================================');
  console.log('>>> ALL CHECKS PASSED: 100% of files, content, and metadata are intact! <<<');
  console.log('========================================================================');
} else {
  console.error(`\n>>> INTEGRITY CHECK FAILED with ${errorsFound} errors! <<<`);
  process.exit(1);
}
