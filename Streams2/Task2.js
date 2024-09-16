import fs from 'fs';
import { Transform } from 'stream';

//// TASK 2

const readStream = fs.createReadStream('text.txt', { encoding: 'utf8' });

const UpperStream = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

readStream.pipe(UpperStream);

let buffer = ''; 
let index = 0;

UpperStream.on('data', (chunk) => {
  buffer += chunk;
});


UpperStream.on('end', () => {
  const interval = setInterval(() => {
    if (index < buffer.length) {
      console.log(buffer[index]); 
      index++;
    } else {
      clearInterval(interval); 
    }
  }, 100); 
});