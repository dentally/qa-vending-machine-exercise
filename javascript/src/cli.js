import { Outcome } from "./vendingMachine.js";
import { DENOMINATIONS, formatCents, describeCoins } from "./money.js";

const HELP =
  "Commands: insert <cents>, select <code>, refund, products, coins, help, quit";
// A thin shell around the machine. Everything it reads and writes goes through the
// injected `io`, so tests can hand it a fake and read back the transcript.
export class Cli {
  constructor({ machine, io }) {
    this.machine = machine;
    this.io = io;
  }

  run() {
    this.io.write("Welcome to the vending machine.");

    while (true) {
      const line = this.io.readLine();
      if (line === null || line === undefined) {
        break;
      }

      const command = line.trim();
      if (command === "") {
        continue;
      }

      if (command === "quit") {
        this.io.write("Goodbye.");
        break;
      }

      this.handle(command);
    }
  }

  handle(command) {
    const [verb, argument] = command.split(/\s+/);

    switch (verb) {
      case "help":
        this.io.write(HELP);
        return;
      case "insert":
        return this.handleInsert(argument);
      case "select":
        return this.handleSelect(argument);
      case "refund":
        return this.handleRefund();
      case "products":
        return this.handleProducts();
      case "coins":
        return this.handleCoins();
      default:        this.io.write(`Unknown command: ${verb}`);
    }
  }

  handleInsert(argument) {
    const result = this.machine.insertCoin(Number(argument));

    if (!result.accepted) {
      this.io.write(`Coin returned: ${formatCents(result.coin)}`);
    }

    this.io.write(`Credit: ${formatCents(this.machine.credit)}`);
  }

  handleSelect(code) {
    const result = this.machine.selectProduct(code);

    switch (result.outcome) {
      case Outcome.DISPENSED:
        this.io.write(`Dispensing: ${result.product.name}`);
        this.io.write(`Change: ${describeCoins(result.change)}`);
        return;
      case Outcome.UNKNOWN_PRODUCT:
        this.io.write(`Unknown product: ${result.code}`);
        return;
      case Outcome.OUT_OF_STOCK:
        this.io.write(`Sold out: ${result.product.name}`);
        return;
      case Outcome.INSUFFICIENT_CREDIT:
        this.io.write(
          `Insufficient credit: ${formatCents(result.shortfall)} more needed`
        );
        return;
      case Outcome.EXACT_CHANGE_REQUIRED:
        this.io.write("Exact change required.");
        this.io.write(`Coins returned: ${describeCoins(result.returnedCoins)}`);
    }
  }

  handleRefund() {
    this.io.write(`Coins returned: ${describeCoins(this.machine.refund())}`);
  }

  handleProducts() {
    for (const product of this.machine.products) {
      const stock =
        product.stock === 0 ? "sold out" : `${product.stock} in stock`;
      this.io.write(
        `${product.code}: ${product.name}, ${formatCents(product.price)}, ${stock}`
      );
    }
  }

  handleCoins() {
    for (const denomination of DENOMINATIONS) {
      this.io.write(`${formatCents(denomination)} (insert ${denomination})`);
    }
  }
}