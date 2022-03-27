export default class Expense {
    id: number;
    title: string;
    description: string;
    amount: number;
    userId: string;

    constructor(title: string, amount: number, userId: string, description?: string){
        this.id = Date.now();
        this.title = title;
        this.amount = amount;
        this.userId = userId;
        this.description = description ? description : "";
    }
}