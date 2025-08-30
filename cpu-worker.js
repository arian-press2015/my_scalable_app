const { parentPort } = require('node:worker_threads');

parentPort.on('message', (msg) => {
    let sum = 0;
    for (let i = 0; i < msg.iterations; i++) sum += i;
    parentPort.postMessage(sum);
});