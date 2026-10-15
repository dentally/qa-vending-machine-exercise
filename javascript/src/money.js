// Every amount in this application is a whole number of cents.

export const DENOMINATIONS = [200, 100, 50, 20, 10, 5];

export function isValidCoin(cents) {
  return DENOMINATIONS.includes(cents);
}

export function formatCents(cents) {
  if (cents < 100) {
    return `${cents}c`;
  }
  return `$${cents / 100}`;
}

export function describeCoins(coins) {
  if (!coins || coins.length === 0) {
    return "none";
  }
  return coins.map(formatCents).join(", ");
}
