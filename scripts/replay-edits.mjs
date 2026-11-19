import fs from 'fs';
import readline from 'readline';

const file = 'C:/Users/modym/.gemini/antigravity/brain/e2334513-7027-47f3-935f-566b7f9beb07/.system_generated/logs/transcript_full.jsonl';
const rl = readline.createInterface({ input: fs.createReadStream(file) });

let lineNum = 0;
let baseContent = null;
const edits = [];

rl.on('line', line => {
  lineNum++;
  if (lineNum === 124) {
    const obj = JSON.parse(line);
    const call = obj.tool_calls.find(c => c.name === 'write_file');
    baseContent = call.args?.Content || call.arguments?.Content;
  } else if ([149, 250, 306, 348, 412, 440, 451, 494, 549, 586, 603, 605, 648].includes(lineNum)) {
    const obj = JSON.parse(line);
    const call = obj.tool_calls.find(c => c.name === 'edit_file');
    if (call) {
      const args = call.args || call.arguments;
      edits.push({
        lineNum,
        target: args.Target,
        replacement: args.Replacement
      });
    }
  }
});

rl.on('close', () => {
  console.log(`Loaded base content (${baseContent.length} chars) and ${edits.length} edits.`);
  let content = baseContent;
  for (const edit of edits) {
    if (content.includes(edit.target)) {
      content = content.replace(edit.target, edit.replacement);
      console.log(`Applied edit from line ${edit.lineNum}`);
    } else {
      console.warn(`WARNING: Target not found for edit line ${edit.lineNum}!`);
    }
  }
  fs.writeFileSync('src/data/topics.ts', content, 'utf-8');
  console.log('Saved replayed topics.ts (length:', content.length, ')');
});
