// Stands in for the keyboard and the screen.
//
// Give it the lines a customer would type, in the order they would type them.
// Every line the application writes is collected in `lines`.
//
//   const io = new FakeIo(["insert 100", "select A1", "quit"]);
//   new Cli({ machine, io }).run();
//   expect(io.lines).to.include("Dispensing: Cola");
//
export class FakeIo {
  constructor(inputs = []) {
    this.inputs = [...inputs];
    this.lines = [];
  }

  readLine() {
    return this.inputs.length === 0 ? null : this.inputs.shift();
  }

  write(line) {
    this.lines.push(line);
  }

  // The whole session as one string, handy when a test fails and you want to see why.
  transcript() {
    return this.lines.join("\n");
  }
}
