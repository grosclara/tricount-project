"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRecorder = void 0;
const InvalidAmountError_1 = require("../../errors/InvalidAmountError");
const UnknownUserError_1 = require("../../errors/UnknownUserError");
const Expense_1 = require("../models/Expense");
const User_1 = require("../models/User");
class ExpenseRecorder {
    constructor(expenseRepository, userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }
    async recordExpense(title, amount, username) {
        if (amount < 0)
            throw new InvalidAmountError_1.InvalidAmountError(`Invalid amount error: ${amount} should be a positive integer`);
        const users = await this.userRepository.getAllUsers();
        if (!users.some(user => user.username === username))
            throw new UnknownUserError_1.UnknownUserError(`Unknown user error: ${username} does not exist yet`);
        let expenseToAdd = new Expense_1.Expense(title, amount, new User_1.User(username));
        const createdExpense = await this.expenseRepository.createExpense(expenseToAdd);
        return createdExpense;
    }
}
exports.ExpenseRecorder = ExpenseRecorder;
