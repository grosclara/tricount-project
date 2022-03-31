// For this example we don't use any dependency injection.

import { ExpenseInMemoryAdapter } from "./src/adapters/driven/expense.in.memory.adapter";
import { UserInMemoryAdapter } from "./src/adapters/driven/user.in.memory.adapter";

import { ExpenseRecorder } from "./src/hexagon/usecases/ExpenseRecorder";
import { UserRecorder } from "./src/hexagon/usecases/UserRecorder";
import { AccountCalculator } from "./src/hexagon/usecases/AccountCalculator";

import { CliAdapter } from "./src/adapters/driver/cli.adapter";
import { Terminal } from "./src/adapters/driver/terminal-helper";

// Instantiate the (right-part) driven adapters => server-side
const expenseInMemoryAdapter = new ExpenseInMemoryAdapter([]);
const userInMemoryAdapter = new UserInMemoryAdapter([]);

// Instantiate the business logic (use cases)
const expenseRecorder = new ExpenseRecorder(expenseInMemoryAdapter, userInMemoryAdapter);
const userRecorder = new UserRecorder(userInMemoryAdapter);
const accountCalculator = new AccountCalculator(expenseInMemoryAdapter, userInMemoryAdapter);

// Instantiate the (left-part) driver adapter => user-side
const terminal = new Terminal();
const consoleAdapter = new CliAdapter(terminal, expenseRecorder, userRecorder, accountCalculator);

consoleAdapter.start();