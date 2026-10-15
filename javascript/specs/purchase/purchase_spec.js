import { expect } from "chai";
import { Outcome } from "../../src/vendingMachine.js";
import { createMachine } from "../../test-helpers/fixtures.js";

// Cola (A1) costs 80c and starts with 2 in stock.
// Ginger Beer (A3) is sold out.
describe("Buying a product", () => {
  let machine;

  beforeEach(() => {
    machine = createMachine();
  });

  it("dispenses the product when the credit covers the price", () => {
    machine.insertCoin(100);

    const result = machine.selectProduct("A1");

    expect(result.outcome).to.equal(Outcome.DISPENSED);
    expect(result.product.name).to.equal("Cola");
  });

  it("returns the change that is owed", () => {
    machine.insertCoin(100);

    const result = machine.selectProduct("A1");

    expect(result.change).to.deep.equal([20]);
  });

  it("refuses a product that has sold out", () => {
    machine.insertCoin(100);

    const result = machine.selectProduct("A3");

    expect(result.outcome).to.equal(Outcome.OUT_OF_STOCK);
  });

  it("rejects a code the machine does not recognise", () => {
    const result = machine.selectProduct("Z9");

    expect(result.outcome).to.equal(Outcome.UNKNOWN_PRODUCT);
  });

  it("starts every customer with a fully stocked machine", () => {
    expect(machine.stockOf("A1")).to.equal(2);
  });
});
