import User from "../models/User";
import ForStoringExpenses from "../ports/driven/for.storing.expenses";
import ForStoringUsers from "../ports/driven/for.storing.users";
import ForBalancingAccounts from "../ports/driver/for.balancing.accounts";

export class AccountCalculator implements ForBalancingAccounts {
    
    expenseRepository: ForStoringExpenses
    userRepository: ForStoringUsers

    constructor(
        expenseRepository: ForStoringExpenses, 
        userRepository: ForStoringUsers
    ){
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    GetAccountBalance(): Map<User, Map<User, number>> {
        throw new Error("Method not implemented.");
    }

}
