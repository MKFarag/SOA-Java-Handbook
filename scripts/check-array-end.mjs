import fs from 'fs';

const content = fs.readFileSync('src/data/topics.ts', 'utf-8');
const endArrIdx = content.indexOf('\n];\n\nexport function getTopicById');
console.log('endArrIdx:', endArrIdx);
console.log('Context before end of array:');
console.log(content.substring(endArrIdx - 200, endArrIdx + 50));
