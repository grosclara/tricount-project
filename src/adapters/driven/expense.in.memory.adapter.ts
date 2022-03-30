import { Expense } from "../../hexagon/models/Expense"
import { ForStoringExpenses } from "../../hexagon/ports/driven/for.storing.expenses";

export class ExpenseInMemoryAdapter implements ForStoringExpenses {

	private expenses: Expense[]
	constructor(expenses: Expense[]) {
		this.expenses = expenses;
	}

	getAllExpenses(): Promise<Expense[]> {
		return Promise.resolve(this.expenses);
	}
	createExpense(expense: Expense): Promise<Expense> {
		this.expenses.push(expense);
		return Promise.resolve(expense);
	}
}
