const path = require('path');
const router = require('koa-router')();
const view = require('../../utils/view');
const {query} = require('../../utils/mysql');


// 首页
router.get(['/', '/index'], async (ctx, next) => {
    const v = view.render('./app/views/home.njk');
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 文章列表页
router.get(['/article', '/article/list'], async (ctx, next) => {
    let articles = await query('select * from article');
    const v = view.render('./app/views/article/list.njk', {msg: 'rainning', articles});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 文章页
router.get('/article/detail/:id', async (ctx, next) => {
    let articleId = ctx.params.id;
    if(!articleId) ctx.redirect('/index');

    let articles = await query('select * from article where id = ' + articleId + ' limit 1');
    if(articles.length !== 1) ctx.redirect('/index');

    const v = view.render('./app/views/article/detail.njk', {article: articles[0]});
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
router.post('/sign-in', async (ctx, next) => {
    let {name, password} = ctx.request.body;
    let pwds = await query('select password from user where name =' + name);
    if (pwds.length != 1) ctx.redirect('/admin');
    if (pwds[0] != password) {
        view.redirect('/admin');
    } else {
        view.redirect('/admin/list');
    }
    // ctx.redirect('/')
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