import { isValidCoin } from "./money.js";
import { CoinBank } from "./coinBank.js";

export const Outcome = {
  DISPENSED: "DISPENSED",
  UNKNOWN_PRODUCT: "UNKNOWN_PRODUCT",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  INSUFFICIENT_CREDIT: "INSUFFICIENT_CREDIT",
  EXACT_CHANGE_REQUIRED: "EXACT_CHANGE_REQUIRED",
};

// The rules of the machine. This class knows nothing about consoles or keyboards:
// it takes values in and returns values out, so it can be tested directly.
export class VendingMachine {
  constructor({ products, bank }) {
    this.products = products;
    this.bank = bank instanceof CoinBank ? bank : new CoinBank(bank);
    this.credit = 0;
    this.insertedCoins = [];
  }

  insertCoin(cents) {
    if (!isValidCoin(cents)) {
      return { accepted: false, coin: cents, credit: this.credit };
    }

    this.insertedCoins.push(cents);
    this.credit += cents;
    return { accepted: true, coin: cents, credit: this.credit };
  }

  findProduct(code) {
    const wanted = String(code).trim().toUpperCase();
    return this.products.find((product) => product.code.toUpperCase() === wanted);
  }

  stockOf(code) {
    const product = this.findProduct(code);
    return product ? product.stock : 0;
  }

  selectProduct(code) {
    const product = this.findProduct(code);

    if (!product) {
      return { outcome: Outcome.UNKNOWN_PRODUCT, code };
    }

    if (product.stock <= 0) {
      return { outcome: Outcome.OUT_OF_STOCK, product };
    }

    if (this.credit <= product.price) {
      return {
        outcome: Outcome.INSUFFICIENT_CREDIT,
        product,
        shortfall: product.price - this.credit,
      };
    }

    product.stock -= 1;

    const change = this.bank.makeChange(this.credit - product.price);
    if (change === null) {
      return {
        outcome: Outcome.EXACT_CHANGE_REQUIRED,
        product,
        returnedCoins: this.refund(),
      };
    }

    this.bank.addAll(this.insertedCoins);
    this.bank.withdraw(change);
    this.insertedCoins = [];

    return { outcome: Outcome.DISPENSED, product, change };
  }

  refund() {
    const coins = this.insertedCoins.slice();
    this.insertedCoins = [];
    this.credit = 0;
    return coins;
  }

  restock(code, quantity) {
    const product = this.findProduct(code);
    if (!product) {
      return { restocked: false, code };
    }

    product.stock += quantity;
    return { restocked: true, product };
  }

  loadCoins(counts) {
    for (const [denomination, count] of Object.entries(counts)) {
      for (let i = 0; i < count; i++) {
        this.bank.add(Number(denomination));
      }
    }
  }

  collectCash() {
    const total = this.bank.total();
    this.bank.clear();
    return total;
  }
}
