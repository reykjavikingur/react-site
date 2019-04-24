const Koa = require('koa');
const logger = require('koa-logger');
const mount = require('koa-mount');
const serveStatic = require('koa-static');
const path = require('path');
const router = require('./router');

const interceptError = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = 'Internal Server Error';
        ctx.app.emit('error', err, ctx);
    }
};

const reportError = (err, ctx) => {
    console.log('ERROR:', err.message);
};

const server = new Koa();

server
    .use(interceptError)
    .use(logger())
    .use(mount('/static', serveStatic(path.resolve($dirname, 'static'))))
    .use(mount('/styles', serveStatic(path.resolve($dirname, 'styles'))))
    .use(mount('/scripts', serveStatic(path.resolve($dirname, 'scripts'))))
    .use(router.routes())
    .on('error', reportError)
;

module.exports = server;
