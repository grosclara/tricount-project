import { Expense } from "../../models/Expense";

export interface ForStoringExpenses 
{
	getAllExpenses(): Promise<Expense[]>;
	createExpense(expense: Expense): Promise<Expense>;
}


