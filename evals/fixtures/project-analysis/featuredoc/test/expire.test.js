'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { isExpired } = require('../src/orders/expire');

test('an unpaid order expires after 24 hours', () => {
  const order = { status: 'unpaid', created_at: '2026-01-01T00:00:00Z' };
  assert.equal(isExpired(order, new Date('2026-01-02T00:00:00Z')), true);
});

test('a paid order never expires', () => {
  const order = { status: 'paid', created_at: '2026-01-01T00:00:00Z' };
  assert.equal(isExpired(order, new Date('2027-01-01T00:00:00Z')), false);
});
