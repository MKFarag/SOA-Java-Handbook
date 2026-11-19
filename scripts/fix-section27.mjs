import fs from 'fs';
let src = fs.readFileSync('scripts/section27-data.mjs', 'utf8');
src = src.replace(/\s+deepDive:\s*\{[\s\S]*?\n\s*\},/g, '');
fs.writeFileSync('scripts/section27-data.mjs', src, 'utf8');
console.log('Removed deepDive from scripts/section27-data.mjs');
