import { Expense } from "../../models/Expense";

export interface ForRecordingExpenses     
{
    recordExpense( title: string, amount: number, username: string ) : Promise<Expense> ;
}
