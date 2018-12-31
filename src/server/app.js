const Koa = require('koa');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const {StaticRouter} = require('react-router-dom');
const Router = require('koa-router');
const logger = require('koa-logger');
const staticCache = require('koa-static-cache');
const path = require('path');
const Html = require('./Html');

const router = new Router();

router.get('*', (ctx) => {
	ctx.set('Content-Type', 'text/html');
	const context = {};
	const html = ReactDOMServer.renderToStaticMarkup(
		<StaticRouter location={ctx.req.url} context={context}>
			<Html title="Site"></Html>
		</StaticRouter>
	);
	if (context.url) {
		ctx.redirect(context.url);
	}
	else {
		if (context.lost) {
			ctx.status = 404;
		}
		ctx.body = html;
	}
});

const server = new Koa();

server.use(logger());
server.use(staticCache(path.resolve($dirname, 'static'), {prefix: '/static'}));
server.use(staticCache(path.resolve($dirname, 'styles'), {prefix: '/styles'}));
server.use(staticCache(path.resolve($dirname, 'scripts'), {prefix: '/scripts'}));
server.use(router.routes());

module.exports = server;
