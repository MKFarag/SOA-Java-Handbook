import fs from 'fs';
import readline from 'readline';

const file = 'C:/Users/modym/.gemini/antigravity/brain/e2334513-7027-47f3-935f-566b7f9beb07/.system_generated/logs/transcript_full.jsonl';
const rl = readline.createInterface({ input: fs.createReadStream(file) });

let lineNum = 0;
rl.on('line', line => {
  lineNum++;
  if (lineNum === 124) {
    const obj = JSON.parse(line);
    console.log('type:', obj.type, 'tool_calls:', obj.tool_calls?.map(c => ({ name: c.name, args: Object.keys(c.arguments || c.args || {}) })));
    process.exit(0);
  }
});
