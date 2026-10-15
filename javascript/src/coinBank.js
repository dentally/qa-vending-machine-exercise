import { DENOMINATIONS } from "./money.js";

// Holds the coins the machine has available to give as change.
export class CoinBank {
  constructor(counts = {}) {
    this.counts = {};
    for (const denomination of DENOMINATIONS) {
      this.counts[denomination] = counts[denomination] ?? 0;
    }
  }

  add(cents) {
    this.counts[cents] = (this.counts[cents] ?? 0) + 1;
  }

  addAll(coins) {
    for (const coin of coins) {
      this.add(coin);
    }
  }

  countOf(cents) {
    return this.counts[cents] ?? 0;
  }

  total() {
    return DENOMINATIONS.reduce(
      (sum, denomination) => sum + denomination * this.counts[denomination],
      0
    );
  }

  // Returns the coins to pay out, or null when the amount cannot be made.
  makeChange(amount) {
    if (amount === 0) {
      return [];
    }

    const coins = [];
    let remaining = amount;

    for (const denomination of DENOMINATIONS) {
      let available = this.counts[denomination];
      while (available > 0 && denomination <= remaining) {
        coins.push(denomination);
        remaining -= denomination;
        available -= 1;
      }
    }

    return remaining > 0 ? null : coins;
  }

  withdraw(coins) {
    for (const coin of coins) {
      this.counts[coin] -= 1;
    }
  }

  clear() {
    for (const denomination of DENOMINATIONS) {
      this.counts[denomination] = 0;
    }
  }
}
