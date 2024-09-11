import fs from 'fs';
import { setTimeout } from 'timers/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createStream(filePath) {
  return fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1 });
}

async function printWithDelay(char) {
  await setTimeout(100);
  process.stdout.write(char);
}

const filePath = path.join(__dirname, 'text.txt');

const readableStream = createStream(filePath);

(async () => {
  try {
    for await (const chunk of readableStream) {
      await printWithDelay(chunk);
    }
    console.log('\nЗавершено');
  } catch (error) {
    console.error('Ошибка:', error);
  }
})();