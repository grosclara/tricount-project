export default class Expense {
    id: number;
    title: string;
    amount: number;
    username: string;

    constructor(title: string, amount: number, username: string){
        this.id = Date.now();
        this.title = title;
        this.amount = amount;
        this.username = username;
    }
}
