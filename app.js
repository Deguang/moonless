const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const mount = require('mount-koa-routes');
const path = require('path');
const views = require('koa-views');
const nunjucks = require('nunjucks');
const staticCache = require('koa-static-cache');

var app = new Koa();
app.use(bodyParser());

app.use(views(__dirname, { map: {html: 'nunjucks', njk: 'nunjucks'}}))

app.use(staticCache(path.join(__dirname, './public'), 
    { dynamic: true },
    { maxAge: 365 * 24 * 60 * 60 }
))

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

mount(app, __dirname + '/app/routes', true);
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