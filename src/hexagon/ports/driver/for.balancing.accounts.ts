import { User } from "../../models/User";

export interface ForBalancingAccounts     
{
	getAccountBalance(): Map<User, Map<User, number>> ;
    // GetAccountBalanceByUser(userId): number ;
    // GelAllExpenses()
}
