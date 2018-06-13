const path = require('path');
const router = require('koa-router')();
const view = require('../../utils/view');

router.get('1', async (ctx, next) => {
    const v = view.render('home.njk', {msg: 'rainning'});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

router.get('2', async (ctx, next) => {
    ctx.body = 'this /2!';
});

module.exports = router;