'use strict';

const BASE_URL = 'https://api.stripe.com/v1';

async function createRefund(orderId, amountCents) {
  const response = await fetch(`${BASE_URL}/refunds`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.STRIPE_API_KEY}` },
    body: new URLSearchParams({ charge: orderId, amount: String(amountCents) }),
  });
  if (!response.ok) throw new Error(`Refund failed: ${response.status}`);
}

module.exports = { createRefund };
