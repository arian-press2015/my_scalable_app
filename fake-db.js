const express = require('express');
const crypto = require('node:crypto');
const app = express();

app.get('/query/fast', (req, res) => {
    crypto.pbkdf2("password", "salt", 10000, 64, "sha512", () => {
        res.json({
            id: 1,
            username: "johndoe",
            isActive: true,
        });
    });
});

app.get('/query/slow', (req, res) => {
    crypto.pbkdf2("password", "salt", 100000, 64, "sha512", () => {
        res.json({
            id: 1,
            username: "johndoe",
            isActive: true,
        });
    });
});

app.listen(4000, () => console.log('DB simulator running on port 4000'));