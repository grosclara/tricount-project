export class Expense {
    title: string;
    amount: number;
    username: string;

    constructor(title: string, amount: number, username: string){
        this.title = title;
        this.amount = amount;
        this.username = username;
    }
}
