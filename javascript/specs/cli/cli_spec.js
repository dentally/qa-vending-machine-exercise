import { expect } from "chai";
import { Cli } from "../../src/cli.js";
import { FakeIo } from "../../test-helpers/fakeIo.js";
import { createMachine } from "../../test-helpers/fixtures.js";

// Water (C1) costs 95c.
describe("Command line", () => {
  function session(inputs) {
    const io = new FakeIo(inputs);
    new Cli({ machine: createMachine(), io }).run();
    return io;
  }

  it("walks a customer through a purchase", () => {
    const io = session(["insert 100", "select C1", "quit"]);

    expect(io.lines).to.include("Dispensing: Water");
    expect(io.lines).to.include("Change: 5c");
  });

  it("shows the credit as a money amount", () => {
    const io = session(["insert 100", "insert 50", "quit"]);

    expect(io.lines).to.include("Credit: $1.50");
  });

  it("hands back a coin it does not accept", () => {
    const io = session(["insert 2", "quit"]);

    expect(io.lines).to.include("Coin returned: 2c");
    expect(io.lines).to.include("Credit: 0c");
  });

  it("tells the customer how much more to insert", () => {
    const io = session(["insert 50", "select C1", "quit"]);

    expect(io.lines).to.include("Insuficient credit: 45c more needed");
  });

  it("prints the expected session transcript", () => {
    const io = session(["help", "quit"]);

    expect(io.lines).to.deep.equal([
      "Welcome to the vending machine.",
      "Commands: insert <cents>, select <code>, refund, products, coins, help, quit",
      "Goodbye.",
    ]);
  });

  it("lists the accepted coin denominations", () => {
    const io = session(["coins", "quit"]);

    expect(io.lines).to.include("$2 (insert 200)");
    expect(io.lines).to.include("$1 (insert 100)");
    expect(io.lines).to.include("50c (insert 50)");
    expect(io.lines).to.include("5c (insert 5)");
  });

  it("lists the available products", () => {
    const io = session(["products", "quit"]);

    expect(io.lines).to.include("A1: Cola, 80c, 2 in stock");
    expect(io.lines).to.include("A3: Ginger Beer, 85c, sold out");
    expect(io.lines).to.include("D1: Chocolate, $1.2, 4 in stock");
  });
});
