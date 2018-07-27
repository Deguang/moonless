const nunjucks = require('nunjucks');
const path = require('path');

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
        hex: function (n) {
            return '0x' + n.toString(16);
        },
        dateFormat: function (d) {
            let date = new Date(d * 1000),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();

            month < 10 && (month = '0' + month);
            day < 10 && (day = '0' + day);

            return `${year}-${month}-${day}`;
        }
    }
});

module.exports = env;