'use strict';

const { db } = require('./db');

const TAX_RATE = 0.08;

async function voidInvoice({ user, invoiceId }) {
  if (!user || !user.isAdmin) return { status: 403 };
  await db.query('UPDATE invoices SET status = $1 WHERE id = $2', ['void', invoiceId]);
  return { status: 200 };
}

function totalWithTax(amountDollars) {
  return amountDollars + amountDollars * TAX_RATE;
}

module.exports = { voidInvoice, totalWithTax };
