import Expense from "../models/Expense";
import ForStoringExpenses from "../ports/driven/for.storing.expenses";
import ForStoringUsers from "../ports/driven/for.storing.users";
import ForRecordingExpenses from "../ports/driver/for.recording.expenses";

export class ExpenseRecorder implements ForRecordingExpenses {
    
    expenseRepository: ForStoringExpenses
    userRepository: ForStoringUsers

    constructor(
        expenseRepository: ForStoringExpenses,
        userRepository: ForStoringUsers
    ){
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }
    
    RecordExpense(title: string, amount: number, username: string): Expense {
        throw new Error("Method not implemented");
    }
}
