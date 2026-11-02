'use strict';

const UNPAID_ORDER_TTL_HOURS = 24;

function isExpired(order, now = new Date()) {
  if (order.status !== 'unpaid') return false;
  const ageHours = (now - new Date(order.created_at)) / 3_600_000;
  return ageHours >= UNPAID_ORDER_TTL_HOURS;
}

module.exports = { isExpired, UNPAID_ORDER_TTL_HOURS };
