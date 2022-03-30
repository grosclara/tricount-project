import ForRecordingExpenses from "../../hexagon/ports/driver/for.recording.expenses";
import ForBalancingAccounts from "../../hexagon/ports/driver/for.balancing.accounts";
import ForRecordingUsers from "../../hexagon/ports/driver/for.recording.users";
import Terminal from "./terminal-helper";
import User from "../../hexagon/models/User";

export default class CliAdapter {
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

    public start() : Promise<void> {
        return this.terminal.print('Hello, I\'m the Tricount CLI :)\n')
        .then( () => { return this.userRecorder.GetAllUsers() })
        .then((users) => {
            if (users.length === 0) {
                return this.createTricount()
            }
            else {
                return this.run();
            }
        })
    }

    private run(): Promise<void> {
        return this.terminal.print("Welcome to your Tricount!");
    }

    private createTricount(): Promise<void> {
        return this.terminal.readInput('\nDo you want to create a new Tricount? [y/N] ')
        .then((input) => {
            if (input.toLowerCase() === 'y'){
                return this.addUser();
            }
            else {
                return this.terminal.print('ok bye!\n');
            }
        })
    }

    private addUser(): Promise<void> {
        return this.terminal.readInput('\nEnter a unique username: ')
        .then((input) => {
            return this.userRecorder.CreateUser(input);
        })
        .then((user) => {
            return this.terminal.print(`User ${user.username} successfully added to the Tricount!`)
        })
        .then(() => {
            return this.terminal.readInput('Do you want to add another user? [y/N] ')
        })
        .then((input) => {
            if (input.toLowerCase() === 'y')
                return this.addUser();
            else {
                return this.userRecorder.GetAllUsers()
                .then((users) => {
                    if (users.length <= 1) {
                        return this.terminal.print('You must add at least two members in the Tricount!')
                        // .then(() => { return this.addUser() })
                       // return this.addUser();
                    }
                    // else {
                    //     return Promise.resolve();
                    // }
                })
            }
            
        })
    }

    private addExpense(): Promise<void> {
        throw new Error("Method not implemented");
    }

    private getBalance() : Promise<void> {
        throw new Error("Method not implemented")
    }
}