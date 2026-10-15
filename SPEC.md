# Vending Machine — Specification

This is the source of truth for how the machine is supposed to behave. It is deliberately
language-agnostic so that the JavaScript, C# and Java versions of this exercise all describe
the same product.

If the code and this document disagree, **this document is right and the code is wrong**.

---

## 1. Money

All amounts are whole numbers of cents. There are no fractions of a cent anywhere in the system.

The machine accepts exactly these six coins:

| Coin | Value in cents |
| ---- | -------------- |
| 5c   | 5              |
| 10c  | 10             |
| 20c  | 20             |
| 50c  | 50             |
| $1   | 100            |
| $2   | 200            |

**R1.** Any other coin — a 1c piece, a foreign coin, a button, a negative or non-numeric value — is
rejected and handed straight back. A rejected coin never changes the customer's credit.

**R2.** Credit is the total of all accepted coins inserted since the last completed transaction.

### Displaying money

**R3.** Amounts below one dollar are shown in cents with a trailing `c`, for example `5c`, `45c`,
`0c`. Amounts of one dollar and above are shown in dollars with a `$` sign and **always two decimal
places**, for example `$1.00`, `$1.50`, `$2.05`.

---

## 2. Products

Each product has a code (such as `A1`), a name, a price in cents, and a stock count.

**R4.** Product codes are matched case-insensitively and ignoring surrounding whitespace, so
`a1`, `A1` and ` A1 ` all select the same product.

---

## 3. Buying something

When a customer selects a product, exactly one of these outcomes occurs.

| Outcome                 | When                                                  |
| ----------------------- | ----------------------------------------------------- |
| `UNKNOWN_PRODUCT`       | No product has that code                              |
| `OUT_OF_STOCK`          | The product exists but its stock is zero              |
| `INSUFFICIENT_CREDIT`   | Credit is less than the price                         |
| `EXACT_CHANGE_REQUIRED` | The sale is affordable but the change cannot be paid  |
| `DISPENSED`             | The product is delivered                              |

**R5.** A product may be bought when credit is **greater than or equal to** the price. Paying the
exact price is a normal, successful purchase — the customer is not required to overpay.

**R6.** When credit is short, the machine reports the shortfall, which is `price - credit`.

**R7.** After any unsuccessful selection, the credit and the stock are both left exactly as they
were. A customer who picks a sold-out product, an unknown code, or something they cannot afford
loses nothing and can try again.

**R8.** After a successful sale the machine decreases that product's stock by one, moves the
customer's inserted coins into its own coin bank, pays out the change, and resets the credit to
zero.

---

## 4. Change

**R9.** Change is `credit - price`. When that is zero, no coins are returned and the sale still
succeeds.

**R10.** Change is paid from the coins already in the machine's bank **at the start of the
transaction**. The coins the customer has just inserted are not available as change for their own
purchase; they only join the bank once the sale completes.

**R11.** If any combination of the coins in the bank adds up to the change owed, the machine must
find one and pay it. Preferring larger coins is fine, but preferring larger coins must never cause
the machine to give up on change it is actually capable of paying.

> Worked example. The machine owes 60c. Its bank holds one 50c and three 20c coins and nothing
> smaller. Taking the 50c first leaves 10c owing and no coin small enough to pay it. The machine
> must instead pay `20c + 20c + 20c`. Refusing this sale is a defect.

**R12.** Only when no combination exists may the machine refuse. It then reports
`EXACT_CHANGE_REQUIRED`, returns the customer's coins, and leaves the stock untouched.

---

## 5. Refunds

**R13.** A customer may ask for a refund at any point before selecting a product.

**R14.** A refund returns **the coins the customer actually inserted**, not an equivalent value
assembled from the bank. Someone who inserts a $2 coin gets that $2 coin back, not four 50c pieces.

**R15.** After a refund the credit is zero and the list of inserted coins is empty.

---

## 6. Operator functions

**R16.** `restock(code, quantity)` adds to a product's stock and reports whether the code was
recognised.

**R17.** `loadCoins(counts)` adds coins to the bank so it can give change.

**R18.** `collectCash()` empties the coin bank and returns the total value it held.

---

## 7. The command line

The console is a thin layer over the machine. It reads one command per line and writes one message
per line. It holds no rules of its own.

| Command           | Effect                                       |
| ----------------- | -------------------------------------------- |
| `insert <cents>`  | Insert a coin, then report the current credit |
| `select <code>`   | Attempt to buy a product                      |
| `refund`          | Return the inserted coins                     |
| `products`        | List each product's code, name, price, and stock |
| `coins`           | List each accepted coin denomination and the value to pass to `insert` |
| `help`            | List the commands                             |
| `quit`            | End the session                               |

Messages:

```
Welcome to the vending machine.
Commands: insert <cents>, select <code>, refund, products, coins, help, quit
Credit: $1.50
Coin returned: 2c
A1: Cola, 80c, 2 in stock
A3: Ginger Beer, 85c, sold out
$2.00 (insert 200)
$1.00 (insert 100)
50c (insert 50)
5c (insert 5)
Dispensing: Cola
Change: 20c, 10c, 5c
Sold out: Ginger Beer
Unknown product: Z9
Unknown command: fly
Insufficient credit: 15c more needed
Exact change required.
Coins returned: $1.00
Goodbye.
```

`products` writes one line per product: `code: name, price, stock` (or `sold out` when stock is
zero). `coins` writes one line per accepted denomination, largest first: `display value (insert
cents)`.

A list of coins is written largest first, separated by `, `. An empty list is written as `none`.
