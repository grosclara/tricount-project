"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseInMemoryAdapter = void 0;
class ExpenseInMemoryAdapter {
    constructor(expenses) {
        this.expenses = expenses;
    }
    getAllExpenses() {
        return Promise.resolve(this.expenses);
    }
    createExpense(expense) {
        this.expenses.push(expense);
        return Promise.resolve(expense);
    }
}
exports.ExpenseInMemoryAdapter = ExpenseInMemoryAdapter;
