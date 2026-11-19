import fs from 'fs';
import readline from 'readline';

const file = 'C:/Users/modym/.gemini/antigravity/brain/e2334513-7027-47f3-935f-566b7f9beb07/.system_generated/logs/transcript_full.jsonl';
const rl = readline.createInterface({ input: fs.createReadStream(file) });

let lineNum = 0;
const history = [];

rl.on('line', line => {
  lineNum++;
  if (line.includes('topics.ts')) {
    try {
      const obj = JSON.parse(line);
      const calls = obj.tool_calls || [];
      for (const call of calls) {
        if ((call.arguments?.Path || call.args?.Path || '').includes('topics.ts')) {
          history.push({
            lineNum,
            tool: call.name,
            keys: Object.keys(call.arguments || call.args || {})
          });
        }
      }
    } catch (e) {}
  }
});

rl.on('close', () => {
  console.log('Found history entries:', history);
});
