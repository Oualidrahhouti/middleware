const express = require('express');
const app = express();
const port = 3000;

let publicUrls = [
    '/url1',
    '/url2',
    '/login'
];

function loggerMiddleware(req, res, next) {
    console.log("Nouvelle requête entrante");
    next(); 
}

function myMiddleware(req, res, next) {
    const requestedUrl = req.path;

    if (publicUrls.includes(requestedUrl)) {
        next(); 
    } else {
        const authToken = req.headers.authorization;
        if (authToken && authToken === 'Bearer 42') {
            next(); 
        } else {
            res.status(403).send('Forbidden');
        }
    }
}

app.use(loggerMiddleware,myMiddleware);

app.post('/login', (req, res) => {
    // Generate and return a unique token (for simplicity, just returning a hardcoded token)
    res.json({ token: '42' });
});

app.get('/url1', (req, res) => {
    res.send('Hello World!');
});

app.get('/url2', (req, res) => {
    res.send('Hello World!');
});

app.get('/private/url1', (req, res) => {
    res.send('Hello, it is secret');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
