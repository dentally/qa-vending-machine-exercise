# QA Technical Exercise — Vending Machine

Welcome, and thanks for making the time.

You have been handed a small application and the test suite that is supposed to cover it. Neither
is in good shape. Your job for the next hour is to work out what is wrong and to leave both in a
better state than you found them.

There is no single correct answer and there is more here than anyone finishes in an hour. We are
far more interested in how you decide what to look at than in how much of it you get through.
Please think out loud as you go.

---

## Getting set up

Requires **Node.js 22** or newer.

```
npm install
npm test      # run the test suite
npm start     # play with the machine yourself
```

`npm start` gives you an interactive console. Try `help`, then something like
`products`, `coins`, `insert 100`, `select A1`, `refund`, `quit`. Poking at the real thing for a
couple of minutes is usually time well spent.

You can script a session too, which is handy for trying the same sequence repeatedly. In
PowerShell:

```powershell
@("insert 100", "select A1", "quit") | npm start
```

or in bash:

```bash
printf "insert 100\nselect A1\nquit\n" | npm start
```

### Debugging tests

Open the **`vending-machine/`** folder as your workspace in Cursor or VS Code (the folder that
contains `SPEC.md` and `javascript/`). Debug configs live in `vending-machine/.vscode/launch.json`.
Set breakpoints in a spec file or in `src/`, then open **Run and Debug** (Ctrl+Shift+D) and choose
from the dropdown at the top — not the "Select debugger" popup:

- **Mocha: all tests** — runs the full suite under the debugger
- **Mocha: current file** — runs only the spec file you have open
- **Mocha: current file (grep)** — runs one test by name (e.g. `gives change`)

Use F10 to step over, F11 to step into, and the Variables panel to inspect `machine.credit`,
`result.change`, and so on.

---

## What the application does

It is a vending machine. You put coins in, you pick a product, you get the product and your change.
If you change your mind you can ask for your coins back. There is a small operator interface for
restocking and emptying the cash box.

**[`../SPEC.md`](../SPEC.md) is the source of truth.** It describes exactly how the machine is meant
to behave, rule by rule. Where the code and the specification disagree, the specification is right.
Read it before you read the code — it takes about five minutes and it is the only place the intended
behaviour is written down.

---

## How the code is arranged

```
src/
  money.js            Coin denominations, and formatting amounts for display
  coinBank.js         The coins the machine holds, and working out change
  vendingMachine.js   The rules. No console, no keyboard, no globals.
  cli.js              A thin console shell over the machine
  io.js               The real keyboard and screen, or piped input when there is any
  index.js            Entry point for `npm start`

specs/
  change/             Change calculation
  cli/                End-to-end walkthroughs of a console session
  credit/             Inserting coins and tracking credit
  purchase/           Selecting and dispensing products

test-helpers/
  fakeIo.js           A stand-in for the keyboard and screen
  fixtures.js         The catalogue and coin float the specs are built on
```

`VendingMachine` deliberately knows nothing about input and output. You can call its methods
directly with plain values and assert on what comes back — no mocking required.

Where a test does need to drive the console, it uses `FakeIo`. You give it the lines a customer
would type, in the order a customer would type them, and read back everything the application
wrote:

```javascript
const io = new FakeIo(["insert 100", "select A1", "quit"]);
new Cli({ machine: createMachine(), io }).run();

expect(io.lines).to.include("Dispensing: Cola");
expect(io.lines).to.include("Change: 20c");
```

There is no mocking library here, and the tests as written do not need one. If you reach a point
where you want one, install it — you have a network connection and adding a dependency is a
perfectly reasonable thing to do. We would just be interested to hear what you wanted it for.

**Everything in this project is yours to change**, including the test helpers and the fixtures.
They are part of the code under review, not a fixed given.

---

## What we would like you to do

1. **Get the suite telling the truth.** Some tests fail. Some tests pass when they should not. For
   each one, decide whether the test is wrong or the application is wrong, and say why before you
   fix it.
2. **Fix what you find.** Both test code and application code are in scope.
3. **Add coverage.** Pick behaviour in `SPEC.md` that nobody has tested yet and write tests for it.
   A few sharp tests beat a long list of shallow ones.
4. **Tell us what else you would change.** Anything you spot but do not have time to fix — design
   smells, brittle tests, missing scenarios, things that would bite us later — is worth saying out
   loud. Note them in a comment, a scratch file, or just tell us.

### Rough shape of the hour

| Time     | Focus                                                                     |
| -------- | ------------------------------------------------------------------------- |
| 0–15 min | Read `SPEC.md`, run the app, run the suite, skim the code                 |
| 15–45 min | Investigate and fix                                                      |
| 45–60 min | Add your own tests, and talk us through what you would do with more time |

Do not worry if you do not reach the end. Nobody does.

### Places the coverage looks thin

Not a checklist, just somewhere to start if you would rather not hunt:

- Refunds
- Coins the machine should not accept
- Product codes typed in lower case or with stray spaces
- The operator functions: restocking, loading coins, emptying the cash box
- Change in awkward situations, when the machine is low on particular coins
