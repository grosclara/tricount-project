"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliAdapter = void 0;
const AlreadyExistingUserError_1 = require("../../errors/AlreadyExistingUserError");
const InvalidAmountError_1 = require("../../errors/InvalidAmountError");
const UnknownUserError_1 = require("../../errors/UnknownUserError");
class CliAdapter {
    constructor(terminal, expenseRecorder, userRecorder, accountingBalancer) {
        this.terminal = terminal;
        this.expenseRecorder = expenseRecorder;
        this.userRecorder = userRecorder;
        this.accountingBalancer = accountingBalancer;
    }
    start() {
        return this.terminal.print('Hello, I\'m the Tricount CLI :)\n')
            .then(() => { return this.userRecorder.getAllUsers(); })
            .then((users) => {
            if (users.length === 0) {
                return this.createTricount();
            }
            else {
                return true;
            }
        })
            .then((tricountCreated) => {
            if (tricountCreated)
                return this.run();
        });
    }
    run() {
        return this.terminal.print("Welcome to your Tricount!")
            .then(() => {
            return this.terminal.readInput('Do you want to:\n1) Record a new expense?\n2) Get account balance?\n3) exit?\n');
        })
            .then((input) => {
            if (input === '1')
                return this.addExpense();
            else if (input === '2')
                return this.getBalance();
            if (input === '3')
                return this.terminal.print('ok bye!\n');
            else {
                return this.terminal.print('You must select one of the options')
                    .then(() => { return this.run(); });
            }
        });
    }
    createTricount() {
        return this.terminal.readInput('\nDo you want to create a new Tricount? [y/N] ')
            .then((input) => {
            if (input.toLowerCase() === 'y') {
                return this.addUser().then(() => { return true; });
            }
            else {
                return this.terminal.print('ok bye!\n').then(() => { return false; });
            }
        });
    }
    addUser() {
        return this.terminal.readInput('\nEnter a unique username: ')
            .then((input) => {
            return this.userRecorder.createUser(input);
        })
            .then((user) => {
            return this.terminal.print(`User ${user.username} successfully added to the Tricount!`);
        })
            .then(() => {
            return this.terminal.readInput('Do you want to add another user? [y/N] ');
        })
            .then((input) => {
            if (input.toLowerCase() === 'y')
                return this.addUser();
            else {
                return this.userRecorder.getAllUsers()
                    .then((users) => {
                    if (users.length <= 1) {
                        return this.terminal.print('You must add at least two members in the Tricount!')
                            .then(() => {
                            return this.addUser();
                        });
                    }
                    else {
                        let userString = "";
                        users.forEach(user => userString = userString + user.username + "\n");
                        return this.terminal.print(`Here are the members of you Tricount:\n${userString}\n`);
                    }
                });
            }
        })
            .catch((err) => {
            if (err instanceof AlreadyExistingUserError_1.AlreadyExistingUserError) {
                return this.terminal.print(`User ${err.user.username} is already a member!`)
                    .then(() => {
                    this.addUser();
                });
            }
        });
    }
    addExpense() {
        var username, amount, title;
        return this.terminal.print(`\nLet's record a new expense`)
            .then(() => { return this.userRecorder.getAllUsers(); })
            .then((users => {
            let userString = "";
            users.forEach(user => userString = userString + user.username + "\n");
            return this.terminal.readInput(`-> Enter a username in the member list:\n${userString}`);
        }))
            .then((userInput) => {
            username = userInput;
            return this.terminal.readInput('-> Enter an amount (€): ');
        })
            .then((amountInput) => {
            amount = +amountInput;
            return this.terminal.readInput('-> Enter enter a description: ');
        })
            .then((titleInput) => {
            title = titleInput;
            return this.expenseRecorder.recordExpense(title, amount, username);
        })
            .then((expense) => {
            return this.terminal.print(`Expense successfully recorded: ${expense.user.username} paid ${expense.amount} for ${expense.title}!\n`);
        })
            .catch((err) => {
            if (err instanceof UnknownUserError_1.UnknownUserError) {
                return this.terminal.print(`User ${username} does not exist!`);
            }
            if (err instanceof InvalidAmountError_1.InvalidAmountError) {
                return this.terminal.print(`Amount ${username} should be a postitive integer!`);
            }
        })
            .finally(() => {
            return this.run();
        });
    }
    getBalance() {
        return this.terminal.print('\nAccount balance:')
            .then(() => {
            return this.accountingBalancer.getAccountBalance();
        })
            .then((accountMap) => {
            let accountString = '';
            accountMap.forEach(function (debtorMap, creditor) {
                accountString += `\nCreditor: ${creditor.username}\n`;
                debtorMap.forEach(function (amount, debtor) {
                    accountString += `\tDebtor: ${debtor.username} | Amount: ${amount}\n`;
                });
            });
            return this.terminal.print(accountString);
        })
            .finally(() => {
            return this.run();
        });
    }
}
exports.CliAdapter = CliAdapter;
