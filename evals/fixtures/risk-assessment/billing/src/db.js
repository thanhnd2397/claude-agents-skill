'use strict';

const db = {
  async query(sql, params) {
    throw new Error('not wired up in this fixture');
  },
};

module.exports = { db };
