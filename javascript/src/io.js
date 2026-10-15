import { readFileSync } from "node:fs";
import readlineSync from "readline-sync";

// The real keyboard and screen. Tests use test-helpers/fakeIo.js instead.
//
// When something is piped into the process it reads that instead of prompting,
// so a session can be scripted:
//
//   echo "insert 100
//   select A1
//   quit" | npm start
//
export class ConsoleIo {
  constructor() {
    this.piped = process.stdin.isTTY ? null : readPipedLines();
  }

  readLine() {
    if (this.piped === null) {
      return readlineSync.question("> ");
    }
    return this.piped.length === 0 ? null : this.piped.shift();
  }

  write(line) {
    console.log(line);
  }
}

function readPipedLines() {
  try {
    return readFileSync(0, "utf8").split(/\r?\n/);
  } catch {
    return [];
  }
}
