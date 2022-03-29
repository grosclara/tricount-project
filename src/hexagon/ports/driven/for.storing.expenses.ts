import Expense from "../../models/Expense";

export default interface ForStoringExpenses 
{
	getAllExpenses(): Promise<Expense[]>;
	createExpense(expense: Expense): Promise<Expense>;
}


