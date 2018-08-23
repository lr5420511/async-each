'use strict';

module.exports = function SortAsyncPlugin(Series) {
    Series.prototype.sort = async function(callback) {
        const src = this.source,
            len = src.length;
        let n = 0;
        while (n++ < len) {
            const cur = src.pop();
            for (let i = 0; i < n - 1; i++) {
                const res = await callback(src[i], cur);
                res > 0 && (src.splice(i, 0, cur));
                if (res > 0) break;
            }
            len > src.length && (
                src.splice(n - 1, 0, cur)
            );
        }
        return src;
    };
};