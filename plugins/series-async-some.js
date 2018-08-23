'use strict';

module.exports = function SomeAsyncPlugin(Series) {
    //Regist some command to prototype of Series
    Series.prototype.some = async function(callback, cur = Series.root) {
        callback = callback.bind(cur);
        const src = this.source,
            len = src.length;
        for (let i = 0; i < len; i++) {
            const cont = await callback(src[i], i, src);
            if (cont) return true;
        }
        return false;
    };
};