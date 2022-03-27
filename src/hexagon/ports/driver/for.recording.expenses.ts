import Expense from "../../models/Expense";

export default interface ForRecordingExpenses     
{
	RecordExpense( expense: Expense ): void ;
    // EditExpense(expenseId): void ;
}