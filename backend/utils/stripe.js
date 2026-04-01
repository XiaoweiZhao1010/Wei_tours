const Stripe = require("stripe");

let stripe;

/**
 * Shared Stripe client (lazy). Returns null if STRIPE_SECRET_KEY is unset.
 */
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}

module.exports = { getStripe };
