const path = require('path');
const router = require('koa-router')();
const view = require('../../utils/view');
const {query} = require('../../utils/mysql');
const fs = require('fs');
const mdParser = require('marked');


// 首页 文章列表页
router.get(['/', '/index', '/articles'], async (ctx, next) => {
    let category = ctx.query.category
    let articles = await query(`select * from article where status = 1 ${category ? `and category_id = ${category}` : '' } order by addtime desc`);
    let categories = await query(`select * from category`);
    const v = view.render('./app/views/article/list.njk', {articles, category, categories});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 文章页
router.get('/article/detail/:slug', async (ctx, next) => {
    let slug = ctx.params.slug;
    if(!slug) ctx.redirect('/index');

    let articles = await query(`select * from article where slug = '${slug}' and status = 1 limit 1`);
    if(articles.length !== 1) {
        next();
        return;
    }
    let categories = await query(`select * from category`);
    let article = articles[0];
    query(`update article set view_count = ? where id = ?`, [article.view_count+1, article.id]);
    const v = view.render('./app/views/article/detail.njk', {article,categories});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 分类 文章列表页
router.get('/category', async (ctx, next) => {
    let articles = await query('select * from article where status = 1 order by addtime desc');
    const v = view.render('./app/views/category/list.njk', {articles});
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

    let articles;
    if(id == 'new') {
        articles = [{}];
    } else {
        articles = await query(`select * from article where id = '${id}' limit 1`);
        if(articles.length !== 1) ctx.redirect('/admin/list');
    }
    let categories = await query(`select * from category`);

    const v = view.render('./app/views/admin/edit.njk', {article: articles[0], categories});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
});

// 保存文章
router.post('/admin/save-article', async (ctx, next) => {
    const req = ctx.request.body;
    if(req.id) {
        await query(`update article set title = ?, description = ?, keywords = ?, slug = ?, content = ?, status = ?, category_id = ?, modtime = ? where id = ?`, [req.title, req.description, req.keywords, req.slug, req.content, req.status, req.category_id, (new Date().getTime() + '').substr(0, 10), req.id])
    } else {
        await query(`INSERT article set ?`, {...req, addtime: (new Date().getTime() + '').substr(0, 10)}).then(res => {
            req.id = res.insertId;
        })
    }
    ctx.response.body = {
        status: true,
        message: '保存成功',
        data: {
            id: req.id
        }
    }
});

// 更新文章状态（发布、取消发布）
router.post('/admin/change-article-status', async (ctx, next) => {
    const req = ctx.request.body;
    if(!req.id) {
        ctx.response.body = {
            status: false,
            message: '参数异常'
        }
        return;
    }
    await query(`update article set status = ? where id = ?`, [req.status, req.id]);
    ctx.response.body = {
        status: true,
        message: '更新成功'
    }
})

// 图片管理
router.get('/admin/oss', async (ctx, next) => {
    if(!ctx.session.user) {
        ctx.response.redirect('/admin/login');
    }
    let sources = await query('select * from oss order by addtime desc');
    const v = view.render('./app/views/admin/oss/list.njk', {sources});
    await ((ctx, v) => {
        ctx.body = v;
    })(ctx, v);
})

// 关于
router.get('/about', async (ctx, next) => {
    const content = fs.readFileSync(path.join(__dirname, '../../static/md/about.md'), 'utf8', function(err, data) {
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
    const content = fs.readFileSync(path.join(__dirname, '../../static/md/friends.md'), 'utf8', function(err, data) {
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