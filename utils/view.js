const nunjucks = require('nunjucks');
const path = require('path');
const marked = require('marked')

const mdParser = marked.setOptions({
    highlight: (code) => require('highlight.js').highlightAuto(code).value
})

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
                    return str || '码路，李德广的技术博客。记录一路走来的风景，成为更好的开发者。';
                    break;
                case 'k':
                    return str || 'Frontend developer, Tech blog, 码路, Deguang, Deguang Li, 李德广, 德广, 前端开发博客, 前端技术博客,';
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
        },
        boolean: function (s) {
            if(typeof s != 'boolean') {
                s = !!s;
            }
            return s;
        },
        mapId: function (id, arr) {
            let res = id;
            arr.some( item => {
                if (item.id == id) {
                    res = item.name
                    return true;
                }
            })
            return res;
        }
    }
});

module.exports = env;