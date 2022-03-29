import Expense from "../../models/Expense";

export default interface ForRecordingExpenses     
{
    RecordExpense( title: string, amount: number, username: string ) : Promise<Expense> ;
}
