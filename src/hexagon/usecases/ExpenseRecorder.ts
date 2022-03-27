import { ExpenseInMemoryAdapter } from "../../adapters/driven/expense.in.memory.adapter";
import Expense from "../models/Expense";
import User from "../models/User";
import ForStoringExpenses from "../ports/driven/for.storing.expenses";
import ForRecordingExpenses from "../ports/driver/for.recording.expenses";

export class ExpenseRecorder implements ForRecordingExpenses {
    
    expenseRepository: ForStoringExpenses

    constructor(
        expenseRepository: ForStoringExpenses, 
    ){
        this.expenseRepository = expenseRepository;
    }
    
    RecordExpense(expense: Expense): void {
        throw new Error("Invalid amount error");
    }
}
