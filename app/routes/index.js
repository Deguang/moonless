const path = require('path');
const router = require('koa-router')();
const view = require('../../utils/view');
const {query} = require('../../utils/mysql');


// 首页， 文章列表页
router.get(['/', '/index', '/home'], async (ctx, next) => {
    let articles = await query('select * from article');
    const v = view.render('./app/views/home.njk', {msg: 'rainning', articles});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
})

// 文章页
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

// 登录页
router.get(['/admin/login', '/admin/'], async (ctx, next) => {
    const v = view.render('./app/views/admin/login.njk');
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 登录
router.post('/login', async (ctx, next) => {
    let {name, password} = ctx.request.body;
    let pwds = await query('select password from user where name ')
    ctx.redirect('/')
});

// 文章列表页（管理）
router.get('/admin/list', async (ctx, next) => {
    const v = view.render('./app/views/admin/list.njk');
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 404
router.get('*', async (ctx, next) => {
    const v = view.render('./static/404.html', {msg: 'rainning'});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

module.exports = router;