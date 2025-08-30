const { Worker } = require("worker_threads");
const os = require("os");

class WorkerPool {
    constructor(file, size = os.cpus().length) {
        this.workers = [];
        this.idle = [];
        this.queue = [];

        for (let i = 0; i < size; i++) {
            const worker = new Worker(file);
            worker.on("message", (result) => {
                const {
                    resolve
                } = worker.task;
                worker.task = null;
                this.idle.push(worker);
                resolve(result);
                this._next();
            });
            worker.on("error", (err) => {
                if (worker.task) worker.task.reject(err);
                worker.task = null;
                this._replace(worker);
            });
            this.workers.push(worker);
            this.idle.push(worker);
        }
    }

    exec(payload) {
        return new Promise((resolve, reject) => {
            const task = {
                payload,
                resolve,
                reject
            };
            this.queue.push(task);
            this._next();
        });
    }

    _next() {
        if (this.idle.length === 0 || this.queue.length === 0) return;
        const worker = this.idle.pop();
        const task = this.queue.shift();
        worker.task = task;
        worker.postMessage(task.payload);
    }

    _replace(worker) {
        const idx = this.workers.indexOf(worker);
        if (idx !== -1) {
            const newWorker = new Worker(worker.filename);
            this.workers[idx] = newWorker;
            this.idle.push(newWorker);
        }
    }
}

module.exports = WorkerPool;