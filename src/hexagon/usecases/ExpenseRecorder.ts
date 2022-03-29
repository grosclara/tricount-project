import InvalidAmountError from "../../errors/InvalidAmountError";
import UnknownUserError from "../../errors/UnknownUserError";
import Expense from "../models/Expense";
import ForStoringExpenses from "../ports/driven/for.storing.expenses";
import ForStoringUsers from "../ports/driven/for.storing.users";
import ForRecordingExpenses from "../ports/driver/for.recording.expenses";

export default class ExpenseRecorder implements ForRecordingExpenses {
    
    expenseRepository: ForStoringExpenses
    userRepository: ForStoringUsers

    constructor(
        expenseRepository: ForStoringExpenses,
        userRepository: ForStoringUsers
    ){
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }
    
    async RecordExpense(title: string, amount: number, username: string): Promise<Expense> {
        if (amount < 0)
            throw new InvalidAmountError('Invalid amount error');
        let users = await this.userRepository.getAllUsers();
        if (!users.some(user => user.username === username))
            throw new UnknownUserError('Unknown user error');
       
        return new Expense(title, amount, username);
    }
}
