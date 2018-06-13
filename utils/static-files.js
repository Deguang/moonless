const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

/**
 * 静态资源中间件
 * @param {string} url：'/static/'
 * @param {string} dir: _dirname + '/static'
 */
const statisFiles = (url = '/static/', dir = __dirname + '/static') => {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        if (rpath.startsWith(url)) {
            let fp = path.join(dir, rpath.substring(url.length));
            if(await fs.exists(fp)) {
                ctx.response.type = mime.getType(rpath);
                ctx.response.body = await fs.readFile(fp);
            } else {
                ctx.response.status = 404;
            }
        } else {
            await next();
        }
    }
}

module.exports = statisFiles;