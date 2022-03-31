// For this example we don't use any dependency injection.

import { ExpenseInMemoryAdapter } from "./adapters/driven/expense.in.memory.adapter";
import { UserInMemoryAdapter } from "./adapters/driven/user.in.memory.adapter";

import { ExpenseRecorder } from "./hexagon/usecases/ExpenseRecorder";
import { UserRecorder } from "./hexagon/usecases/UserRecorder";
import { AccountCalculator } from "./hexagon/usecases/AccountCalculator";

import { CliAdapter } from "./adapters/driver/cli.adapter";
import { Terminal } from "./adapters/driver/terminal-helper";

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