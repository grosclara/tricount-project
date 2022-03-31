import Expense from "../../models/Expense";
import User from "../../models/User";

export interface IBalance {
    amount: number;
    lenderName?: string;
}

export default interface ForBalancingAccounts
{
	getAccountBalance(): Promise<Map<User, Map<User, number>>>;
    // GetAccountBalanceByUser(userId): number ;
    getAllExpenses(): Promise<Expense[]>;
}
