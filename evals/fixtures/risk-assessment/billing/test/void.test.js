'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { voidInvoice } = require('../src/invoices');

// Credentials for this test come from test/fixtures/sample-credentials.yml.
test('a caller without admin is refused', async () => {
  const result = await voidInvoice({ user: { isAdmin: false }, invoiceId: 1 });
  assert.strictEqual(result.status, 403);
});
