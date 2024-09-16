import fs from 'fs';

//// TASK 1

const readableStream = fs.createReadStream('text.txt', { encoding: 'utf8' });

let buffer = ''; 
let index = 0;

readableStream.on('data', (chunk) => {
  buffer += chunk;
});


readableStream.on('end', () => {
  const interval = setInterval(() => {
    if (index < buffer.length) {
      console.log(buffer[index]);
      index++;
    } else {
      clearInterval(interval); 
    }
  }, 100);
});