import { expect } from "chai";
import { Outcome } from "../../src/vendingMachine.js";
import { createMachine } from "../../test-helpers/fixtures.js";

// Chocolate (D1) costs 120c.
describe("Handling credit", () => {
  let machine;

  beforeEach(() => {
    machine = createMachine();
  });

  it("adds accepted coins together", () => {
    machine.insertCoin(50);
    machine.insertCoin(20);

    expect(machine.credit).to.equal(70);
  });

  it("does not take a coin it cannot accept", () => {
    const result = machine.insertCoin(3);

    expect(result.accepted).to.equal(false);
    expect(machine.credit).to.equal(0);
  });

  it("reports how much more the customer needs", () => {
    machine.insertCoin(100);
    machine.insertCoin(5);

    const result = machine.selectProduct("D1");

    expect(result.outcome).to.equal(Outcome.INSUFFICIENT_CREDIT);
    expect(result.shortfall).to.equal(15);
  });

  it("clears the credit once a purchase completes", () => {
    machine.insertCoin(100);
    machine.insertCoin(50);

    const result = machine.selectProduct("D1");

    expect(result.outcome).to.equal(Outcome.DISPENSED);
    expect(machine.credit).to.equal(0);
  });

  it("handles a customer paying the exact price", () => {
    machine.insertCoin(100);
    machine.insertCoin(20);

    const result = machine.selectProduct("D1");

    expect(result.outcome).to.equal(Outcome.INSUFFICIENT_CREDIT);
  });
});
