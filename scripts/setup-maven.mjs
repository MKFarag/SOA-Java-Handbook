import https from 'https';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const destDir = path.resolve('../maven-bin');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
const zipPath = path.join(destDir, 'maven.zip');

console.log('Downloading Maven 3.9.9...');
const file = fs.createWriteStream(zipPath);

https.get('https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip', (res) => {
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    https.get(res.headers.location, (redirectRes) => {
      redirectRes.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('Downloaded. Extracting...');
          execSync(`tar -xf "${zipPath}" -C "${destDir}"`);
          console.log('Extraction complete!');
        });
      });
    });
    return;
  }
  res.pipe(file);
  file.on('finish', () => {
    file.close(() => {
      console.log('Downloaded. Extracting...');
      execSync(`tar -xf "${zipPath}" -C "${destDir}"`);
      console.log('Extraction complete!');
    });
  });
}).on('error', (err) => {
  console.error('Download error:', err.message);
});
