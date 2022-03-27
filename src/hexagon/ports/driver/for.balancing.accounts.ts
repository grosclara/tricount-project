import User from "../../models/User";

export default interface ForBalancingAccounts     
{
	GetAccountBalance(): Map<User, Map<User, number>> ;
    // GetAccountBalanceByUser(userId): number ;
    // GelAllExpenses()
}
