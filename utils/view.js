const nunjucks = require('nunjucks');
const path = require('path');
const mdParser = require('marked');

const createEnv = (path, opts) => {
    var autoescape = opts.autoescape && true,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCache,
                watch
            }), {
                autoescape,
                throwOnUndefined
            }
        );

    if(opts.filters) {
        for(var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}
var env = createEnv(path.join(__dirname, '../'), {
    watch: true,
    filters: {
        tdk: function (str, type) {
            str = str || '';
            switch(type) {
                case 't':
                    return str + (str.length ? '-' : '');
                    break;
                case 'd':
                    return str || '前端开发者的开发笔记，记录前端成长道路上的点滴收获。';
                    break;
                case 'k':
                    return str || 'Frontend developer, Tech blog, Moonless, Deguang, Deguang Li, 李德广, 德广, 前端开发博客';
                    break;
                default:
                    return '';
            }
        },
        dateFormat: function (d) {
            let date = new Date(d * 1000),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();

            month < 10 && (month = '0' + month);
            day < 10 && (day = '0' + day);

            return `${year}-${month}-${day}`;
        },
        mdFilter: function (md) {
            return mdParser(md);
        }
    }
});

module.exports = env;