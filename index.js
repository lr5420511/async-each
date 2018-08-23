'use strict';

const Series = require('./lib/series');

const each = module.exports = function(ar) {
    return new Series(...ar);
};

each.Series = Series;