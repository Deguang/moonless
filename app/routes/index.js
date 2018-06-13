const path = require('path');
const router = require('koa-router')();
const view = require('../../utils/view');

router.get('1', async (ctx, next) => {
    const v = view.render('./app/views/home.njk', {msg: 'rainning'});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

router.get('2', async (ctx, next) => {
    ctx.body = 'this /2!';
});

// router.get('*', async (ctx, next) => {
//     const v = view.render('./static/404.html', {msg: 'rainning'});
//     await ((ctx, v) => {
//         ctx.body = v;
//     })(ctx, v);
// });

module.exports = router;