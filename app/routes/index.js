const path = require('path');
const router = require('koa-router')();
const view = require('../../utils/view');
const {query} = require('../../utils/mysql');
const fs = require('fs');
const mdParser = require('marked');


// 首页 文章列表页
router.get(['/', '/index', '/articles'], async (ctx, next) => {
    let articles = await query('select * from article order by addtime desc');
    const v = view.render('./app/views/article/list.njk', {articles});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 文章页
router.get('/article/detail/:slug', async (ctx, next) => {
    let slug = ctx.params.slug;
    if(!slug) ctx.redirect('/index');

    let articles = await query(`select * from article where slug = '${slug}' limit 1`);
    if(articles.length !== 1) ctx.redirect('/index');

    const v = view.render('./app/views/article/detail.njk', {article: articles[0]});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 登录页
router.get('/admin/login', async (ctx, next) => {
    const v = view.render('./app/views/admin/login.njk');
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 登录
router.post('/admin/login', async (ctx, next) => {
    let {name, password} = ctx.request.body;
    let pwds = await query(`select password from user where username = '${name}'`);
    if (pwds.length != 1) ctx.redirect('/admin');
    if (pwds[0].password != password) {
        ctx.data = {
            error: `userName or password is incorrect`
        };
    } else {
        ctx.session.user = name
        ctx.response.redirect('/admin/list');
    }
});

// 文章列表页（管理）
router.get(['/admin/list', '/admin/'], async (ctx, next) => {
    if(!ctx.session.user) {
        ctx.response.redirect('/admin/login');
    }
    let articles = await query('select * from article order by addtime desc');
    const v = view.render('./app/views/admin/list.njk', {articles});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 文章编辑页（管理）
router.get('/admin/edit/:id', async (ctx, next) => {
    if(!ctx.session.user) {
        ctx.response.redirect('/admin/login');
    }
    let id = ctx.params.id;
    if(!id) ctx.redirect('/admin/list');

    let articles = await query(`select * from article where id = '${id}' limit 1`);
    if(articles.length !== 1) ctx.redirect('/index');

    let categories = await query(`select * from category`);

    const v = view.render('./app/views/admin/edit.njk', {article: articles[0], categories});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 关于
router.get('/about', async (ctx, next) => {
    const content = fs.readFileSync('static/md/about.md', 'utf8', function(err, data) {
        if (err) next();
        return data;
    });
    const v = view.render('./app/views/about.njk', {content});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 友链
router.get('/friends', async (ctx, next) => {
    const content = fs.readFileSync('static/md/friends.md', 'utf8', function(err, data) {
        if (err) next();
        return data;
    });
    const v = view.render('./app/views/friends.njk', {content});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});


// 转换md到html
router.post('/tool/parser-md-to-html', async (ctx, next) => {
    const md = ctx.request.body.md;
    if(!md) {
        ctx.response.body = {
            status: false,
            message: '参数异常'
        }
        return;
    }
    const html = mdParser(md);

    ctx.response.body = {
        status: true,
        message: '转换成功',
        data: {
            html
        }
    }
})

// 404
router.get('*', async (ctx, next) => {
    const v = view.render('./app/views/404.njk');
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

module.exports = router;