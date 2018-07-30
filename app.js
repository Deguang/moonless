const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const compress = require('koa-compress');
// const mount = require('mount-koa-routes');
const staticFiles = require('./utils/static-files');
// const path = require('path');
// const views = require('koa-views');
// const nunjucks = require('nunjucks');
// const staticCache = require('koa-static-cache');
const router = require('./app/routes/index')

var app = new Koa();
app.use(bodyParser());
app.use(staticFiles('/static/', __dirname + '/static'));

app.use(compress({
    filter: function (content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))

app.keys = ['sessionTestKey123321'];
app.use(session({
    key: 'Moon:sess',
    maxAge: 2 * 60 * 60 * 1000,
    overwrite: true,
    httpOnly: true,
    signed: true
}, app))
// app.use(views(path.join(__dirname, './app/views'), { map: {html: 'nunjucks', njk: 'nunjucks'}}))

// app.use(staticCache(path.join(__dirname, '/static'), 
//     { dynamic: true },
//     { maxAge: 365 * 24 * 60 * 60 }
// ))

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// mount(app, __dirname + '/app/routes', true);
app.use(router.routes());
app.on('error', async (err, ctx) => {
    console.log('serverError: ', err, ctx)
})

module.exports = app;