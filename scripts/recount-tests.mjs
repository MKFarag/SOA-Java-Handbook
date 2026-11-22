import fs from 'fs';
import path from 'path';

const EXAMPLES_DIR = path.resolve('./examples');

function scanDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'classes' && entry.name !== 'war-build') {
      files = files.concat(scanDir(full));
    } else if (entry.isFile() && entry.name.endsWith('.java')) {
      files.push(full);
    }
  }
  return files;
}

const categories = ['core', 'web', 'spring', 'databases', 'enterprise'];
const stats = {};

for (const cat of categories) {
  const dir = path.join(EXAMPLES_DIR, cat);
  const files = scanDir(dir);
  stats[cat] = {
    fileCount: files.length,
    files: files.map(f => {
      const content = fs.readFileSync(f, 'utf8');
      const lines = content.split('\n').length;
      const hasMain = content.includes('public static void main');
      const hasTest = content.includes('@Test');
      const asserts = (content.match(/assert|check|verify|assertEquals|assertTrue|requireNonNull/gi) || []).length;
      return {
        name: path.basename(f),
        lines,
        hasMain,
        hasTest,
        asserts
      };
    })
  };
}

console.log('=== TEST SUITE RECOUNT ===');
for (const cat of categories) {
  console.log(`${cat.toUpperCase()}: ${stats[cat].fileCount} java files`);
}

// Database breakdown (topics 120 - 131)
console.log('\n=== DATABASE EXAMPLES BREAKDOWN (Topics 120-131) ===');
for (const file of stats.databases.files) {
  console.log(`- ${file.name} (${file.lines} lines, hasMain: ${file.hasMain}, assertions/checks: ${file.asserts})`);
}
