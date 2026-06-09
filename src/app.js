const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('E-Commerce Backend Running...');
});

app.post('/api/test', (req, res) => {
    console .log(req.body);
    res.json({
        success: true,
        receivedData: req.body
    });
});

module.exports = app;