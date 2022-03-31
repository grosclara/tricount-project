import { InvalidAmountError } from "../../errors/InvalidAmountError";
import { UnknownUserError } from "../../errors/UnknownUserError";
import { Expense } from "../models/Expense";
import { User } from "../models/User";
import { ForStoringExpenses } from "../ports/driven/for.storing.expenses";
import { ForStoringUsers } from "../ports/driven/for.storing.users";
import { ForRecordingExpenses } from "../ports/driver/for.recording.expenses";

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
    
    async recordExpense(title: string, amount: number, username: string): Promise<Expense> {

        if (amount < 0)
            throw new InvalidAmountError(`Invalid amount error: ${amount} should be a positive integer`);

        const users = await this.userRepository.getAllUsers();
        if (!users.some(user => user.username === username))
            throw new UnknownUserError(`Unknown user error: ${username} does not exist yet`);

        let expenseToAdd = new Expense(title, amount, new User(username));
        const createdExpense = await this.expenseRepository.createExpense(expenseToAdd);   
        
        return createdExpense; 
    }
}
