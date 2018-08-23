'use strict';

const ReduceWare = require('./plugins/series-async-reduce');
const SomeWare = require('./plugins/series-async-some');
const SortWare = require('./plugins/series-async-sort');

module.exports = [ReduceWare, SomeWare, SortWare];