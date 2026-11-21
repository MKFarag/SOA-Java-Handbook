import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIRS = [
  path.resolve('content/part1-core'),
  path.resolve('content/part2-jakarta'),
  path.resolve('content/part3-spring'),
  path.resolve('content/part4-databases')
];
const OUTPUT_FILE = path.resolve('src/data/generated-topics.json');
const SECTIONS_FILE = path.resolve('src/data/generated-sections.json');

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
    let content = parsed.content;

    // Purge local filesystem and relative links: replace file:///.../NN-slug.md and ../.../NN-slug.md with #topic-NN
    content = content.replace(
      /(?:[^\s()]*?[\\/])?([0-9]{2,3})-[a-z0-9-]+\.md/gi,
      (match, num) => `#topic-${num}`
    );
    content = content.replace(/file:\/\/\/[^\s)]+/gi, '#');

    // Also clean up prerequisites array if it contains file:/// links or relative paths
    let prereqs = data.prerequisites || [];
    if (Array.isArray(prereqs)) {
      prereqs = prereqs.map(p => {
        if (typeof p === 'string') {
          return p.replace(
            /(?:[^\s()]*?[\\/])?([0-9]{2,3})-[a-z0-9-]+\.md/gi,
            (match, num) => `#topic-${num}`
          ).replace(/file:\/\/\/[^\s)]+/gi, '#');
        }
        return p;
      });
    }

    // Extract searchable terms from markdown headings, code identifiers, annotations, and tables
    const searchableTermsSet = new Set(Array.isArray(data.searchableTerms) ? data.searchableTerms : []);

    // 1. Headings (H1 to H4)
    const headingRegex = /^#{1,4}\s+(.+)$/gm;
    let headingMatch;
    while ((headingMatch = headingRegex.exec(content)) !== null) {
      const headingText = headingMatch[1].replace(/[`*#]/g, '').trim();
      if (headingText.length > 2) searchableTermsSet.add(headingText);
    }

    // 2. Inline code tokens & method signatures
    const codeRegex = /`([^`\n]+)`/g;
    let codeMatch;
    while ((codeMatch = codeRegex.exec(content)) !== null) {
      const rawCode = codeMatch[1].trim();
      if (rawCode.length >= 2 && rawCode.length <= 80 && !/^\d+$/.test(rawCode)) {
        searchableTermsSet.add(rawCode);
        // Extract bare method name from method invocations (e.g. setAttribute from setAttribute(name, val))
        const methodMatch = rawCode.match(/^([a-zA-Z0-9_$.]+)\s*\(/);
        if (methodMatch) {
          searchableTermsSet.add(methodMatch[1]);
          const parts = methodMatch[1].split('.');
          if (parts.length > 1) searchableTermsSet.add(parts[parts.length - 1]);
        }
        // Extract base type from generics (e.g. Map from Map<String, Object>)
        const genericMatch = rawCode.match(/^([a-zA-Z0-9_$]+)<.+>$/);
        if (genericMatch) {
          searchableTermsSet.add(genericMatch[1]);
        }
      }
    }

    // 3. Annotations (@AnnotationName)
    const annoRegex = /(?:^|\s)(@[A-Za-z0-9_]+)/g;
    let annoMatch;
    while ((annoMatch = annoRegex.exec(content)) !== null) {
      searchableTermsSet.add(annoMatch[1]);
    }

    // 4. Markdown tables (cheat sheets, quick references)
    const tableRowRegex = /^\|(.+)\|$/gm;
    let tableMatch;
    const tableTextParts = [];
    while ((tableMatch = tableRowRegex.exec(content)) !== null) {
      if (/^[\s|:-]+$/.test(tableMatch[1])) continue;
      const cells = tableMatch[1].split('|').map(c => c.replace(/[*`_]/g, '').trim()).filter(Boolean);
      for (const cell of cells) {
        if (cell.length >= 2 && cell.length <= 80 && !/^[\d\s]+$/.test(cell)) {
          tableTextParts.push(cell);
          if (cell.length <= 40) searchableTermsSet.add(cell);
        }
      }
    }
    const cheatSheetText = tableTextParts.join(' ');

    topics.push({
      ...data,
      searchableTerms: Array.from(searchableTermsSet),
      cheatSheetText: cheatSheetText,
      prerequisites: prereqs,
      markdownContent: content
    });
  }
}

// Sort topics by topicNumber
topics.sort((a, b) => (a.topicNumber || 0) - (b.topicNumber || 0));

// Generate sections list dynamically
const sectionsMap = new Map();
for (const topic of topics) {
  const secNum = topic.sectionNumber || 1;
  if (!sectionsMap.has(secNum)) {
    sectionsMap.set(secNum, {
      sectionNumber: secNum,
      title: topic.sectionTitle || `Section ${secNum}`,
      part: topic.part,
      description: topic.shortDescription || '',
      topicIds: []
    });
  }
  const sec = sectionsMap.get(secNum);
  sec.topicIds.push(topic.id);
}
const sections = Array.from(sectionsMap.values()).sort((a, b) => a.sectionNumber - b.sectionNumber);

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topics, null, 2), 'utf-8');
fs.writeFileSync(SECTIONS_FILE, JSON.stringify(sections, null, 2), 'utf-8');
console.log(`Successfully compiled ${topics.length} markdown topics into ${OUTPUT_FILE}`);
console.log(`Successfully compiled ${sections.length} sections into ${SECTIONS_FILE}`);
