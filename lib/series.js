'use strict';

const Series = module.exports = function() {
    this.source = [].slice.call(arguments);
};

//Get root object
const root = Series.root = (function() {
    return this;
})();

Series.prototype = {
    constructor: Series,
    forEach: async function(callback, cur = root) {
        callback = callback.bind(cur);
        const src = this.source,
            len = src.length;
        for (let i = 0; i < len; i++) {
            await callback(src[i], i, src);
        }
    },
    every: async function(callback, cur = root) {
        callback = callback.bind(cur);
        const src = this.source,
            len = src.length;
        for (let i = 0; i < len; i++) {
            const cont = await callback(src[i], i, src);
            if (!cont) return false;
        }
        return true;
    },
    map: async function(callback, cur = root) {
        callback = callback.bind(cur);
        const src = this.source,
            len = src.length,
            res = [];
        for (let i = 0; i < len; i++) {
            res[i] = await callback(src[i], i, src);
        }
        return res;
    },
    filter: async function(callback, cur = root) {
        callback = callback.bind(cur);
        const src = this.source,
            len = src.length,
            res = [];
        for (let i = 0; i < len; i++) {
            const vaild = await callback(src[i], i, src);
            if (vaild) res.push(src[i]);
        }
        return res;
    }
};

//Inside install plugins
Series.plugins = require('../config').filter(plugin =>
    plugin(Series) || true
);