require('@babel/polyfill');
const http = require('http');
const app = require('./app');

const server = http.createServer(app.callback());

const port = parseInt(process.env.PORT) || $defaultPort;

server.listen(port, () => {
	const address = server.address();
	console.log(`server listening at http://localhost:${address.port}/`);
});
