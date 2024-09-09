import EventEmitter from 'events';

////////////////////// TASK 1 ///////////////////
console.log("Завдання 1");

const emitter = new EventEmitter();

emitter.on('on_click', () => {
    console.log('клік 1');
});

emitter.on('on_click', () => {
    console.log('клік 2');
});

emitter.on('on_click', () => {
    console.log('клік 3');
});


emitter.emit('on_click');




////////////////////// TASK 2 ////////////////////////


console.log("\nЗавдання 2");

const emitter2 = new EventEmitter();


const handler1 = () => {
    console.log('Помилка 1');
};

const handler2 = () => {
    console.log('Помилка 2');
};

const handler3 = () => {
    console.log('Помилка 3');
};


emitter2.on('error', handler1);
emitter2.on('error', handler2);
emitter2.on('error', handler3);


emitter2.off('error', handler2); 

emitter2.emit('error');



///////////////////// TASK 3 //////////////////////

console.log("\nЗавдання 3");


class Dice extends EventEmitter {
    roll() {
        const res = Math.floor(Math.random() * 6) + 1;
        this.emit('rolled', res); 
    }
}

const dice = new Dice();


dice.on('rolled', (res) => {
    console.log(`Випало: ${res}`);
});

dice.roll(); 



//////////////// TASK 4 //////////////////////////////

console.log("\nЗавдання 4")

class Logger extends EventEmitter {
    info(message) {
        this.emit('info', message); 
    }
    warn(message) {
        this.emit('warn', message);
    }
    error(message) {
        this.emit('error', message);
    }
}

const log = new Logger();

log.on('info', (message) => {
    console.log(`INFO: ${message}`);
});

log.on('warn', (message) => {
    console.log(`WARN: ${message}`);
});

log.on('error', (message) => {
    console.log(`ERROR: ${message}`);
});

log.info('Start');
log.warn('low power');
log.error('Blue screen Windows');