import { User } from "./User";

export class Expense {
    title: string;
    amount: number;
    user: User;

    constructor(title: string, amount: number, user: User){
        this.title = title;
        this.amount = amount;
        this.user = user;
    }
}
