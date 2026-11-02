CREATE TABLE customers (
  id BIGINT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers (id),
  status TEXT NOT NULL CHECK (status IN ('unpaid', 'paid', 'cancelled', 'refunded')),
  total_cents INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL
);
