const http = require('http');
const app = require('./app');

const server = http.createServer(app.callback());

server.listen($port, () => {
	const address = server.address();
	console.log(`server listening at http://localhost:${address.port}/`);
});
