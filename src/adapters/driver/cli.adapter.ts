import { ForRecordingExpenses } from "../../hexagon/ports/driver/for.recording.expenses";
import { ForBalancingAccounts } from "../../hexagon/ports/driver/for.balancing.accounts";
import { ForRecordingUsers } from "../../hexagon/ports/driver/for.recording.users";
import { Terminal } from "./terminal-helper";
import { AlreadyExistingUserError } from "../../errors/AlreadyExistingUserError";
import { InvalidAmountError } from "../../errors/InvalidAmountError";
import { UnknownUserError } from "../../errors/UnknownUserError";
import { BlankUsernameError } from "../../errors/BlankUsernameError";

export class CliAdapter {
    private terminal: Terminal
    private expenseRecorder: ForRecordingExpenses;
    private userRecorder: ForRecordingUsers;
    private accountingBalancer: ForBalancingAccounts;

    constructor(terminal: Terminal,
        expenseRecorder: ForRecordingExpenses, 
        userRecorder: ForRecordingUsers, 
        accountingBalancer: ForBalancingAccounts)
    {
        this.terminal = terminal
        this.expenseRecorder = expenseRecorder;
        this.userRecorder = userRecorder;
        this.accountingBalancer = accountingBalancer;
    }

    public start() {
        return this.terminal.print('Hello, I\'m the Tricount CLI :)\n')
        .then( () => { return this.userRecorder.getAllUsers() })
        .then((users) => {
            if (users.length === 0) {
                return this.createTricount()
            }
            else { return true}
        })
        .then((tricountCreated) => {
            if (tricountCreated)
                return this.run()
        })
    }

    private run(): Promise<void> {
        return this.terminal.print("Welcome to your Tricount!")
        .then(() => {
            return this.terminal.readInput('Do you want to:\n1) Record a new expense?\n2) See all expenses?\n3) Get account balance?\n4) Exit?\n')
        })
        .then((input) => {
            switch(input) {
                case '1':
                    return this.addExpense();
                case '2':
                    return this.getAllExpenses();
                case '3':
                    return this.getBalance();
                case '4':
                    return this.terminal.print('ok bye!\n');
                default:
                    return this.terminal.print('You must select one of the options')
                    .then(() => { return this.run() })
            }
        })
    }

    private createTricount(): Promise<boolean> {
        return this.terminal.readInput('Do you want to create a new Tricount? [y/N] ')
        .then((input) => {
            if (input.toLowerCase() === 'y') {
                return this.createFirstUser().then(() => { return true});
            }
            return this.terminal.print('ok bye!').then(() => { return false});
        })
    }

    private createFirstUser(): Promise<void> {
        return  this.terminal.print('\nLet\'s add 2 users at least to create your tricount').then(() => this.addUser());
    }

    private createSecondUser(): Promise<void> {
        return this.terminal.print('Let\'s add a second user')
                .then(() => {
                    return this.addUser()
                })
    }

    private askForAddMoreUsers(): Promise<void> {
        return this.terminal.readInput('Do you want to add an other user? [y/N] ')
        .then((input) => {
            if (input.toLowerCase() === 'y')
                return this.addUser();
            else {
                return this.userRecorder.getAllUsers()
                .then((users) => {
                    if (users.length <= 1) {
                        return this.terminal.print('You must add at least two members in the Tricount!')
                        .then(() => {
                            return this.addUser()
                        })
                    }
                    else {
                        let userString = ""
                        users.forEach(user => userString = userString + user.username + "\n");
                        return this.terminal.print(`Here are the members of you Tricount:\n${userString}`);
                    }
                })
            }
        })
    }

    private getUsersNbToCreateOtherUsers(): Promise<void> {
        return this.userRecorder.getAllUsers()
        .then((users) => {
            if (users.length <= 1) {
                return this.createSecondUser();
            }
            return this.askForAddMoreUsers();
        })
    }

    private addUser(): Promise<void> {
        return this.terminal.readInput('Enter a unique username: ')
        .then((input) => {
            return this.userRecorder.createUser(input);
        })
        .then((user) => {
            return this.terminal.print(`User ${user.username} successfully added to the Tricount!\n`);
        })
        .then(() => {
            return this.getUsersNbToCreateOtherUsers();
        })
        .catch((err) => {
            if (err instanceof AlreadyExistingUserError) {
                return this.terminal.print(`User ${err.user.username} is already a member!`).then(() => this.getUsersNbToCreateOtherUsers());
            } else if (err instanceof BlankUsernameError) {
                return this.terminal.print(err.message).then(() => this.getUsersNbToCreateOtherUsers());
            }
        })
    }

    private addExpense(): Promise<void> {
        var username: string, amount: number, title: string;
        return this.terminal.print(`\nLet's record a new expense`)
        .then(() => { return this.userRecorder.getAllUsers() })
        .then((users => {
            let userString = ""
            users.forEach(user => userString = userString + user.username + "\n");
            return this.terminal.readInput(`-> Enter a username in the member list:\n${userString}`)
        }))
        .then((userInput) => {
            username = userInput;
            return this.terminal.readInput('-> Enter an amount (???): ')
        })
        .then((amountInput) => {
            amount = +amountInput;
            if (isNaN(amount))
                throw new InvalidAmountError(`Invalid amount error: ${amount} should be a positive integer`);
            return this.terminal.readInput('-> Enter enter a description: ')
        })
        .then((titleInput) => {
            title = titleInput;
            return this.expenseRecorder.recordExpense(title, amount, username);
        })
        .then((expense) => {
            return this.terminal.print(`Expense successfully recorded: ${expense.user.username} paid ${expense.amount} for ${expense.title}!\n`)
        })
        .catch((err) => {
            if (err instanceof UnknownUserError) {
                return this.terminal.print(err.message + '\n')
            }
            if (err instanceof InvalidAmountError) {
                return this.terminal.print(err.message + '\n')
            }
        })
        .finally(() => {
            return this.run();
        })
    }

    private getBalance() : Promise<void> {
        return this.terminal.print('\nAccount balance:')
        .then(() => {
            return this.accountingBalancer.getAccountBalance()
        })
        .then((accountMap) => {
            let accountString = '';
            accountMap.forEach(function(debtorMap, creditor) {
                if (debtorMap.size == 0) {
                    accountString += `\n${creditor.username} has no debt !\n`
                } else {
                    accountString += `\n${creditor.username}'s debts\n`
                    debtorMap.forEach(function(amount, debtor) {
                        accountString += `\t- debt of ${amount}??? to ${debtor.username}\n`
                    })
                }
            })
            return this.terminal.print(accountString);
        })
        .finally(() => {
            return this.run();
        })
    }

    private getAllExpenses() : Promise<void> {
        return this.terminal.print('\List of expenses:\n')
        .then(() => {
            return this.accountingBalancer.getAllExpenses()
        })
        .then((expenses) => {
            let expenseString = ""
            expenses.forEach(expense => expenseString = expenseString + `${expense.user.username} paid ${expense.amount} for ${expense.title}\n`);
            return this.terminal.print(expenseString)
        })
        .finally(() => {
            return this.run();
        })
    }
}