import ForRecordingExpenses from "../../hexagon/ports/driver/for.recording.expenses";
import ForBalancingAccounts from "../../hexagon/ports/driver/for.balancing.accounts";
import ForRecordingUsers from "../../hexagon/ports/driver/for.recording.users";
import Terminal from "./terminal-helper";

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
        return this.terminal.print('Hello, I\'m the Tricount CLI :)\n');
    }

    private run(): Promise<void> {
        throw new Error("Method not implemented");
    }

    private createTricount(): Promise<boolean> {
        throw new Error("Method not implemented");
    }

    private addUser(): Promise<void> {
        throw new Error("Method not implemented");
    }

    private addExpense(): Promise<void> {
        throw new Error("Method not implemented");
    }

    private getBalance() : Promise<void> {
        throw new Error("Method not implemented")
    }
}