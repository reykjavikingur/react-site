const React = require('react');
const Router = require('koa-router');
const ReactDOMServer = require('react-dom/server');
const {StaticRouter} = require('react-router-dom');
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

module.exports = router;
