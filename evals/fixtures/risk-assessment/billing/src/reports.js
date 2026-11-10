'use strict';

const { db } = require('./db');

const STATUSES = ['paid', 'void', 'overdue'];

// Called only by scripts/nightly.js, once per status in STATUSES.
async function summarize(status) {
  return db.query(`SELECT count(*) FROM invoices WHERE status = '${status}'`);
}

module.exports = { summarize, STATUSES };
