const express = require('express');
const { Worker } = require('node:worker_threads');
const app = express();

app.get('/io/slow', async (req, res) => {
    const data = await getDBUserSlow();
    res.json(data);
});

app.get('/io/fast', async (req, res) => {
    const data = await getDBUserFast();
    res.json(data);
});

app.get('/cpu/slow', async (req, res) => {
    const data = await getDBUserSlow();
    let sum = 0;
    for (let i = 0; i < 1e7; i++) sum += i;
    res.json(data);
});

app.get('/cpu/fast', async (req, res) => {
    const data = await getDBUserFast();
    
    await new Promise((res, rej) => {
        const worker = new Worker('cpu-worker.js');
        worker.once("message", res);
        worker.once("error", rej);
        worker.postMessage({ iterations: 1e7 });
    });
    res.json(data);
});

async function getDBUserSlow() {
    const response = await fetch('http://localhost:4000/query/slow');
    return await response.json();
}

async function getDBUserFast() {
    const response = await fetch('http://localhost:4000/query/fast');
    return await response.json();
}

app.listen(3000, () => console.log('Backend running on port 3000'));