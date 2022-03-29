import Expense from "../models/Expense";
import User from "../models/User";
import ForStoringExpenses from "../ports/driven/for.storing.expenses";
import ForStoringUsers from "../ports/driven/for.storing.users";
import ForBalancingAccounts from "../ports/driver/for.balancing.accounts";

export class AccountCalculator implements ForBalancingAccounts {
    
    expenseRepository: ForStoringExpenses
    userRepository: ForStoringUsers

    constructor(
        expenseRepository: ForStoringExpenses, 
        userRepository: ForStoringUsers
    ){
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    async getAccountBalance(): Promise<Map<String, Map<String, number>>> {
        const users: User[] = await this.userRepository.getAllUsers();
        if (users.length == 0) {
            throw new Error("No user!");
        }
        const expenses = await this.expenseRepository.getAllExpenses();
        if (expenses.length == 0) {
            const balances = new Map<String, Map<String, number>>();
            users.forEach(user => {
                balances.set(user.username, new Map<String, number>());
            });
            return balances;
        }
        const totalAmountPaidByUser = new Map<String, number>();
        const rawDebts = new Map<String, Map<String, number>>();
        users.forEach(user => {
            totalAmountPaidByUser.set(user.username, 0);
            rawDebts.set(user.username, new Map<String, number>());
        });

        // sum of all expenses spent by each person
        expenses.forEach(expense => {
            const { username, amount } = expense;
            const currentAmountPaidByUser: number | undefined = totalAmountPaidByUser.get(username)
            if (currentAmountPaidByUser == undefined) return;
            totalAmountPaidByUser.set(username, currentAmountPaidByUser + amount);
        });

        // share these expenses to get a first ugly version of balances
        const userNb = users.length;
        users.forEach(userWhoPaid => {
            const totalByUser = totalAmountPaidByUser.get(userWhoPaid.username);
            if (!totalByUser) return;
            const amountToShare = Math.floor(totalByUser/userNb);
            for (var user of users) {
                if (user.username != userWhoPaid.username) {
                    const userDebts: Map<String, number> | undefined = rawDebts.get(user.username);
                    if (userDebts == undefined) continue;
                    const currentUserDebtToUserWhoPaid = userDebts.get(userWhoPaid.username);
                    const updatedDebtToUserWhoPaid: number = (currentUserDebtToUserWhoPaid == undefined) ? amountToShare : currentUserDebtToUserWhoPaid + amountToShare;
                    userDebts.set(
                        userWhoPaid.username,
                        updatedDebtToUserWhoPaid
                    );
                }
            }
        });

        // first rearrange the expenses
        // on prend chaque personne, on parcourt la liste de ses dettes
        // pour chaque dette, on regarde si le créancier lui doit aussi de l'argent, on équilibre une première fois
        users.forEach(user => {
            const userDebts: Map<String, number> | undefined = rawDebts.get(user.username);
            if (!userDebts) return;


            for (var [lenderName, debtAmount] of userDebts) {

                const lenderDebts = rawDebts.get(lenderName);
                if (!lenderDebts) continue;

                if (lenderDebts.has(user.username)) {
                    const lenderDebtAmountToUser = lenderDebts.get(user.username);
                    if (!lenderDebtAmountToUser) continue;
                    const lenderDebtAmountMinusUserDebtAmount = lenderDebtAmountToUser - debtAmount;

                    if (lenderDebtAmountMinusUserDebtAmount > 0) {
                        userDebts.delete(lenderName);
                        lenderDebts.set(user.username, lenderDebtAmountToUser - debtAmount);
                    } else if (lenderDebtAmountMinusUserDebtAmount < 0) {
                        userDebts.set(lenderName, lenderDebtAmountToUser - debtAmount);
                        lenderDebts.delete(user.username);
                    } else {
                        userDebts.delete(lenderName);
                        lenderDebts.delete(user.username);
                    }
                }
            }
        });
        this.printRawDebts(rawDebts);

        return rawDebts;

        // Proposition pour un algo plus poussé
        // pour chaque personne, on regarde si on a plus encore plus de 2 dettes. Si oui, alors on regarde chaque dette et le créancier associé
        // si le créancier a lui-même une dette envers un autre créancier de l'utilisateur qu'on regarde, on procède à un équilibrage
        // on renvoie la liste au bout de 10 itérations ou si la liste des équilibres ne changent plus entre le début et la fin d'une boucle
    }

    async getAllExpenses(): Promise<Expense[]> {
        return this.expenseRepository.getAllExpenses();
    }

    printRawDebts(balances: Map<String, Map<String, number>>): void {
        console.log('on print les raw debts');
        for (var [userName, debts] of balances) {
            console.log('Dettes de ' + userName);
            for (var [lender, debtAmount] of debts) {
                console.log(`Créancier : ${lender}, amount : ${debtAmount}`);
            }
            console.log('');
        }
    }
}
