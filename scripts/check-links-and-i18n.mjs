import fs from 'fs';
import path from 'path';

console.log('--- Checking for Arabic characters across content/ and src/ ---');
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

let arabicCount = 0;
function scanForArabic(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanForArabic(full);
    } else if (/\.(md|ts|tsx|json|html|css|js|mjs)$/.test(item)) {
      const text = fs.readFileSync(full, 'utf8');
      if (ARABIC_REGEX.test(text)) {
        console.error(`Found Arabic text in: ${full}`);
        arabicCount++;
      }
    }
  }
}

scanForArabic('content');
scanForArabic('src');
console.log(`Arabic scan complete: ${arabicCount} files with Arabic characters.`);

console.log('--- Checking for .NET / C# framing across content/ and src/ ---');
const DOTNET_REGEX = /\b(\.NET|C#|CLR|C-sharp)\b/i;
let dotnetCount = 0;
function scanForDotNet(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanForDotNet(full);
    } else if (/\.(md|ts|tsx)$/.test(item)) {
      const text = fs.readFileSync(full, 'utf8');
      const matches = text.match(DOTNET_REGEX);
      if (matches) {
        console.error(`Found .NET reference in: ${full} -> "${matches[0]}"`);
        dotnetCount++;
      }
    }
  }
}
scanForDotNet('content');
scanForDotNet('src');
console.log(`.NET scan complete: ${dotnetCount} occurrences found.`);
