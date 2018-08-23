'use strict';

module.exports = function ReduceAsyncPlugin(Series) {
    Series.prototype.reduce = async function(callback) {
        const args = [].slice.call(arguments),
            src = this.source,
            len = src.length;
        let res = args.length > 1 ? args[1] : src[0];
        for (let i = args.length > 1 ? 0 : 1; i < len; i++) {
            res = await callback(res, src[i], i, src);
        }
        return res;
    };
};