require('@babel/polyfill');
const http = require('http');
const app = require('./app');

const server = http.createServer(app.callback());

const port = parseInt(process.env.PORT) || $defaultPort;

server.listen(port, () => {
    setTimeout(() => {
        const address = server.address();
        console.log(`server listening on port ${address.port}`);
    }, 250);
});
