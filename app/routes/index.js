const path = require('path');
const router = require('koa-router')();
const view = require('../../utils/view');
const {query} = require('../../utils/mysql');


router.get(['/', '/index', '/home'], async (ctx, next) => {
    let articles = await query('select * from article');
    const v = view.render('./app/views/home.njk', {msg: 'rainning', articles});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
})


router.get('/article/:id', async (ctx, next) => {
    let articleId = ctx.params.id;
    if(!articleId) ctx.redirect('/index');

    let articles = await query('select * from article where id = ' + articleId + ' limit 1');
    if(articles.length !== 1) ctx.redirect('/index');

    const v = view.render('./app/views/article.njk', {article: articles[0]});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

router.get('*', async (ctx, next) => {
    const v = view.render('./static/404.html', {msg: 'rainning'});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

module.exports = router;