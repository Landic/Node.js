
///////////////////////////// TASK 1 ////////////////////////

console.log("TASK 1");

import path from 'path';
import Logger from './logger.js'; 
import fs from 'fs';


const logger = new Logger('logger.log');

logger.info('Информация')
.then(() => logger.warn('Предупреждение'))
.then(() => logger.error('Ошибка'))
.then(() => {
    console.log(logger.readLogsSync());
    return logger.readLogs();
})
.then(logs => console.log(logs))
.catch(err => console.error('Ошибка:', err));



/////////////////////// TASK 2 ///////////////////////////////

setTimeout(() => 
    {
        console.log("\nTASK 2");

        const __dirname = import.meta.dirname;
        const data = fs.readFileSync(path.join(__dirname, 'text.txt'), 'utf8');

        const lines = data.split('\n');
        console.log(`Количество строк -> ${lines.length}`);
}, 500);
