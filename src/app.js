const express = require('express');
const app = express();
const port = 3000;

let publicUrls = [
    '/url1',
    '/url2',
    '/login'
];
const generateRandomToken = () => {
    const tokenLength = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

function loggerMiddleware(req, res, next) {
    console.log("Nouvelle requête entrante");
    next(); 
}

let globalToken = null;

const logHeadersMiddleware = (req, res, next) => {
    console.log("Contenu des en-têtes de la requête :");
    console.log(req.headers);
    next();
};

const authorizationMiddleware = (req, res, next) => {
    const clientToken = req.headers.authorization;

    if (clientToken === globalToken) {
        next();
    } else {
        res.status(403).json({ message: "Accès non autorisé" });
    }
};

app.use(loggerMiddleware,logHeadersMiddleware,myMiddleware);

app.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
    const token = generateRandomToken();
    globalToken = token;
    res.json({ token: token });
});

app.get('/url1', (req, res) => {
    res.send('Hello World!');
});

app.get('/url2', (req, res) => {
    res.send('Hello World!');
});

app.get('/private/url1',authorizationMiddleware, (req, res) => {
    res.send('Hello, it is secret');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
