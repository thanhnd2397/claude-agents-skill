'use strict';

const { summarize, STATUSES } = require('../src/reports');

for (const status of STATUSES) summarize(status);
