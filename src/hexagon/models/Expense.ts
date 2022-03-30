import User from "./User";

export default class Expense {
    id: number;
    title: string;
    amount: number;
    user: User;

    constructor(title: string, amount: number, user: User){
        this.id = Date.now();
        this.title = title;
        this.amount = amount;
        this.user = user;
    }
}