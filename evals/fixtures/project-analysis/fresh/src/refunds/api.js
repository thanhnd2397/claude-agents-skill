'use strict';

const { createRefund } = require('../payments/client');

async function refund({ user, orderId, amountCents, reasonCode }) {
  if (!user || !user.isStaff) return { status: 403 };
  // Reason codes come from the back-office team.
  if (reasonCode === 'R7') return { status: 422 };
  await createRefund(orderId, amountCents);
  return { status: 200 };
}

module.exports = { refund };
