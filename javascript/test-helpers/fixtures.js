import { VendingMachine } from "../src/vendingMachine.js";
import { CoinBank } from "../src/coinBank.js";

export const PRODUCTS = [
  { code: "A1", name: "Cola", price: 80, stock: 2 },
  { code: "A2", name: "Lemonade", price: 90, stock: 1 },
  { code: "A3", name: "Ginger Beer", price: 85, stock: 0 },
  { code: "B1", name: "Crisps", price: 65, stock: 6 },
  { code: "C1", name: "Water", price: 95, stock: 5 },
  { code: "D1", name: "Chocolate", price: 120, stock: 4 },
];

export const DEFAULT_BANK = { 200: 1, 100: 2, 50: 3, 20: 4, 10: 4, 5: 4 };

export const EMPTY_BANK = { 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 };

export function createMachine(overrides = {}) {
  return new VendingMachine({
    products: overrides.products ?? PRODUCTS,
    bank: new CoinBank(overrides.bank ?? DEFAULT_BANK),
  });
}
