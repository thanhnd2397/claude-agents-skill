'use strict';

const { db } = require('./db');

async function purge(table) {
  await db.query(`DELETE FROM ${table}`);
}

module.exports = { purge };
