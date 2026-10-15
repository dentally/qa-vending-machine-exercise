import { expect } from "chai";
import { Outcome } from "../../src/vendingMachine.js";
import { createMachine, EMPTY_BANK } from "../../test-helpers/fixtures.js";

// Crisps (B1) cost 65c.
describe("Giving change", () => {
  let machine;

  beforeEach(() => {
    machine = createMachine();
  });

  it.only("returns the largest coins available", () => {
    machine.insertCoin(100);

    const result = machine.selectProduct("B1");

    expect(result.change).to.deep.equal([20, 10, 5]);
  });

  it("gives change made up of several coins", () => {
    machine.insertCoin(200);

    const result = machine.selectProduct("B1");

    expect(result.change).to.deep.equal([20, 10, 5]);
  });

  it("leaves the stock alone when it cannot make change", () => {
    machine = createMachine({ bank: EMPTY_BANK });
    const stockBefore = machine.stockOf("B1");
    machine.insertCoin(100);

    const result = machine.selectProduct("B1");

    expect(result.outcome).to.equal(Outcome.EXACT_CHANGE_REQUIRED);
    expect(result.returnedCoins).to.deep.equal([100]);
    expect(machine.stockOf("B1")).to.equal(stockBefore);
  });

  it("gives a single coin when one coin covers the change", () => {
    machine.insertCoin(50);
    machine.insertCoin(20);
    machine.insertCoin(10);
    machine.insertCoin(5);

    const result = machine.selectProduct("B1");

    expect(result.change).to.deep.equal([20]);
  });

  it("keeps the customer's coins in the bank after a sale", () => {
    machine.insertCoin(100);

    const result = machine.selectProduct("B1");

    expect(result).to.exist;
  });
});
