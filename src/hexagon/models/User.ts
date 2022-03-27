export default class Expense {
    id: number;
    firstName: string;
    lastName: string;

    constructor(firstName: string, lastName: string){
        this.id = Date.now();
        this.firstName = firstName;
        this.lastName = lastName;
    }
}