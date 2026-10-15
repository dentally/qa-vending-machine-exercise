import { VendingMachine } from "./vendingMachine.js";
import { CoinBank } from "./coinBank.js";
import { Cli } from "./cli.js";
import { ConsoleIo } from "./io.js";

const machine = new VendingMachine({
  products: [
    { code: "A1", name: "Cola", price: 80, stock: 2 },
    { code: "A2", name: "Lemonade", price: 90, stock: 1 },
    { code: "A3", name: "Ginger Beer", price: 85, stock: 0 },
    { code: "B1", name: "Crisps", price: 65, stock: 6 },
    { code: "C1", name: "Water", price: 95, stock: 5 },
    { code: "D1", name: "Chocolate", price: 120, stock: 4 },
  ],
  bank: new CoinBank({ 200: 1, 100: 2, 50: 3, 20: 4, 10: 4, 5: 4 }),
});

new Cli({ machine, io: new ConsoleIo() }).run();
