import Expense from "../../models/Expense";

export interface IBalance {
    amount: number;
    lenderName?: string;
}

export default interface ForBalancingAccounts
{
	getAccountBalance(): Promise<Map<String, Map<String, number>>>;
    // GetAccountBalanceByUser(userId): number ;
    getAllExpenses(): Promise<Expense[]>;
}
