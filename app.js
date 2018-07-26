const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
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

app.keys = ['sessionTestKey123321'];
app.use(session({
    key: 'koa:sess',
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
app.on('error', (err, ctx) => {
    console.log('serverError: ', err, ctx)
})

// app.use(async(ctx, next) => {
//     try {
//       await next()
//       const status = ctx.status || 404
//       if (status === 404) {
//           ctx.throw(404)
//       }
//     } catch (err) {
//       ctx.status = err.status || 500
//       if (ctx.status === 404) {
//         await ctx.render('./public/404')
//       } else {
//         await ctx.render('./public/500')
//       }
//     }
//   })
module.exports = app;