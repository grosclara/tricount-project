import  { Expense } from "../../models/Expense";
import { User } from "../../models/User";

export interface IBalance {
    amount: number;
    lenderName?: string;
}

export interface ForBalancingAccounts     
{
	getAccountBalance(): Promise<Map<User, Map<User, number>>>;
    getAllExpenses(): Promise<Expense[]>;
}
