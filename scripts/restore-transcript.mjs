import fs from 'fs';
import readline from 'readline';

const file = 'C:/Users/modym/.gemini/antigravity/brain/e2334513-7027-47f3-935f-566b7f9beb07/.system_generated/logs/transcript_full.jsonl';
const rl = readline.createInterface({ input: fs.createReadStream(file) });

let lineNum = 0;
let bestContent = null;
let bestLength = 0;
let bestLine = 0;

rl.on('line', line => {
  lineNum++;
  if (line.includes('src/data/topics.ts') || line.includes('src\\\\data\\\\topics.ts')) {
    try {
      const obj = JSON.parse(line);
      const calls = obj.tool_calls || [];
      for (const call of calls) {
        const p = call.arguments?.Path || call.args?.Path || '';
        if (p.includes('topics.ts')) {
          const content = call.arguments?.Content || call.args?.Content || '';
          if (content.length > bestLength) {
            bestLength = content.length;
            bestContent = content;
            bestLine = lineNum;
          }
        }
      }
    } catch (e) {}
  }
});

rl.on('close', () => {
  console.log(`Best write found at line ${bestLine} with length ${bestLength}`);
  if (bestContent) {
    fs.writeFileSync('src/data/topics.ts', bestContent, 'utf-8');
    console.log('Successfully restored topics.ts with full content!');
  }
});
